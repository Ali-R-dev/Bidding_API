import express from 'express'
import { get, getById, newBid, toogleAutoBidStatus, getAllBots, updateBot, getbotByUserId } from '../controllers/UserController'

const router = express.Router();

router.route("/bots/:id").get(getbotByUserId).put(updateBot);

router.route("/items/auto/:id").put(toogleAutoBidStatus);

router.route("/items/bidnow/:id").put(newBid);

router.route("/bots").get(getAllBots);

router.route("/items/:id").get(getById);

router.route("/items").get(get);

const testFunc = (req, res) => {

}

router.route("/test/:id").get().post(testFunc).put();

export default router;