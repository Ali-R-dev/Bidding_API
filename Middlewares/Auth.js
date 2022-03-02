import { Admins, Regulars } from '../config/user_credentials'

export const Auth = (req, res, next) => {

    const id = req.headers['auth-id'];
    const role = req.headers['auth-role'];

    if (!id || !role) return res.status(401).send("Invalid credentials");

    switch (role) {
        case 'admin':
            let adm = Admins.find(x => x.id === id);
            if (adm != undefined) {
                req.userId = id;
                req.userRole = role;
                req.userName = adm.userName;
                return next()
            }
            return res.status(401).send("Invalid credentials")
            break
        case 'regular':
            let reg = Regulars.find(x => x.id === id)
            if (reg != undefined) {
                req.userId = id;
                req.userRole = role;
                req.userName = reg.userName;
                return next()
            }
            return res.status(401).send("Invalid credentials")

        default:
            return res.status(401).send("Invalid credentials")
    }
}