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
  console.log("Starting platform simulation...");
  console.log("========================================");

  const contractAddress = getContractAddress();

  if (!contractAddress) {
    console.error("Error: Contract address not found");
    console.log("Please set CONTRACT_ADDRESS environment variable or deploy the contract first");
    process.exit(1);
  }

  console.log("Network:", hre.network.name);
  console.log("Contract address:", contractAddress);
  console.log("========================================");

  // Get signers
  const [owner, researcher1, researcher2, researcher3] = await hre.ethers.getSigners();
  console.log("Simulation accounts:");
  console.log("  Owner:", owner.address);
  console.log("  Researcher 1:", researcher1.address);
  console.log("  Researcher 2:", researcher2.address);
  console.log("  Researcher 3:", researcher3.address);
  console.log("========================================");

  // Connect to the contract
  const contract = await hre.ethers.getContractAt(
    "AnonymousResearchDataSharing",
    contractAddress
  );

  // Simulation timeline
  console.log("\n📊 SIMULATION: Research Data Platform Usage");
  console.log("========================================");

  // Step 1: Check initial platform state
  console.log("\n1️⃣ Initial Platform State");
  console.log("----------------------------------------");
  await displayPlatformStats(contract);

  // Step 2: Researcher 1 contributes multiple datasets
  console.log("\n2️⃣ Researcher 1 Contributing Datasets");
  console.log("----------------------------------------");
  const datasets1 = [
    { value: 12345, quality: 85, hash: "QmMedicalData001", public: true },
    { value: 23456, quality: 90, hash: "QmMedicalData002", public: false },
    { value: 34567, quality: 88, hash: "QmMedicalData003", public: true },
  ];

  for (let i = 0; i < datasets1.length; i++) {
    const dataset = datasets1[i];
    console.log(`Contributing dataset ${i + 1}...`);
    const tx = await contract
      .connect(researcher1)
      .contributeData(dataset.value, dataset.quality, dataset.hash, dataset.public);
    const receipt = await tx.wait();
    console.log(`✓ Dataset ${i + 1} contributed (Gas: ${receipt.gasUsed.toString()})`);
  }

  // Step 3: Researcher 2 contributes datasets
  console.log("\n3️⃣ Researcher 2 Contributing Datasets");
  console.log("----------------------------------------");
  const datasets2 = [
    { value: 45678, quality: 92, hash: "QmClinicalTrial001", public: true },
    { value: 56789, quality: 87, hash: "QmClinicalTrial002", public: false },
  ];

  for (let i = 0; i < datasets2.length; i++) {
    const dataset = datasets2[i];
    console.log(`Contributing dataset ${i + 1}...`);
    const tx = await contract
      .connect(researcher2)
      .contributeData(dataset.value, dataset.quality, dataset.hash, dataset.public);
    const receipt = await tx.wait();
    console.log(`✓ Dataset ${i + 1} contributed (Gas: ${receipt.gasUsed.toString()})`);
  }

  // Step 4: Researcher 3 requests data access
  console.log("\n4️⃣ Researcher 3 Requesting Data Access");
  console.log("----------------------------------------");
  const requests = [
    {
      topic: "Cancer Treatment Research",
      budget: 50000,
      deadline: Math.floor(Date.now() / 1000) + 86400 * 30,
    },
    {
      topic: "COVID-19 Vaccine Study",
      budget: 75000,
      deadline: Math.floor(Date.now() / 1000) + 86400 * 60,
    },
  ];

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    console.log(`Requesting access for: ${request.topic}`);
    const tx = await contract
      .connect(researcher3)
      .requestDataAccess(request.topic, request.budget, request.deadline);
    const receipt = await tx.wait();
    console.log(`✓ Request ${i + 1} submitted (Gas: ${receipt.gasUsed.toString()})`);
  }

  // Step 5: Grant access to datasets
  console.log("\n5️⃣ Granting Data Access");
  console.log("----------------------------------------");
  console.log("Researcher 1 granting access to dataset 1 for Researcher 3...");
  let tx = await contract.connect(researcher1).grantDataAccess(1, researcher3.address);
  let receipt = await tx.wait();
  console.log(`✓ Access granted (Gas: ${receipt.gasUsed.toString()})`);

  console.log("Researcher 2 granting access to dataset 4 for Researcher 3...");
  tx = await contract.connect(researcher2).grantDataAccess(4, researcher3.address);
  receipt = await tx.wait();
  console.log(`✓ Access granted (Gas: ${receipt.gasUsed.toString()})`);

  // Step 6: Researcher 3 accesses datasets
  console.log("\n6️⃣ Researcher 3 Accessing Datasets");
  console.log("----------------------------------------");
  try {
    const datasetInfo = await contract.connect(researcher3).accessDataset(1);
    console.log("✓ Dataset 1 accessed successfully");
    console.log(`  Metadata: ${datasetInfo[0]}`);
    console.log(`  Timestamp: ${new Date(Number(datasetInfo[1]) * 1000).toISOString()}`);
    console.log(`  Access count: ${datasetInfo[2].toString()}`);
  } catch (error) {
    console.error("✗ Access denied:", error.message);
  }

  // Step 7: Owner updates quality scores
  console.log("\n7️⃣ Owner Updating Quality Scores");
  console.log("----------------------------------------");
  console.log("Updating quality score for dataset 2...");
  tx = await contract.connect(owner).updateQualityScore(2, 95);
  receipt = await tx.wait();
  console.log(`✓ Quality score updated (Gas: ${receipt.gasUsed.toString()})`);

  // Step 8: Owner distributes rewards
  console.log("\n8️⃣ Distributing Rewards to Contributors");
  console.log("----------------------------------------");
  const rewards = [
    { contributor: researcher1.address, datasetId: 1, amount: 1000 },
    { contributor: researcher1.address, datasetId: 2, amount: 1500 },
    { contributor: researcher2.address, datasetId: 4, amount: 2000 },
  ];

  for (const reward of rewards) {
    console.log(`Distributing reward for dataset ${reward.datasetId}...`);
    tx = await contract
      .connect(owner)
      .distributeReward(reward.contributor, reward.datasetId, reward.amount);
    receipt = await tx.wait();
    console.log(`✓ Reward distributed (Gas: ${receipt.gasUsed.toString()})`);
  }

  // Step 9: View contributor statistics
  console.log("\n9️⃣ Contributor Statistics");
  console.log("----------------------------------------");

  console.log("Researcher 1:");
  const r1Count = await contract.getContributorDatasetCount(researcher1.address);
  const r1Datasets = await contract.getContributorDatasets(researcher1.address);
  const r1Rewards = await contract.getContributorRewardCount(researcher1.address);
  console.log(`  Datasets contributed: ${r1Count.toString()}`);
  console.log(`  Dataset IDs: ${r1Datasets.map((id) => id.toString()).join(", ")}`);
  console.log(`  Rewards received: ${r1Rewards.toString()}`);

  console.log("\nResearcher 2:");
  const r2Count = await contract.getContributorDatasetCount(researcher2.address);
  const r2Datasets = await contract.getContributorDatasets(researcher2.address);
  const r2Rewards = await contract.getContributorRewardCount(researcher2.address);
  console.log(`  Datasets contributed: ${r2Count.toString()}`);
  console.log(`  Dataset IDs: ${r2Datasets.map((id) => id.toString()).join(", ")}`);
  console.log(`  Rewards received: ${r2Rewards.toString()}`);

  // Step 10: Deactivate a dataset
  console.log("\n🔟 Deactivating Dataset");
  console.log("----------------------------------------");
  console.log("Researcher 1 deactivating dataset 3...");
  tx = await contract.connect(researcher1).deactivateDataset(3);
  receipt = await tx.wait();
  console.log(`✓ Dataset deactivated (Gas: ${receipt.gasUsed.toString()})`);

  // Step 11: Final platform state
  console.log("\n1️⃣1️⃣ Final Platform State");
  console.log("----------------------------------------");
  await displayPlatformStats(contract);

  // Step 12: Display all dataset information
  console.log("\n1️⃣2️⃣ All Datasets Summary");
  console.log("----------------------------------------");
  const stats = await contract.getPlatformStats();
  const totalDatasets = Number(stats[0]);

  for (let i = 1; i <= totalDatasets; i++) {
    try {
      const info = await contract.getDatasetInfo(i);
      console.log(`\nDataset ${i}:`);
      console.log(`  Contributor: ${info[0]}`);
      console.log(`  Metadata: ${info[1]}`);
      console.log(`  Public: ${info[2]}`);
      console.log(`  Timestamp: ${new Date(Number(info[3]) * 1000).toISOString()}`);
      console.log(`  Access count: ${info[4].toString()}`);
      console.log(`  Active: ${info[5]}`);
    } catch (error) {
      console.log(`Dataset ${i}: Unable to fetch (may be inactive)`);
    }
  }

  // Step 13: Display all data requests
  console.log("\n1️⃣3️⃣ All Data Requests Summary");
  console.log("----------------------------------------");
  const totalRequests = Number(stats[1]);

  for (let i = 1; i <= totalRequests; i++) {
    try {
      const info = await contract.getDataRequestInfo(i);
      console.log(`\nRequest ${i}:`);
      console.log(`  Requester: ${info[0]}`);
      console.log(`  Topic: ${info[1]}`);
      console.log(`  Deadline: ${new Date(Number(info[2]) * 1000).toISOString()}`);
      console.log(`  Fulfilled: ${info[3]}`);
    } catch (error) {
      console.log(`Request ${i}: Unable to fetch`);
    }
  }

  console.log("\n========================================");
  console.log("✓ Simulation completed successfully!");
  console.log("========================================");

  // Save simulation report
  const report = {
    network: hre.network.name,
    contractAddress: contractAddress,
    timestamp: new Date().toISOString(),
    summary: {
      totalDatasets: totalDatasets,
      totalRequests: totalRequests,
      totalContributors: 2,
      totalRewards: rewards.length,
    },
    participants: {
      owner: owner.address,
      researcher1: researcher1.address,
      researcher2: researcher2.address,
      researcher3: researcher3.address,
    },
  };

  const reportsDir = path.join(__dirname, "..", "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filename = `simulation-report-${Date.now()}.json`;
  const filepath = path.join(reportsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));

  console.log(`\n📄 Simulation report saved to: ${filename}`);
}

async function displayPlatformStats(contract) {
  const stats = await contract.getPlatformStats();
  const owner = await contract.owner();

  console.log("Platform Statistics:");
  console.log(`  Total datasets: ${stats[0].toString()}`);
  console.log(`  Total requests: ${stats[1].toString()}`);
  console.log(`  Block timestamp: ${new Date(Number(stats[2]) * 1000).toISOString()}`);
  console.log(`  Owner: ${owner}`);
}

// Execute simulation
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Simulation failed:", error);
    process.exit(1);
  });

module.exports = main;
