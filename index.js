const express = require("express");
const { socket } = require('socket.io')

const app = express();
const http = require('http').createServer(app);
const path = require('path')
const port = 6969;
let rooms = [{id: "123"}]; // Contiendras toute les rooms, room par défaut crée (impossible car 3char) car sinon le script ne marche pas

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

// Permet de gérer les evenement pour chaque socket (un peu comme une classe)
io.on('connection', (socket) => {
    console.log((`[connection] => ${socket.id}`));
    
    // Dès qu'un formulaire est envoyé
    socket.on('playerData', (player) => {
        console.log(`[playerData] => ${player.username}`);
        let room =  null;

        if (!player.roomId) { // Si le joueur n'as pas saisi de roomId
            room = createRoom(player)
            console.log(`[create room] => ${room.id} - ${player.username}`);
            socket.join(room.id); // Creer un socket commun avec les différents joueur de la room
            socket.emit('roomId', room);
        } 
        else if (rooms.some((room) => room.id === player.roomId)) { //vérifie si un id de rooms est égal à player.id
            console.log(`[room Join] => ${player.username} Join "${player.roomId}"`);
            
            rooms.forEach((room) => {
                if (player.roomId == room.id) {                                       
                    room.player.push(player.username);
                    socket.join(room.id);
                    io.to(room.id).emit('selectBoat', room.id); // Lance le jeu et envoie l'evenement 'slectBoat' à tous les joueurs d'une room
                }
            })
        } else { // Si un roomId est renseigné mais inexistant (crée une room avec cette ID)
            let room = {id: player.roomId, player: []};
            room.player.push(player.username);
            rooms.push(room);
            socket.join(room.id);
        }
        console.log(rooms);
    })

    // Gère quand la selection des bateaux est fini pour lancer la partie
    socket.on('playerReady', (player) => {
        const playerIndex = rooms.findIndex(room => room.player && room.player.includes(player.username));
        const room = rooms[playerIndex];        
        if (room.playerReady != null) {
            room.playerReady = 2; // Sachant qu'il y à deux joueur, si un est pret, alors le nombre de joueur pret est automatiquement de deux
            io.to(room.id).emit('startGame') // LAnce la partie une foie les bateuax choisis
            console.log(`[partie lancé] => ${room.id}`);
        } else {
            room.playerReady = 1;
        }
    })
})

// Creer une room avec un ID aléatoire
function createRoom(player) {
    let room = {id: roomIdGen(), player: []};
    room.player.push(player.username);
    player.roomId = room.id;
    rooms.push(room);
    

    return room;
}

// Génere un ID aléatoire de 5 charactere
function roomIdGen() {
    return Math.random().toString(36).substr(2, 5)
}