const assert = require('assert');
const CircuitBreaker = require('../utils/CircuitBreaker');

// 2 failures allowed, cooldown 2s
const breaker = new CircuitBreaker(2, 2000);

// Should allow at first
assert.strictEqual(breaker.canAttempt(), true, "Should allow first attempt");

// Fail twice
breaker.recordFailure();
breaker.recordFailure();

// Now should be OPEN
assert.strictEqual(breaker.canAttempt(), false, "Should be OPEN after failures");

// Wait for cooldown to expire
setTimeout(() => {
  assert.strictEqual(breaker.canAttempt(), true, "Should enter HALF_OPEN after cooldown");

  // Succeed to close circuit
  breaker.recordSuccess();
  assert.strictEqual(breaker.canAttempt(), true, "Should be CLOSED after success");

  console.log("✅ CircuitBreaker tests passed.");
}, 2100);

