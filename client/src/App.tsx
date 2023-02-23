/* eslint-disable jsx-a11y/anchor-is-valid */

import io from "socket.io-client";
import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import UserSocket from "./websockets/UserSocket";
import UserData from "./interfaces/UserData";

const socket = io("http://localhost:3500/users");

function App() {
  const [userProfile, setUserProfile] = useState<UserData>({
    UUID: null,
    name: null,
  });
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="App">
      <UserSocket
        userProfileHook={[userProfile, setUserProfile]}
        isConnectedHook={[isConnected, setIsConnected]}
        socket={socket}
      />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {!socket.connected && userProfile.name !== null ? (
          <h3>Not connected, please wait...</h3>
        ) : (
          <>
            <a
              className="App-link"
              href="#"
              onClick={() => socket.emit("ping")}
              rel="noopener noreferrer"
            >
              Ping
            </a>
            <a className="App-link" href="#" rel="noopener noreferrer">
              My Name: {userProfile.name}
            </a>
            <a className="App-link" href="#" rel="noopener noreferrer">
              My UUID:{userProfile.UUID}
            </a>
            <a
              className="App-link"
              href="#"
              onClick={() => socket.disconnect()}
              rel="noopener noreferrer"
            >
              Disconnect
            </a>
            <a
              className="App-link"
              href="#"
              onClick={() => socket.emit("list")}
              rel="noopener noreferrer"
            >
              Check User List
            </a>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
