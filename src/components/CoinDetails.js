// CoinDetails.js
import React from 'react';
import './CoinDetails.css'; // Import CSS for styling

const CoinDetails = ({ selectedCoin }) => {
  return (
    <div className="coin-details">
      {selectedCoin && (
        <div className="card">
          <div className="card-body">
            
            <div className="card-text">
              <img src={selectedCoin.png32} alt={selectedCoin.name} className="coin-image" />
              <div className="detail-item">
                <h2> {selectedCoin.name}</h2>
               
              </div>
              <div className="detail-item"> <h3>HighUSD </h3><p>{selectedCoin.allTimeHighUSD}</p> </div>
              <div className="detail-item"> <h3>Currant Rate</h3><p>{selectedCoin.rate}</p> </div>
              <div className="detail-item"><h3>Currant Volume</h3> <p>{selectedCoin.volume}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinDetails;
