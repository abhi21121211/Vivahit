import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoChart from './CryptoChart';

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState(null); // Initialize with null
  const [cryptoData, setCryptoData] = useState([]);
  const [timespan, setTimespan] = useState('day');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCryptoList = async () => {
      try {
        const response = await axios.get('https://api.polygon.io/v2/aggs/grouped/locale/global/market/crypto/2023-01-09?adjusted=true&apiKey=sEJVHAc9hHkQ28Il5zikoqhWP5JB334d');
        setCryptoData(response.data.results);
      } catch (error) {
        console.error('Error fetching crypto list:', error);
      }
    };

    fetchCryptoList();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedCrypto) return;

      try {
        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${selectedCrypto}/range/1/${timespan}/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=sEJVHAc9hHkQ28Il5zikoqhWP5JB334d`);
        setChartData(response.data.results);
        console.log(response.data.results)
        console.log(chartData)
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [selectedCrypto, timespan]);

  const handleCryptoSelect = (event) => {
    setSelectedCrypto(event.target.value);
  };

  const handleTimespanSelect = (event) => {
    setTimespan(event.target.value);
  };

  return (
    <div>
      <h1>Cryptocurrency Dashboard</h1>
      <div>
        <label>Select Cryptocurrency: </label>
        <select value={selectedCrypto} onChange={handleCryptoSelect}>
          <option value={null}>Select Crypto</option> {/* Use null as initial value */}
          {cryptoData.map((crypto) => (
            <option key={crypto.T} value={crypto.T}>{crypto.T}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Timespan: </label>
        <select value={timespan} onChange={handleTimespanSelect}>
          <option value="day">1 Day</option>
          <option value="2day">2 Days</option>
          <option value="3day">3 Days</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div>
        {/* {chartData.length > 0 && <CryptoChart chartData={chartData} />} */}
      </div>
    </div>
  );
};

export default Dashboard;
