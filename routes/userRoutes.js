import express from 'express'
// import { get, getById, newBid, toogleAutoBidStatus, updateBot, getbotByUserId } from '../controllers/UserController'

const router = express.Router();

// router.route("/items/auto/:id")
//     .put(toogleAutoBidStatus);

// router.route("/items/bidnow/:id")
//     .put(newBid);

// router.route("/bots")
//     .get(getbotByUserId)
//     .put(updateBot);


// router.route("/items/:id")
//     .get(getById);



// ---testing area---
// import { createUser, getAllUsers, getUserByCred } from '../services/userService'

// const testGet = async (req, res) => {
//     await getAllUsers().then(
//         ful => res.send(ful),
//         rej => res.send(rej)
//     )
// }
// const testpost = async (req, res) => {
//     await createUser(req.body).then(
//         ful => res.send(ful),
//         rej => res.send(rej)
//     )
// }
// router.route('/user').get(testGet).post(testpost)
export default router;