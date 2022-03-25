import express from 'express'

const router = express.Router();

const login = (req, res) => {

    res.send({
        id: req.user._id,
        userId: req.user.userId,
        userName: req.user.userName,
        role: req.user.role
    })
}
router.route("/").get(login)

export default router;