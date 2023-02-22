/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import logo from "./logo.svg";
import "./App.css";

const socket = io("http://localhost:3500/users");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);

  useEffect(() => {
    console.log("Connected: ", isConnected);
  }, [isConnected]);

  useEffect(() => {
    console.log("Last pong: ", lastPong);
  }, [lastPong]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("ping");
    });

    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("other", (ctx) => {
      console.log(ctx);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  const sendPing = () => {
    socket.emit("ping");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="#"
          onClick={sendPing}
          rel="noopener noreferrer"
        >
          Ping
        </a>
      </header>
      <button onClick={sendPing}>Send ping</button>
    </div>
  );
}

export default App;
