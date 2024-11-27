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
    console.log('A user connected', socket.id);

    // Join Room
    socket.on('join-room', (data) => {
        console.log('join-room', data);
        socket.join(data.roomID); // Use roomID for consistency

        // Emit that the user connected
        socket.to(data.roomID).emit('user-connected');

        // Get users in the room
        const usersInRoom = Array.from(io.sockets.adapter.rooms.get(data.roomID) || []);
        io.to(data.roomID).emit('room-users', { users: usersInRoom });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
