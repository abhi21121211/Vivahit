import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';


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

  const fetchChartData = async (cryptoTicker) => {
    try {
      const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${cryptoTicker}/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=sEJVHAc9hHkQ28Il5zikoqhWP5JB334d`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching crypto chart data:', error);
      return [];
    }
  };

  const handleCryptoChange = async (cryptoTicker) => {
    setSelectedCrypto(cryptoTicker);
    const data = await fetchChartData(cryptoTicker);
    setChartData(data);
    console.log(data)
    renderChart(data);
  };

 

  const renderChart = (data) => {
    const ctx = document.getElementById('cryptoChart');
    const chartData = {
      labels: ['Open', 'High', 'Low', 'Close', 'Volume Weighted Average'],
      datasets: [{
        label: 'Aggregates',
        data: data.map(item => [item.o, item.h, item.l, item.c, item.vw]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', // Open
          'rgba(54, 162, 235, 0.2)',  // High
          'rgba(255, 206, 86, 0.2)',  // Low
          'rgba(75, 192, 192, 0.2)',  // Close
          'rgba(153, 102, 255, 0.2)'  // Volume Weighted Average
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', // Open
          'rgba(54, 162, 235, 1)',  // High
          'rgba(255, 206, 86, 1)',  // Low
          'rgba(75, 192, 192, 1)',  // Close
          'rgba(153, 102, 255, 1)'  // Volume Weighted Average
        ],
        borderWidth: 1
      }]
    };
  
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
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
        <canvas id="cryptoChart" width="800" height="400"></canvas>
      </div>
    </div>
  );
};

export default CryptoChart;






