const defaultUrl = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";

async function fetchPrice(url = defaultUrl) {
  const response = await fetch(url);

  const data = await response.json();

  return {
    symbol: data.symbol,
    price: parseFloat(data.price),
    timestamp: new Date().toISOString(),
  };
}

export { fetchPrice };
