import express from "express";
import {
  login,
  logout,
  signUp,
  googleCallback,
} from "../controller/auth.controller.js";
import passport from "passport";

let authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

// Google OAuth
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback
);

export default authRouter;
