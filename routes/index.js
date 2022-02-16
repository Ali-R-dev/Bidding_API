import express from 'express'
import loginRoute from './loginRoute'
import userRoutes from './userRoutes'
import adminRoutes from './adminRoutes'


const router = express.Router();

router.route("/api/login", loginRoute);
router.route("/api/user", userRoutes);
router.route("/api/adm", adminRoutes);

export default router;