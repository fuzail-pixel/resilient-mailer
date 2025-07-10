class MockProviderA {
  async send(email) {
    console.log("[ProviderA] Sending email...");

    // Simulate a failure scenario
    // In a real-world scenario, this would be replaced with actual email sending logic
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
