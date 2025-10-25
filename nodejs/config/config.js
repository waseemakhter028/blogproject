const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_POOL_MIN, DB_POOL_MAX, DB_POOL_IDLE, DB_PORT } =
  process.env

const mysql2 = require('mysql2')

// FIXED: Optimized values for Vercel serverless environment
const min = parseInt(DB_POOL_MIN) || 0   // Must be 0 for serverless
const max = parseInt(DB_POOL_MAX) || 2   // Small pool (2-5 recommended)
const idle = parseInt(DB_POOL_IDLE) || 0 // Release connections immediately

// Shared configuration to avoid repetition
const sharedConfig = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT || 3306,
  dialect: 'mysql',
  dialectModule: mysql2,
  
  // CRITICAL FIX: Serverless-optimized pool settings
  pool: { 
    max: max,           // 2-5 connections max
    min: min,           // 0 for serverless (no persistent connections)
    idle: idle,         // 0 to release immediately
    acquire: 8000,      // 8s max to acquire connection
    evict: 1000,        // Check for idle connections every 1s
    handleDisconnects: true
  },
  
  // CRITICAL FIX: Connection and query timeouts
  dialectOptions: {
    connectTimeout: 5000,     // 5s to establish connection
    timeout: 8000,            // 8s for query execution (leaves 2s buffer)
    decimalNumbers: true,
    dateStrings: true,
    // Enable SSL if needed (uncomment for production databases)
    // ssl: {
    //   rejectUnauthorized: true
    // }
  },
  
  // Performance optimizations
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  
  // CRITICAL FIX: Retry logic for transient connection errors
  retry: {
    max: 2,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /PROTOCOL_CONNECTION_LOST/
    ]
  },
  
  // Disable logging by default
  logging: false,
  benchmark: false,
  logQueryParameters: false
}

module.exports = {
  development: {
    ...sharedConfig,
    logging: console.log  // Enable logging in development
  },
  test: {
    ...sharedConfig,
    logging: false
  },
  production: {
    ...sharedConfig,
    logging: false
  }
}
