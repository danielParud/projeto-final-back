import { Schema, model, Types} from "mongoose";

const commentSchema = new Schema ({
    text: { type: String, required: true, trim: true},
    creator: { type: Types.ObjectId, ref: "User"},
    referenceProject: {type:Types.ObjectId, ref: "Project" }
})

export const CommentModel = model("Comment", commentSchema)