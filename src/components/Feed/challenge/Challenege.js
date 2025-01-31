
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Challenge.module.css";

const Challenge = () => {
    const [challenge, setChallenge] = useState(null);
    const [status, setStatus] = useState(null);

    const userId = useSelector((state) => state.user?.user?._id);
    const token = useSelector((state) => state.user?.token);

    const showToast = (message, type) => {
        const options = {
            position: "top-right",
        };

        if (type === 'error') {
            toast.error(message, options); 
        } else {
            toast.success(message, options);  
        }
    };

    const handleChallenge = async () => {

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
        <div className={styles.challengeContainer}>
            <h2>Daily Challenge</h2>
            {!challenge &&
                <div>
                    <Button onClick={handleChallenge} className={`form-control w-100 ${styles.fetchChallengeButton}`}>
                        Get Today's Challenge
                    </Button>
                </div>
            }
            {challenge && (
                <div className="mt-4">
                    <h3 className="text-dark">Today's Challenge:</h3>
                    <p className="text-dark">{challenge}</p>

                    <div className="d-flex justify-content-evenly align-items-center">
                        <Button  onClick={handleComplete} className={`btn ${styles.complete}`}>
                            Complete
                        </Button>
                        <Button onClick={handleIncomplete} className={`btn ${styles.incomplete}`}>
                            Incomplete
                        </Button>
                    </div>

                    {status && (
                        <div className="text-dark mt-5">
                            <p><b>Challenge status:</b> {status}</p>
                        </div>
                    )}
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Challenge;