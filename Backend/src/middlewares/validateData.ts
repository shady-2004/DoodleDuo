import { Response, Request, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { userIn } from "../schema/UserPayload";
const validateSignUpData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body as userIn;
    console.log(req.body);

    // Trim all fields
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();

    if (
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedFirstName ||
      !trimmedLastName
    ) {
      return next(new AppError("Please provide all required fields", 400));
    }
    req.body = {
      email: trimmedEmail,
      password: trimmedPassword,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
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

    // Trim all fields
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    //Check for email and password fields
    if (!trimmedEmail || !trimmedPassword) {
      return next(new AppError("Please provide email and password!", 400));
    }

    // Update req.body with trimmed values
    req.body = {
      email: trimmedEmail,
      password: trimmedPassword,
    };

    next();
  }
);

export default { validateSignUpData, validateLoginData };
