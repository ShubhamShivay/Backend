import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  return jwt.sign({ payload }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
};

export default generateToken;