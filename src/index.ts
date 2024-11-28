import dotenv from "dotenv";
import { Server } from "socket.io";
import Prisma from "./lib/Prisma";
import http from "http";
import cors from "cors";

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

    socket.on("join-room", (data) => {
        console.log("User joining room:", data);
        socket.join(data.roomID);
        socket.to(data.roomID).emit("user-connected", data);

        const usersInRoom = Array.from(io.sockets.adapter.rooms.get(data.roomID) || []);
        io.to(data.roomID).emit("room-users", { users: usersInRoom });
    });

    socket.on("auth", async (data) => {
        const { name, email, picture } = data;

        try {
            // Check if user exists
            let user = await Prisma.user.findUnique({
                where: { email },
            });
            
            if (user) {
                // If user exists, update their information
                user = await Prisma.user.update({
                    where: { email },
                    data: { name, picture },
                });
            } else {
                // If user doesn't exist, create a new user
                user = await Prisma.user.create({
                    data: { name, email, picture },
                });
            }

            // Send the user info back
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
