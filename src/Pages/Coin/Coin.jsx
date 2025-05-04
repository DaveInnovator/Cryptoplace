import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../Context/CoinContext';
import LineChart from '../../Components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const { currency } = useContext(CoinContext);

  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCoinData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-snbxdTGA1MFmbFz8YeXN8mef',
          },
        }
      );
      const data = await response.json();
      setCoinData(data);
    } catch (error) {
      console.error('Error fetching coin data:', error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-snbxdTGA1MFmbFz8YeXN8mef',
          },
        }
      );
      const data = await response.json();
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCoinData(), fetchHistoricalData()]);
      setLoading(false);
    };
    fetchData();
  }, [currency, coinId]);

  if (loading || !coinData || !historicalData) {
    return (
      <div className='spinner'>
        <div className="spin"></div>
      </div>
    );
  }

  // Helper function to safely access market data
  const getMarketData = (field) => {
    return coinData?.market_data?.[field]?.[currency.name];
  };

  const currentPrice = getMarketData('current_price');
  const marketCap = getMarketData('market_cap');
  const high24h = getMarketData('high_24h');

  return (
    <div className='coin'>
      <div className="coin-name">
        <img src={coinData.image.large} alt={coinData.name} />
        <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
      </div>

      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank ?? 'N/A'}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>{currentPrice ? `${currency.symbol}${currentPrice.toLocaleString()}` : 'N/A'}</li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>{marketCap ? `${currency.symbol}${marketCap.toLocaleString()}` : 'N/A'}</li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>{high24h ? `${currency.symbol}${high24h.toLocaleString()}` : 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
