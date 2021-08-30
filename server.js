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

    let timer = 200;
    let tickDownTimer = setInterval(() => {
        if (timer > -1) {
            timer = timer - 10;
        }
    }, 10)

    ws.on('close', () => {
        console.log('Client disconnected')
        clearInterval(tickDownTimer);
    });

    ws.on('message', function incoming(message) {
        let object = JSON.parse(message);
        console.log(`message: ${object.type} has val: ${object.val}`);

        if (timer <= 0) {
            wss.clients.forEach((client) => {
                console.log("sending: ", JSON.stringify(object))
                client.send(JSON.stringify(object));
            });
        }
    });
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