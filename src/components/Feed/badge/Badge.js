import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Badge = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todayBadge, setTodayBadge] = useState(null);

  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);

  // Function to show success or error toast
  const showToast = (message, type) => {
    const options = {
      position: "top-right",  // Specify the position of the toast
    };

    if (type === 'error') {
      toast.error(message, options);  // Show error toast
    } else {
      toast.success(message, options);  // Show success toast
    }
  };

  // Fetch all badges earned by the user
  const fetchAllBadges = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/badges/badges-all/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBadges(response.data);
      showToast("All badges fetched successfully", "success");
    } catch (err) {
      showToast("Error fetching badges", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's badge for the user
  const fetchTodayBadge = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/badges/badge-today/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodayBadge(response.data.badge);
      showToast("Today's badge fetched successfully", "success");
    } catch (err) {
      showToast("Error fetching today's badge", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Badges</h2>

      <div className="my-3">
        {/* Button to fetch today's badge */}
        <Button variant="primary" onClick={fetchTodayBadge} disabled={loading}>
          Get Today's Badge
        </Button>
        
        {/* Button to fetch all earned badges */}
        <Button variant="secondary" onClick={fetchAllBadges} disabled={loading} className="ms-3">
          Get All Badges
        </Button>
      </div>

      {/* Display today's badge */}
      {todayBadge && (
        <div className="mt-4">
          <h4>Today's Badge:</h4>
          <p>Name: {todayBadge.name}</p>
          <p>Description: {todayBadge.description}</p>
        </div>
      )}

      {/* Display all earned badges */}
      <div className="mt-5">
        <h4>Earned Badges:</h4>
        {badges.length > 0 ? (
          badges.map((badge) => (
            <div key={badge._id} className="badge-item">
              <p>{badge.name}</p>
              <p>{badge.description}</p>
            </div>
          ))
        ) : (
          <p>No badges earned yet</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Badge;
