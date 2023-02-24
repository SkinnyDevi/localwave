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
    for (let sh of socketHandlers) {
      let clientList = [];
      Websocket.io.of(sh.path).on("connection", (s: Socket) => {
        sh.handleConnection(s, clientList);
      });
    }
  }
}

export default Websocket;
