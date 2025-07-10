class CircuitBreaker {
  constructor(failureThreshold = 3, cooldownTime = 10000) {
    this.failureThreshold = failureThreshold;
    this.cooldownTime = cooldownTime;
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.warn(`[CircuitBreaker] OPENED - too many failures`);
    }
  }

  recordSuccess() {
    this.reset();
  }

  reset() {
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
  }

  canAttempt() {
    if (this.state === 'CLOSED') return true;

    const now = Date.now();
    const timePassed = now - this.lastFailureTime;

    if (this.state === 'OPEN' && timePassed >= this.cooldownTime) {
      this.state = 'HALF_OPEN';
      console.warn(`[CircuitBreaker] HALF-OPEN - testing provider`);
      return true;
    }

    return false;
  }
}

module.exports = CircuitBreaker;
