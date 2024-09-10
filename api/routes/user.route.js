import express from "express";
import { 
    getUsers, 
    getAgentUsers, 
    getUser, 
    updateUser, 
    deleteUser, 
    savePost, 
    profilePosts, 
    getNotificationNumber, 
    addSubscriber,
    getAllPublisherandSubscriberRelations,
    addNotification,
    fetchNotifications, 
    readNotification} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/agents", verifyToken, getAgentUsers);

// router.get("/:id", verifyToken,  getUser);

router.put("/:id", verifyToken, updateUser);

router.delete("/:id", verifyToken, deleteUser);

router.post("/save", verifyToken, savePost);

// router.post("/addCity", addCity);

// router.get("/getCities", getCities);

router.get("/profilePosts", verifyToken, profilePosts);

router.get("/notification", verifyToken, getNotificationNumber);

router.get("/relations",  getAllPublisherandSubscriberRelations) ;

router.post("/subscribe", verifyToken, addSubscriber);

router.post("/add/notification", verifyToken, addNotification);

router.get("/fetch/notification", verifyToken, fetchNotifications);

router.put("/read/notification/:notificationId", verifyToken, readNotification);

export default router;