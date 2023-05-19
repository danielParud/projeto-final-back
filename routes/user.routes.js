import bcrypt from "bcrypt";
import express from "express";
import { generateToken } from "../config/jwt.config.js";
import { UserModel } from "../model/user.model.js";

const SALT_ROUNDS = 10;

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({
        msg: "Please fill all fields..!!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        msg: "Password not match with confirm password..!!",
      });
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        msg: "User already exist..!!",
      });
    }

    if (
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res.status(400).json({
        msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
      });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      name: name,
      email: email,
      passwordHash: hashedPassword,
    });

    // delete createdUser._doc.passwordHash;
    return res.status(201).json(createdUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Email ou senha invalidos." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        token: token,
      });
    } else {
      return res.status(401).json({ msg: "Email ou senha invalidos." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export { userRouter };
