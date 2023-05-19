import { UserModel } from "../model/user.model.js";
import jwt from "jsonwebtoken";

export default async function attachCurrentUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SIGN_SECRET);
    const user = await UserModel.findOne({ _id: decodedToken._id });

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    req.currentUser = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
