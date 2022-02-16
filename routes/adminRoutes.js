import express from 'express'
import { get, create, getById } from '../controllers/AdminController'



const router = express.Router();

router.route("/items")
    .get(get)
    .post(create);

router.route("/items/:id").get(getById).post();

export default router;