import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

const addSketchToUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    if (user.sketches.length >= 6) {
      return next(new AppError("You can only store up to 6 sketches", 403));
    }

    // Trim the sketch name
    const trimmedName = req.body.name?.trim();

    if (!trimmedName) {
      return next(new AppError("No sketch name provided", 403));
    }

    user.sketches.push({
      data: req.body.sketchData,
      name: trimmedName,
    });
    await user.save();
    res.status(201).json({
      status: "success",
      data: {
        sketch: {
          name: user.sketches[user.sketches.length - 1].name,
          id: user.sketches[user.sketches.length - 1]._id,
          picture: user.sketches[user.sketches.length - 1].picture,
          createdAt: user.sketches[user.sketches.length - 1].createdAt,
        },
      },
    });
  }
);

const getAllUserSketches = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const sketches = user.sketches.map(({ _id, createdAt, picture, name }) => ({
      id: _id,
      createdAt,
      picture,
      name,
    }));
    res.status(200).json({
      status: "success",
      data: {
        sketches,
      },
    });
  }
);

const getUserSketch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!req.params.id) {
      return next(new AppError("No sketch id provided", 403));
    }
    const sketch = user.sketches.find(
      ({ _id }) => _id.toString() == req.params.id
    );
    if (!sketch) {
      return next(new AppError("User does not own sketch with that id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        sketch: {
          id: sketch._id,
          data: sketch.data,
          name: sketch.name,
        },
      },
    });
  }
);

const deleteUserSketch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    if (!req.params.id) {
      return next(new AppError("No sketch id provided", 403));
    }
    const sketchIndex = user.sketches.findIndex(
      ({ _id }) => _id.toString() == req.params.id
    );
    if (sketchIndex === -1) {
      return next(new AppError("User does not own sketch with that id", 404));
    }
    user.sketches.splice(sketchIndex, 1);
    await user.save();
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
const updateUserSketch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    if (!req.params.id) {
      return next(new AppError("No sketch id provided", 403));
    }
    const sketchIndex = user.sketches.findIndex(
      ({ _id }) => _id.toString() == req.params.id
    );
    if (sketchIndex === -1) {
      return next(new AppError("User does not own sketch with that id", 404));
    }
    if (!req.body.sketchData) {
      return next(new AppError("Missing sketch data sketch data ", 403));
    }
    user.sketches[sketchIndex].data = req.body.sketchData;
    // user.sketches[sketchIndex].picture = req.body.sketchPicture;
    await user.save();
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export default {
  addSketchToUser,
  getAllUserSketches,
  getUserSketch,
  deleteUserSketch,
  updateUserSketch,
};
