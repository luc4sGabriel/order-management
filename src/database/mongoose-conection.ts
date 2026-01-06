import mongoose from "mongoose";
import { config } from "../config/env";

export async function connectMongo(){
  await mongoose.connect(config.databaseUrl);
  console.log("MongoDB conectado");
}