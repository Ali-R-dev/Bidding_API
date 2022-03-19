import morgan from 'morgan'
import loginRoute from './routes/loginRoute'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import itemRoutes from './routes/itemRoutes'
import Cors from 'cors'
import DbConnect from './db/DbConnect'
import config from 'config'
import { Auth } from './Middlewares/Auth'
import { RunBidderBots } from './services/botService'
import { InitSocket } from './services/MySocketIo'

// ---server instance cretion---
import express from "express";
import { createServer } from "http";


const app = express();
// ---Middlewares---
//app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(Cors());
app.use(Auth)

// ---server---
const httpServer = createServer(app);
InitSocket(httpServer)
// const io = new Server(httpServer, {
//     cors: {
//         origin: "*",
//         methods: ['GET', 'POST']
//     }
// });


// io.on("connection", (socket) => {
//     io.emit("message", { message: "hello" });
//     socket.on("startLiveUpdates", (id) => {
//         socket.join(id);
//         console.log("room joined: ", id);
//     });
//     socket.on("StopLiveUpdates", (id) => {
//         socket.leave(id);
//         console.log("room leaved : ", id);
//     });
// });
// setInterval(() => {
//     let rooms = Array.from(io.sockets.adapter.rooms);
//     const filtered = rooms.filter((room) => !room[1].has(room[0]));
//     const res = filtered.map((i) => i[0]);
//     console.log("no of rooms :", res);
//     // const n = res.find((r) => r === "123");
//     // if (n) io.to("123").emit("updatedData");
// }, 2000);
// -------

// --- Routing ---
app.use("/api/login", loginRoute);
app.use("/api/items", itemRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/adm", adminRoutes);
app.use("*", (req, res) => res.status(404).send("route not found"));
// ---------------


const PORT = config.get('Server.port');
const DbUri = config.get('Database.uri');

//---if db connects successfully then server starts listening--- 
DbConnect(DbUri).then(
    () => {
        httpServer.listen(PORT)
        console.log(`server running on port ${PORT}`)

        //--start biider bots service---
        setTimeout(() => {
            //RunBidderBots();
        }, 2000);
    }
)
