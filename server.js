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

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Case Schema
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
  followUps: [Object], // Multiple follow-ups
});

const Case = mongoose.model("Case", caseSchema);

// Submit New Case
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

// Get All Cases
app.get("/cases", async (req, res) => {
  const cases = await Case.find();
  res.send(cases);
});

// Remedy Data Endpoint (Static JSON file)
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

// AI Integration Endpoint
app.post("/ask-ai", async (req, res) => {
  const { caseData } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a homeopathy expert. Analyze the case and suggest the best remedy with full explanation.",
          },
          {
            role: "user",
            content: `Patient case data: ${JSON.stringify(caseData)}`,
          },
        ],
      }),
    });

    const data = await response.json();
    res.send(data.choices[0].message.content);
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).send("Error getting AI response");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
