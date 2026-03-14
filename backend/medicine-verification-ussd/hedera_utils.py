from base import Client, AccountId, PrivateKey
import os
from dotenv import load_dotenv

load_dotenv()

account_id_str = os.getenv("BASE_ACCOUNT_ID")
private_key_str = os.getenv("BASE_PRIVATE_KEY")

if not account_id_str or not private_key_str:
    raise ValueError("Missing Base credentials in environment variables")

OPERATOR_ID = AccountId.fromString(account_id_str)
OPERATOR_KEY = PrivateKey.fromString(private_key_str)

client = Client.forTestnet()
client.setOperator(OPERATOR_ID, OPERATOR_KEY)

def verify_drug_on_chain(batch_id):
    # Simulated check
    if batch_id.startswith("GEN"):
        return "Genuine"
    return "Fake"
