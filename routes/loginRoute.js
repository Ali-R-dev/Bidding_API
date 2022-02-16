import express from 'express'

const router = express.Router();

router.route("/api/login").post((req, res) => res.send("login route"))


export default router;