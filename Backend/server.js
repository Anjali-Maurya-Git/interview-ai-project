// Force Node.js to use reliable public DNS servers (Google + Cloudflare)
const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);


// ====================== VERY CLEAN SERVER.JS ======================
require('dotenv').config({ 
  path: './.env', 
  override: true 
});

console.log("=== ENV DEBUG START ===");
console.log("GEMINI_API_KEY Loaded:", process.env.GEMINI_API_KEY ? "✅ YES" : "❌ NO");
console.log("MONGO_URI exists:", process.env.MONGO_URI ? "YES" : "NO");
console.log("=== ENV DEBUG END ===");



const express = require('express');
const cors = require('cors');
const app = require("./src/app");
const connectToDB = require("./src/config/database");


// CORS Setup
app.use(cors({
   origin: true,
   credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/mock-interview", require("./src/routes/mockInterview.routes"));

// Test Route
app.get("/", (req, res) => {
    res.send("✅ Backend API is working 🚀");
});

// Connect Database
connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server started successfully on port ${PORT}`);
    console.log("✅ Ready for frontend connection");
});