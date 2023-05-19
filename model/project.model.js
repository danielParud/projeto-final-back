import { Schema, model } from "mongoose";

const projectSchema = new Schema({
  name: { type: String, required: true, trim: true },
  creator: { type: String, required: true, trim: true },
  status: { type: String, required: true, trim: true },
  startDate: { type: String, required: true, trim: true },
  dueDate: { type: String, required: true, trim: true },
  boardId: { type: String, required: true, trim: true },
  userId: { type: String, required: true, trim: true },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: { type: Date, default: Date.now() },
});

export const ProjectModel = model("Project", projectSchema);
