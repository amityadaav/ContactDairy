const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { db } = require("./config/db");

dotenv.config();

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


app.use(express.json());
//app.use(express.urlencoded({extended:true}))

db();

const contactRoutes = require("./Routes/contactRoutes");
const loginRoutes = require("./Routes/UserRoutes")

app.use("/api", contactRoutes);
app.use("/api", loginRoutes);
app.get("/", (req, res) => {
    res.send("Server Running");
});

app.listen(process.env.PORT, (error) => {
    if (error) throw error;

    console.log(`Server running on port no ${process.env.PORT}`);
});