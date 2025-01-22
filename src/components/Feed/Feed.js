import React from "react";
import {
  Home as HomeIcon,
  Group as GroupIcon,
  AutoStories as AutoStoriesIcon,
  Event as EventIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Chat as ChatIcon,
  Groups as GroupsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
} from "@mui/icons-material";
import "./Feed.css";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux-config/UserSlice";
import ManasthaliLogo from "../../images/Manasthali.png";

const Feed = () => {
  const {isLoggedIn} = useSelector((store)=>store.User || {});
  console.log(isLoggedIn)
  const dispatch = useDispatch();
  return (
    <div className="main-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <img className="rotating-logo" src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
          <div className="site-logo">Manasthali</div>
        </div>
        <div className="header-right">
          <input type="text" placeholder="Search..." className="searchBar"/>
        </div>
      </div>
      <br /> <br /> <br />
      {/* Content Section */}
      <div className="content-container">
        {/* Left Navbar */}
        <div className="left-navbar">
          <div className="nav-item navItem">
            <HomeIcon/>
            <span className="icon-text ml-2">Home</span>
          </div>
          <div className="nav-item navItem">
            <GroupIcon/>
            <span className="icon-text ml-2">Group</span>
          </div>
          <div className="nav-item navItem">
            <AutoStoriesIcon/>
            <span className="icon-text ml-2">Stories</span>
          </div>
          <div className="nav-item navItem">
            <ChatIcon/>
            <span className="icon-text ml-2">Chat</span>
          </div>
          <div className="nav-item navItem">
            <GroupsIcon/>
            <span className="icon-text ml-2">GroupChat</span>
          </div>
          <div className="nav-item navItem">
            <NotificationsIcon/>
            <span className="icon-text ml-2">Notifications</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="mid-part">
          <div className="innerDb">
          </div>
        </div>

        {/* Right Navbar */}
        <div className="right-navbar">
          <div className="nav-item">
            <AccountCircleIcon/>
          </div>
          <div className="nav-item">
            <EventIcon/>
          </div>
          <div className="nav-item">
            <WorkspacePremiumIcon/>
          </div>
          <div className="nav-item" onClick={()=>dispatch(signOut())}>
            <PowerSettingsNewIcon/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
