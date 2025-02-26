const express = require("express");
const { socket } = require('socket.io')

const app = express();
const http = require('http').createServer(app);
const path = require('path')
const port = 6969;
let rooms = [{ id: "123", player: {} }]; // Room par défaut pour éviter un crash

/**
 * @type {socket}
 */
const io = require('socket.io')(http);

// Servir les fichiers statiques
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/initialisation", (req, res) => {
    res.sendFile(path.join(__dirname, "views/init.html"));
});

// Écouter les connexions entrantes
http.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});

io.on('connection', (socket) => {
    console.log(`[connection] => ${socket.id}`);

    // Dès qu'un formulaire est envoyé
    socket.on('playerData', (player) => {
        console.log(`[playerData] => ${player.username}`);
        let room = null;

        if (!player.roomId) { // Si le joueur ne fournit pas d'ID de room
            room = createRoom(player);
            console.log(`[create room] => ${room.id} - ${player.username}`);
            socket.join(room.id);
            socket.emit('roomId', room);
        } 
        else if (rooms.some((room) => room.id === player.roomId)) { // Vérifie si la room existe
            console.log(`[room Join] => ${player.username} Join "${player.roomId}"`);

            rooms.forEach((room) => {
                if (player.roomId == room.id) {                                       
                    room.player[player.username] = null; // Ajout du joueur sans grille pour l'instant
                    socket.join(room.id);
                    io.to(room.id).emit('selectBoat', room.id);
                }
            });
        } else { // Si une room avec cet ID n'existe pas, en créer une
            let room = { id: player.roomId, player: {} };
            room.player[player.username] = null; // Ajout du joueur sans grille
            rooms.push(room);
            socket.join(room.id);
        }
        console.log(rooms);
    });

    // Gère quand un joueur a terminé la sélection des bateaux
    socket.on('playerReady', (player) => {
        console.log(player.grille);
        
        const roomIndex = rooms.findIndex(room => room.player[player.player.username] !== undefined);
        if (roomIndex === -1) return; // Sécurité : Si la room n'est pas trouvée, ne rien faire

        const room = rooms[roomIndex];
        room.player[player.player.username] = player.grille; // Associer la grille au joueur

        const playersReady = Object.values(room.player).filter(grille => grille !== null).length;

        if (playersReady === 2) { // Si les deux joueurs ont fourni leur grille
            io.to(room.id).emit('startGame');
            console.log(`[partie lancé] => ${room.id}`);
        }
    });

    // Gère quand un joueur envoie un missile
    socket.on('shoot', (coord) => {
        const roomIndex = rooms.findIndex(room => 
            Object.keys(room.player).some(player => room.player[player] !== undefined)
        );
        const players = Object.keys(rooms[roomIndex].player); // Liste des joueurs dans la room
        const otherPlayer = players.find(player => player !== coord.p); // Trouver l'autre joueur

        if (rooms[roomIndex].player[otherPlayer][coord.y - 1][coord.x - 1] == "X") {
            socket.emit('BoatTouched');
        } else {
            socket.emit('BoatMissed');
            io.to(rooms[roomIndex].id).emit('changeTurn');
        }
    });
});

// Créer une room avec un ID aléatoire
function createRoom(player) {
    let room = { id: roomIdGen(), player: {} };
    room.player[player.username] = null; // Ajout du joueur sans grille
    player.roomId = room.id;
    rooms.push(room);
    return room;
}

// Générer un ID aléatoire de 5 caractères
function roomIdGen() {
    return Math.random().toString(36).substr(2, 5);
}
