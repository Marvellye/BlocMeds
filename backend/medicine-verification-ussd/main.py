from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()
BASE_ACCOUNT_ID = os.getenv("BASE_ACCOUNT_ID", "Enter Account ID")
BASE_PRIVATE_KEY = os.getenv("BASE_PRIVATE_KEY", "Enter Private Key")
DRUG_VERIFICATION_TOPIC_ID = os.getenv("DRUG_VERIFICATION_TOPIC_ID")

# Initialize Supabase
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# Simulated Base check (to be replaced with actual SDK logic)
def verify_drug_on_chain(batch_id):
    # Placeholder for Base logic
    base_verified_batches = ["ABC123", "XYZ789"]
    return "Verified" if batch_id in base_verified_batches else "Unverified"

# Supabase drug metadata lookup
def get_drug_status(batch_id):
    try:
        response = supabase.table("drugs").select("*").eq("batch_id", batch_id).execute()
        if response.data:
            data = response.data[0]
            return {
                "drugName": data.get("drug_name"),
                "batchId": data.get("batch_id"),
                "manufacturer": data.get("manufacturer"),
                "expiry": data.get("expiry"),
                "tokenId": data.get("token_id"),
                "status": data.get("status")
            }
    except Exception as e:
        import logging
        logging.error(f"Supabase error: {e}")
    return None

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for FlowSim
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enable logging
logging.basicConfig(level=logging.INFO)

# USSD route
@app.post("/ussd")
async def ussd(request: Request):
    try:
        data = await request.json()
    except Exception as e:
        logging.warning(f"Connection test or invalid JSON: {e}")
        return {"response": "END Connection test OK", "sessionId": "test-session"}

    logging.info(f"Received JSON: {data}")
    print("Received JSON:", data)

    session_id = data.get("sessionId", "")
    service_code = data.get("serviceCode", "")
    if service_code != "*384#":
        return {"response": "END Invalid service code", "sessionId": session_id}

    phone_number = data.get("phoneNumber", "")
    text = data.get("text", "")

    if text == "":
        response = "CON Welcome to Drug Checker\nEnter Drug Batch ID:"
    else:
        batch_id = text.strip().upper()
        drug_data = get_drug_status(batch_id)
        if drug_data:
            #status = verify_drug_on_chain(batch_id)
            expiry = drug_data.get("expiry", "Unknown")
            drug_name = drug_data.get("drugName", "Unknown")
            manufacturer = drug_data.get("manufacturer", "Unknown")
            tokenId = drug_data.get("tokenId", "Unknown")
            batchId = drug_data.get("batchId", "Unknown")
            response = (
                #f"END Drug Status: {status}\n"
                f"Expiry: {expiry}\n"
                f"Drug Name: {drug_name}\n"
                f"Manufacturer: {manufacturer}\n"
                f"tokenId: {tokenId}\n"
                f"batchId: {batchId}\n"
            )
        else:
            response = "END Batch ID not found."

    logging.info(f"Response: {response}")
    return {
        "response": response,
        "sessionId": session_id
    }
