import express from 'express'
// import {getById, newBid, toogleAutoBidStatus, updateBot, getbotByUserId } from '../controllers/UserController'

import { create, get, getById, update, del, newBid, getBids, getItemsByUserbids } from '../controllers/ItemController'

const router = express.Router();

// router.route("/auto/:id")
//     .put(toogleAutoBidStatus);

// router.route("/bids/:id")
//     .get(getbotByUserId)
//     .put(updateBot);

// router.route("/bids")
//     .get(getbotByUserId)
//     .put(updateBot);

// router.route("/bot")
//     .get(getbotByUserId)
//     .put(updateBot);

// --- Bid routes ---
router.route("/bidnow/:id")
    .put(newBid);

router.route("/bids/:id")
    .get(getBids)

// --- Item Routes ---

router.route("/userhistory").get(getItemsByUserbids);

router.route("/:id")
    .get(getById).put(update).delete(del);

router.route("/")
    .get(get).post(create);

export default router;