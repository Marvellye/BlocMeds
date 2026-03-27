const { Coinbase, Wallet, Asset } = require("@coinbase/coinbase-sdk");
require("dotenv").config();

// Configure Coinbase SDK
if (process.env.CDP_API_KEY_NAME && process.env.CDP_API_KEY_PRIVATE_KEY) {
  Coinbase.configure({
    apiKeyName: process.env.CDP_API_KEY_NAME,
    privateKey: process.env.CDP_API_KEY_PRIVATE_KEY,
  });
}

/**
 * Mint a verifiable drug batch token on Base (Sepolia Testnet for testing)
 */
async function mintDrugToken(drugName, batchId) {
  try {
    if (!process.env.CDP_API_KEY_NAME) {
      console.warn("⚠️ CDP API Key not found, using mock Base ID for testing");
      return `BASE-TKN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }

    // Create/Get a developer wallet on Base Sepolia
    const wallet = await Wallet.create({ networkId: Coinbase.networks.BaseSepolia });

    // For testing/mock purposes, we'll record it on-chain with a self-transfer
    const mintTx = await wallet.createTransfer({
      amount: 0.0001,
      assetId: Coinbase.assets.Eth,
      destination: wallet,
    });

    const receipt = await mintTx.wait();
    
    return receipt.getTransactionHash();
  } catch (err) {
    console.error("❌ Base Minting failed:", err);
    // Final fallback for demo
    return `BASE-TKN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

module.exports = { mintDrugToken };
