const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const multer = require("multer");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS for your frontend
app.use(
  cors({
    origin: "https://bhanu-homeo-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parse application/json
app.use(express.json());

// ✅ Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Case schema
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

// ✅ Submit new case with image
app.post("/submit-case", upload.single("image"), async (req, res) => {
  try {
    const { name, age, phone, symptoms, mind, modality, physical, date, followUps } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newCase = new Case({
      name,
      age,
      phone,
      symptoms,
      mind,
      modality,
      physical,
      imageUrl,
      date,
      followUps: followUps ? JSON.parse(followUps) : [],
    });

    await newCase.save();
    res.status(200).send({ message: "Case saved successfully" });
  } catch (err) {
    console.error("Error saving case:", err);
    res.status(500).send("Error saving case");
  }
});

// ✅ Get all cases
app.get("/cases", async (req, res) => {
  try {
    const cases = await Case.find();
    res.send(cases);
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).send("Error fetching cases");
  }
});

// ✅ Static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Remedy data endpoint
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

// ✅ Gemini AI integration
app.post("/ask-ai", async (req, res) => {
  const { caseData } = req.body;
  try {
    const response = await fetch("https://api.gemini.ai/v1/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        query: `Analyze the following homeopathy case and suggest the best remedy with a detailed explanation: ${JSON.stringify(caseData)}`,
      }),
    });

    const data = await response.json();
    res.send(data.response);
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).send("Error getting AI response");
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
