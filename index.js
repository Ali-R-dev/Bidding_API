import morgan from 'morgan'
import loginRoute from './routes/loginRoute'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import itemRoutes from './routes/itemRoutes'
import Cors from 'cors'
import DbConnect from './db/DbConnect'
import config from 'config'
import { Auth } from './Middlewares/Auth'
import { RunBotService } from './services/botService'
import { RunCoreServices, ItemSoldingProcess } from './services/CoreServices'
import { InitSocket } from './services/MySocketIo'
import easyinvoice from 'easyinvoice'
import fs from 'fs'
// ---server instance cretion---
import express from "express";
import { createServer } from "http";


const app = express();
// ---Middlewares---
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(Cors());
app.use(Auth)

// ---server---
const httpServer = createServer(app);
InitSocket(httpServer)


// --- Routing ---
app.use("/api/login", loginRoute);
app.use("/api/items", itemRoutes);
app.use("*", (req, res) => res.status(404).send("route not found"));
// ---------------


const PORT = config.get('Server.port');
const DbUri = config.get('Database.uri');

//---if db connects successfully then server starts listening--- 
DbConnect(DbUri).then(
    () => {
        httpServer.listen(PORT)
        console.log(`server running on port ${PORT}`)

        // ---backend services---
        setTimeout(() => {
            // ---bot service---
            //RunBotService();
            // ItemSoldingProcess()
            // ====ALERT-DONT DISABLE CORE SERVICES-ALERT====
            //RunCoreServices()
        }, 2000);

    }
)
