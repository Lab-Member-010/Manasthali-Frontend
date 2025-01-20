import React, { useState } from "react";
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
} from "@mui/icons-material";
import "./Feed.css";
import ManasthaliLogo from "../../images/Manasthali.png";

const Feed = () => {
  const [isLeftHover, setIsLeftHover] = useState(false);

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
            <NotificationsIcon style={{ fontSize: 30, color: "#a06bba" }} />
          </button>
        </div>
      </div>
      <br/> <br/> <br/>
      {/* Content Section */}
      <div className="content-container">
        {/* Left Navbar */}
        <div
          className={`left-navbar ${isLeftHover ? "hovered" : ""}`}
          onMouseEnter={() => setIsLeftHover(true)}
          onMouseLeave={() => setIsLeftHover(false)}
        >
          <div className="nav-item">
            <HomeIcon style={{ fontSize: 30, color: "black" }} />
            <span className="icon-text">Home</span>
          </div>
          <div className="nav-item">
            <GroupIcon style={{ fontSize: 30, color: "black" }} />
            <span className="icon-text">Group</span>
          </div>
          <div className="nav-item">
            <AutoStoriesIcon style={{ fontSize: 30, color: "black" }} />
            <span className="icon-text">Stories</span>
          </div>
          <div className="nav-item">
            <EventIcon style={{ fontSize: 30, color: "black" }} />
            <span className="icon-text">Events</span>
          </div>
          <div className="nav-item">
            <WorkspacePremiumIcon style={{ fontSize: 30, color: "black" }} />
            <span className="icon-text">Premium</span>
          </div>

          {/* Dropdown Menu */}
          {isLeftHover && (
            <div className="dropdown-menu">
              <div className="dropdown-item">Home</div>
              <div className="dropdown-item">Group</div>
              <div className="dropdown-item">Stories</div>
              <div className="dropdown-item">Events</div>
              <div className="dropdown-item">Premium</div>
            </div>
          )}
        </div>

        {/* Main Content */}

        <div className="mid-part">
          <div>Main Content Area <br /> a transcriptional activator, a model for happiness, and an organization that promotes higher education.
            PerA
            A transcriptional activator that positively controls the expression of BFP. PerA is also known as BfpT.
            PERMA+ model
            A scientific theory of happiness that aims to improve well-being and reduce stress, depression, and anxiety. The model is based on the idea that increasing positive emotions, engagement, relationships, meaning, and achievement can lead to a happier life.
            Preeminent Education Research Association (PERA)
            An organization that promotes higher education, research, and other activities in Maharashtra, India. PERA's activities include:
            Conducting Common Entrance Tests (CETs) for professional undergraduate and post graduate programs
            Working with industry to create collaborative education projects
            Helping universities get accreditation, rankings, and ratings
            Encouraging research and other activities related to art, design, technology, sports, and commerce
            Why Pera
            Why Pera * The constitution of PERA, as an Esteemed Federation of the State Private universities in Maharashtra, is a step in the...

            PERA CET
            Identification of the DNA Binding Sites of PerA, the ...
            The expression of BFP is under the positive control of PerA (also known as BfpT), an AraC/XylS-like transcriptional activator enco...
            National Institutes of Health (NIH) (.gov)
            PERA – Preeminent Education Research Association (PERA)
            Preeminent Education and Research Association PERA is an esteem federation of the state private universities of Maharashtra. The f...
            PERA CET
            Identification of the DNA Binding Sites of PerA, the ...
            The expression of BFP is under the positive control of PerA (also known as BfpT), an AraC/XylS-like transcriptional activator enco...
            National Institutes of Health (NIH) (.gov)
            PERA – Preeminent Education Research Association (PERA)
            Preeminent Education and Research Association PERA is an esteem federation of the state private universities of Maharashtra. The f...
            PERA CET
            Identification of the DNA Binding Sites of PerA, the ...
            The expression of BFP is under the positive control of PerA (also known as BfpT), an AraC/XylS-like transcriptional activator enco...
            National Institutes of Health (NIH) (.gov)
            PERA – Preeminent Education Research Association (PERA)
            Preeminent Education and Research Association PERA is an esteem federation of the state private universities of Maharashtra. The f...
            PERA CET
            Identification of the DNA Binding Sites of PerA, the ...
            The expression of BFP is under the positive control of PerA (also known as BfpT), an AraC/XylS-like transcriptional activator enco...
            National Institutes of Health (NIH) (.gov)
            PERA – Preeminent Education Research Association (PERA)
            Preeminent Education and Research Association PERA is an esteem federation of the state private universities of Maharashtra. The f...

            PERA CET
            Show all
            Generative AI is experimental.



            Export

            Pera: Uses, Side effects, Reviews, Composition ...

            1mg
            https://www.1mg.com › medicines › pera-118737
            28 Oct 2022 — Pera 1000mg Injection is an antibiotic that kills harmful bacteria. However, it also affects the helpful bacteria in your stomach or intestine and causes ...</div>
        </div>

        {/* Right Navbar */}
        <div className="right-navbar">
          <div className="nav-item">
            <AccountCircleIcon style={{ fontSize: 30, color: "black" }} />
          </div>
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

