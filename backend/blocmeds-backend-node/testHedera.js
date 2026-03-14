const { Client, AccountBalanceQuery } = require("@hashgraph/sdk");

// Replace with your testnet account ID and private key
const operatorId = "";
const operatorKey = "";

async function main() {
    // Connect to Base testnet
    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);

    try {
        // Create a query for account balance
        const balance = await new AccountBalanceQuery()
            .setAccountId(operatorId)
            .execute(client);

        console.log("✅ Connected! Your ETH balance is:", balance.hbars.toString());
    } catch (err) {
        console.error("❌ Base connection failed:", err);
    }
}

main();
