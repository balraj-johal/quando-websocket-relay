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

    ws.on('message', function incoming(message) {
        let object = JSON.parse(message);
        console.log(`message: ${object.type} has val: ${object.val}`);
        wss.clients.forEach((client) => {
            console.log("sending: ", message)
            client.send(message);
        });
      });
    ws.on('value', (data) => {
        console.log("value seen, with data: ", data)
    })
});

wss.on('value', (ws) => {
    console.log('val recieved');
});


//broadcast updates per second
setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
    });
}, 1000);