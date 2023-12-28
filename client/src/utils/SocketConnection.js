import io from "socket.io-client";

class SocketConnection {
  static connection = null;

  static getConnection() {
    if (!this.connection) {
      this.connection = io("http://localhost:3060");
    }

    return this.connection;
  }
}

export { SocketConnection };
