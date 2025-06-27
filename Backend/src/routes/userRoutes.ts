import express, { Request, Response, NextFunction } from "express";
import authController from "../controllers/authController";
import sketchRouter from "./sketchRoutes";

const router = express.Router();

router.route("/login").post(authController.login);

router.use("/sketch", sketchRouter);

export default router;
