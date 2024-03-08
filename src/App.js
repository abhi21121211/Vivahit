// src/App.js
import React from 'react';
import Dashboard from './components/Dashboard';
import CryptoChart from './components/CryptoChart';
import Dashboards from './components/Dashboards';
import LivePriceHistoryChart from './components/LivePriceHistoryChart';

function App() {
  return (
    <div className="App">
      {/* <Dashboard /> */}
      <CryptoChart/>
      <Dashboards/>
      {/* <LivePriceHistoryChart/> */}
    </div>
    
  );
}

export default App;
