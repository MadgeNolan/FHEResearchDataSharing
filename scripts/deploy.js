const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment process...");
  console.log("----------------------------------------");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("----------------------------------------");

  // Deploy the contract
  console.log("Deploying AnonymousResearchDataSharing contract...");

  const AnonymousResearchDataSharing = await hre.ethers.getContractFactory(
    "AnonymousResearchDataSharing"
  );

  const contract = await AnonymousResearchDataSharing.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✓ Contract deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("----------------------------------------");

  // Get deployment transaction details
  const deploymentTx = contract.deploymentTransaction();
  if (deploymentTx) {
    console.log("Transaction hash:", deploymentTx.hash);
    console.log("Block number:", deploymentTx.blockNumber);
    console.log("Gas used:", deploymentTx.gasLimit.toString());
  }
  console.log("----------------------------------------");

  // Verify contract deployment
  console.log("Verifying contract deployment...");
  const owner = await contract.owner();
  const nextDatasetId = await contract.nextDatasetId();
  const nextRequestId = await contract.nextRequestId();

  console.log("✓ Contract owner:", owner);
  console.log("✓ Next dataset ID:", nextDatasetId.toString());
  console.log("✓ Next request ID:", nextRequestId.toString());
  console.log("----------------------------------------");

  // Save deployment information
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: deploymentTx?.hash || "N/A",
    blockNumber: deploymentTx?.blockNumber || "N/A",
    owner: owner,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `deployment-${hre.network.name}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

  console.log("Deployment information saved to:", filename);
  console.log("----------------------------------------");

  // Network-specific information
  if (hre.network.name === "sepolia") {
    console.log("Network: Sepolia Testnet");
    console.log("Explorer:", `https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("To verify the contract, run:");
    console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
  } else if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    console.log("Network: Local Development");
    console.log("Note: This is a local deployment for testing purposes.");
  }
  console.log("----------------------------------------");

  console.log("✓ Deployment completed successfully!");

  return {
    contract: contract,
    address: contractAddress,
    deployer: deployer.address,
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

module.exports = main;
