import styles from "./Admin.module.css";
import ManasthaliLogo from "../../images/Manasthali.png";
import {
    Home as HomeIcon,
    Forum,
    Group as GroupIcon,
} from "@mui/icons-material";
import { useState } from "react";
import CommunityAdmin from "./Community/communityAdmin";
import AdminHome from "./AdminHome/AdminHome";

const Admin = () => {

    const [activeComponent, setActiveComponent] = useState("admin");

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case "home":
                return <CommunityAdmin />;
            case "group":
                return <AdminHome />;
            default:
                return <AdminHome />;
        }
      };

    return (
    <div className={styles.adminContainer}>
        <div className={styles.headerAdmin}>
            <div className={styles.headerLeftAdmin}>
                <img className={styles.rotatingLogoAdmin} src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
                <div className={styles.siteLogoAdmin}>Manasthali</div>
            </div>
        </div>

        <br /> <br /> <br />

        <div className={styles.contentContainerAdmin}>

            <div className={styles.leftNavbarAdmin}>
                <div className={`nav-item ${styles.navItemAdmin}`} onClick={() => setActiveComponent("home")}>
                    <HomeIcon />
                    <span className="icon-text ml-2">Admin</span>
                </div>
                <div className={`nav-item ${styles.navItemAdmin}`} onClick={() => setActiveComponent("group")}>
                    <GroupIcon />
                    <span className="icon-text ml-2">Add Group</span>
                </div>
            </div>

            <div className={styles.midPartAdmin}>
                <div className={styles.innerDbAdmin}>
                {renderActiveComponent()}
                </div>
            </div>

        </div>
    </div>
  );
};

export default Admin;



