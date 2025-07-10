// server.js
const express = require("express");
const EmailService = require("./services/EmailService");

const app = express();
const port = process.env.PORT || 3000;
const emailService = new EmailService();

app.use(express.json());

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await emailService.sendEmail({ to, subject, body });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Resilient Mailer API is running!");
});

app.listen(port, () => {
  console.log(` Server listening on http://localhost:${port}`);
});
