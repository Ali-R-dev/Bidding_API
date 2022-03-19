
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
    // setInterval(() => {
    //     let rooms = Array.from(io.sockets.adapter.rooms);
    //     const filtered = rooms.filter((room) => !room[1].has(room[0]));
    //     const res = filtered.map((i) => i[0]);
    //     console.log("no of rooms :", res);
    //     // const n = res.find((r) => r === "123");
    //     // if (n) io.to("123").emit("updatedData");
    // }, 2000);
}
export const getIo = () => {
    return io;
}