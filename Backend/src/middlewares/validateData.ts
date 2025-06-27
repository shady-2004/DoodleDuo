import { Response, Request, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { userIn } from "../schema/UserPayload";
const validateSignUpData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body as userIn;
    if (!email || !password || !firstName || !lastName) {
      return next(new AppError("Please provide all required fields", 400));
    }
    req.body = {
      email,
      password,
      firstName,
      lastName,
    };
    next();
  }
);

const validateLoginData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };
    //Check for email and password fields
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    next();
  }
);

export default { validateSignUpData, validateLoginData };
