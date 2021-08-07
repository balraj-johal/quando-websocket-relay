const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const express = require("express");

const { Server } = require('ws');

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

//create new websocket server
const wss = new Server({ server });

// begin listening for websocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

//broadcast updates per second
setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
    });
}, 1000);
