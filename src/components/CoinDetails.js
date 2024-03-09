// CoinDetails.js
import React from 'react';
import './CoinDetails.css'; // Import CSS for styling

const CoinDetails = ({ selectedCoin }) => {
  return (
    <div className="coin-details">
      {selectedCoin && (
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">{selectedCoin.name} Information</h2>
            <div className="card-text">
              <img src={selectedCoin.png32} alt={selectedCoin.name} className="coin-image" />
              <h3>
                <span>{selectedCoin.symbol}</span>
                {selectedCoin.name}
              </h3>
              <div className="detail-item">HighUSD: {selectedCoin.allTimeHighUSD}</div>
              <div className="detail-item">Currant Rate: {selectedCoin.rate}</div>
              <div className="detail-item">Currant Volume: {selectedCoin.volume}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinDetails;
