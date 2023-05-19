import { Schema, model } from "mongoose";

const boardSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  userId: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now() },
});

export const BoardModel = model("Board", boardSchema);
