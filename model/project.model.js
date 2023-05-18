import { Schema, model, Types} from "mongoose";

const projectSchema = new Schema({
  name: { type: String, required: true, trim: true, minLength: 3 },
  details: { type: String, trim: true, minLength: 1 },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now() },
  creator: { type: Types.ObjectId, ref: "User"}
});

export const ProjectModel = model("Project", projectSchema);