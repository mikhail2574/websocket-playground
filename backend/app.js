import { WebSocketServer, WebSocket } from "ws";

import { fetchPrice } from "./fetch-price.js";
import { isUpdated, updateLastPrice } from "./state.js";

const PORT = 8080;
const POLL_INTERVAL = 2500;

const wss = new WebSocketServer({ port: PORT });
console.log("WebSocket is running on ws://localhost:" + PORT);

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("Client connected");

  wss.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("Client disconnected");
  });
});

setInterval(async () => {
  try {
    const priceData = await fetchPrice();

    if (isUpdated(priceData.price)) {
      updateLastPrice(priceData.price);
    }
    const message = JSON.stringify({ type: "btc_price", data: priceData });

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        console.log("New price sent! Price: " + priceData.price);
      } else {
        console.log("No price change");
      }
    });
  } catch (error) {
    console.error("Error fetching price: ", error.message);
  }
}, POLL_INTERVAL);
