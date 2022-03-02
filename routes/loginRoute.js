import express from 'express'

const router = express.Router();

const login = (req, res) => {

    res.send({
        id: req.userId,
        role: req.userRole,
        userName: req.userName
    })
}
router.route("/").get(login)

export default router;