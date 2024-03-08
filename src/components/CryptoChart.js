import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';


const CryptoChart = ({ chartData }) => {
  const [chart, setChart] = useState(null);
  const chartContainer = React.createRef();

  useEffect(() => {
    if (chartData.length === 0) return;

    const ctx = chartContainer.current.getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(data => new Date(data.t).toLocaleTimeString()), // Assuming t is the timestamp
        datasets: [{
          label: 'Price',
          data: chartData.map(data => data.c), // Assuming c is the closing price
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute' // Adjust this based on your data
            }
          }
        }
      }
    });

    setChart(newChart);

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartData]);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <canvas ref={chartContainer} />
    </div>
  );
};

export default CryptoChart;
