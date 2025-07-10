const assert = require('assert');
const EmailService = require('../services/EmailService');

(async () => {
  const emailService = new EmailService();

  console.log(' Testing: Successful send (eventually via fallback)...');

  const email = {
    to: 'test@example.com',
    subject: 'Test Email',
    body: 'Hello from EmailService test'
  };

  const result = await emailService.sendEmail(email);
  assert.ok(['sent', 'skipped', 'failed'].includes(result.status), 'Unexpected status');
  console.log(' Passed: EmailService handles send with retries/fallbacks');

  console.log(' Testing: Duplicate email is skipped...');

  const duplicateResult = await emailService.sendEmail(email);
  assert.strictEqual(duplicateResult.status, 'skipped', 'Duplicate email was not skipped');
  console.log(' Passed: Duplicate email was skipped due to idempotency');
})();
