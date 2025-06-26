import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import mongoSanitize from "express-mongo-sanitize";
import userRouter from "./routes/userRoutes";
import AppError from "./AppError";

import globalErrorHanlder from "./controllers/errorController";

const xss = require("xss-clean") as () => express.RequestHandler;

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
});

app.use("/DoodleDuo", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());
app.use(xss());

app.use(morgan("dev"));

app.use("/DoodleDuo/users", userRouter);

// app.all("*", (req, res) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server! `, 404));
// });
app.use(globalErrorHanlder);

export default app;
