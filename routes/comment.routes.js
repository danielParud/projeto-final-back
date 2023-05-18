import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { ProjectModel } from "../model/project.model.js";
import { UserModel } from "../model/user.model.js";
import { CommentModel } from "../model/comment.model.js";

const commentRouter = express.Router();

commentRouter.project("/:postId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    const comment = await CommentModel.create({
      ...req.body,
      creator: loggedInUser._id,
      referencePost: req.params.postId,
    });
    await PostModel.findOneAndUpdate(
      { _id: req.params.postId },
      { $push: { comments: comment._id } },
      { runValidators: true}
    );
    await UserModel.findOneAndUpdate(
        { _id: loggedInUser.postId },
        { $push: { comments: comment._id } },
        { runValidators: true}
      );
      return res.status(200).json(comment)
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

commentRouter.delete(
  "/:commentId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const comment = await CommentModel.findOne({
        _id: req.params.commentId,
      }).populate("referencePost");

      if (
        !comment.creator === req.currentUser._id ||
        !comment.referencePost.creator === req.currentUser._id
      ) {
        return res
          .status(401)
          .json("Acesso negado. Voce não tem autorização para excluir esse comentário");
      }
      const deletedComment = await ProjectModel.deleteOne({
        _id: req.params.commentId,
      });

      await ProjectModel.findOneAndUpdate(
        { _id: comment.referenceProject },
        { $pull: { comments: comment._id } },
        { runValidators: true }
      );

      await UserModel.findOneAndUpdate(
        { _id: req.currentUser._id },
        { $pull: { comments: comment._id } },
        { runValidators: true }
      );
      return res.status(200).json(deletedComment)

    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }
);
export { commentRouter };