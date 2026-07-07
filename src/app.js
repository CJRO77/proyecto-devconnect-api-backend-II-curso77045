import express from "express";
import indexRouter from "./routes/index.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1", indexRouter);

app.use("/api/v1/auth", authRouter);

export default app;