//Script qui gère la connexion avec le Serveur et appel les différents fonctions

// Format des cellules de la grille du joueur : .cell-7_8
// Format des cellules de la grille adversaire : .Acell-5_9


const socket = io();

let player = {
    name: null,
    host: false,
    roomId: null,
    socketId: null,
    turn: false,
    lastCible: null
}

const form = document.getElementById("formulaire");
const playerName = document.getElementById("pseudo")
const connexion = document.getElementById("connexion");
const attente = document.getElementById("wait");
const roomId = document.getElementById("roomId");
const selectBoat = document.getElementById("selection");
const rId = document.getElementById("rId");
const copier = document.getElementById("copier");

// On cache les elements innutiles
attente.hidden = true;
selectBoat.hidden = true;

// Envoie un missile sur la grille
function missile(cible) {
    player.lastCible = cible;
    let [y, x] = coord(cible); // Extraction des coordonnées
    let p = player.name;
    socket.emit('shoot', {x, y, p});
}

// Une fois que la grille de bateau à été envoyé au serveur et est complete
function playerReady(grille) {    
    socket.emit('playerReady', {player, grille})
    selectBoat.hidden = true;
    attente.hidden = false;
    // Enlève le roomId et le bouton copier
    document.querySelectorAll(".temp").forEach((element) => {element.hidden = true});
}

// Gere l'envoie des données du formulaire au serveur
form.addEventListener('submit', (e) => {
    e.preventDefault();
    player.username = playerName.value;
    player.socketId = socket.id;
    player.name = playerName.value;
    connexion.hidden = true;
    attente.hidden = false;
    
    if (roomId.value.trim().length != 5) {
        player.host = true;
        player.turn = true;   
    } else {
        player.roomId = roomId.value.trim();
    }
    socket.emit('playerData', player);
    rId.innerHTML = player.roomId;
})

// Gère le boutons pour copier le room id
copier.addEventListener('click', () => {
    navigator.clipboard.writeText(player.roomId).then(() => {
        document.getElementById("copier").innerHTML = "Copié !";
    });
})

// Gère quand le joueur doit selectionenr ses bateaux
socket.on('selectBoat', () => {
    document.getElementById("selectionPage").disabled = false;
    document.getElementById("rooms").disabled = true;    
    attente.hidden = true;
    selectBoat.hidden = false;
})

// Gère le lancement de la patie
socket.on('startGame', () => {
    attente.hidden = true;
    selectBoat.hidden = false;
    document.getElementById("ship-list").hidden = true;
    document.querySelector(".title").innerHTML = "Vos Bateaux !";
    document.getElementById("validateBtn").hidden = true;
    genererTab(true);
    document.querySelector(".titleAdv").innerHTML = "Grille de l'adversaire !";
    const texte = player.turn ? "Votre tour de jouer !" : "C'est au tour de l'adversaire !";
    document.querySelector(".turn").innerHTML = texte;
    putAdversListner();
})

// donne le room id au client quand il à créé une room sans le renseigner
socket.on('roomId', (room) => {  
    player.roomId = room.room.id;
    player.turn = room.turn;
    rId.innerHTML = player.roomId;
})

// Quand le missile à touché le bateau 
socket.on('BoatTouched', (coord) => {
    if (coord.p == player.name) {
        document.querySelector(`.${player.lastCible} button`).setAttribute("boat", "touched");
    } else {
        document.querySelector(`.cell-${coord.y}_${coord.x} button`).setAttribute("boat", "touched");
    }
})

// Quand le missile n'as pas touché de bateau
socket.on('BoatMissed', (coord) => {
    if (coord.p == player.name) {
        document.querySelector(`.${player.lastCible} button`).setAttribute("boat", "missed");
    } else {
        document.querySelector(`.cell-${coord.y}_${coord.x} button`).setAttribute("boat", "missed");
    }
})

// Pour changer le tour
socket.on('changeTurn', () => {
    player.turn = !player.turn;
    texte = player.turn ? "Votre tour de jouer !" : "C'est au tour de l'adversaire !";
    document.querySelector(".turn").innerHTML = texte;
})

// Quand la partie est fini
socket.on('gameFinish', (playerr) => {    
    alert(`${playerr} a gagné la partie, gors gg à lui`);
    location.reload();
})