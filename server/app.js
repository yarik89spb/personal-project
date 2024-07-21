import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSocket } from './sockets/socketHandler.js';
import connectToDB from './models/db.js';
import projectRouter from './routes/projectRoutes.js'
import userRouter from './routes/userRoutes.js';
import eventStatusRouter from './routes/eventStatusRoutes.js'
import dashboardRouter from './routes/dashboardRoutes.js'

dotenv.config();

connectToDB()

const app = express();
const server = createServer(app);
const io = new Server(server, {
  //...
}); 
setupSocket(io);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/project', projectRouter);
app.use('/user', userRouter);
app.use('/event-status', eventStatusRouter);
app.use('/dashboard', dashboardRouter);

// Put it after other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(3000, () => console.log('Server listening on port 3000'))