import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoChart = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCryptoList = async () => {
      try {
        const response = await axios.get('https://api.polygon.io/v2/aggs/grouped/locale/global/market/crypto/2023-01-09?adjusted=true&apiKey=sEJVHAc9hHkQ28Il5zikoqhWP5JB334d');
        setCryptoList(response.data.results);
      } catch (error) {
        console.error('Error fetching crypto list:', error);
      }
    };

    fetchCryptoList();
  }, []);

  const handleCryptoChange = async (cryptoTicker) => {
    setSelectedCrypto(cryptoTicker);
    try {
      const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${cryptoTicker}/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=sEJVHAc9hHkQ28Il5zikoqhWP5JB334d`);
      setChartData(response.data.results);
    } catch (error) {
      console.error('Error fetching crypto chart data:', error);
    }
  };

  return (
    <div>
      <h1>Cryptocurrency Chart</h1>
      <select value={selectedCrypto} onChange={(e) => handleCryptoChange(e.target.value)}>
        <option value="">Select a cryptocurrency</option>
        {cryptoList.map((crypto) => (
          <option key={crypto.T} value={crypto.T}>{crypto.T}</option>
        ))}
      </select>
      <div>
        {chartData.map((data, index) => (
          <div key={index}>
            <p>Timestamp: {new Date(data.t).toLocaleString()}</p>
            <p>Open: {data.o}</p>
            <p>High: {data.h}</p>
            <p>Low: {data.l}</p>
            <p>Close: {data.c}</p>
            <p>Volume: {data.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoChart;
