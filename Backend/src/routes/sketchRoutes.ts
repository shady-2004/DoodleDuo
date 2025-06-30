import express, { Request, Response, NextFunction } from "express";
import sketchController from "../controllers/sketchController";

const router = express.Router();

router
  .route("/")
  .get(sketchController.getAllUserSketches)
  .post(sketchController.addSketchToUser);

router
  .route("/:id")
  .get(sketchController.getUserSketch)
  .delete(sketchController.deleteUserSketch)
  .patch(sketchController.updateUserSketch);

export default router;
