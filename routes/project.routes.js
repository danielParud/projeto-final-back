import express from "express";
import { ProjectModel } from "../model/project.model.js";
import attachCurrentUser from "../middleware/attachCurrentUser.js";
import jwtMiddleware from "../middleware/isAuth.js";
import { cloudinary } from "../config/cloudinary.config.js";

const projectRouter = express.Router();

projectRouter.post(
  "/board-projects",
  jwtMiddleware,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { boardId } = req.body;
      const currentUser = req.currentUser;
      const currentUserId = currentUser._id;
      const getCurrentUserProjects = await ProjectModel.find({
        userId: currentUserId,
        boardId: boardId,
      });
      res.status(200).json(getCurrentUserProjects);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

projectRouter.get(
  "/:id",
  jwtMiddleware,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { id } = req.params;
      const currentUser = req.currentUser;
      const currentUserId = currentUser._id;
      const getProjectDetails = await ProjectModel.findOne({
        _id: id,
        userId: currentUserId,
      });
      res.status(200).json(getProjectDetails);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

projectRouter.post("/", jwtMiddleware, attachCurrentUser, async (req, res) => {
  try {
    const { name, status, boardId, image, startDate, dueDate } = req.body;
    const currentUser = req.currentUser;
    if (!name || !status || !boardId) {
      return res.status(400).json({
        msg: "Please fill all fields..!!",
      });
    }
    const result = await cloudinary.uploader.upload(image, {
      folder: "projects",
    });
    const createdProject = await ProjectModel.create({
      name: name,
      creator: currentUser.name,
      status: status,
      startDate,
      dueDate,
      boardId: boardId,
      userId: currentUser._id,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
    res.status(200).json(createdProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

projectRouter.put(
  "/:id",
  jwtMiddleware,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, status } = req.body;

      const project = await ProjectModel.findById(id);

      if (!project) {
        return res.status(400).json({
          msg: "Project not found..!!",
        });
      }

      const updates = {
        name: name,
        status: status,
      };

      const updatedProject = await ProjectModel.findByIdAndUpdate(id, updates, {
        new: true,
      });
      res.status(200).json(updatedProject);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

projectRouter.delete(
  "/:id",
  jwtMiddleware,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { id } = req.params;

      const project = await ProjectModel.findById(id);

      if (!project) {
        return res.status(400).json({
          msg: "Project not found..!!",
        });
      }
      await ProjectModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Project deleted successfully..!!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

export { projectRouter };
