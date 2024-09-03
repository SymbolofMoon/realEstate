import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {  
    addMessage, seenMessage
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/:chatId", verifyToken, addMessage);
router.put("/:msgId", verifyToken, seenMessage );


export default router;