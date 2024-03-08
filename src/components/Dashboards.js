import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './CryptoDashboard.css'; // Import CSS for styling

const CryptoDashboard = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch("https://api.livecoinwatch.com/coins/list", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": "f061fcc5-a991-4b6e-900c-c736ab027c5e",
          },
          body: JSON.stringify({
            currency: "USD",
            sort: "rank",
            order: "ascending",
            offset: 0,
            limit: 10,
            meta: false,
          }),
        });
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, []);

  const fetchCoinData = async (code) => {
    try {
      const response = await fetch("https://api.livecoinwatch.com/coins/single", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": "f061fcc5-a991-4b6e-900c-c736ab027c5e",
        },
        body: JSON.stringify({
          currency: "USD",
          code: code,
          meta: true,
        }),
      });
      const data = await response.json();
      setSelectedCoin(data);
    } catch (error) {
      console.error("Error fetching single coin data:", error);
    }
  };

  const fetchPriceHistory = async (code) => {
    try {
      const response = await fetch("https://api.livecoinwatch.com/coins/single/history", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": "f061fcc5-a991-4b6e-900c-c736ab027c5e",
        },
        body: JSON.stringify({
          currency: "USD",
          code: code,
          start: Date.now() - 86400000, // Last 24 hours
          end: Date.now(),
          meta: true,
        }),
      });
      const data = await response.json();
      setPriceHistory(data.history);
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  const handleCoinClick = (code) => {
    fetchCoinData(code);
    fetchPriceHistory(code);
  };

  useEffect(() => {


    if (!priceHistory.length || !selectedCoin) return;
  
    const labels = priceHistory.map(data => new Date(data.date));
    const prices = priceHistory.map(data => data.rate);
  
    const ctx = chartRef.current.getContext('2d');
  
    // Destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
  
    // Create new chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price History',
          data: prices,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour' // Customize time axis if needed
            }
          }
        }
      }
    });
  
    // Cleanup function to destroy chart instance when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [priceHistory, selectedCoin]);
  

  return (
    <div className="crypto-dashboard">
      <h1>Cryptocurrency Dashboard</h1>
      <div className="coins-list">
        <h2>Coins List</h2>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Rate</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.code} onClick={() => handleCoinClick(coin.code)}>
                <td>{coin.code}</td>
                <td>{coin.rate}</td>
                <td>{coin.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedCoin && (
        <div className="coin-details">
          <h2>{selectedCoin.name} Information</h2>
          <img src={selectedCoin.png32} alt="" />
          <p>Rate: {selectedCoin.rate}</p>
          <div className="live-price-history">
            <h3>Live Price History</h3>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoDashboard;
