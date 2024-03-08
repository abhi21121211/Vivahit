// Chart.js

import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartRef.current && data.length) {
      if (chartInstance) {
        // If a chart instance already exists, destroy it first
        chartInstance.destroy();
      }

      const labels = data.map(item => item.date);
      const prices = data.map(item => item.price);
      
      const ctx = chartRef.current.getContext('2d');

      const newChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Price',
            data: prices,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });

      setChartInstance(newChartInstance);
    }

    // Cleanup function
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data]); // Only re-run the effect if the 'data' prop changes

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
