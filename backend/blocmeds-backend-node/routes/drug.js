const express = require("express");
const router = express.Router();
const { db } = require("../firebase/admin");
const { mintDrugToken } = require("../services/baseService");

// Upload drug batch and mint token
router.post("/upload", async (req, res) => {
  const { drugName, batchId, manufacturer, expiry } = req.body;

  try {
    const tokenId = await mintDrugToken(drugName, batchId);

    await db.collection("drugs").doc(batchId).set({
      drugName,
      batchId,
      manufacturer,
      expiry,
      tokenId,
    });

    res.status(200).json({ success: true, tokenId });
  } catch (e) {
    console.error("Upload error:", e.message);
    res.status(500).json({
      error: "Failed to mint token. Check supply limits or token configuration.",
    });
  }
});

// Verify drug batch by batchId
router.get("/verify/:batchId", async (req, res) => {
  const { batchId } = req.params;

  try {
    const doc = await db.collection("drugs").doc(batchId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Batch not found" });
    }

    res.json(doc.data());
  } catch (e) {
    console.error("Verify error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
