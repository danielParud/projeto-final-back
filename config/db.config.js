import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export async function connectToDB() {
  try {
    const URI = `${process.env.MONGODB_URI}`;
    const dbConnect = await mongoose.connect(URI);

    console.log(`Connected to db: ${dbConnect.connection.name}`);
  } catch (err) {
    console.log(err);
  }
}
