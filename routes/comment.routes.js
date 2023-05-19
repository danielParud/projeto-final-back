import express from "express";
import attachCurrentUser from "../middleware/attachCurrentUser.js";
import jwtMiddleware from "../middleware/isAuth.js";
import { CommentModel } from "../model/comment.model.js";
import { ProjectModel } from "../model/project.model.js";

const commentRouter = express.Router();

commentRouter.post("/", jwtMiddleware, attachCurrentUser, async (req, res) => {
  try {
    const { projectId, comment } = req.body;
    if (!projectId || !comment) {
      return res.status(400).json({
        msg: "Please fill all fields..!!",
      });
    }
    const getProject = await ProjectModel.findById({
      _id: projectId,
    });
    if (!getProject) {
      return res.status(400).json({
        msg: "Project not found..!!",
      });
    }
    const addedComment = await CommentModel.create({
      comment: comment,
      projectId: getProject._id,
    });
    res.status(200).json(addedComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

commentRouter.get("/:id", jwtMiddleware, attachCurrentUser, async (req, res) => {
  try {
    const { id } = req.params;
    const getComments = await CommentModel.find({
      projectId: id,
    });
    res.status(200).json(getComments);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

export { commentRouter };
