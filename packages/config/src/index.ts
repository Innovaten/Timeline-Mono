import { config as DotenvConfig } from "dotenv";

DotenvConfig();

export const config = {
  port: {
    admin: parseInt(process.env.PORT || "3000", 10),
    LMS: parseInt(process.env.PORT || "3001", 10),
    core: parseInt(process.env.PORT || "3002", 10),
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    host: process.env.REDIS_HOST || "127.0.0.1",
    username: process.env.REDIS_USER || "default",
    password: process.env.REDIS_PASS || "",
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/test",
    database: process.env.MONGODB_DATABASE || ""
  }
};
