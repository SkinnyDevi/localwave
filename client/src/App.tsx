/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

import logo from "./logo.svg";
import "./App.css";
import UserData from "./interfaces/UserData";

const socket = io("http://localhost:3500/users", { autoConnect: false });

function App() {
  const [isConnected, setIsConnected] = useState(false);

  const [myProfile, setMyProfile] = useState<UserData | null>(null);

  const [lastPong, setLastPong] = useState<string | null>(null);

  const checkList = () => {
    let wasConnected = socket.connected;

    if (!wasConnected) socket.connect();
    socket.emit("list");
    if (!wasConnected) socket.disconnect();
  };

  const disconnect = () => {
    socket.emit("remove-user", myProfile);
    socket.disconnect();
  };

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
      socket.emit("register", { UUID: myUuid });
    });

    socket.on("register-complete", (data: UserData) => {
      setMyProfile(data);
    });

    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setMyProfile(null);
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
        {!isConnected && !myProfile ? (
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
              My Name: {myProfile?.name}
            </a>
            <a className="App-link" href="#" rel="noopener noreferrer">
              My UUID: {myProfile?.UUID}
            </a>
            <a
              className="App-link"
              href="#"
              onClick={disconnect}
              rel="noopener noreferrer"
            >
              Disconnect
            </a>
          </>
        )}
        <a
          className="App-link"
          href="#"
          onClick={checkList}
          rel="noopener noreferrer"
        >
          Check User List
        </a>
      </header>
      <button onClick={sendPing}>Send ping</button>
    </div>
  );
}

export default App;
