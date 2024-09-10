import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);

router.get("/:postId", getPost);

router.post("/", verifyToken, addPost);

router.put("/:postId", verifyToken, updatePost);

router.delete("/:postId", verifyToken, deletePost);

export default router;