import dotenv from "dotenv";
import { Server } from "socket.io";
import Prisma from "./lib/Prisma";
import http from "http";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP Server
const httpServer = http.createServer();

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join-room", async (data) => {
        console.log("User joining room:", data);
        socket.join(data.roomID);
        socket.to(data.roomID).emit("user-connected", data);

        try {
            // Check if the room exists
            let Id;
            const Room = await Prisma.room.findUnique({
                where: { roomID: data.roomID },
                select: { id: true },
            });

            // If the room exists, use its ID, else create a new room
            if (Room) {
                Id = Room.id;
            } else {
                const room = await Prisma.room.create({
                    data: { roomID: data.roomID },
                    select: { id: true },
                });
                Id = room.id;
            }
            console.log("Room upserted with ID:", Id);

            // Update user with the room's primary key ID
            const updateRoom = await Prisma.user.update({
                where: { email: data.email },
                data: { roomID: Id },
            });
            console.log("User updated with room ID:", updateRoom);

            // Fetch all users in the room
            const roomUsers = await Prisma.user.findMany({
                where: { roomID: Id },
                select: { id: true, name: true, email: true, picture: true },
            });

            // Emit the room users to the room
            io.to(data.roomID).emit("room-users", { users: roomUsers });
        } catch (error) {
            console.error("Error joining room:", error);
            socket.emit("error", "Failed to join room");
        }
    });



    socket.on("auth", async (data) => {
        const { name, email, picture } = data;

        try {
            let user = await Prisma.user.upsert({
                where: { email },
                update: { name, picture },
                create: { name, email, picture },
            });

            socket.emit("user", user);
        } catch (error) {
            console.error(error);
            socket.emit("error", "Failed to authenticate user");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default io;
