import express from 'express'

import { create, get, getById, update, del, newBid, getBids, getItemsByUserbids, toogleAutoBidStatus, getbotByUserId, updateBot, getInvoice } from '../controllers/ItemController'

const router = express.Router();

router.route("/invoice/:id")
    .get(getInvoice);

router.route("/bot")
    .get(getbotByUserId)
    .put(updateBot);

// --- Bid routes ---
router.route("/bidnow/:id")
    .put(newBid);

router.route("/bids/:id")
    .get(getBids);

router.route("/auto/:id")
    .put(toogleAutoBidStatus);

router.route("/userhistory").get(getItemsByUserbids);

// --- Item Routes ---

router.route("/:id")
    .get(getById).put(update).delete(del);

router.route("/")
    .get(get).post(create);

export default router;
