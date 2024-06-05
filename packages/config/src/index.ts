import { config as DotenvConfig } from "dotenv";

//DotenvConfig();

export const config = {
  applications: {
    admin: process.env.ADMIN_URL || 'http://localhost:3000',
    LMS: process.env.LMS_URL || 'http://localhost:3001',
    core: process.env.CORE_URL || 'http://localhost:3002',
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

export const constants = {
  courses: {
    "SAT": {
      displayName: 'Scholastic Assessment Test',   
    },
    "GRE": {
      displayName: "Graduate Record Examinations",
    }, 
    "GMAT": {
      displayName: "Graduate Management Admission Test",
    }, 
    "TOEFL": {
      displayName: "Test of English as a Foreign Language",
    }, 
    "IELTS": {
      displayName: "International English Language Testing System",
    }, 
    "ACT": {
      displayName: "American College Testing",
    },
    "LSAT": {
      displayName: "Law School Admission Test",
    }
  }
}
