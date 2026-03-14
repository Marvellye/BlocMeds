const express = require("express");
require("dotenv").config();
const cors = require("cors");
const drugRoutes = require("./routes/drug");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/drugs", drugRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BlocMeds backend running on port ${PORT}`);
});
