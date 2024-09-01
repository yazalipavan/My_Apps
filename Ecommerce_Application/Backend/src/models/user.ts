import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  photo: string;
  email: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  //virutal Atrributre
  age: number;
}

const schema = new mongoose.Schema(
  {
    _id: { type: String, required: [true, "Please Enter Id"] },
    name: { type: String, required: [true, "Please Enter Name"] },
    email: {
      type: String,
      unique: [true, "Email already Exist"],
      required: [true, "Please Enter email"],
      validate: validator.default.isEmail,
    },
    photo: { type: String, required: [true, "Please Enter Photo"] },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please enter your Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please enter Dob"],
    },
  },
  { timestamps: true }
);
schema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

export const User = mongoose.model<IUser>("User", schema);
