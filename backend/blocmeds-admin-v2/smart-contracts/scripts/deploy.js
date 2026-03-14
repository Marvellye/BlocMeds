const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const ManufacturerVerifier = await ethers.getContractFactory("ManufacturerVerifier");
  const contract = await ManufacturerVerifier.deploy(deployer.address);

  await contract.waitForDeployment();

  console.log("ManufacturerVerifier deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
