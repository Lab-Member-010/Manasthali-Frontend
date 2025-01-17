import React from "react";
import './Feed.css'
import { FaBell } from "react-icons/fa"; // Importing a bell icon from react-icons

function Feed() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* Top Search Bar */}
      <header className="navbar bg-light p-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          placeholder="Search..."
          className="form-control"
          style={{ maxWidth: "500px" }}
        />
        {/* Notification Icon */}
        <div className="ms-3">
          <button
            type="button"
            className="btn btn-outline-secondary position-relative"
          >
            <FaBell />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.75rem" }}
            >
              3
              <span className="visually-hidden">unread notifications</span>
            </span>
          </button>
        </div>
      </header>

      <div className="row flex-grow-1">
        {/* Left Navbar */}
        <nav className="col-md-1 text-white py-3  align-items-center" style={{background:"#c8abd9"}}>
          <ul className="nav flex-column">
            <li className="nav-item">Home</li>
            <li className="nav-item">About</li>
            <li className="nav-item">Services</li>
            <li className="nav-item">Contact</li>
          </ul>
        </nav>

        {/* Main Section */}
        <div className="col-md-10 py-3" >
        <div className="main">
        <h1>Wellcome to Manasthali  </h1>
        <p>this is your social page please scroll it.
        </p>
        </div>
        </div>

        {/* Right Navbar */}
        <nav className="col-md-1  py-3 right-nav" style={{background:"#abc6d9"} }>
          <ul className="nav flex-column">
            <li className="nav-item">Profile</li>
            <li className="nav-item">Settings</li>
            <li className="nav-item">Notifications</li>
            <li className="nav-item">Logout</li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Feed;
