import express from 'express'
import loginRoute from './routes/loginRoute'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import DbConnect from './db/DbConnect'
import config from 'config'

const app = express();


// ---Middlewares---
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// --- Routing ---
app.use("/api/login", loginRoute);
app.use("/api/user", userRoutes);
app.use("/api/adm", adminRoutes);
// app.use("*", (req, res) => res.status(404).send("custom not found"));
// ------



const PORT = config.get('Server.port');
const DbUri = config.get('Database.uri');
console.log(PORT)
DbConnect(DbUri).then(
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    })

)
