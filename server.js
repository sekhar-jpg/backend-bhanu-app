const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow requests from frontend domain
app.use(cors({
  origin: "https://bhanu-homeo-frontend.onrender.com",  // Make sure this matches the frontend URL exactly
  methods: ["GET", "POST", "PUT", "DELETE"],           // Allowing common methods
  allowedHeaders: ["Content-Type", "Authorization"],   // Allow necessary headers
}));

app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Case Schema
const caseSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  symptoms: String,
  mind: String,
  modality: String,
  physical: String,
  imageUrl: String,
  date: Date,
  followUps: [Object],
});

const Case = mongoose.model("Case", caseSchema);

// ✅ Submit New Case
app.post("/submit-case", async (req, res) => {
  try {
    const newCase = new Case(req.body);
    await newCase.save();
    res.status(200).send({ message: "Case saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving case");
  }
});

// ✅ Get All Cases
app.get("/cases", async (req, res) => {
  try {
    const cases = await Case.find();
    res.send(cases);
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).send("Error fetching cases");
  }
});

// ✅ Remedy Data Endpoint
app.get("/remedies", (req, res) => {
  const filePath = path.join(__dirname, "data", "remedies.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    res.send(JSON.parse(data));
  } catch (err) {
    console.error("Error reading remedies:", err);
    res.status(500).send("Error reading remedy data");
  }
});

// ✅ Gemini AI Integration Endpoint
app.post("/ask-ai", async (req, res) => {
  const { caseData } = req.body;
  try {
    const response = await fetch("https://api.gemini.ai/v1/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,  // Use Gemini API key
      },
      body: JSON.stringify({
        query: `Analyze the following homeopathy case and suggest the best remedy with a detailed explanation: ${JSON.stringify(caseData)}`,
      }),
    });

    const data = await response.json();
    res.send(data.response);  // Adjust based on Gemini's actual response structure
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).send("Error getting AI response");
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
