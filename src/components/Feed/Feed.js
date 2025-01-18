import React, { useState } from "react";
import {
  Home as HomeIcon,
  Group as GroupIcon,
  AutoStories as AutoStoriesIcon,
  Event as EventIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  AccountCircle as AccountCircleIcon,
  Chat as ChatIcon,
  Groups as GroupsIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import "./Feed.css";
import ManasthaliLogo from "../Feed/Manasthali.png";

const Feed = () => {
  const [isLeftHover, setIsLeftHover] = useState(false);
  const [isRightHover, setIsRightHover] = useState(false);

  return (
    <div className="main-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <img className="rotating-logo" src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
          <div className="site-logo">Manasthali</div>
        </div>
        <div className="header-right">
          <input type="text" placeholder="Search..." className="search-bar" />
          <button className="menu-button">
            <NotificationsIcon style={{ fontSize: 30, color:"#a06bba" }} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-container">
        {/* Left Navbar */}
        <div
          className="left-navbar"
          onMouseEnter={() => setIsLeftHover(true)}
          onMouseLeave={() => setIsLeftHover(false)}
        >
          <div className="nav-item">
            <HomeIcon style={{ fontSize: 30, color: "black" }} />
            {isLeftHover && <div className="hover-text">Home</div>}
          </div>
          <div className="nav-item">
            <GroupIcon style={{ fontSize: 30, color: "black" }} />
            {isLeftHover && <div className="hover-text">Group</div>}
          </div>
          <div className="nav-item">
            <AutoStoriesIcon style={{ fontSize: 30, color: "black" }} />
            {isLeftHover && <div className="hover-text">Stories</div>}
          </div>
          <div className="nav-item">
            <EventIcon style={{ fontSize: 30, color: "black" }} />
            {isLeftHover && <div className="hover-text">Events</div>}
          </div>
          <div className="nav-item">
            <WorkspacePremiumIcon style={{ fontSize: 30, color: "black" }} />
            {isLeftHover && <div className="hover-text">Premium</div>}
          </div>
        </div>

        {/* Main Content */}
        <div className="mid-part">Main Content Area</div>

        {/* Right Navbar */}
        <div className="right-navbar">
          <div
            className="nav-item"
            onMouseEnter={() => setIsRightHover(true)}
            onMouseLeave={() => setIsRightHover(false)}
          >
            <AccountCircleIcon style={{ fontSize: 30, color: "black" }} />
          </div>
          {isRightHover && (
            <div className="hover-menu right-hover-menu">
              <div className="hover-item">Account</div>
              <div className="hover-item">Settings</div>
              <div className="hover-item">Logout</div>
            </div>
          )}
          <div className="nav-item">
            <GroupsIcon style={{ fontSize: 30, color: "black" }} />
          </div>
          <div className="nav-item">
            <ChatIcon style={{ fontSize: 30, color: "black" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;