// CoinsList.js
import React from 'react';
import './CoinsList.css';
const CoinsList = ({ coins, handleCoinClick }) => {
  return (
    <div className="coins-list">
      <h2>Coins List</h2>
      <table>
        <thead>
          <tr>
            <th>IMG</th>
            <th>Name</th>
          
            <th>Code</th>
            <th>Rank</th>
            <th>Rate</th>
            <th>HighUSD</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.code} onClick={() => handleCoinClick(coin.code)}>
              <td>
                <img src={coin.png32} alt={coin.name} />
              </td>
              <td>{coin.name}</td>
             
              <td>{coin.code}</td>
              <td>{coin.rank}</td>
              <td>{coin.rate}</td>
              <td>{coin.allTimeHighUSD}</td>
              <td>{coin.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinsList;
