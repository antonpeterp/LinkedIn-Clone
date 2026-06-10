import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

dotenv.config();

let app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // frontend connection middleware

app.use("/api/auth", authRouter); // gives the url as http://localhost:5000/api/auth/[signup(this changes the main thing here)] aka this the middleware

app.use("/api/user", userRouter); // protected route

app.use("/api/posts", postRouter); // post

connectDB().then(() => {
  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is up and running at http://localhost:5000`);
  });
});
