const express = require("express");
const { socket } = require('socket.io');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const port = 6969;

// Liste des rooms actives, initialisée avec une room par défaut
let rooms = [{ id: "123", player: {} }]; 

/**
 * @type {socket}
 */
const io = require('socket.io')(http);

// Middleware pour servir les fichiers statiques (ex : JS, CSS, images)
app.use(express.static("public"));

// Routes pour servir les pages HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/initialisation", (req, res) => {
    res.sendFile(path.join(__dirname, "views/init.html"));
});

// Démarrer le serveur HTTP et écouter sur le port spécifié : 6969
http.listen(port, () => {
    console.log(`Pour jouer, c'est ici => http://localhost:${port}/`);
});

// Écouter les connexions des clients
io.on('connection', (socket) => {
    console.log(`[connection] => ${socket.id}`);

    // Événement lorsqu'un joueur envoie ses données
    socket.on('playerData', (player) => {
        console.log(`[playerData] => ${player.username}`);
        let room = null;
        // Si le joueur n'a pas spécifié de room, on crée une nouvelle room
        if (!player.roomId) {
            room = createRoom(player);
            console.log(`[create room] => ${room.id} - ${player.username}`);
            socket.join(room.id);
            socket.emit('roomId', {room: room, turn: true});
        } else {
            // Cherche la room existante avec l'ID fourni
            room = rooms.find((existingRoom) => existingRoom.id === player.roomId);
            if (room) { // Si la room existe
                console.log(`[room Join] => ${player.username} joined "${player.roomId}"`);               
                // Ajouter le joueur à la room
                room.player[player.username] = null;
                room.touchedBoat[player.username] = 0;
                socket.join(room.id);
                io.to(room.id).emit('selectBoat', room.id);
            } else {
                // Si la room n'existe pas, crée une nouvelle room avec l'ID fourni
                room = { id: player.roomId, player: {}, touchedBoat: {} };
                room.player[player.username] = null;
                room.touchedBoat[player.username] = 0;
                rooms.push(room);
                socket.join(room.id); // Faire rejoindre le joueur à cette nouvelle room
                console.log(`[create new room] => ${room.id} - ${player.username}`);
                socket.emit('roomId', {room: room, turn: true}); // Renvoyer l'ID de la room au client
            }
        }
    });
    
    

    // Événement lorsque le joueur est prêt et a terminé la sélection de ses bateaux
    socket.on('playerReady', (player) => {
        const roomIndex = rooms.findIndex(room => room.player[player.player.username] !== undefined);
        if (roomIndex === -1) return; // Si la room n'est pas trouvée, on ne fait rien

        const room = rooms[roomIndex];
        room.player[player.player.username] = player.grille; // Associer la grille au joueur

        // Vérifier si tous les joueurs sont prêts
        const playersReady = Object.values(room.player).filter(grille => grille !== null).length;

        if (playersReady === 2) { // Si les deux joueurs sont prêts
            io.to(room.id).emit('startGame');
            console.log(`[game started] => ${room.id}`);
        }
    });

    // Gérer l'envoi d'un tir par un joueur
    socket.on('shoot', (coord) => {
        const roomIndex = rooms.findIndex(room => 
            Object.keys(room.player).some(player => room.player[player] !== undefined)
        );
        const room = rooms[roomIndex];
        const currentPlayer = coord.p;
        const players = Object.keys(room.player); // Liste des joueurs dans la room
        const opponent = players.find(player => player !== currentPlayer); // Trouver l'autre joueur

        if (room.player[opponent][coord.y - 1][coord.x - 1] === "X") { // Si le tir touche un bateau
            io.to(room.id).emit('BoatTouched', coord);
            room.touchedBoat[currentPlayer] += 1; // Incrémenter les touches du joueur
            console.log(room.touchedBoat[currentPlayer]);
            if (room.touchedBoat[currentPlayer] >= 17) { // Si le joueur a touché tous les bateaux
                console.log(`[game finish] => ${room.id} - ${currentPlayer} won`);
                io.to(room.id).emit('gameFinish', currentPlayer);
            }
        } else { // Si le tir rate
            io.to(room.id).emit('BoatMissed', coord);
            io.to(room.id).emit('changeTurn');
        }
    });
});

// Fonction pour créer une nouvelle room avec un ID aléatoire
function createRoom(player) {
    let room = { id: generateRoomId(), player: {}, touchedBoat: {} };
    room.player[player.username] = null; // Ajouter le joueur sans grille
    player.roomId = room.id;
    room.touchedBoat[player.username] = 0; // Initialiser le comptage des touches pour le joueur
    rooms.push(room);
    return room;
}

// Fonction pour générer un ID aléatoire de 5 caractères pour une room
function generateRoomId() {
    return Math.random().toString(36).substr(2, 5);
}
