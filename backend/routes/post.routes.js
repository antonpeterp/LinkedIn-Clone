import express from "express";
import { createPost, getPost } from "../controller/post.controller.js";
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";

const postRouter = express.Router();

postRouter.post(
  "/create",
  isAuth,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);

postRouter.get("/getpost", isAuth, getPost);

export default postRouter;
