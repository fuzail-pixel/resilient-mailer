class MockProviderB {
  async send(email) {
    console.log("[ProviderB] Sending email...");
    const success = Math.random() > 0.5;

    await new Promise(res => setTimeout(res, 200));
    if (success) {
      return { success: true, provider: "B" };
    } else {
      throw new Error("ProviderB failed");
    }
  }
}

module.exports = MockProviderB;
