# Local Wave

<div style="text-align: center;">
	<svg
				xmlns="http://www.w3.org/2000/svg"
				height="256"
				width="256"
				viewBox="0 0 24 24"
				fill="#84d0ff"
			>
					<g id="Layer_2" data-name="Layer 2">
					<circle cx="12" cy="12" r="2.5" />
					<g>
						<path d="m7.88 17.12a.76.76 0 0 1 -.54-.23 7.36 7.36 0 0 1 -2-5.13 7.38 7.38 0 0 1 2-5.14.75.75 0 0 1 1.07 1 5.89 5.89 0 0 0 -1.54 4.09 5.88 5.88 0 0 0 1.54 4.08.76.76 0 0 1 0 1.07.77.77 0 0 1 -.53.26z" />
						<path d="m4.92 20.19a.78.78 0 0 1 -.54-.19 11.77 11.77 0 0 1 -3.13-8.2 11.77 11.77 0 0 1 3.13-8.25.75.75 0 0 1 1.08 1 10.26 10.26 0 0 0 -2.71 7.16 10.25 10.25 0 0 0 2.71 7.15.77.77 0 0 1 0 1.07.77.77 0 0 1 -.54.26z" />
						<path d="m16.12 17.12a.74.74 0 0 1 -.52-.22.75.75 0 0 1 0-1.06 5.88 5.88 0 0 0 1.54-4.08 5.89 5.89 0 0 0 -1.54-4.09.75.75 0 0 1 1.07-1 7.38 7.38 0 0 1 2 5.14 7.36 7.36 0 0 1 -2 5.13.76.76 0 0 1 -.55.18z" />
						<path d="m19.08 20.19a.77.77 0 0 1 -.53-.21.77.77 0 0 1 0-1.07 10.25 10.25 0 0 0 2.71-7.15 10.26 10.26 0 0 0 -2.72-7.16.75.75 0 0 1 0-1.06.75.75 0 0 1 1.06 0 11.74 11.74 0 0 1 3.14 8.21 11.73 11.73 0 0 1 -3.13 8.25.74.74 0 0 1 -.53.19z" />
						<path d="m12 14.75a2.75 2.75 0 1 1 2.75-2.75 2.75 2.75 0 0 1 -2.75 2.75zm0-4a1.25 1.25 0 1 0 1.25 1.25 1.25 1.25 0 0 0 -1.25-1.25z" />
					</g>
				</g>
	</svg>
</div>

A custom web app made to transfer files between users in the same network.

- [Main Purpose](#MainPurpose)
- [Usage](#Usage)
- [Developer Notes](#DevelopersNotes)
- [Installation](#Installation)

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