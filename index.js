require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API route
const sendRoute = require("./api/send");
app.use("/api/send", sendRoute);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
