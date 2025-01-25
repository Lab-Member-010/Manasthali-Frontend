import React, { useState, useEffect, } from "react";
import axios from "axios";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  
  const [newNotification, setNewNotification] = useState({
    userId: "",
    sender_id: "",
    type: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch notifications
  const fetchNotifications = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/notifications/${userId}`, 
    
      );
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (err) {
      setError("Error fetching notifications");
      console.error(err);
      setLoading(false);
    }
  };

  // Send a new notification
  const sendNotification = async () => {
    try {
      const response = await axios.post("http://localhost:3001/notifications/send", newNotification);
      alert(response.data.message);
      setNewNotification({
        userId: "",
        sender_id: "",
        type: "",
        content: "",
      });
      fetchNotifications(newNotification.userId); // Refresh notifications
    } catch (err) {
      setError("Error sending notification");
      console.error(err);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3001/notifications/${id}/mark-read`);
      alert(response.data.message);
      fetchNotifications(newNotification.userId); // Refresh notifications
    } catch (err) {
      setError("Error marking notification as read");
      console.error(err);
    }
  };

  // Fetch notifications on component mount for a demo user
  useEffect(() => {
    const demoUserId = "12345"; // Replace with the actual logged-in user's ID
    setNewNotification((prev) => ({ ...prev, userId: demoUserId }));
    fetchNotifications(demoUserId);
  }, []);

  return (
    <div>
      <h1>Notifications</h1>

      {/* New Notification Form */}
      <div>
        <h2>Send Notification</h2>
        <input
          type="text"
          placeholder="Sender ID"
          value={newNotification.sender_id}
          onChange={(e) =>
            setNewNotification({ ...newNotification, sender_id: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Type"
          value={newNotification.type}
          onChange={(e) =>
            setNewNotification({ ...newNotification, type: e.target.value })
          }
        />
        <textarea
          placeholder="Content"
          value={newNotification.content}
          onChange={(e) =>
            setNewNotification({ ...newNotification, content: e.target.value })
          }
        />
        <button onClick={sendNotification}>Send</button>
      </div>

      {/* Notifications List */}
      <div>
        <h2>Your Notifications</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && notifications.length === 0 && <p>No notifications found</p>}
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <p><strong>Type:</strong> {notification.type}</p>
              <p><strong>Content:</strong> {notification.content}</p>
              <p>
                <strong>Status:</strong>{" "}
                {notification.read_status ? "Read" : "Unread"}
              </p>
              {!notification.read_status && (
                <button onClick={() => markAsRead(notification._id)}>
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notification;
