const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Get contract address from environment or deployment file
function getContractAddress() {
  let contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
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
      }
    }
  }

  return contractAddress;
}

async function main() {
  console.log("Starting contract interaction...");
  console.log("----------------------------------------");

  const contractAddress = getContractAddress();

  if (!contractAddress) {
    console.error("Error: Contract address not found");
    console.log("Please set CONTRACT_ADDRESS environment variable or deploy the contract first");
    process.exit(1);
  }

  console.log("Network:", hre.network.name);
  console.log("Contract address:", contractAddress);

  // Get signers
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  console.log("Interacting as:", deployer.address);
  console.log("----------------------------------------");

  // Connect to the contract
  const contract = await hre.ethers.getContractAt(
    "AnonymousResearchDataSharing",
    contractAddress
  );

  // Display menu
  console.log("Available actions:");
  console.log("1. View platform statistics");
  console.log("2. Contribute dataset");
  console.log("3. Request data access");
  console.log("4. Grant data access");
  console.log("5. View dataset information");
  console.log("6. View contributor datasets");
  console.log("7. View data request information");
  console.log("8. Update quality score (owner only)");
  console.log("9. Distribute reward (owner only)");
  console.log("10. Deactivate dataset");
  console.log("----------------------------------------");

  // Get action from command line or default to viewing stats
  const action = process.env.ACTION || "1";

  switch (action) {
    case "1":
      await viewPlatformStats(contract);
      break;

    case "2":
      await contributeDataset(contract);
      break;

    case "3":
      await requestDataAccess(contract);
      break;

    case "4":
      await grantDataAccess(contract);
      break;

    case "5":
      await viewDatasetInfo(contract);
      break;

    case "6":
      await viewContributorDatasets(contract, deployer.address);
      break;

    case "7":
      await viewDataRequestInfo(contract);
      break;

    case "8":
      await updateQualityScore(contract);
      break;

    case "9":
      await distributeReward(contract);
      break;

    case "10":
      await deactivateDataset(contract);
      break;

    default:
      console.log("Invalid action. Defaulting to viewing platform statistics.");
      await viewPlatformStats(contract);
  }

  console.log("----------------------------------------");
  console.log("✓ Interaction completed successfully!");
}

async function viewPlatformStats(contract) {
  console.log("\nFetching platform statistics...");
  const stats = await contract.getPlatformStats();
  console.log("Total datasets:", stats[0].toString());
  console.log("Total requests:", stats[1].toString());
  console.log("Block timestamp:", new Date(Number(stats[2]) * 1000).toISOString());

  const owner = await contract.owner();
  console.log("Contract owner:", owner);
}

async function contributeDataset(contract) {
  console.log("\nContributing new dataset...");

  const dataValue = process.env.DATA_VALUE || 12345;
  const qualityScore = process.env.QUALITY_SCORE || 85;
  const metadataHash = process.env.METADATA_HASH || "QmExampleHash123456789";
  const isPublic = process.env.IS_PUBLIC === "true";

  console.log("Data value (encrypted):", dataValue);
  console.log("Quality score:", qualityScore);
  console.log("Metadata hash:", metadataHash);
  console.log("Is public:", isPublic);

  const tx = await contract.contributeData(dataValue, qualityScore, metadataHash, isPublic);
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✓ Dataset contributed successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());

  // Get the dataset ID from the event
  const event = receipt.logs.find((log) => {
    try {
      return contract.interface.parseLog(log).name === "DatasetContributed";
    } catch {
      return false;
    }
  });

  if (event) {
    const parsedEvent = contract.interface.parseLog(event);
    console.log("Dataset ID:", parsedEvent.args.datasetId.toString());
  }
}

async function requestDataAccess(contract) {
  console.log("\nRequesting data access...");

  const researchTopic = process.env.RESEARCH_TOPIC || "Medical Research Study";
  const budget = process.env.BUDGET || 50000;
  const deadline = process.env.DEADLINE || Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days

  console.log("Research topic:", researchTopic);
  console.log("Budget (encrypted):", budget);
  console.log("Deadline:", new Date(deadline * 1000).toISOString());

  const tx = await contract.requestDataAccess(researchTopic, budget, deadline);
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✓ Data access requested successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());

  // Get the request ID from the event
  const event = receipt.logs.find((log) => {
    try {
      return contract.interface.parseLog(log).name === "DataRequested";
    } catch {
      return false;
    }
  });

  if (event) {
    const parsedEvent = contract.interface.parseLog(event);
    console.log("Request ID:", parsedEvent.args.requestId.toString());
  }
}

async function grantDataAccess(contract) {
  console.log("\nGranting data access...");

  const datasetId = process.env.DATASET_ID || 1;
  const accessor = process.env.ACCESSOR_ADDRESS;

  if (!accessor) {
    console.error("Error: ACCESSOR_ADDRESS environment variable is required");
    return;
  }

  console.log("Dataset ID:", datasetId);
  console.log("Accessor address:", accessor);

  const tx = await contract.grantDataAccess(datasetId, accessor);
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✓ Data access granted successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());
}

async function viewDatasetInfo(contract) {
  console.log("\nFetching dataset information...");

  const datasetId = process.env.DATASET_ID || 1;
  console.log("Dataset ID:", datasetId);

  try {
    const info = await contract.getDatasetInfo(datasetId);
    console.log("Contributor:", info[0]);
    console.log("Metadata hash:", info[1]);
    console.log("Is public:", info[2]);
    console.log("Timestamp:", new Date(Number(info[3]) * 1000).toISOString());
    console.log("Access count:", info[4].toString());
    console.log("Is active:", info[5]);
  } catch (error) {
    console.error("Error fetching dataset info:", error.message);
  }
}

async function viewContributorDatasets(contract, contributor) {
  console.log("\nFetching contributor datasets...");

  const address = contributor || process.env.CONTRIBUTOR_ADDRESS;
  console.log("Contributor address:", address);

  try {
    const count = await contract.getContributorDatasetCount(address);
    console.log("Total datasets:", count.toString());

    if (count > 0) {
      const datasets = await contract.getContributorDatasets(address);
      console.log("Dataset IDs:", datasets.map((id) => id.toString()).join(", "));
    }
  } catch (error) {
    console.error("Error fetching contributor datasets:", error.message);
  }
}

async function viewDataRequestInfo(contract) {
  console.log("\nFetching data request information...");

  const requestId = process.env.REQUEST_ID || 1;
  console.log("Request ID:", requestId);

  try {
    const info = await contract.getDataRequestInfo(requestId);
    console.log("Requester:", info[0]);
    console.log("Research topic:", info[1]);
    console.log("Deadline:", new Date(Number(info[2]) * 1000).toISOString());
    console.log("Is fulfilled:", info[3]);
  } catch (error) {
    console.error("Error fetching request info:", error.message);
  }
}

async function updateQualityScore(contract) {
  console.log("\nUpdating quality score...");

  const datasetId = process.env.DATASET_ID || 1;
  const newScore = process.env.NEW_SCORE || 90;

  console.log("Dataset ID:", datasetId);
  console.log("New score:", newScore);

  const tx = await contract.updateQualityScore(datasetId, newScore);
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✓ Quality score updated successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());
}

async function distributeReward(contract) {
  console.log("\nDistributing reward...");

  const contributor = process.env.CONTRIBUTOR_ADDRESS;
  const datasetId = process.env.DATASET_ID || 1;
  const rewardAmount = process.env.REWARD_AMOUNT || 1000;

  if (!contributor) {
    console.error("Error: CONTRIBUTOR_ADDRESS environment variable is required");
    return;
  }

  console.log("Contributor:", contributor);
  console.log("Dataset ID:", datasetId);
  console.log("Reward amount:", rewardAmount);

  const tx = await contract.distributeReward(contributor, datasetId, rewardAmount);
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✓ Reward distributed successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());
}

async function deactivateDataset(contract) {
  console.log("\nDeactivating dataset...");

  const datasetId = process.env.DATASET_ID || 1;
  console.log("Dataset ID:", datasetId);

  const tx = await contract.deactivateDataset(datasetId);
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✓ Dataset deactivated successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());
}

// Execute interaction
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Interaction failed:", error);
    process.exit(1);
  });

module.exports = main;
