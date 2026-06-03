// Vercel Serverless Function entry point
// This file imports the Express app from the backend and exports it
// so that Vercel can wrap it as a Serverless Function.
const app = require('../backend/server.cjs');

module.exports = app;
