const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting contract verification process...");
  console.log("----------------------------------------");

  // Get contract address from command line or deployment file
  let contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    // Try to read from latest deployment file
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (fs.existsSync(deploymentsDir)) {
      const files = fs
        .readdirSync(deploymentsDir)
        .filter((f) => f.startsWith(`deployment-${hre.network.name}`))
        .sort()
        .reverse();

      if (files.length > 0) {
        const latestDeployment = JSON.parse(
          fs.readFileSync(path.join(deploymentsDir, files[0]))
        );
        contractAddress = latestDeployment.contractAddress;
        console.log("Using contract address from latest deployment:", contractAddress);
      }
    }
  }

  if (!contractAddress) {
    console.error("Error: Contract address not provided");
    console.log("Usage:");
    console.log("  CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network sepolia");
    console.log("  Or ensure deployment file exists in deployments/ directory");
    process.exit(1);
  }

  console.log("Network:", hre.network.name);
  console.log("Contract address:", contractAddress);
  console.log("----------------------------------------");

  // Verify on Etherscan
  if (hre.network.name === "sepolia" || hre.network.name === "mainnet") {
    console.log("Verifying contract on Etherscan...");

    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });

      console.log("✓ Contract verified successfully!");
      console.log(
        `View on Etherscan: https://${
          hre.network.name === "mainnet" ? "" : hre.network.name + "."
        }etherscan.io/address/${contractAddress}`
      );
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✓ Contract is already verified on Etherscan");
        console.log(
          `View on Etherscan: https://${
            hre.network.name === "mainnet" ? "" : hre.network.name + "."
          }etherscan.io/address/${contractAddress}`
        );
      } else {
        console.error("Verification failed:", error.message);
        process.exit(1);
      }
    }
  } else {
    console.log("Skipping Etherscan verification for local network");
  }

  console.log("----------------------------------------");

  // Verify contract functionality
  console.log("Verifying contract functionality...");

  try {
    const Contract = await hre.ethers.getContractAt(
      "AnonymousResearchDataSharing",
      contractAddress
    );

    // Check basic contract properties
    const owner = await Contract.owner();
    const nextDatasetId = await Contract.nextDatasetId();
    const nextRequestId = await Contract.nextRequestId();
    const stats = await Contract.getPlatformStats();

    console.log("✓ Contract is accessible and functional");
    console.log("  Owner:", owner);
    console.log("  Next dataset ID:", nextDatasetId.toString());
    console.log("  Next request ID:", nextRequestId.toString());
    console.log("  Total datasets:", stats[0].toString());
    console.log("  Total requests:", stats[1].toString());
    console.log("  Block timestamp:", stats[2].toString());
  } catch (error) {
    console.error("✗ Contract functionality check failed:", error.message);
    process.exit(1);
  }

  console.log("----------------------------------------");
  console.log("✓ Verification completed successfully!");
}

// Execute verification
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Verification failed:", error);
    process.exit(1);
  });

module.exports = main;
