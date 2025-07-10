// providers/MockProviderA.js

class MockProviderA {
  async send(email) {
    console.log("[ProviderA] Sending email...");

    // Simulate failure (for circuit breaker testing)
    const success = false; // Always fail

    await new Promise(res => setTimeout(res, 200));
    if (success) {
      return { success: true, provider: "A" };
    } else {
      throw new Error("ProviderA failed");
    }
  }
}

module.exports = MockProviderA;
