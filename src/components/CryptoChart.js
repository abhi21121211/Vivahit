import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './CryptoChart.css'; // Import CSS file for styling

const CryptoChart = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [chartInstance, setChartInstance] = useState(null); // State to store Chart instance
  const [chartData, setChartData] = useState();
  const [error, setError] = useState('');

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
      if (error.response && error.response.status === 429) {
        setError('You are making too many requests. Please try again after waiting for one minute.');
        setTimeout(() => {
          setError('');
        }, 30000); // 30 seconds
      } else {
        console.error('Error fetching crypto chart data:', error);
      }
      return [];
    }
  };

  const handleCryptoChange = async (cryptoTicker) => {
    setSelectedCrypto(cryptoTicker);
    const data = await fetchChartData(cryptoTicker);
    setChartData(data);
    console.log(data);
    
    // Destroy existing Chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    renderChart(data);
  };

  const renderChart = (data) => {
    const ctx = document.getElementById('cryptoChart');
    
    // Constructing the chart data
    const chartData = {
      labels: data.map(item => new Date(item.t)),
      datasets: [
        {
          label: 'Open',
          data: data.map(item => item.o),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'High',
          data: data.map(item => item.h),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Low',
          data: data.map(item => item.l),
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        },
        {
          label: 'Close',
          data: data.map(item => item.c),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Volume Weighted Average',
          data: data.map(item => item.vw),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  
    // Create new Chart instance
    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Price'
            }
          },
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          }
        }
      }
    });
  
    // Set the new Chart instance to state
    setChartInstance(newChartInstance);
  };

  return (
    <div className="crypto-chart-container">
      <h1>Cryptocurrency Chart</h1>
      {error && <div className="error">{error}</div>}
      <select className="crypto-select" value={selectedCrypto} onChange={(e) => handleCryptoChange(e.target.value)}>
        <option value="">Select a cryptocurrency</option>
        {cryptoList.map((crypto) => (
          <option key={crypto.T} value={crypto.T}>{crypto.T}</option>
        ))}
      </select>
      <div className="chart-container">
        <canvas id="cryptoChart" width="800" height="400"></canvas>
      </div>
    </div>
  );
};

export default CryptoChart;
