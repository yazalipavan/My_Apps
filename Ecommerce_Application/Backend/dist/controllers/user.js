import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, dob, _id } = req.body;
    let user = await User.findById(_id);
    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome , ${user.name}`,
        });
    }
    if (!_id || !name || !email || !photo || !gender) {
        return next(new ErrorHandler("Provide all fields", 400));
    }
    user = await User.create({
        name,
        email,
        photo,
        gender,
        dob,
        _id,
    });
    res.status(201).json({
        success: true,
        message: `Welcome , ${user.name}`,
    });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        success: true,
        users,
    });
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    res.status(200).json({
        success: true,
        user,
    });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});