const dotenv = require("dotenv");

//dotenv.config({path: './.env'});


const config = {
  applications: {
    admin: process.env.ADMIN_URL || 'http://localhost:3000',
    LMS: process.env.LMS_URL || 'http://localhost:3001',
    core: process.env.CORE_URL || 'http://localhost:3002',
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    notifications: process.env.NOTIFICATIONS_APP_NAME || 'timeline-services'
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017",
    database: process.env.MONGODB_DATABASE || "timeline-test"
  },
  secrets : {
    core: process.env.CORE_SECRET_KEY || ""
  },
  kafka: {
    brokers: []
  },
  mail: {
    mailgun_key: process.env.MAILGUN_KEY || "",
    mailgun_domain: process.env.MAILGUN_DOMAIN || "",
  }
};

const constants = {
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

module.exports = {
  config,
  constants
}