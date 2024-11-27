import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import Prisma from "./lib/Prisma";

dotenv.config();
const httpserver = http.createServer();
const io = new Server(httpserver, {
    cors: {
        origin: '*',
        allowedHeaders: '*',
    },
});

const port :number = process.env.PORT as unknown as number;


httpserver.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default io;

io.on('connection', (socket) => {
    console.log('a user connected ', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});