import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import useUserApi from "../services/useUserApi";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const userApi = useUserApi();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      userApi.actions.createNow(
        {
          name: user.displayName!,
          email: user.email!,
          photo: user.photoURL!,
          gender,
          role: "user",
          dob: date,
          _id: user.uid,
        },
        {
          onSuccess: (response) => {
            console.log(response, "response");
            toast.success(response.message);
          },
          onError: (error) => {
            toast.error(error);
          },
        }
      );
    } catch (error) {
      toast.error("Sign-in failed");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="login">Login</h1>
        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Choose Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <p>Already Signed in Once</p>
          <button onClick={loginHandler}>
            <FcGoogle />
            <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
