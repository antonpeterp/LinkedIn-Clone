import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {
    let token = await jwt.sign({ userId }, process.env.JWT_SEC, {
      expiresIn: "7d",
    }); // generates a user token, why the { Id }
    return token;
  } catch (error) {
    console.log(error);
  }
};
export default genToken;
