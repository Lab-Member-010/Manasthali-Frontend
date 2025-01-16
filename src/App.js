import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home"
import SignUp from "./components/Signup";
import Signin from "./components/Signin";
import Verifyotp from "./components/Verifyotp";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import Quiz from "./components/Quiz";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home/>}/>

        {/* Signup Page */}
        <Route path="/signup" element={<SignUp />} />

        {/* OTP Verification Page */}
        {/* The email prop will need to be passed via state from SignUp */}
        <Route
          path="/verify-otp"
          element={<Verifyotp />}
        />

        {/* Sign-in Page */}
        <Route path="/signin" element={<Signin />} />

        {/* Forgot Password Page */}
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* Reset Password Page */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Quiz Page */}
        <Route path="/quiz" element={<Quiz />} />

        {/* Default Route to Signup */}
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
};

export default App;
