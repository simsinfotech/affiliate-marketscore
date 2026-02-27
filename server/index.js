const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "applications.json");

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

// POST /api/apply — submit an Alpha Provider application
app.post("/api/apply", (req, res) => {
  const { fullName, email, whatsapp, providerType, audienceSize, platform, message } = req.body;

  // Validation
  const errors = [];
  if (!fullName || fullName.trim().length < 2) errors.push("Full name is required");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required");
  if (!whatsapp || whatsapp.trim().length < 6) errors.push("WhatsApp number is required");
  if (!providerType) errors.push("Provider type is required");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Read existing applications
  let applications = [];
  try {
    applications = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    applications = [];
  }

  const application = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    whatsapp: whatsapp.trim(),
    providerType,
    audienceSize: audienceSize || "",
    platform: platform || "",
    message: message || "",
    submittedAt: new Date().toISOString(),
    status: "pending",
  };

  applications.push(application);
  fs.writeFileSync(DATA_FILE, JSON.stringify(applications, null, 2), "utf-8");

  console.log(`New application from ${application.fullName} (${application.email}) - ${application.providerType}`);

  res.json({
    success: true,
    message: "Application submitted successfully! We'll get back to you within 48 hours.",
    applicationId: application.id,
  });
});

// GET /api/applications — view all applications (admin)
app.get("/api/applications", (req, res) => {
  try {
    const applications = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    res.json({ success: true, count: applications.length, applications });
  } catch {
    res.json({ success: true, count: 0, applications: [] });
  }
});

app.listen(PORT, () => {
  console.log(`MarketScore API running on http://localhost:${PORT}`);
});
