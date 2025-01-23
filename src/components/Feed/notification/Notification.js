import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "./Notification.css";

const Notification = () => {
  const user = useSelector((state) => state.UserSlice?.user);
  const userId = user ? user._id : localStorage.getItem("userId");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      if (!token || !userId) {
        setError("You need to log in to view notifications.");
        setLoading(false);
        return;
      }

      try {
        console.log(`Requesting notifications for user: ${userId}`);

        // Corrected URL
        const response = await axios.get(
          `http://localhost:3001/notifications/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotifications(response.data.notifications);
      } catch (err) {
        setError("Failed to fetch notifications. Please try again.");
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3001/notifications/${id}/mark-read`);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, read_status: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div className="notification-dropdown">
      <NotificationsIcon />
      <div className="notification-list">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : notifications.length === 0 ? (
          <p>No notifications available</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`notification-item ${notif.read_status ? "read" : "unread"}`}
              onClick={() => markAsRead(notif._id)}
            >
              <p>{notif.content}</p>
              <small>{new Date(notif.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
