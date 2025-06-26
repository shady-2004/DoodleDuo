import express, { Request, Response, NextFunction } from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.route("/login").post(authController.login);

export default router;
