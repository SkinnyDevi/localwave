# Local Wave

<div align="center">
	<img src="https://raw.githubusercontent.com/SkinnyDevi/localwave/master/client/public/logo.svg" alt="Localwave Logo" width="256" height="256" />
</div>


A custom web app made to transfer files between users in the same network.

- [Main Purpose](#main-purpose)
- [Usage](#usage)
- [Developer Notes](#developer-notes)
- [Installation](#installation)

## Main Purpose
To make easier to transfer files between devices in the same local network. Other web apps do the same job using WebRTC, but since
I couldn't get them to work between different OS (iPhone and Windows 10), I made my own.

Mine works with websockets, so it can stablish connection with any device that supports running the code using websockets.

## Usage
Once started the web client, you will be greeted at the root URL. To access the server and connect to it, you must specify as follows:

### Connecting with other users

Example: 
- Device private IP: ```192.168.1.85```
- Server host: ```192.168.1.85:3500```
- Client connection path: ```http://localhost:3000/192.168.1.85:3500```
- Other devices in network: ```http://192.168.1.85:3000/192.168.1.85:3500```

Not tested: use a hostname on Linux/MacOs systems to re-route the IP address to a hostname.

Example: re-route ```http://192.168.1.85:3000``` to ```http://localwave.local```

***Only an IP is valid as an access route to a server.***

### Sending files between users
Click on the desired user and make sure you have selected the *Files* tab (selected by default.) 

Yoy may add multiple files to send to a user. Press send to send the files to the selected user and finalize the process.

### Receiving files
You will see a dialog box pop up, displaying all files sent. You may view or download the files at once.

Since some files don't support viewing on web (Example: *.mov* video files), they will download automatically.

### Sending plain text
Click on the desired user and make sure you have selected the *Text* tab.

You now can write or paste any desired text to send with a *2000 character limit*. Click *Send message* to send and finalize the process.

### Receiving plain text
You will see a dialog box pop up, displaying a text box with the text message sent.


## Developer Notes
The base of the project is composed on a server and a client, both working with ```SocketIO``` and TypeScript. The frontend has been developed using React TS, and the server is using Express TS.

If you wish to expand the project and add other types and routes of sockets, there's a class called ```SocketBase```, located in ```src/interfaces``` which you can extend and use it's method as a base for all sockets. To register a new ```SocketBase```, simply add it to the ```initializeHandlers``` method from the ```Websocket``` server class:

```ts
io.initializeHandlers([new UserSocket("/users", io)]);
```

```ts
/**
   * Initialize any sockets extended from the `Websocket` class.
   *
   * @param socketHandlers - List of sockets to initialize and register.
   */
  public initializeHandlers(socketHandlers: SocketBase[]) {
    for (let sh of socketHandlers) {
      Websocket.io
        .of(sh.getPath())
        .on("connection", (s: Socket) => sh.handleConnection(s));
    }
  }
```

The server host has been setup in a way to automatically gather your device network interfaces and use either *Ethernet* or *en0* (for Linux/MacOS based systems), where *en0* is the WiFi common interface for most devices. If you network interface desired to host the server is not found, use the method inside ```CommonUtils``` to gather and show you available network interfaces.


***Note that this server does not connect in any way, shape or form to any external server whatsoever. Everything that happens in the server-side and client-side are all processes done locally on the device running it.***

***It is very recommened to make your network secure if you already haven't, to prevent any unwanted users inside of your network accessing this app.***

As a similar concept, in the frontend, you can use the ```useProfileHook``` as a reference to developing the React Hook used to register the socket events in the frontend and receive information dynamically.

All code is documented and explained as clear as possible.


## Installation
As of now, there is no official executable to launch the app. Since the app works with server and web, I am currently working on an
executable format to launch both server and web app as an application executable for multiple OS.

For now, if you wish to use it:
```cmd
git clone https://github.com/SkinnyDevi/localwave

cd ./localwave
cd ./server

npm i 
npm start

cd ../client
npm i
npm start
```
