import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  comment: { type: String, required: true, trim: true },
  projectId: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now() },
});

export const CommentModel = model("Comment", commentSchema);