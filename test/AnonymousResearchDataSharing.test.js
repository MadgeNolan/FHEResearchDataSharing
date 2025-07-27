const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("AnonymousResearchDataSharing", function () {
  // Fixture for deploying the contract
  async function deployContractFixture() {
    const [owner, researcher1, researcher2, researcher3, researcher4] = await ethers.getSigners();

    const AnonymousResearchDataSharing = await ethers.getContractFactory(
      "AnonymousResearchDataSharing"
    );
    const contract = await AnonymousResearchDataSharing.deploy();

    return { contract, owner, researcher1, researcher2, researcher3, researcher4 };
  }

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { contract, owner } = await loadFixture(deployContractFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct starting values", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      expect(await contract.nextDatasetId()).to.equal(1);
      expect(await contract.nextRequestId()).to.equal(1);
    });

    it("Should return correct initial platform stats", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      const stats = await contract.getPlatformStats();
      expect(stats[0]).to.equal(0); // totalDatasets
      expect(stats[1]).to.equal(0); // totalRequests
    });
  });

  describe("Data Contribution", function () {
    it("Should allow researchers to contribute data", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      const dataValue = 12345;
      const qualityScore = 85;
      const metadataHash = "QmExampleHash123";
      const isPublic = true;

      await expect(
        contract.connect(researcher1).contributeData(dataValue, qualityScore, metadataHash, isPublic)
      )
        .to.emit(contract, "DatasetContributed")
        .withArgs(1, researcher1.address, metadataHash);

      expect(await contract.nextDatasetId()).to.equal(2);
    });

    it("Should reject quality score above 100", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      await expect(
        contract.connect(researcher1).contributeData(12345, 101, "QmHash", true)
      ).to.be.revertedWith("Quality score must be 0-100");
    });

    it("Should reject empty metadata hash", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      await expect(
        contract.connect(researcher1).contributeData(12345, 85, "", true)
      ).to.be.revertedWith("Metadata hash required");
    });

    it("Should track contributor datasets", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash1", true);
      await contract.connect(researcher1).contributeData(23456, 90, "QmHash2", false);

      const count = await contract.getContributorDatasetCount(researcher1.address);
      expect(count).to.equal(2);

      const datasets = await contract.getContributorDatasets(researcher1.address);
      expect(datasets.length).to.equal(2);
      expect(datasets[0]).to.equal(1);
      expect(datasets[1]).to.equal(2);
    });

    it("Should store correct dataset information", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      const dataValue = 12345;
      const qualityScore = 85;
      const metadataHash = "QmExampleHash123";
      const isPublic = true;

      await contract.connect(researcher1).contributeData(dataValue, qualityScore, metadataHash, isPublic);

      const info = await contract.getDatasetInfo(1);
      expect(info[0]).to.equal(researcher1.address); // contributor
      expect(info[1]).to.equal(metadataHash); // metadataHash
      expect(info[2]).to.equal(isPublic); // isPublic
      expect(info[4]).to.equal(0); // accessCount
      expect(info[5]).to.equal(true); // isActive
    });
  });

  describe("Data Access Requests", function () {
    it("Should allow researchers to request data access", async function () {
      const { contract, researcher2 } = await loadFixture(deployContractFixture);

      const researchTopic = "Cancer Research";
      const budget = 50000;
      const deadline = Math.floor(Date.now() / 1000) + 86400;

      await expect(
        contract.connect(researcher2).requestDataAccess(researchTopic, budget, deadline)
      )
        .to.emit(contract, "DataRequested")
        .withArgs(1, researcher2.address, researchTopic);

      expect(await contract.nextRequestId()).to.equal(2);
    });

    it("Should reject empty research topic", async function () {
      const { contract, researcher2 } = await loadFixture(deployContractFixture);

      const deadline = Math.floor(Date.now() / 1000) + 86400;

      await expect(
        contract.connect(researcher2).requestDataAccess("", 50000, deadline)
      ).to.be.revertedWith("Research topic required");
    });

    it("Should reject past deadline", async function () {
      const { contract, researcher2 } = await loadFixture(deployContractFixture);

      const pastDeadline = Math.floor(Date.now() / 1000) - 86400;

      await expect(
        contract.connect(researcher2).requestDataAccess("Research", 50000, pastDeadline)
      ).to.be.revertedWith("Deadline must be in future");
    });

    it("Should store correct request information", async function () {
      const { contract, researcher2 } = await loadFixture(deployContractFixture);

      const researchTopic = "Medical Research";
      const budget = 75000;
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 30;

      await contract.connect(researcher2).requestDataAccess(researchTopic, budget, deadline);

      const info = await contract.getDataRequestInfo(1);
      expect(info[0]).to.equal(researcher2.address); // requester
      expect(info[1]).to.equal(researchTopic); // researchTopic
      expect(info[2]).to.equal(deadline); // deadline
      expect(info[3]).to.equal(false); // isFulfilled
    });
  });

  describe("Access Control", function () {
    it("Should allow contributor to grant access", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      // Contribute dataset
      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", false);

      // Grant access
      await expect(contract.connect(researcher1).grantDataAccess(1, researcher2.address))
        .to.emit(contract, "DatasetAccessed")
        .withArgs(1, researcher2.address);

      // Check access count increased
      const info = await contract.getDatasetInfo(1);
      expect(info[4]).to.equal(1); // accessCount
    });

    it("Should allow owner to grant access", async function () {
      const { contract, owner, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      // Contribute dataset
      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", false);

      // Owner grants access
      await expect(contract.connect(owner).grantDataAccess(1, researcher2.address))
        .to.emit(contract, "DatasetAccessed")
        .withArgs(1, researcher2.address);
    });

    it("Should reject unauthorized access grant", async function () {
      const { contract, researcher1, researcher2, researcher3 } = await loadFixture(
        deployContractFixture
      );

      // Contribute dataset
      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", false);

      // Unauthorized user tries to grant access
      await expect(
        contract.connect(researcher3).grantDataAccess(1, researcher2.address)
      ).to.be.revertedWith("Not authorized to grant access");
    });

    it("Should reject access to invalid dataset", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      await expect(
        contract.connect(researcher1).grantDataAccess(999, researcher2.address)
      ).to.be.revertedWith("Invalid dataset ID");
    });
  });

  describe("Dataset Access", function () {
    it("Should allow access to public datasets", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      const metadataHash = "QmPublicHash";
      await contract.connect(researcher1).contributeData(12345, 85, metadataHash, true);

      const info = await contract.connect(researcher2).accessDataset(1);
      expect(info[0]).to.equal(metadataHash);
    });

    it("Should allow contributor to access own dataset", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      const metadataHash = "QmPrivateHash";
      await contract.connect(researcher1).contributeData(12345, 85, metadataHash, false);

      const info = await contract.connect(researcher1).accessDataset(1);
      expect(info[0]).to.equal(metadataHash);
    });

    it("Should allow granted access to private datasets", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      const metadataHash = "QmPrivateHash";
      await contract.connect(researcher1).contributeData(12345, 85, metadataHash, false);
      await contract.connect(researcher1).grantDataAccess(1, researcher2.address);

      const info = await contract.connect(researcher2).accessDataset(1);
      expect(info[0]).to.equal(metadataHash);
    });

    it("Should reject access to private dataset without permission", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmPrivateHash", false);

      await expect(contract.connect(researcher2).accessDataset(1)).to.be.revertedWith(
        "Access denied"
      );
    });

    it("Should reject access to inactive dataset", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);
      await contract.connect(researcher1).deactivateDataset(1);

      await expect(contract.connect(researcher2).accessDataset(1)).to.be.revertedWith(
        "Dataset not active"
      );
    });
  });

  describe("Quality Score Management", function () {
    it("Should allow owner to update quality score", async function () {
      const { contract, owner, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);

      await expect(contract.connect(owner).updateQualityScore(1, 95))
        .to.emit(contract, "QualityScoreUpdated")
        .withArgs(1, 95);
    });

    it("Should reject quality score update from non-owner", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);

      await expect(
        contract.connect(researcher2).updateQualityScore(1, 95)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should reject quality score above 100", async function () {
      const { contract, owner, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);

      await expect(contract.connect(owner).updateQualityScore(1, 101)).to.be.revertedWith(
        "Score must be 0-100"
      );
    });
  });

  describe("Reward Distribution", function () {
    it("Should allow owner to distribute rewards", async function () {
      const { contract, owner, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);

      await expect(contract.connect(owner).distributeReward(researcher1.address, 1, 1000))
        .to.emit(contract, "RewardDistributed")
        .withArgs(researcher1.address, 1);

      const rewardCount = await contract.getContributorRewardCount(researcher1.address);
      expect(rewardCount).to.equal(1);
    });

    it("Should reject reward distribution from non-owner", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);

      await expect(
        contract.connect(researcher2).distributeReward(researcher1.address, 1, 1000)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should reject reward for invalid contributor", async function () {
      const { contract, owner, researcher1, researcher2 } = await loadFixture(
        deployContractFixture
      );

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);

      await expect(
        contract.connect(owner).distributeReward(researcher2.address, 1, 1000)
      ).to.be.revertedWith("Invalid contributor");
    });

    it("Should track multiple rewards for a contributor", async function () {
      const { contract, owner, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash1", true);
      await contract.connect(researcher1).contributeData(23456, 90, "QmHash2", true);

      await contract.connect(owner).distributeReward(researcher1.address, 1, 1000);
      await contract.connect(owner).distributeReward(researcher1.address, 2, 1500);

      const rewardCount = await contract.getContributorRewardCount(researcher1.address);
      expect(rewardCount).to.equal(2);
    });
  });

  describe("Dataset Deactivation", function () {
    it("Should allow contributor to deactivate dataset", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);
      await contract.connect(researcher1).deactivateDataset(1);

      const info = await contract.getDatasetInfo(1);
      expect(info[5]).to.equal(false); // isActive
    });

    it("Should allow owner to deactivate dataset", async function () {
      const { contract, owner, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);
      await contract.connect(owner).deactivateDataset(1);

      const info = await contract.getDatasetInfo(1);
      expect(info[5]).to.equal(false); // isActive
    });

    it("Should reject deactivation from unauthorized user", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);

      await expect(contract.connect(researcher2).deactivateDataset(1)).to.be.revertedWith(
        "Not authorized"
      );
    });
  });

  describe("Platform Statistics", function () {
    it("Should track total datasets and requests", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      // Contribute datasets
      await contract.connect(researcher1).contributeData(12345, 85, "QmHash1", true);
      await contract.connect(researcher1).contributeData(23456, 90, "QmHash2", true);

      // Submit requests
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await contract.connect(researcher2).requestDataAccess("Research 1", 50000, deadline);
      await contract.connect(researcher2).requestDataAccess("Research 2", 60000, deadline);

      const stats = await contract.getPlatformStats();
      expect(stats[0]).to.equal(2); // totalDatasets
      expect(stats[1]).to.equal(2); // totalRequests
    });

    it("Should return correct block timestamp", async function () {
      const { contract } = await loadFixture(deployContractFixture);

      const stats = await contract.getPlatformStats();
      expect(stats[2]).to.be.gt(0); // blockTimestamp
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple contributors and datasets", async function () {
      const { contract, researcher1, researcher2, researcher3 } = await loadFixture(
        deployContractFixture
      );

      await contract.connect(researcher1).contributeData(11111, 80, "QmHash1", true);
      await contract.connect(researcher2).contributeData(22222, 85, "QmHash2", true);
      await contract.connect(researcher3).contributeData(33333, 90, "QmHash3", false);

      const stats = await contract.getPlatformStats();
      expect(stats[0]).to.equal(3);

      expect(await contract.getContributorDatasetCount(researcher1.address)).to.equal(1);
      expect(await contract.getContributorDatasetCount(researcher2.address)).to.equal(1);
      expect(await contract.getContributorDatasetCount(researcher3.address)).to.equal(1);
    });

    it("Should handle zero values correctly", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(0, 0, "QmHash", true);

      const info = await contract.getDatasetInfo(1);
      expect(info[0]).to.equal(researcher1.address);
    });

    it("Should return empty array for contributor with no datasets", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      const count = await contract.getContributorDatasetCount(researcher1.address);
      expect(count).to.equal(0);

      const datasets = await contract.getContributorDatasets(researcher1.address);
      expect(datasets.length).to.equal(0);
    });

    it("Should handle maximum uint32 value", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      const maxUint32 = 2n ** 32n - 1n;
      await contract.connect(researcher1).contributeData(maxUint32, 100, "QmMaxHash", true);

      const info = await contract.getDatasetInfo(1);
      expect(info[0]).to.equal(researcher1.address);
    });

    it("Should handle multiple access grants to same dataset", async function () {
      const { contract, researcher1, researcher2, researcher3, researcher4 } = await loadFixture(
        deployContractFixture
      );

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", false);

      await contract.connect(researcher1).grantDataAccess(1, researcher2.address);
      await contract.connect(researcher1).grantDataAccess(1, researcher3.address);
      await contract.connect(researcher1).grantDataAccess(1, researcher4.address);

      const info = await contract.getDatasetInfo(1);
      expect(info[4]).to.equal(3); // accessCount
    });
  });

  describe("Complex Workflows", function () {
    it("Should handle full workflow: contribute, request, grant, access", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      // Step 1: Contribute dataset
      await contract.connect(researcher1).contributeData(12345, 85, "QmWorkflow", false);

      // Step 2: Request access
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await contract.connect(researcher2).requestDataAccess("Workflow Test", 50000, deadline);

      // Step 3: Grant access
      await contract.connect(researcher1).grantDataAccess(1, researcher2.address);

      // Step 4: Access dataset
      const info = await contract.connect(researcher2).accessDataset(1);
      expect(info[0]).to.equal("QmWorkflow");
    });

    it("Should handle multiple datasets and multiple requests", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      // Contribute multiple datasets
      await contract.connect(researcher1).contributeData(11111, 80, "QmHash1", true);
      await contract.connect(researcher1).contributeData(22222, 85, "QmHash2", false);
      await contract.connect(researcher1).contributeData(33333, 90, "QmHash3", true);

      // Multiple requests
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await contract.connect(researcher2).requestDataAccess("Request 1", 10000, deadline);
      await contract.connect(researcher2).requestDataAccess("Request 2", 20000, deadline);

      const stats = await contract.getPlatformStats();
      expect(stats[0]).to.equal(3); // 3 datasets
      expect(stats[1]).to.equal(2); // 2 requests
    });

    it("Should handle reward distribution to multiple contributors", async function () {
      const { contract, owner, researcher1, researcher2, researcher3 } = await loadFixture(
        deployContractFixture
      );

      // Contribute datasets
      await contract.connect(researcher1).contributeData(11111, 80, "QmHash1", true);
      await contract.connect(researcher2).contributeData(22222, 85, "QmHash2", true);
      await contract.connect(researcher3).contributeData(33333, 90, "QmHash3", true);

      // Distribute rewards
      await contract.connect(owner).distributeReward(researcher1.address, 1, 1000);
      await contract.connect(owner).distributeReward(researcher2.address, 2, 1500);
      await contract.connect(owner).distributeReward(researcher3.address, 3, 2000);

      // Verify rewards
      expect(await contract.getContributorRewardCount(researcher1.address)).to.equal(1);
      expect(await contract.getContributorRewardCount(researcher2.address)).to.equal(1);
      expect(await contract.getContributorRewardCount(researcher3.address)).to.equal(1);
    });
  });

  describe("Event Emissions", function () {
    it("Should emit DatasetContributed event with correct parameters", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      await expect(contract.connect(researcher1).contributeData(12345, 85, "QmEvent", true))
        .to.emit(contract, "DatasetContributed")
        .withArgs(1, researcher1.address, "QmEvent");
    });

    it("Should emit DataRequested event with correct parameters", async function () {
      const { contract, researcher2 } = await loadFixture(deployContractFixture);

      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await expect(contract.connect(researcher2).requestDataAccess("Event Test", 50000, deadline))
        .to.emit(contract, "DataRequested")
        .withArgs(1, researcher2.address, "Event Test");
    });

    it("Should emit DatasetAccessed event when access is granted", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", false);

      await expect(contract.connect(researcher1).grantDataAccess(1, researcher2.address))
        .to.emit(contract, "DatasetAccessed")
        .withArgs(1, researcher2.address);
    });

    it("Should emit RewardDistributed event when reward is given", async function () {
      const { contract, owner, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);

      await expect(contract.connect(owner).distributeReward(researcher1.address, 1, 1000))
        .to.emit(contract, "RewardDistributed")
        .withArgs(researcher1.address, 1);
    });

    it("Should emit QualityScoreUpdated event when score is updated", async function () {
      const { contract, owner, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", true);

      await expect(contract.connect(owner).updateQualityScore(1, 95))
        .to.emit(contract, "QualityScoreUpdated")
        .withArgs(1, 95);
    });
  });

  describe("Gas Optimization", function () {
    it("Should have reasonable gas cost for data contribution", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      const tx = await contract.connect(researcher1).contributeData(12345, 85, "QmGas", true);
      const receipt = await tx.wait();

      // Gas should be reasonable (adjust based on actual measurements)
      expect(receipt.gasUsed).to.be.lt(500000);
    });

    it("Should have reasonable gas cost for access request", async function () {
      const { contract, researcher2 } = await loadFixture(deployContractFixture);

      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const tx = await contract
        .connect(researcher2)
        .requestDataAccess("Gas Test", 50000, deadline);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(300000);
    });

    it("Should have reasonable gas cost for granting access", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(12345, 85, "QmHash", false);

      const tx = await contract.connect(researcher1).grantDataAccess(1, researcher2.address);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(200000);
    });
  });

  describe("State Consistency", function () {
    it("Should maintain correct dataset counter after multiple contributions", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      expect(await contract.nextDatasetId()).to.equal(1);

      await contract.connect(researcher1).contributeData(11111, 80, "QmHash1", true);
      expect(await contract.nextDatasetId()).to.equal(2);

      await contract.connect(researcher2).contributeData(22222, 85, "QmHash2", true);
      expect(await contract.nextDatasetId()).to.equal(3);
    });

    it("Should maintain correct request counter after multiple requests", async function () {
      const { contract, researcher1, researcher2 } = await loadFixture(deployContractFixture);

      expect(await contract.nextRequestId()).to.equal(1);

      const deadline = Math.floor(Date.now() / 1000) + 86400;

      await contract.connect(researcher1).requestDataAccess("Request 1", 10000, deadline);
      expect(await contract.nextRequestId()).to.equal(2);

      await contract.connect(researcher2).requestDataAccess("Request 2", 20000, deadline);
      expect(await contract.nextRequestId()).to.equal(3);
    });

    it("Should maintain correct contributor dataset list", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      await contract.connect(researcher1).contributeData(11111, 80, "QmHash1", true);
      await contract.connect(researcher1).contributeData(22222, 85, "QmHash2", true);
      await contract.connect(researcher1).contributeData(33333, 90, "QmHash3", false);

      const datasets = await contract.getContributorDatasets(researcher1.address);
      expect(datasets.length).to.equal(3);
      expect(datasets[0]).to.equal(1);
      expect(datasets[1]).to.equal(2);
      expect(datasets[2]).to.equal(3);
    });
  });

  describe("Boundary Conditions", function () {
    it("Should handle dataset ID boundary correctly", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      // Test with non-existent dataset ID
      await expect(contract.getDatasetInfo(999)).to.be.revertedWith("Invalid dataset ID");
    });

    it("Should handle request ID boundary correctly", async function () {
      const { contract } = await loadFixture(deployContractFixture);

      // Test with non-existent request ID
      await expect(contract.getDataRequestInfo(999)).to.be.revertedWith("Invalid request ID");
    });

    it("Should handle very long metadata hash", async function () {
      const { contract, researcher1 } = await loadFixture(deployContractFixture);

      const longHash = "Qm" + "a".repeat(100);
      await contract.connect(researcher1).contributeData(12345, 85, longHash, true);

      const info = await contract.getDatasetInfo(1);
      expect(info[1]).to.equal(longHash);
    });

    it("Should handle very long research topic", async function () {
      const { contract, researcher2 } = await loadFixture(deployContractFixture);

      const longTopic = "Research " + "topic ".repeat(50);
      const deadline = Math.floor(Date.now() / 1000) + 86400;

      await contract.connect(researcher2).requestDataAccess(longTopic, 50000, deadline);

      const info = await contract.getDataRequestInfo(1);
      expect(info[1]).to.equal(longTopic);
    });
  });

  describe("Integration Tests", function () {
    it("Should complete full research data sharing lifecycle", async function () {
      const { contract, owner, researcher1, researcher2 } = await loadFixture(
        deployContractFixture
      );

      // 1. Researcher1 contributes data
      await contract.connect(researcher1).contributeData(12345, 85, "QmLifecycle", false);

      // 2. Researcher2 requests access
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await contract.connect(researcher2).requestDataAccess("Lifecycle Test", 50000, deadline);

      // 3. Researcher1 grants access
      await contract.connect(researcher1).grantDataAccess(1, researcher2.address);

      // 4. Researcher2 accesses data
      const accessInfo = await contract.connect(researcher2).accessDataset(1);
      expect(accessInfo[0]).to.equal("QmLifecycle");

      // 5. Owner updates quality score
      await contract.connect(owner).updateQualityScore(1, 95);

      // 6. Owner distributes reward
      await contract.connect(owner).distributeReward(researcher1.address, 1, 1000);

      // 7. Verify final state
      const stats = await contract.getPlatformStats();
      expect(stats[0]).to.equal(1); // 1 dataset
      expect(stats[1]).to.equal(1); // 1 request

      const rewardCount = await contract.getContributorRewardCount(researcher1.address);
      expect(rewardCount).to.equal(1);
    });
  });
});
