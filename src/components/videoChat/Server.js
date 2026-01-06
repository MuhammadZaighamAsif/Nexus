const express =require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket)=>{
    console.log('A user connected');
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    }); 
});

socket.on('sendCandidate', (candidate)=>{
    socket.broadcast.emit('receiveCandidate', candidate);   
});

const Port = process.env.PORT || 3000;
server.listen(Port, ()=>{
    console.log(`Server is running on port ${Port}`);
});