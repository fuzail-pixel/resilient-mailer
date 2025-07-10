const QueueProcessor = require('./QueueProcessor');

const emailQueue = [
  {
    to: "user1@example.com",
    subject: "Welcome A",
    body: "Email for A",
  },
  {
    to: "user2@example.com",
    subject: "Welcome B",
    body: "Email for B",
  },
  {
    to: "user3@example.com",
    subject: "Welcome C",
    body: "Email for C",
  },
];

(async () => {
  const processor = new QueueProcessor(emailQueue);
  await processor.processQueue();
})();

const EmailService = require('./services/EmailService');

(async () => {
  const emailService = new EmailService();

  const emailPayload = {
    to: "user999@example.com",
    subject: "Welcome User999",
    body: "Single test email with retry/fallback",
  };

  const result = await emailService.sendEmail(emailPayload);
  console.log("Final Result:", result);
})();

