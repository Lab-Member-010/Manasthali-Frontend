import React,{useState} from "react";
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
import { useDispatch, useSelector} from "react-redux";
import { signOut } from "../../redux-config/UserSlice";
import ManasthaliLogo from "../../images/Manasthali.png";
import Chat from "../Chats/Chat";
import FeedHome from "./FeedHome"

const Feed = () => {
  const {isLoggedIn} = useSelector((store)=>store.User || {});
  console.log(isLoggedIn)
  const dispatch = useDispatch();

  const [activeComponent, setActiveComponent] = useState("home");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "home":
        return <FeedHome />;
      case "groups":
        return <Chat />;
      case "Dekhte baad me":
        return <Chat />;
      case "chat":
        return <Chat />;
      case "group-chat":
        return <Chat />;
      case "notifications":
        return <Chat />;
      default:
        return <div>Welcome to Manasthali!</div>;
    }
  };

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
          <div className="nav-item navItem" onClick={() => setActiveComponent("home")}>
            <HomeIcon/>
            <span className="icon-text ml-2">Home</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("groups")}>
            <GroupIcon/>
            <span className="icon-text ml-2">Group</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("Dekhte baad me")}>
            <AutoStoriesIcon/>
            <span className="icon-text ml-2">Dekhte baad me</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("chat")}>
            <ChatIcon/>
            <span className="icon-text ml-2">Chat</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("group-chat")}>
            <GroupsIcon/>
            <span className="icon-text ml-2">GroupChat</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("notifications")}>
            <NotificationsIcon/>
            <span className="icon-text ml-2">Notifications</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="mid-part">
          <div className="storiesDiv">
            hello
          </div>
          <div className="innerDb">
            {renderActiveComponent()}
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
