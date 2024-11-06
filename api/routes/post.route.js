import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost, likePost, createCommentonPost, addRating } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);

router.get("/:postId", getPost);

router.post("/", verifyToken, addPost);

router.post("/like", verifyToken, likePost);

router.post("/comment", verifyToken, createCommentonPost);

router.post("/rating", verifyToken, addRating);

router.put("/:postId", verifyToken, updatePost);

router.delete("/:postId", verifyToken, deletePost);

export default router;