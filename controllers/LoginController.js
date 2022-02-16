
import { users, admins } from '../config/user_credentials'

const Authentication = (req, res, next) => {
    const { userName, role } = req.body;
    if (!role || !userName) return res.status(401).send("invalid credentials")
    switch (role) {

        case "admin":
            if (admins.find(x => x.userName === userName)) return res.send("admin found")
            return res.send("invalid credentials")

        case "user":
            if (users.find(x => x.userName === userName)) return res.send("user found")
            return res.send("invalid credentials")

        default:
            return res.send("invalid credentials")
    }
}