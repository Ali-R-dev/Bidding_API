import express from 'express'
import { get, create, getById, update, del } from '../controllers/AdminController'


const router = express.Router();

router.route("/items")
    .get(get)
    .post(create);

router.route("/items/:id")
    .get(getById)
    .put(update)
    .delete(del);

export default router;