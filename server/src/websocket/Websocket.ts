import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import SocketBase from "../interfaces/SocketBase.js";

const WEBSOCKET_CORS = {
  origin: "*",
  methods: ["GET", "POST"],
};

/**
 * Class used to instantiate the `SocketIO` connections.
 */
export default class Websocket extends Server {
  private static io: Websocket;

  constructor(httpServer: HttpServer) {
    super(httpServer, {
      cors: WEBSOCKET_CORS,
      maxHttpBufferSize: 3e9,
    });
  }

  /**
   * Gets the current instance available. If none, creates it.
   *
   * @param httpServer - Any specified server to use for the `SocketIO` connections.
   * @returns A `Websocket` instance.
   */
  public static getInstance(httpServer?: HttpServer): Websocket {
    if (!Websocket.io) {
      Websocket.io = new Websocket(httpServer);
    }

    return Websocket.io;
  }

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
}
