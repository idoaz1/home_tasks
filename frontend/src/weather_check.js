import React, { useState } from 'react';

function Weather() {
  const [city, setCity] = useState('');
  const [cityData, setCityData] = useState(null);

  // Fetch city data from backend
  const fetchCity = async () => {
    if (!city) return;
  
    try {
      const res = await fetch(`http://localhost:3005/weather?city=${city}`);
      const data = await res.json();
  
      if (data) {
        setCityData(data);
      } else {
        alert('City not found');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Failed to fetch city data');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city (e.g., Haifa)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchCity}>Select City</button>
      
      {cityData && (
        <div>
          <a
            className="App-link"
            href={`https://www.accuweather.com/en/${cityData.Country.ID.toLowerCase()}/${cityData.LocalizedName.toLowerCase()}/${cityData.Key}/weather-forecast/${cityData.Key}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Check Weather here ! 🌡️
          </a>
        </div>
      )}
    </div>
  );
}

export default Weather;
