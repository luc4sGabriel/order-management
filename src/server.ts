import "dotenv/config"; 
import { config } from "./config/env";
import { connectMongo } from "./database/mongoose-conection";
import { app } from "./app";

connectMongo().then(() => {
  app.listen(config.port, () => console.log("Server running"))
}).catch((err) => {
  console.error("Failed to connect to the database", err)
  process.exit(1);
});