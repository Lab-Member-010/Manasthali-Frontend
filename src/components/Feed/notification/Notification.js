import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "./Notification.module.css";
import Api from "../../../apis/Api";
 
const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications for User ID:", userId);
        const response = await axios.get(
          `${Api.SERVER_URL}/notifications${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Fetched Notifications:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userId && token) {
      fetchNotifications();
    }
  }, [userId, token]);

  return (
    <div className={styles.notificationContainer}>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`${styles.notificationItem} ${
              notification.read_status ? "" : styles.unread
            }`}
          >
            <div className={styles.notificationIcon}>🔔</div>
            <div className={styles.notificationText}>
              <p>
                <strong>{notification.notification_type}</strong> from{" "}
                {notification.sender_id}
              </p>
              <span className={styles.notificationTime}>
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationComponent;
