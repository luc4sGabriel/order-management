import "dotenv/config"; 
import { connectMongo } from "./database/mongoose-conection";
import { app } from "./app";

connectMongo().then(() => {
  app.listen(process.env.PORT, () => console.log("Server running"));
});