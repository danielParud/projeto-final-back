import express from "express";
import { BoardModel } from "../model/board.model.js";
import attachCurrentUser from "../middleware/attachCurrentUser.js";
import jwtMiddleware from "../middleware/isAuth.js";
import { ProjectModel } from "../model/project.model.js";

const boardRouter = express.Router();

boardRouter.get(
  "/user-boards",
  jwtMiddleware,
  attachCurrentUser,
  async (req, res) => {
    try {
      const currentUser = req.currentUser;
      const currentUserId = currentUser._id;
      const getCurrentUserBoards = await BoardModel.find({
        userId: currentUserId,
      });
      res.status(200).json(getCurrentUserBoards);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

boardRouter.get("/:id", jwtMiddleware, attachCurrentUser, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.currentUser;
    const currentUserId = currentUser._id;
    const getBoardDetails = await BoardModel.findOne({
      _id: id,
      userId: currentUserId,
    });
    res.status(200).json(getBoardDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

boardRouter.post("/", jwtMiddleware, attachCurrentUser, async (req, res) => {
  try {
    const { name, description } = req.body;
    const currentUser = req.currentUser;
    if (!name || !description) {
      return res.status(400).json({
        msg: "Please fill all fields..!!",
      });
    }
    const createdBoard = await BoardModel.create({
      name: name,
      description: description,
      userId: currentUser._id,
    });
    res.status(200).json(createdBoard);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

boardRouter.put("/:id", jwtMiddleware, attachCurrentUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const board = await BoardModel.findById(id);

    if (!board) {
      return res.status(400).json({
        msg: "Board not found..!!",
      });
    }

    const updates = {
      name: name,
      description: description,
    };

    const updatedBoard = await BoardModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json(updatedBoard);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

boardRouter.delete(
  "/:id",
  jwtMiddleware,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { id } = req.params;
      const board = await BoardModel.findById(id);

      if (!board) {
        return res.status(400).json({
          msg: "Board not found..!!",
        });
      }
      await ProjectModel.deleteMany({ boardId: id });
      await BoardModel.findByIdAndDelete({ _id: id });
      res.status(200).json({ message: "Board deleted successfully..!!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

export { boardRouter };
