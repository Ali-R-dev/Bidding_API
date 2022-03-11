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


// ---server instance cretion---
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
// ---Middlewares---
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(Cors());
app.use(Auth)

// --- Routing ---
app.use("/api/login", loginRoute);
app.use("/api/items", itemRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/adm", adminRoutes);
app.use("*", (req, res) => res.status(404).send("route not found"));
// ---------------


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

// ---socket conn---
// in future---for live update
io.on("connection", socket => {
    io.emit('message', ({ message: "hello" }))
});
// -------

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
