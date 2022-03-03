import express from 'express'
import { get, getById, newBid, toogleAutoBidStatus, updateBot, getbotByUserId } from '../controllers/UserController'

const router = express.Router();

router.route("/items/auto/:id")
    .put(toogleAutoBidStatus);

router.route("/items/bidnow/:id")
    .put(newBid);

router.route("/bots")
    .get(getbotByUserId)
    .put(updateBot);


router.route("/items/:id")
    .get(getById);

router.route("/items")
    .get(get);


export default router;