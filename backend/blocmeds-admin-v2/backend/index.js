import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import axios from 'axios';
import { ethers } from 'ethers';
import { Client, PrivateKey, AccountId, TopicMessageSubmitTransaction } from '@hashgraph/sdk';
import { db } from './services/firebase.js';
import { mintDrugToken } from './services/token.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Base SDK Setup
const operatorId = AccountId.fromString(process.env.OPERATOR_ID || '');
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY || '');
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const topicId = process.env.TOPIC_ID || '0.0.6825354';

// Ethers Setup for Smart Contract
const abi = JSON.parse(fs.readFileSync('./contracts/ManufacturerVerifier.json', 'utf8')).abi;

const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000', abi, signer);

// ETH Fee Configuration (Mock for now, to be implemented in Phase 2)
const uploadFeeETH = 0.1; // Mock fee in ETH

// Submit Message to Base Consensus Service
async function submitBase ConsensusMessage(eventData) {
  try {
    const txResponse = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(JSON.stringify(eventData))
      .execute(client);

    const receipt = await txResponse.getReceipt(client);
    console.log(`✅ Base Consensus message submitted: ${receipt.status.toString()}`);
    return receipt;
  } catch (error) {
    console.error('Base Consensus submission error:', error);
    throw error;
  }
}

// API: Upload Drug Batch
app.post('/api/drugs/upload', async (req, res) => {
  try {
    const { drugName, manufacturer, batchId, expiry, senderAddress } = req.body;

    if (!drugName || !manufacturer || !batchId || !expiry || !senderAddress) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check manufacturer verification
    const isVerified = await contract.isVerifiedManufacturer(senderAddress);
    if (!isVerified) {
      return res.status(403).json({ error: 'Manufacturer is not verified' });
    }

    // Mock ETH fee deduction (to be implemented with HashPack in Phase 2)
    console.log(`Deducting ${uploadFeeETH} ETH from ${senderAddress} (mocked for now)`);

    // Mint drug token and store batch
    const tokenId = await mintDrugToken(drugName, batchId);

    await db.collection('drug_batches').doc(batchId).set({
      batchId,
      drugName,
      manufacturer,
      expiry,
      senderAddress,
      tokenId,
      timestamp: new Date().toISOString()
    });


    // Log to Base Consensus
    await submitBase ConsensusMessage({
      event: 'BatchUploaded',
      drugName,
      manufacturer,
      batchId,
      expiry,
      senderAddress,
      tokenId,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      tokenId,
      message: 'Batch uploaded and token minted successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload batch', details: error.message });
  }
});

// API: Check Manufacturer Verification
app.post('/api/manufacturers/is-verified', async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const isVerified = await contract.isVerifiedManufacturer(address);
    res.json({ isVerified });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check verification', details: error.message });
  }
});

// API: Verify Manufacturer (Admin-Only)
app.post('/api/manufacturers/verify', async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    // Admin-only check (mocked for now, to be secured in Phase 2)
    console.log('Admin action: Verifying manufacturer', address);

    const tx = await contract.verifyManufacturer(address);
    await tx.wait();

    await db.collection('verified_manufacturers').add({
      address,
      verifiedAt: new Date().toISOString(),
      txHash: tx.hash
    });

    await submitBase ConsensusMessage({
      event: 'ManufacturerVerified',
      address,
      timestamp: new Date().toISOString(),
      txHash: tx.hash
    });

    res.json({
      success: true,
      transactionHash: tx.hash,
      message: 'Manufacturer verified successfully'
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Failed to verify manufacturer', details: error.message });
  }
});

// API: Revoke Manufacturer (Admin-Only)
app.post('/api/manufacturers/revoke', async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    // Admin-only check (mocked for now, to be secured in Phase 2)
    console.log('Admin action: Revoking manufacturer', address);

    const tx = await contract.revokeManufacturer(address);
    await tx.wait();

    await db.collection('revoked_manufacturers').add({
      address,
      revokedAt: new Date().toISOString(),
      txHash: tx.hash
    });

    await submitBase ConsensusMessage({
      event: 'ManufacturerRevoked',
      address,
      timestamp: new Date().toISOString(),
      txHash: tx.hash
    });

    res.json({
      success: true,
      transactionHash: tx.hash,
      message: 'Manufacturer access revoked'
    });
  } catch (error) {
    console.error('Revocation error:', error);
    res.status(500).json({ error: 'Failed to revoke manufacturer', details: error.message });
  }
});

// API: Analyze Data (for National Drug Bodies)
app.post('/api/analyze', async (req, res) => {
  try {
    const { scan_data } = req.body;
    if (!scan_data) {
      return res.status(400).json({ error: 'Scan data is required' });
    }

    // Forward to AI service (mocked locally, to be hosted on Railway)
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001/api/analyze_patterns';
    const aiResponse = await axios.post(aiServiceUrl, { scan_data });
    const { anomalies, prediction, hotspots } = aiResponse.data;

    // Log analysis to Base Consensus (optional for audit)
    await submitBase ConsensusMessage({
      event: 'AIAnalysisPerformed',
      timestamp: new Date().toISOString(),
      anomaliesCount: anomalies.length,
      prediction
    });

    res.json({
      anomalies,
      prediction,
      hotspots
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze data', details: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});