import morgan from 'morgan'
import loginRoute from './routes/loginRoute'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'

import DbConnect from './db/DbConnect'
import config from 'config'


// const app = express();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
// ---Middlewares---
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use()
// --- Routing ---
app.use("/api/login", loginRoute);
app.use("/api/user", userRoutes);
app.use("/api/adm", adminRoutes);
app.use("*", (req, res) => res.status(404).send("custom not found"));
// ------
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

// ---socket conn---
io.on("connection", (socket) => {
    console.log(socket.id);
});
// -------

const PORT = config.get('Server.port');
const DbUri = config.get('Database.uri');

console.log(PORT)
DbConnect(DbUri).then(() => {
    httpServer.listen(3000)
    console.log(`server running on port ${PORT}`)
}
)
