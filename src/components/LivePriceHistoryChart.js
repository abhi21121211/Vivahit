// LivePriceHistoryChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LivePriceHistoryChart = ({ priceHistory }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!priceHistory.length) return;

    const labels = priceHistory.map((data) => new Date(data.date));
    const prices = priceHistory.map((data) => data.rate);

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Price History',
            data: prices,
            fill: false,
            borderColor: 'green',
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [priceHistory]);

  return <canvas ref={chartRef}></canvas>;
};

export default LivePriceHistoryChart;
