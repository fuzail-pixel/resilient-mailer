const assert = require('assert');
const RateLimiter = require('../utils/RateLimiter');

// Allow max 3 calls per 2 seconds
const limiter = new RateLimiter(3, 2000);

let passed = 0;
for (let i = 0; i < 3; i++) {
  if (limiter.allow()) passed++;
}

assert.strictEqual(passed, 3, "First 3 should pass");
assert.strictEqual(limiter.allow(), false, "4th call should be blocked");

setTimeout(() => {
  assert.strictEqual(limiter.allow(), true, "Should allow after cooldown");
  console.log("✅ RateLimiter tests passed.");
}, 2100);
