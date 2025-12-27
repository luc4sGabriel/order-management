import mongoose from "mongoose";

export async function connectMongo(){
  await mongoose.connect(process.env.DATABASE_URL || "");
  console.log("MongoDB conectado");
}