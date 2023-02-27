import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import SocketBase from "../interfaces/SocketBase.js";

const WEBSOCKET_CORS = {
  origin: "*",
  methods: ["GET", "POST"],
};

class Websocket extends Server {
  private static io: Websocket;

  constructor(httpServer: HttpServer) {
    super(httpServer, {
      cors: WEBSOCKET_CORS,
      maxHttpBufferSize: 3e9,
    });
  }

  public static getInstance(httpServer?: HttpServer): Websocket {
    if (!Websocket.io) {
      Websocket.io = new Websocket(httpServer);
    }

    return Websocket.io;
  }

  public initializeHandlers(socketHandlers: SocketBase[]) {
    for (let sh of socketHandlers) {
      Websocket.io
        .of(sh.getPath())
        .on("connection", (s: Socket) => sh.handleConnection(s));
    }
  }
}

export default Websocket;
