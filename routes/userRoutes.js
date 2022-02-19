import express from 'express'
import { get, getById, newBid, toogleAutoBidStatus, getAllBots, updateBot, getbotByUserId } from '../controllers/UserController'

const router = express.Router();

router.route("/bots/:id").get(getbotByUserId).put(updateBot);

router.route("/items/auto/:id").put(toogleAutoBidStatus);

router.route("/items/bidnow/:id").put(newBid);

router.route("/items/:id").get(getById);

router.route("/bots").get(getAllBots);

router.route("/items").get(get);





// ---test area---//
import { createBot, getActiveBots, getBotByUserId } from "../DAL/biderBotDbOperations";
const testFunc = (req, res) => {
    // createBot(req.body).then(
    //     onResolve => {
    //         return res.status(200).json(onResolve)
    //     },
    //     onReject => {
    //         return res.status(400).send("No record found")
    //     }
    // )
    console.log("Controller");
    getBotByUserId(req.body.userId).then(
        onResolve => {
            return res.status(200).json(onResolve)
        },
        onReject => {
            return res.status(400).send("No record found")
        }
    )
}

router.route("/test").get(testFunc).post().put();
// -----------------
export default router;