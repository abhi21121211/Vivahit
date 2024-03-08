import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const LiveHistoryChart = ({ coinCode }) => {
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch("https://api.livecoinwatch.com/coins/single/history", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": "f061fcc5-a991-4b6e-900c-c736ab027c5e",
          },
          body: JSON.stringify({
            currency: "USD",
            name: coinCode,
            start: Date.now() - (24 * 60 * 60 * 1000), // Fetch last 24 hours data
            end: Date.now(),
            meta: true,
          }),
        });
        const data = await response.json();
        setPriceHistory(data.history);
      } catch (error) {
        console.error('Error fetching price history:', error);
      }
    };

    fetchPriceHistory();

    // Fetch price history every minute for live updates
    const interval = setInterval(fetchPriceHistory, 60000);

    return () => clearInterval(interval);
  }, [coinCode]);

  useEffect(() => {
    if (priceHistory.length === 0) return;

    const labels = priceHistory.map((data) => new Date(data.date).toLocaleTimeString());
    const prices = priceHistory.map((data) => data.rate);

    const ctx = document.getElementById('liveHistoryChart').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price History',
          data: prices,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
          }
        }
      }
    });
  }, [priceHistory]);

  return <canvas id="liveHistoryChart"></canvas>;
};

export default LiveHistoryChart;
