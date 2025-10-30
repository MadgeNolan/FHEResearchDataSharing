// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool, euint8 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ResearchDataSharing
 * @notice Privacy-preserving scientific data platform powered by FHEVM
 * @dev Enables secure and anonymous research data collaboration
 */
contract ResearchDataSharing is SepoliaConfig {

    address public owner;
    uint32 public nextDatasetId;
    uint32 public nextRequestId;

    struct Dataset {
        address contributor;
        euint32 encryptedDataValue;      // Encrypted research data
        euint8 encryptedQualityScore;    // Encrypted quality (0-100)
        string metadataHash;              // Public IPFS hash
        bool isPublic;
        uint256 timestamp;
        uint32 accessCount;
        bool isActive;
    }

    struct DataRequest {
        address requester;
        string researchTopic;
        euint32 encryptedBudget;
        uint256 deadline;
        bool isFulfilled;
        uint32[] approvedDatasets;
    }

    struct Contribution {
        uint32 datasetId;
        euint64 encryptedReward;
        bool rewardClaimed;
    }

    mapping(uint32 => Dataset) public datasets;
    mapping(uint32 => DataRequest) public dataRequests;
    mapping(address => uint32[]) public contributorDatasets;
    mapping(address => Contribution[]) public contributions;
    mapping(uint32 => mapping(address => bool)) public datasetAccess;

    event DatasetContributed(uint32 indexed datasetId, address indexed contributor, string metadataHash);
    event DataRequested(uint32 indexed requestId, address indexed requester, string researchTopic);
    event DatasetAccessed(uint32 indexed datasetId, address indexed accessor);
    event RewardDistributed(address indexed contributor, uint32 indexed datasetId);
    event QualityScoreUpdated(uint32 indexed datasetId, uint8 newScore);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier validDataset(uint32 _datasetId) {
        require(_datasetId > 0 && _datasetId < nextDatasetId, "Invalid dataset ID");
        require(datasets[_datasetId].isActive, "Dataset not active");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextDatasetId = 1;
        nextRequestId = 1;
    }

    /**
     * @notice Contribute encrypted research data
     * @param _dataValue Data value to encrypt
     * @param _qualityScore Quality score (0-100)
     * @param _metadataHash IPFS hash of metadata
     * @param _isPublic Whether dataset is publicly accessible
     */
    function contributeData(
        uint32 _dataValue,
        uint8 _qualityScore,
        string memory _metadataHash,
        bool _isPublic
    ) external {
        require(_qualityScore <= 100, "Quality score must be 0-100");
        require(bytes(_metadataHash).length > 0, "Metadata hash required");

        // Encrypt data value and quality score
        euint32 encryptedValue = FHE.asEuint32(_dataValue);
        euint8 encryptedQuality = FHE.asEuint8(_qualityScore);

        datasets[nextDatasetId] = Dataset({
            contributor: msg.sender,
            encryptedDataValue: encryptedValue,
            encryptedQualityScore: encryptedQuality,
            metadataHash: _metadataHash,
            isPublic: _isPublic,
            timestamp: block.timestamp,
            accessCount: 0,
            isActive: true
        });

        contributorDatasets[msg.sender].push(nextDatasetId);

        // Set access control permissions
        FHE.allowThis(encryptedValue);
        FHE.allowThis(encryptedQuality);
        FHE.allow(encryptedValue, msg.sender);
        FHE.allow(encryptedQuality, msg.sender);

        emit DatasetContributed(nextDatasetId, msg.sender, _metadataHash);
        nextDatasetId++;
    }

    /**
     * @notice Request access to research data
     * @param _researchTopic Topic of research
     * @param _budget Research budget
     * @param _deadline Request deadline
     */
    function requestDataAccess(
        string memory _researchTopic,
        uint32 _budget,
        uint256 _deadline
    ) external {
        require(bytes(_researchTopic).length > 0, "Research topic required");
        require(_deadline > block.timestamp, "Deadline must be in future");

        euint32 encryptedBudget = FHE.asEuint32(_budget);

        dataRequests[nextRequestId] = DataRequest({
            requester: msg.sender,
            researchTopic: _researchTopic,
            encryptedBudget: encryptedBudget,
            deadline: _deadline,
            isFulfilled: false,
            approvedDatasets: new uint32[](0)
        });

        FHE.allowThis(encryptedBudget);
        FHE.allow(encryptedBudget, msg.sender);

        emit DataRequested(nextRequestId, msg.sender, _researchTopic);
        nextRequestId++;
    }

    /**
     * @notice Grant data access permission
     * @param _datasetId Dataset ID
     * @param _accessor Address to grant access to
     */
    function grantDataAccess(uint32 _datasetId, address _accessor)
        external
        validDataset(_datasetId)
    {
        Dataset storage dataset = datasets[_datasetId];
        require(
            msg.sender == dataset.contributor || msg.sender == owner,
            "Not authorized to grant access"
        );

        datasetAccess[_datasetId][_accessor] = true;
        dataset.accessCount++;

        // Grant FHE decryption permissions
        FHE.allow(dataset.encryptedDataValue, _accessor);
        FHE.allow(dataset.encryptedQualityScore, _accessor);

        emit DatasetAccessed(_datasetId, _accessor);
    }

    /**
     * @notice Access dataset metadata
     * @param _datasetId Dataset ID
     * @return metadataHash IPFS metadata hash
     * @return timestamp Creation timestamp
     * @return accessCount Number of accesses
     */
    function accessDataset(uint32 _datasetId)
        external
        view
        validDataset(_datasetId)
        returns (string memory metadataHash, uint256 timestamp, uint32 accessCount)
    {
        Dataset storage dataset = datasets[_datasetId];
        require(
            dataset.isPublic ||
            datasetAccess[_datasetId][msg.sender] ||
            msg.sender == dataset.contributor,
            "Access denied"
        );

        return (dataset.metadataHash, dataset.timestamp, dataset.accessCount);
    }

    /**
     * @notice Update quality score (owner only)
     * @param _datasetId Dataset ID
     * @param _newScore New quality score
     */
    function updateQualityScore(uint32 _datasetId, uint8 _newScore)
        external
        onlyOwner
        validDataset(_datasetId)
    {
        require(_newScore <= 100, "Score must be 0-100");

        euint8 encryptedNewScore = FHE.asEuint8(_newScore);
        datasets[_datasetId].encryptedQualityScore = encryptedNewScore;

        FHE.allowThis(encryptedNewScore);

        emit QualityScoreUpdated(_datasetId, _newScore);
    }

    /**
     * @notice Distribute reward to contributor
     * @param _contributor Contributor address
     * @param _datasetId Dataset ID
     * @param _rewardAmount Reward amount
     */
    function distributeReward(address _contributor, uint32 _datasetId, uint64 _rewardAmount)
        external
        onlyOwner
        validDataset(_datasetId)
    {
        require(datasets[_datasetId].contributor == _contributor, "Invalid contributor");

        euint64 encryptedReward = FHE.asEuint64(_rewardAmount);

        contributions[_contributor].push(Contribution({
            datasetId: _datasetId,
            encryptedReward: encryptedReward,
            rewardClaimed: false
        }));

        FHE.allowThis(encryptedReward);
        FHE.allow(encryptedReward, _contributor);

        emit RewardDistributed(_contributor, _datasetId);
    }

    /**
     * @notice Deactivate a dataset
     * @param _datasetId Dataset ID
     */
    function deactivateDataset(uint32 _datasetId)
        external
        validDataset(_datasetId)
    {
        require(
            msg.sender == datasets[_datasetId].contributor || msg.sender == owner,
            "Not authorized"
        );
        datasets[_datasetId].isActive = false;
    }

    /**
     * @notice Get platform statistics
     * @return totalDatasets Total number of datasets
     * @return totalRequests Total number of requests
     */
    function getPlatformStats()
        external
        view
        returns (uint32 totalDatasets, uint32 totalRequests)
    {
        return (nextDatasetId - 1, nextRequestId - 1);
    }
}
