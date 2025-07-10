const MockProviderA = require('../providers/MockProviderA');
const MockProviderB = require('../providers/MockProviderB');
const RateLimiter = require('../utils/RateLimiter');
const Logger = require('../utils/Logger');
const IdempotencyStore = require('../utils/IdempotencyStore');
const CircuitBreaker = require('../utils/CircuitBreaker');

class EmailService {
  constructor() {
    this.providers = [
      {
        name: 'ProviderA',
        instance: new MockProviderA(),
        rateLimiter: new RateLimiter(5, 60000),
        circuitBreaker: new CircuitBreaker(3, 15000) // 3 failures, 15s cooldown
      },
      {
        name: 'ProviderB',
        instance: new MockProviderB(),
        rateLimiter: new RateLimiter(5, 60000),
        circuitBreaker: new CircuitBreaker(3, 15000)
      }
    ];
    this.logger = new Logger();
    this.idempotencyStore = new IdempotencyStore();
    this.maxRetries = 3;
    this.baseDelay = 500; // 0.5s
  }

  async sendEmail(emailPayload) {
    const key = this.idempotencyStore.generateKey(emailPayload);

    if (this.idempotencyStore.isSent(key)) {
      this.logger.info('Duplicate email skipped.');
      return { status: 'skipped', reason: 'duplicate' };
    }

    for (let providerIndex = 0; providerIndex < this.providers.length; providerIndex++) {
      const { name, instance, rateLimiter, circuitBreaker } = this.providers[providerIndex];

      if (!rateLimiter.allow()) {
        this.logger.warn(`${name} is rate-limited. Trying next provider...`);
        continue;
      }

      if (!circuitBreaker.canAttempt()) {
        this.logger.warn(`${name} is in OPEN state. Skipping...`);
        continue;
      }

      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          this.logger.info(`Attempting to send via ${name} [Try ${attempt + 1}]`);
          const result = await instance.send(emailPayload);

          this.idempotencyStore.markSent(key);
          circuitBreaker.recordSuccess();
          this.logger.success(`Email sent successfully via ${name}`);
          return {
            status: 'sent',
            provider: name,
            attempts: attempt + 1,
          };
        } catch (err) {
          circuitBreaker.recordFailure();
          this.logger.error(`Error from ${name}: ${err.message}`);

          if (attempt < this.maxRetries) {
            const delay = this._getExponentialBackoffDelay(attempt);
            this.logger.info(`Retrying after ${delay}ms...`);
            await this._sleep(delay);
          }
        }
      }

      this.logger.warn(`${name} failed after retries. Switching provider...`);
    }

    this.logger.error(`All providers failed.`);
    return {
      status: 'failed',
      reason: 'All providers failed',
    };
  }

  _getExponentialBackoffDelay(attempt) {
    return this.baseDelay * Math.pow(2, attempt) + Math.floor(Math.random() * 100);
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = EmailService;
