import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {  
    getChats,
    getChat,
    addChat,
    readChat,
    deleteChat,
    getPeopleChat

} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", verifyToken, getChats);

router.get("/:chatId", verifyToken, getChat);

router.get("/to/:id", verifyToken, getPeopleChat);

router.post("/", verifyToken, addChat);

router.put("/read/:id", verifyToken, readChat);

router.delete("/:id", verifyToken, deleteChat);

export default router;