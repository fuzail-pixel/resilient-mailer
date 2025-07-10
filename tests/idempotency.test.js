const assert = require('assert');
const fs = require('fs');
const path = require('path');
const IdempotencyStore = require('../utils/IdempotencyStore');

const storeFile = path.join(__dirname, '../utils/sentEmails.json');

// Clean before test
if (fs.existsSync(storeFile)) fs.unlinkSync(storeFile);

const store = new IdempotencyStore();

const sampleEmail = {
  to: "test@example.com",
  subject: "Test",
  body: "Hello",
};

const key = store.generateKey(sampleEmail);

// Should not be sent yet
assert.strictEqual(store.isSent(key), false, "Email should not be marked sent yet");

// Mark as sent
store.markSent(key);

// Should now return true
assert.strictEqual(store.isSent(key), true, "Email should be marked as sent");

console.log("✅ IdempotencyStore tests passed.");
