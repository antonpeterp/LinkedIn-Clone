import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ message: "User doesn't have Token" });
    }
    let verifyToken = await jwt.verify(token, process.env.JWT_SEC);
    if (!verifyToken) {
      return res.status(400).json({ message: "User doesnt have valid token" });
    }
    req.userId = verifyToken.userId; // taking the user id specifically
    next();
  } catch (error) {
    return res.status(500).json({ message: "is Auth Error" });
  }
};
export default isAuth;
