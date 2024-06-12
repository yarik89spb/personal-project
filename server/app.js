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
  
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(3000, () => console.log('Server listening on port 3000'))