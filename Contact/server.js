
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { db } = require("./config/db");

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const contactRoutes = require("./Routes/contactRoutes");
const loginRoutes = require("./Routes/UserRoutes");

app.use("/api", contactRoutes);
app.use("/api", loginRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});

// Start server after MongoDB connects
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
