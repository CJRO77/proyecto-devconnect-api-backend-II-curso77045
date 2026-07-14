import express from "express";
import indexRouter from "./routes/index.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

initializePassport();

app.use(passport.initialize());


app.use("/api/v1", indexRouter);

app.use("/api/v1/sessions", sessionsRouter);

export default app;