import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controller/notification.controller.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/", isAuth, getNotifications);
router.patch("/:id/read", isAuth, markAsRead);
router.patch("/read-all", isAuth, markAllAsRead);

export default router;
