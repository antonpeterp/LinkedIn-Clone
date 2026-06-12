import express from "express";
import {
  createPost,
  getPost,
  likePost,
  commentPost,
} from "../controller/post.controller.js";
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
postRouter.post("/like/:postId", isAuth, likePost);
postRouter.post("/comment/:postId", isAuth, commentPost);

export default postRouter;
