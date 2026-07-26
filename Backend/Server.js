const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// CONFIG
dotenv.config();

// ROUTES
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const tsrInitiationRoutes = require('./routes/tsrInitiationRoutes');
const tsrDraftRoutes = require('./routes/tsrDraftRoutes');   // Draft generation
const masterDBRoutes = require("./routes/masterDBRoutes");
const path = require('path');
const fs = require('fs');

// Connect Database
connectDB();

// APP
const app = express();

// MIDDLEWARE
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CREATE uploads folder if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// SERVE uploaded files statically:
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("NLK Legal Management API Running...");
});


// API ROUTES
app.use("/api/auth", authRoutes);
app.use('/api/tsr-initiation', tsrInitiationRoutes);
app.use('/api/tsr-draft', tsrDraftRoutes);         // Draft generation for TSR Drafting page

app.use("/api/masterdb", masterDBRoutes);


// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// PORT
const PORT = process.env.PORT || 5000;


// SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});