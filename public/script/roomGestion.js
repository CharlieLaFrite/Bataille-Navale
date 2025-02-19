const socket = io();

let player = {
    host: false,
    roomId: null,
    socketId: null,
    turn: false
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

// Gere l'envoie des données du formulaire au serveur
form.addEventListener('submit', (e) => {
    e.preventDefault();
    player.username = playerName.value;
    player.socketId = socket.id;
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
socket.on('selectBoat', (id) => {
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
})

// Une fois que la grille de bateau à été envoyé au serveur et est complete
function playerReady(grille) {
    socket.emit('playerReady', player)
    selectBoat.hidden = true;
    attente.hidden = false;
}

// donne le room id au client quand il à créé une room sans le renseigner
socket.on('roomId', (room) => {  
    player.roomId = room.id;
    rId.innerHTML = player.roomId;
})
