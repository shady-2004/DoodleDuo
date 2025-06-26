import User, { IUser } from "./../models/userModel";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { UserPayload } from "../schema/UserPayload";
import { Response, Request, NextFunction } from "express";
import util from "util";
import { AuthenticatedUser } from "../schema/user";

export const signToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN as string;

  if (!jwtSecret || !jwtExpiresIn) {
    throw new AppError("JWT configuration missing", 500);
  }
  // @ts-ignore
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

const createSendToken = (
  user: UserPayload,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user.id);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };
    //Check for email and password fields
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    //Chech if user exists && password is correct
    const user = (await User.findOne({ email }).select(
      "+password"
    )) as IUser | null;

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new AppError("False login credintials (User not found)", 401)
      );
    }

    // Map IUser to UserPayload
    const userPayload: UserPayload = {
      id: user._id,
      email: user.email,
      profile: user.profile || undefined,
      password: user.password,
    };
    createSendToken(userPayload, 200, res);
  }
);

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(
          "Your are not logged in! Please log in to get access .",
          401
        )
      );
    }
    //Verification token
    const jwtSecret = process.env.JWT_SECRET as string;

    const verifyToken = util.promisify(jwt.verify);

    // @ts-ignore

    const decoded = await verifyToken(token, jwtSecret);
    //Check if user still exists
    // @ts-ignore

    let userDoc = await User.findById(decoded.id);

    if (!userDoc) {
      return next(
        new AppError(
          "The user belonging  to token user does no longer exist .",
          401
        )
      );
    }
    const user: AuthenticatedUser = {
      id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
    };

    req.user = user;
    next();
  }
);

export default { login, protect };
