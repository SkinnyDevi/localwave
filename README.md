# Local Wave

<div align="center">
	<img src="https://raw.githubusercontent.com/SkinnyDevi/localwave/master/client/public/logo.svg" alt="Localwave Logo" width="256" height="256" />
</div>


A custom web app made to transfer files between users in the same network.

- [Main Purpose](#main-purpose)
- [Installation](#installation)
	- [Troubleshooting](#troubleshooting)
- [Usage](#usage)
- [Developer Notes](#developer-notes)

## Main Purpose
To make easier to transfer files between devices in the same local network. Other web apps do the same job using WebRTC, but since
I couldn't get them to work between different OS (iPhone and Windows 10), I made my own.

Mine works with websockets, so it can stablish connection with any device that supports running the code using websockets.

## Installation
Currently, there is a very experimental version as an executable for Windows, Mac and Linux (not tested). You can download the app and run it on your system through the [releases page](https://github.com/SkinnyDevi/localwave/releases).

For **MacOS users** (first time opening the app):
If you're running the app for the first time, you must open a terminal window and go to the directory where the app is located. Once there, we are going to run the ```before-first-use.sh``` script that makes the required files executable for the app to open.

To do this:
- Open a terminal window.
- Type ```chmod +x before-first-use.sh```
- Run the script ```./before-first-use.sh```

Once followed the steps and ran the script, you should be able to open the app as normal.

If you wish to run it from the source code, in a development state:
```dockerfile
git clone https://github.com/SkinnyDevi/localwave

cd ./localwave
cd ./server

npm i 
npm build # or npm build:win

cd ../client
npm i
npm start  # or npm start:win
```

If you wish to change the port that the app starts on, you must start the app running the commands:
- Windows: ```set SERVER_PORT=XXXX&& localwave-win.exe```
- MacOS & Linux: ```SERVER_PORT=XXXX localwave-macos/linux```

Where 'XXXX' is a 4 digit number.

### Troubleshooting
The **Windows** distribution includes a ```start-win.vbs``` script to run the app hidden without a console window. If at any point you wish to stop the app, you can go to ***Task Manager -> Node.js JavaScript Runtime -> Details***, make sure the name matches with the app name, and terminate it.

For **MacOS**, if the file appears as a plain text file, open a Terminal window and type ```chmod +x file_location_here```, where the file location is the location where you currently have your file (Downloads folder, etc). With that, you should be able to open it as normal.

## Usage
Once started the web client, you will be greeted at the root URL. To access the server and connect to it, you must specify as follows:

### Connecting with other users

Example: 
- Device private IP: ```192.168.1.85```
- Server host: ```192.168.1.85:3500```
- Client connection path: ```http://localhost:3500```
- Other devices in network: ```http://192.168.1.85:3500```

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

### Building from source
In the folder ```compiler utils```, I have added a few scripts that will aid me and you in compiling an executable with the source code. Each file will be named following it's respective OS compatiblity. **Make sure you run the script from the ```compiler utils``` folder.**

Sadly, I was not able to attach multiple icons to the windows executable. If anyone does have a workaround that doesn't corrupt the ```pkg``` compilation, I would love to hear it out.
