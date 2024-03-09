import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCryptoList = async () => {
      try {
        const response = await axios.get('https://api.polygon.io/v2/reference/crypto/symbols?sort=ticker&perpage=50&page=1&apiKey=sEJVHAc9hHkQ28Il5zikoqhWP5JB334d');
        setCryptoList(response.data.symbols.map(symbol => symbol.symbol));
      } catch (error) {
        console.error('Error fetching crypto list:', error);
      }
    };

    fetchCryptoList();
  }, []);

  const handleCryptoChange = async (e) => {
    const selectedCrypto = e.target.value;
    setSelectedCrypto(selectedCrypto);
    try {
      const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${selectedCrypto}/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=sEJVHAc9hHkQ28Il5zikoqhWP5JB334d`);
      setChartData(response.data.results);
    } catch (error) {
      console.error(`Error fetching chart data for ${selectedCrypto}:`, error);
    }
  };

  return (
    <div>
      <h1>Cryptocurrency Chart Dashboard</h1>
      <div>
        <label htmlFor="crypto-select">Select Cryptocurrency: </label>
        <select id="crypto-select" value={selectedCrypto} onChange={handleCryptoChange}>
          <option value="">Select a cryptocurrency</option>
          {cryptoList.map(crypto => (
            <option key={crypto} value={crypto}>{crypto}</option>
          ))}
        </select>
      </div>
      {selectedCrypto && (
        <div>
          <h2>{selectedCrypto} Chart</h2>
          <ul>
            {chartData.map((data, index) => (
              <li key={index}>
                <p>Timestamp: {new Date(data.t).toLocaleString()}</p>
                <p>Open: {data.o}</p>
                <p>High: {data.h}</p>
                <p>Low: {data.l}</p>
                <p>Close: {data.c}</p>
                <p>Volume: {data.v}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
