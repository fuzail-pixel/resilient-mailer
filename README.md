# Resilient Mailer

A robust email-sending service built in JavaScript that simulates real-world email dispatch infrastructure with built-in resiliency features like retries, fallback, circuit breaking, rate limiting, idempotency, logging, and a basic queue processor.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Assumptions](#assumptions)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Live Demo

🚀 **[View Live Demo](https://resilient-mailer.onrender.com)**

Experience the Resilient Mailer in action with our hosted demo.

---

## Overview

This service is designed to demonstrate how to send emails reliably even in unstable conditions using common patterns like:

- Retry with exponential backoff
- Fallback provider switching
- Circuit breaker to avoid overloading failing services
- Idempotency to prevent duplicates
- Basic in-memory rate limiting
- Logging for observability
- A queue system to handle multiple email requests in batch

All functionality is implemented using vanilla JavaScript with minimal external libraries and mock providers to simulate different failure/success scenarios.

---

## Features

### Resiliency
- **Retry Logic**: Retries sending email up to 3 times with exponential backoff delays.
- **Fallback Providers**: If one provider fails, the service switches to the next available.
- **Circuit Breaker**: Automatically disables a provider after repeated failures, preventing cascading failures.

### Infrastructure Support
- **Rate Limiting**: Allows only a fixed number of emails per provider per minute.
- **Idempotency**: Prevents duplicate email sends using a SHA256 hash of email payload.
- **Logging**: Structured and timestamped logs for all events and actions.
- **Queue Processor**: Sends multiple emails in sequence to simulate batch processing.

---

## Architecture

```text
                       +----------------------+
                       |   QueueProcessor     |
                       +----------+-----------+
                                  |
                    +-------------v-------------+
                    |       EmailService        |
                    +-------------+-------------+
                                  |
      +--------------------------+---------------------------+
      |                          |                           |
+-----v-----+            +-------v--------+          +-------v--------+
| RateLimiter|          | CircuitBreaker |          | IdempotencyStore|
+-----------+           +----------------+          +-----------------+
      |
+------------------+
|  MockProviderA/B |
+------------------+
```

---

## Project Structure

```
resilient-mailer/
│
├── index.js                   # Entry script for triggering email/queue
├── QueueProcessor.js          # Processes batch email jobs in sequence
│
├── providers/                 # Simulated providers (mocked failures/successes)
│   ├── MockProviderA.js
│   └── MockProviderB.js
│
├── services/
│   └── EmailService.js        # Core logic with fallback, retry, circuit breaker
│
├── utils/
│   ├── Logger.js              # Centralized logger
│   ├── RateLimiter.js         # Token bucket-style limiter
│   ├── IdempotencyStore.js    # Prevents duplicate email sending
│   ├── CircuitBreaker.js      # Tracks and disables failing providers
│   └── sentEmails.json        # Stores sent email hashes for idempotency
│
├── tests/                     # Lightweight test cases
│   ├── ratelimiter.test.js
│   ├── circuitbreaker.test.js
│   ├── idempotency.test.js
│   └── EmailService.test.js
│
└── README.md
```

---

## Installation

### Prerequisites

* Node.js v18+ (tested with v20.18.0)

### Steps

```bash
git clone https://github.com/fuzail-pixel/resilient-mailer.git
cd resilient-mailer
```

No external dependencies are required.

---

## Usage

### Single Email Send

```bash
node index.js
```

This sends a single hardcoded email using available providers with all resilience mechanisms.

### Batch Send via Queue

To simulate a queue-based processing system:

1. Edit `QueueProcessor.js` to define your email batch.
2. Run:

   ```bash
   node QueueProcessor.js
   ```

---

## Testing

This project uses basic assertion-based test files. To run:

```bash
node tests/ratelimiter.test.js
node tests/idempotency.test.js
node tests/circuitbreaker.test.js
node tests/EmailService.test.js
```

Each test will output pass/fail messages to the console.

---

## Assumptions

* Providers are mocked and randomly simulate failures.
* All data (e.g., sent records) is stored locally in a JSON file (`sentEmails.json`).
* No database or external message queue is integrated — this is a simulation.
* Duplicate detection is based on hash of `to`, `subject`, and `body`.

---

## Future Improvements

* Migrate to TypeScript for stricter type safety.
* Replace file-based store with Redis or a database.
* Introduce an actual job queue (e.g., Bull, RabbitMQ).
* Support real email APIs (e.g., SendGrid, Mailgun).
* Add CLI interface or REST API wrapper.
* Implement monitoring dashboard.

---

## License

This project is licensed under the MIT License.
