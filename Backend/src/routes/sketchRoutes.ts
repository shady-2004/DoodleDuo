import express, { Request, Response, NextFunction } from "express";
import sketchController from "../controllers/sketchController";

const router = express.Router();

router.route("/").get(sketchController.getAllUserSketches);

router
  .route("/:id")
  .post(sketchController.addSketchToUser)
  .get(sketchController.getUserSketch)
  .delete(sketchController.deleteUserSketch)
  .patch(sketchController.deleteUserSketch);

export default router;
