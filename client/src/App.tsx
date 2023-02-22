/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import io, { Socket } from "socket.io-client";

import logo from "./logo.svg";
import "./App.css";

const socket = io("http://localhost:3500/users", { autoConnect: false });

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [myUUID, setMyUUID] = useState<string | null>(null);
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

      const myUuid = uuid();
      socket.emit("register", { uuid: myUuid });
      setMyUUID(myUuid);
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
        {!isConnected ? (
          <a
            className="App-link"
            href="#"
            onClick={() => socket.connect()}
            rel="noopener noreferrer"
          >
            Connect
          </a>
        ) : (
          <>
            <a
              className="App-link"
              href="#"
              onClick={sendPing}
              rel="noopener noreferrer"
            >
              Ping
            </a>
            <a className="App-link" href="#" rel="noopener noreferrer">
              My UUID: {myUUID}
            </a>
            <a
              className="App-link"
              href="#"
              onClick={() => socket.disconnect()}
              rel="noopener noreferrer"
            >
              Disconnect
            </a>
          </>
        )}
      </header>
      <button onClick={sendPing}>Send ping</button>
    </div>
  );
}

export default App;
