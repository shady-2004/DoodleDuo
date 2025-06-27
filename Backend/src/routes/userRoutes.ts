import express, { Request, Response, NextFunction } from "express";
import authController from "../controllers/authController";
import sketchRouter from "./sketchRoutes";
import inValidation from "../middlewares/validateData";

const router = express.Router();

router
  .route("/login")
  .post(inValidation.validateLoginData, authController.login);
router
  .route("/signUp")
  .post(inValidation.validateSignUpData, authController.signUp);

router.use("/sketch", authController.protect, sketchRouter);

export default router;
