import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signin.css"
import "bootstrap/dist/css/bootstrap.min.css";
const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/users/login", formData);
      console.log(response);
      navigate("/quiz"); // Navigate to the homepage or next page after successful login
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Invalid credentials.");
    }
  };

  return (
    // <div className="signin-container">
    //   <h2>Sign In</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="email"
    //       name="email"
    //       value={formData.email}
    //       onChange={handleChange}
    //       placeholder="Email"
    //       required
    //     />
    //     <input
    //       type="password"
    //       name="password"
    //       value={formData.password}
    //       onChange={handleChange}
    //       placeholder="Password"
    //       required
    //     />
    //     <button type="submit">Sign In</button>
    //   </form>
    //   {errorMessage && <p className="error-message">{errorMessage}</p>}
    //   <button onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
    // </div>

    <div className="signin-container container d-flex justify-content-center align-items-center min-vh-100">
  <div className="signin-box card p-4 shadow">
    <h2 className="text-center mb-4">Sign In</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="form-control"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Sign In</button>
    </form>
    {errorMessage && <p className="error-message text-danger mt-3">{errorMessage}</p>}
    <button
      className="btn btn-link w-100 mt-3"
      onClick={() => navigate("/forgot-password")}
    >
      Forgot Password?
    </button>
  </div>
</div>

  );
};

export default Signin;
