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

// On cache les elements innutiles
attente.hidden = true;
selectBoat.hidden = true;


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

socket.on('selectBoat', (id) => {
    document.getElementById("selectionPage").disabled = false;
    document.getElementById("rooms").disabled = true;    
    attente.hidden = true;
    selectBoat.hidden = false;
})

socket.on('startGame', () => {
    attente.hidden = true;
    startGame();
})

function playerReady() {
    console.log("lance bros");
    socket.emit('playerReady', player)
    selectBoat.hidden = true;
    attente.hidden = false;
}
