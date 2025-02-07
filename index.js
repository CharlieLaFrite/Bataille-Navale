const express = require("express");
const { socket } = require('socket.io')

const app = express();
const http = require('http').createServer(app);
const path = require('path')
const port = 6969;
let rooms = [{id: "123"}];

/**
 * @type {socket}
 */

const io = require('socket.io')(http);


// Servir les fichiers statiques
app.use(express.static("public"));


// Route pour la page de connexion
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/initialisation", (req, res) => {
    res.sendFile(path.join(__dirname, "views/init.html"));
});

//ecouter les connexions entrentes
http.listen(port, () => {
    console.log(`http://localhost:${port}/`);
    
})

io.on('connection', (socket) => {
    console.log((`[connection] => ${socket.id}`));
    
    socket.on('playerData', (player) => {
        console.log(`[playerData] => ${player.username}`);
        let room =  null;

        if (!player.roomId) {
            room = createRoom(player)
            console.log(`[create room] => ${room.id} - ${player.username}`);
            socket.join(room.id);
        } else if (rooms.some((room) => room.id === player.roomId)) { //vérifie si un id de rooms est égal à player.id
            console.log(`[room Join] => ${player.username} Join "${player.roomId}"`);
            
            rooms.forEach((room) => {
                if (player.roomId == room.id) {                                       
                    room.player.push(player.username);
                    socket.join(room.id);
                    io.to(room.id).emit('selectBoat', room.id);
                }
            })
        } else {
            let room = {id: player.roomId, player: []};
            room.player.push(player.username);
            rooms.push(room);
            socket.join(room.id);
        }
        console.log(rooms);
    })

    socket.on('playerReady', (player) => {
        const playerIndex = rooms.findIndex(room => room.player && room.player.includes(player.username));
        const room = rooms[playerIndex];        
        if (room.playerReady != null) {
            room.playerReady = 2;
            io.to(room.id).emit('startGame')
            console.log(`[partie lancé] => ${room.id}`);
        } else {
            room.playerReady = 1;
        }
    })
})

function createRoom(player) {
    let room = {id: roomIdGen(), player: []};
    room.player.push(player.username);
    player.roomId = room.id;
    rooms.push(room);
    

    return room;
}

function roomIdGen() {
    return Math.random().toString(36).substr(2, 5)
}