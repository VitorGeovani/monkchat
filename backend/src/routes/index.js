import { Router } from "express";
import userRoutes from "./userRoutes.js";
import roomRoutes from "./roomRoutes.js";
import messageRoutes from "./messageRoutes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/rooms", roomRoutes);
router.use("/messages", messageRoutes);

export default router;
