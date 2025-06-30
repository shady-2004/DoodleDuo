import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import sanitizeMiddleware from "./middlewares/sanitize";
import cors from "cors";

import userRouter from "./routes/userRoutes";

import globalErrorHanlder from "./controllers/errorController";
import AppError from "./utils/AppError";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.set("trust proxy", 1);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
});

app.use("/DoodleDuo/api", limiter);

app.use(express.json({ limit: "1mb" }));

app.use(sanitizeMiddleware);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("combined"));
}

app.use("/DoodleDuo/api/users", userRouter);

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server! `, 404));
// });
app.use(globalErrorHanlder);

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1); // Optional but clean
});

export default app;
