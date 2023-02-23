import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

const WEBSOCKET_CORS = {
  origin: "*",
  methods: ["GET", "POST"],
};

class Websocket extends Server {
  private static io: Websocket;

  constructor(httpServer: HttpServer) {
    super(httpServer, {
      cors: WEBSOCKET_CORS,
    });
  }

  public static getInstance(httpServer?: HttpServer): Websocket {
    if (!Websocket.io) {
      Websocket.io = new Websocket(httpServer);
    }

    return Websocket.io;
  }

  public initializeHandlers(socketHandlers: Array<any>) {
    socketHandlers.forEach((element) => {
      let clientList = [];
      Websocket.io.of(element.path).on("connection", (s: Socket) => {
        element.handler.handleConnection(s, clientList);
      });
    });
  }
}

export default Websocket;
