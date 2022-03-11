import { Admins, Regulars } from '../config/user_credentials'
import { getUserByCred } from '../services/userService'
import User from '../models/user'

export const Auth = async (req, res, next) => {

    const id = req.headers['auth-userid'];
    const role = req.headers['auth-role'];

    if (!id || !role) return res.status(401).send("Invalid credentials");

    const user = await getUserByCred({ userId: id, role: role });

    if (!user.length) {
        return res.status(401).send("Invalid credentials");
    }
    req.user = user[0]

    return next();
}