import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import SignUp from "./components/Authentication/Signup";
import Signin from "./components/Authentication/Signin";
import Verifyotp from "./components/Authentication/Verifyotp";
import ForgetPassword from "./components/Authentication/ForgetPassword";
import ResetPassword from "./components/Authentication/ResetPassword";
import QuizGetStarted from "./components/Quiz/QuizGetStarted";
import Quiz from "./components/Quiz/Quiz";
import Feed from "./components/Feed/Feed";
import Auth from "./components/Authorization/Auth";
import Personality from "./components/Quiz/personality";

const App = () => {
  return (
    <>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Signup Page */}
        <Route path="/signup" element={<SignUp />} />

        {/* OTP Verification Page */}
        <Route path="/verify-otp" element={<Verifyotp />} />

        {/* Sign-in Page */}
        <Route path="/signin" element={<Signin />} />

        {/* Forgot Password Page */}
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* Reset Password Page */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Quiz Get Started Page */}
        <Route path="/quiz-start" element={<Auth><QuizGetStarted /></Auth>} />

        {/* Quiz Page */}
        <Route path="/quiz" element={<Auth><Quiz /></Auth>} />

        {/* Feed Page */}
        <Route path="/feed" element={<Auth><Feed /></Auth>} />

        {/* Personality Page */}
        <Route path="/personality" element={<Auth><Personality/></Auth>} />
      </Routes>


    </>
  );
};
export default App;   
