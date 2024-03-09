// LivePriceHistoryChart.js
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LivePriceHistoryChart = ({ priceHistory }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [timePeriod, setTimePeriod] = useState('1 day');
  const [timeInterval, setTimeInterval] = useState('1 hour');

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
              unit: getTimeUnit(),
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
  }, [priceHistory, timePeriod, timeInterval]);

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const handleTimeIntervalChange = (event) => {
    setTimeInterval(event.target.value);
  };

  const getTimeUnit = () => {
    switch (timePeriod) {
      case '1 day':
        return timeInterval === '1 hour' ? 'hour' : 'minute';
      case '1 week':
        return 'day';
      case '1 month':
        return 'week';
      default:
        return 'day';
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="timePeriod">Time Period:</label>
        <select id="timePeriod" value={timePeriod} onChange={handleTimePeriodChange}>
          <option value="1 day">1 Day</option>
          <option value="1 week">1 Week</option>
          <option value="1 month">1 Month</option>
        </select>
      </div>
      
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default LivePriceHistoryChart;
