import express from 'express'
const router = express.Router();

router.route("/api/user")

    .get((req, res) => {
        res.send("response from get user")
    })

    .post((req, res) => {
        res.send("response from post user")
    })

export default router;