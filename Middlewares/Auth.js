
import { getUserByCred } from '../services/userService'

export const Auth = async (req, res, next) => {

    const id = req.headers['auth-userid'];
    const role = req.headers['auth-role'];
    if (!id || !role) return res.status(401).send("Invalid credentials");

    const user = await getUserByCred({ userId: id, role: role });

    if (!user) {
        return res.status(401).send("Invalid credentials");
    }
    req.user = user

    return next();
}