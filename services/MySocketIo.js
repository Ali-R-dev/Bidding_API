
import { Server } from "socket.io";

let io;
export const InitSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });
    io.on("connection", (socket) => {
        io.emit("message", { message: "hello" });
        socket.on("startLiveUpdates", (id) => {
            socket.join(id);
            console.log("room joined: ", id);
        });
        socket.on("StopLiveUpdates", (id) => {
            socket.leave(id);
            console.log("room leaved : ", id);
        });
    });
}
export const getIo = () => {
    return io;
}