import React, { useState, useEffect } from 'react';
import CoinsList from './CoinsList';
import CoinDetails from './CoinDetails';
import LivePriceHistoryChart from './LivePriceHistoryChart';
import './CryptoDashboard.css';

const CryptoDashboard = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [timePeriod, setTimePeriod] = useState('1 day');
  const [timeInterval, setTimeInterval] = useState('1 hour');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('https://api.livecoinwatch.com/coins/list', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'f061fcc5-a991-4b6e-900c-c736ab027c5e',
          },
          body: JSON.stringify({
            currency: 'USD',
            sort: 'rank',
            order: 'ascending',
            offset: 0,
            limit: 10,
            meta: true,
          }),
        });
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchCoins();
  }, []);

  const fetchCoinData = async (code) => {
    try {
      const response = await fetch('https://api.livecoinwatch.com/coins/single', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': 'f061fcc5-a991-4b6e-900c-c736ab027c5e',
        },
        body: JSON.stringify({
          currency: 'USD',
          code: code,
          meta: true,
        }),
      });
      const data = await response.json();
      setSelectedCoin(data);
    } catch (error) {
      console.error('Error fetching single coin data:', error);
    }
  };

  const fetchPriceHistory = async (code) => {
    try {
      const startDate = calculateStartDate();
      const response = await fetch('https://api.livecoinwatch.com/coins/single/history', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': 'f061fcc5-a991-4b6e-900c-c736ab027c5e',
        },
        body: JSON.stringify({
          currency: 'USD',
          code: code,
          start: startDate,
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

  const handleCoinClick = (code) => {
    fetchCoinData(code);
    fetchPriceHistory(code);
  };

  const calculateStartDate = () => {
    switch (timePeriod) {
      case '1 day':
        return Date.now() - 86400000;
      case '1 week':
        return Date.now() - 7 * 86400000;
      case '1 month':
        return Date.now() - 30 * 86400000;
      default:
        return Date.now() - 86400000; // Default to last 24 hours
    }
  };

  return (
    <div className="crypto-dashboard">
      <h1>Cryptocurrency Dashboard</h1>
      <CoinsList coins={coins} handleCoinClick={handleCoinClick} />
      <CoinDetails selectedCoin={selectedCoin} />
      <LivePriceHistoryChart
        priceHistory={priceHistory}
        setTimePeriod={setTimePeriod}
        setTimeInterval={setTimeInterval}
      />
    </div>
  );
};

export default CryptoDashboard;
