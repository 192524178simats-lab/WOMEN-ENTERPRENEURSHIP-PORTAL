const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(express.json());

// Serve the frontend
app.use(express.static(path.join(__dirname, "../FRONTEND")));

// API test route
app.get("/api/status", (req, res) => {
    res.json({
        message: "Women Entrepreneurship Support Portal API is running"
    });
});

// Start server
const server = app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});

process.stdin.resume();