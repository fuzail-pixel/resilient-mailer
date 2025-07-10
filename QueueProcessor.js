// QueueProcessor.js

const EmailService = require('./services/EmailService');

class QueueProcessor {
  constructor(emails = []) {
    this.queue = emails;
    this.emailService = new EmailService();
  }

  async processQueue() {
    for (const email of this.queue) {
      console.log("\n📤 Sending email:", email.subject);
      const result = await this.emailService.sendEmail(email);
      console.log("✅ Result:", result);
    }
  }
}

module.exports = QueueProcessor;
