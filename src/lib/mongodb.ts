import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_BETTER_AUTH_URI;

declare global {
  var _pizzahubMongoClient: MongoClient | undefined;
}

function getClient() {
  if (!uri) {
    throw new Error("MONGODB_BETTER_AUTH_URI is not set.");
  }

  if (!globalThis._pizzahubMongoClient) {
    globalThis._pizzahubMongoClient = new MongoClient(uri);
  }

  return globalThis._pizzahubMongoClient;
}

export function getDb(): Db {
  return getClient().db("pizzahub");
}
