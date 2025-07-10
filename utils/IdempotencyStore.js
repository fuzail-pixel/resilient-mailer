const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const storePath = path.join(__dirname, 'sentEmails.json');

class IdempotencyStore {
  constructor() {
    this.sentEmails = new Set();

    // Load existing keys from disk
    if (fs.existsSync(storePath)) {
      const data = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
      this.sentEmails = new Set(data);
    }
  }

  generateKey(email) {
    const str = JSON.stringify(email);
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  isSent(key) {
    return this.sentEmails.has(key);
  }

  markSent(key) {
    this.sentEmails.add(key);
    fs.writeFileSync(storePath, JSON.stringify([...this.sentEmails]), 'utf-8');
  }
}

module.exports = IdempotencyStore;
