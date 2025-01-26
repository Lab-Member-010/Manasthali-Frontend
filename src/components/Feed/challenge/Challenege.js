import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Challenge = () => {
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const userId = useSelector((state) => state.user?.user?._id);
    const token = useSelector((state) => state.user?.token);

    // Function to show error or success toast
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

    const handleChallenge = async () => {
        setLoading(true);
        setStatus(null);  // Reset previous status message

        try {
            const response = await axios.get(`http://localhost:3001/challenge/daily-challenge/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.challenge) {
                setChallenge(response.data.challenge);
            } else {
                showToast("No challenge found for today", "error");
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to fetch challenge', "error");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = () => {
        setStatus("Completed");
        showToast("Challenge marked as completed", "success");
    };

    const handleIncomplete = () => {
        setStatus("Incomplete");
        showToast("Challenge marked as incomplete", "error");
    };

    return (
        <div className="container mt-5">
            <h2>Daily Challenge</h2>
            <div className="my-3">
                <Button variant="primary" onClick={handleChallenge} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Get Today\'s Challenge'}
                </Button>
            </div>

            {challenge && (
                <div className="mt-4">
                    <h4>Today's Challenge:</h4>
                    <p>{challenge}</p>

                    <div className="mt-3">
                        <Button variant="success" onClick={handleComplete} className="me-2">
                            Complete
                        </Button>
                        <Button variant="danger" onClick={handleIncomplete}>
                            Incomplete
                        </Button>
                    </div>

                    {status && (
                        <div className="mt-3">
                            <p>Challenge status: {status}</p>
                        </div>
                    )}
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Challenge;
