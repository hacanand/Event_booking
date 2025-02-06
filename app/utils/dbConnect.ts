import mongoose from "mongoose";

// Extend the NodeJS namespace to include the cached mongoose connection
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// Global cache for the connection in development to avoid multiple connections
let cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

async function dbConnect(): Promise<mongoose.Connection> {
  try {
    // If already connected, use the cached connection
    if (cached.conn) {
      console.log("Using cached MongoDB connection");
      return cached.conn;
    }

    // If no existing promise, create a new connection promise
    if (!cached.promise) {
      console.log("Initializing new MongoDB connection...");
      cached.promise = mongoose
        .connect(MONGO_URI, {
          bufferCommands: false, // Disable mongoose buffering
          serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds if no server is found
          socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        })
        .then((mongoose) => {
          console.log("MongoDB connection established");
          return mongoose.connection;
        })
        .catch((error) => {
          console.error("Error connecting to MongoDB:", error.message);
          throw new Error("Could not establish a connection to MongoDB");
        });
    }

    // Await and cache the connection
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error ) {
    console.error("Database connection failed:", error );
    throw new Error(`Database connection error: ${error}`);
  }
}

export default dbConnect;
