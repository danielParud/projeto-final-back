import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./config/db.config.js";
import { userRouter } from "./routes/user.routes.js";
import { boardRouter } from "./routes/board.routes.js";
import { projectRouter } from "./routes/project.routes.js";
import { commentRouter } from "./routes/comment.routes.js";

dotenv.config();
connectToDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "10mb" }));

app.use(`/api/user`, userRouter);
app.use(`/api/board`, boardRouter);
app.use(`/api/project`, projectRouter);
app.use(`/api/comment`, commentRouter);

app.listen(Number(process.env.PORT || 4040), () => {
  console.log(`Server up and running at port ${process.env.PORT}`);
});
