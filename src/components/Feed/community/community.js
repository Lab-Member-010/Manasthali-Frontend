import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonalityCards = () => {
  const [personalityData, setPersonalityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching data from your API endpoint
    const fetchPersonalityData = async () => {
      try {
        const response = await axios.get('https://your-api-endpoint.com/personality'); // Replace with your API URL
        setPersonalityData(response.data);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalityData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="cards-container">
      {personalityData.map((personality) => (
        <div key={personality._id} className="card">
          <h2>{personality.name}</h2>
          <p>{personality.description}</p>
          <p><strong>Personality Type:</strong> {personality.personality_type}</p>
        </div>
      ))}
    </div>
  );
};

export default PersonalityCards;
