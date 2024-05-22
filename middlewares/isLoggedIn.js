import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
  // Get token from hader
  const token = getTokenFromHeader(req);
  // Verify the token
  const decodedUser = verifyToken(token);
  // Save the user into req obj
  if (!decodedUser) {
    // console.log("Token Expired/Invalid");
    throw new Error("Token expired, Please login again");
  } else {
    req.user = decodedUser?.payload;
    next();
  }
};
