import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LivePriceHistoryChart = ({ priceHistory, timePeriod, timeInterval, setTimePeriod }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!priceHistory.length) return;

    let filteredData = [];
    const currentTime = Date.now();
    const timeLimits = {
      '1 day': currentTime - 86400000, // Last 24 hours
      '1 week': currentTime - 604800000, // Last 7 days
      '1 month': currentTime - 2592000000, // Last 30 days
    };

    // Filter data based on selected time period
    filteredData = priceHistory.filter((data) => data.date > timeLimits[timePeriod]);

    // Filter data based on selected time interval
    if (timeInterval !== '1 hour') {
      const interval = parseInt(timeInterval.split(' ')[0]) * 60000; // Convert minutes to milliseconds
      filteredData = filteredData.filter((data, index) => {
        if (index === 0) return true; // Include the first data point
        return data.date - filteredData[index - 1].date >= interval;
      });
    }

    const labels = filteredData.map((data) => new Date(data.date));
    const prices = filteredData.map((data) => data.rate);

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
  }, [priceHistory, timePeriod, timeInterval]);

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  return (
    <div>
      {/* <label htmlFor="timePeriod">Select Time Period:</label>
      <select id="timePeriod" value={timePeriod} onChange={handleTimePeriodChange}>
        <option value="1 day">1 Day</option>
        <option value="1 week">1 Week</option>
        <option value="1 month">1 Month</option>
      </select> */}
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default LivePriceHistoryChart;
