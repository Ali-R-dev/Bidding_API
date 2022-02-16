import express from 'express'
import { get, create, getById, update, del } from '../controllers/UserController'



const router = express.Router();
router.route("/bids")
    .get(get)
    .post(create);

router.route("/bids/:id")
    .get(getById)
    .put(update)
    .delete(del);

export default router;