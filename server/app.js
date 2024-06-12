import express from 'express';
import { createServer } from "http";
import { Server } from 'socket.io';

const app = express();

const server = createServer(app);
const io = new Server(server, {
  //...
});

io.on("connection", (socket) => {
  console.log('User connected')
  socket.on('viewerMessage', (message)=>{
    console.log(message)
    io.emit('viewerMessage', message)
  })

  socket.on('changeScreen', (passedData)=>{
    console.log(passedData)
    io.emit('changeScreen', passedData)
  })

  socket.on('startBroadcasting', (passedData)=>{
    console.log(passedData)
    io.emit('startBroadcasting', passedData)
  })

  socket.on('stopBroadcasting', (passedData)=>{
    console.log(passedData)
    io.emit('stopBroadcasting', passedData)
  })

  socket.on('userAnswer', (userAnswer)=>{
    console.log(userAnswer)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(3000, () => console.log('Server listening on port 3000'))