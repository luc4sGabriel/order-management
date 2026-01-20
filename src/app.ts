import express from "express";
import routes from "./routes/index.routes";
import { errorHandler } from "./middlewares/error-handler";
import cors from "cors";

export const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://order-management-il5c.onrender.com',
    // FlutterFlow link
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(routes);
app.use(errorHandler)


