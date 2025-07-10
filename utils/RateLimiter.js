class RateLimiter {
  constructor(maxRequests, intervalMs) {
    this.maxRequests = maxRequests;
    this.intervalMs = intervalMs;
    this.timestamps = [];
  }

  allow() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(ts => now - ts < this.intervalMs);

    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }
}

module.exports = RateLimiter;
