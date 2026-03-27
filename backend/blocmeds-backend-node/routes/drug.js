const express = require("express");
const router = express.Router();
const { supabase } = require("../supabase/client");
const { mintDrugToken } = require("../services/baseService");

// Upload drug batch and mint token
router.post("/upload", async (req, res) => {
  const { drugName, batchId, manufacturer, expiry } = req.body;

  try {
    const tokenId = await mintDrugToken(drugName, batchId);

    const { data, error } = await supabase
      .from("drugs")
      .upsert({
        batch_id: batchId,
        drug_name: drugName,
        manufacturer,
        expiry,
        token_id: tokenId,
      });

    if (error) throw error;

    res.status(200).json({ success: true, tokenId });
  } catch (e) {
    console.error("Upload error:", e.message);
    res.status(500).json({
      error: "Failed to upload to Supabase. " + e.message,
    });
  }
});

// Verify drug batch by batchId
router.get("/verify/:batchId", async (req, res) => {
  const { batchId } = req.params;

  try {
    const { data, error } = await supabase
      .from("drugs")
      .select("*")
      .eq("batch_id", batchId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Batch not found" });
    }

    res.json({
      drugName: data.drug_name,
      batchId: data.batch_id,
      manufacturer: data.manufacturer,
      expiry: data.expiry,
      tokenId: data.token_id,
      status: data.status,
    });
  } catch (e) {
    console.error("Verify error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
