import { Client, PrivateKey, TopicCreateTransaction } from "@hashgraph/sdk";

// ✅ Use your correct ED25519 credentials
const OPERATOR_ID = "";
const OPERATOR_KEY = PrivateKey.fromString(""); // full DER key

const client = Client.forTestnet().setOperator(OPERATOR_ID, OPERATOR_KEY);

async function createTopic() {
  const txResponse = await new TopicCreateTransaction()
    .setTopicMemo("My first Base Consensus topic")
    .execute(client);

  const receipt = await txResponse.getReceipt(client);
  const topicId = receipt.topicId;

  console.log(`✅ Topic created: ${topicId.toString()}`);
}

createTopic().catch(console.error);
