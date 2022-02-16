import express from 'express'
import { getItems, createItem, getById } from '../controllers/AdminController'



const router = express.Router();

router.route("/items")
    .get(getItems)
    .post(createItem);

router.route("/items/:id").get(getById).post();

export default router;