// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool, euint8 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract AnonymousResearchDataSharing is SepoliaConfig {

    address public owner;
    uint32 public nextDatasetId;
    uint32 public nextRequestId;

    struct Dataset {
        address contributor;
        euint32 encryptedDataValue;
        euint8 encryptedQualityScore;
        string metadataHash;
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

    // 贡献匿名研究数据
    function contributeData(
        uint32 _dataValue,
        uint8 _qualityScore,
        string memory _metadataHash,
        bool _isPublic
    ) external {
        require(_qualityScore <= 100, "Quality score must be 0-100");
        require(bytes(_metadataHash).length > 0, "Metadata hash required");

        // 加密数据值和质量分数
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

        // 设置访问控制权限
        FHE.allowThis(encryptedValue);
        FHE.allowThis(encryptedQuality);
        FHE.allow(encryptedValue, msg.sender);
        FHE.allow(encryptedQuality, msg.sender);

        emit DatasetContributed(nextDatasetId, msg.sender, _metadataHash);
        nextDatasetId++;
    }

    // 请求研究数据访问
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

    // 授权数据访问
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

        // 授予加密数据的访问权限
        FHE.allow(dataset.encryptedDataValue, _accessor);
        FHE.allow(dataset.encryptedQualityScore, _accessor);

        emit DatasetAccessed(_datasetId, _accessor);
    }

    // 访问匿名数据集
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

    // 更新数据质量评分（仅限所有者）
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

    // 分发奖励给数据贡献者
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

    // 获取贡献者的数据集数量
    function getContributorDatasetCount(address _contributor)
        external
        view
        returns (uint256)
    {
        return contributorDatasets[_contributor].length;
    }

    // 获取贡献者的数据集ID列表
    function getContributorDatasets(address _contributor)
        external
        view
        returns (uint32[] memory)
    {
        return contributorDatasets[_contributor];
    }

    // 获取贡献者奖励数量
    function getContributorRewardCount(address _contributor)
        external
        view
        returns (uint256)
    {
        return contributions[_contributor].length;
    }

    // 获取数据集基本信息
    function getDatasetInfo(uint32 _datasetId)
        external
        view
        validDataset(_datasetId)
        returns (
            address contributor,
            string memory metadataHash,
            bool isPublic,
            uint256 timestamp,
            uint32 accessCount,
            bool isActive
        )
    {
        Dataset storage dataset = datasets[_datasetId];
        return (
            dataset.contributor,
            dataset.metadataHash,
            dataset.isPublic,
            dataset.timestamp,
            dataset.accessCount,
            dataset.isActive
        );
    }

    // 获取数据请求信息
    function getDataRequestInfo(uint32 _requestId)
        external
        view
        returns (
            address requester,
            string memory researchTopic,
            uint256 deadline,
            bool isFulfilled
        )
    {
        require(_requestId > 0 && _requestId < nextRequestId, "Invalid request ID");
        DataRequest storage request = dataRequests[_requestId];
        return (
            request.requester,
            request.researchTopic,
            request.deadline,
            request.isFulfilled
        );
    }

    // 停用数据集
    function deactivateDataset(uint32 _datasetId)
        external
        validDataset(_datasetId)
    {
        Dataset storage dataset = datasets[_datasetId];
        require(
            msg.sender == dataset.contributor || msg.sender == owner,
            "Not authorized"
        );

        dataset.isActive = false;
    }

    // 获取平台统计信息
    function getPlatformStats()
        external
        view
        returns (
            uint32 totalDatasets,
            uint32 totalRequests,
            uint256 blockTimestamp
        )
    {
        return (
            nextDatasetId - 1,
            nextRequestId - 1,
            block.timestamp
        );
    }
}