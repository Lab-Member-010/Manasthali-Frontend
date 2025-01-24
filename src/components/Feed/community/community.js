import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Api from '../../../apis/Api';
import "./community.css"

const Community = () => {
  const [personalityData, setPersonalityData] = useState([]);
  const { token } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching data from your API endpoint
    const fetchPersonalityData = async () => {
      try {
        const response = await axios.get(Api.COMMUNITY_URL, {
          headers: { Authorization: `Bearer ${token} `},
        });
        console.log(response.data); 
        setPersonalityData(Array.isArray(response.data.data) ? response.data.data: []);  // if the array is inside 'results'
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPersonalityData();
  }, [token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (Array.isArray(personalityData)) {
    return (
      <div className="cards-container">
        {personalityData.map((personality) => (
          <div key={personality._id} className="card">
            <h2>{personality.name}</h2>
            <p>{personality.description}</p>
          </div>
        ))}
      </div>
    );
  } else {
    return <p>No data available or invalid data format</p>;
  }
  
};

export default Community;