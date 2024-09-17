import { NextFunction, Request, Response } from "express";
import { TryCatch } from "./error.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/user.js";

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    console.log(id);
    if (!id) {
      return next(new ErrorHandler("Login to proceed", 401));
    }
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("Invalid Id", 401));
    if (user.role !== "admin")
      return next(new ErrorHandler("You dont have admin access", 403));
    next();
  }
);
