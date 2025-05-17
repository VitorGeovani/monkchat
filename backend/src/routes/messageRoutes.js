import { Router } from "express";
import MessageController from "../controllers/MessageController.js";

const router = Router();

// Rotas existentes
router.post("/", MessageController.sendMessage);
router.get("/room/:roomId", MessageController.getRoomMessages);
router.get(
  "/direct/:senderId/:receiverId",
  MessageController.getDirectMessages
);
router.delete("/:id", MessageController.deleteMessage);
router.put("/:id", MessageController.updateMessage);

export default router;
