import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);
const LivePriceHistoryChart = ({ history }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!history || history.length === 0) return;

    const labels = history.map(data => new Date(data.date));
    const prices = history.map(data => data.rate);

    const ctx = chartRef.current.getContext('2d');

    new Chart(ctx, {
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
  }, [history]);

  return <canvas ref={chartRef} />;
};

export default LivePriceHistoryChart;
