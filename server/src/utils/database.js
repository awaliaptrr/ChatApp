import { MongoClient } from "mongodb";

class Database {
  static connection = null;

  static getConnection() {
    if (!this.connection) {
      this.connection = new MongoClient(process.env.DATABASE_URI).db(
        "icdatabase"
      );
    }

    return this.connection;
  }
}

export { Database };
