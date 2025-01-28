import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Api from '../../../apis/Api';
import styles from "./community.module.css"
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-bootstrap';

const Community = () => {
  const [personalityData, setPersonalityData] = useState([]);
  const { token } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchPersonalityData = async () => {
      try {
        const response = await axios.get(Api.COMMUNITY_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setPersonalityData(Array.isArray(response.data.data) ? response.data.data: []);  
      } catch (err) {
        toast.error("No Community found!");
      }
    };
  
    fetchPersonalityData();
  }, [token]);

    return (
      <div className={styles.container}>
        <ToastContainer/>
        <h1 className='text-center text-dark'>Communities</h1>
      <div className={styles.cardsContainer}>
        {personalityData.map((personality) => (
          <div key={personality._id} className={styles.card}>
            <h2>{personality.name}</h2>
            <p>{personality.description}</p>
            <p><strong>Personality Type:</strong> {personality.personality_type}</p>
          </div>
        ))}
      </div>
      </div>
    );
  
};

export default Community;
