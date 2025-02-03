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


attente.hidden = true;


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
    socket.emit('playerData', player)
    console.log(player);
})

socket.on('selectBoat', (id) => {
    window.location.href = "/initialisation"
    console.log("opiaudoiajh");
    
})
