# Anonymous Research Data Sharing Platform

A privacy-preserving scientific data platform powered by Zama's Fully Homomorphic Encryption (FHE) technology, enabling secure and anonymous research data collaboration.

## 🔬 Overview

The Anonymous Research Data Sharing Platform revolutionizes how researchers share and access sensitive scientific data. By leveraging FHE technology, the platform ensures that data remains encrypted during computation, allowing researchers to collaborate without compromising data privacy or revealing sensitive information.

## 🌟 Core Concepts

### Fully Homomorphic Encryption (FHE)

FHE is a cryptographic technique that allows computations to be performed directly on encrypted data without decrypting it first. This means:

- **Data Privacy**: Research data stays encrypted at all times
- **Secure Computation**: Operations can be performed on encrypted values
- **Zero Knowledge**: No party needs to see the raw data to work with it
- **Trustless Environment**: Mathematical guarantees instead of trust assumptions

### Privacy-Preserving Scientific Data Platform

Our platform implements FHE to enable:

- **Anonymous Data Contribution**: Researchers can share datasets without revealing sensitive information
- **Encrypted Quality Metrics**: Data quality scores are stored and compared in encrypted form
- **Confidential Access Requests**: Research budgets and requirements remain private
- **Verifiable Access Control**: Smart contract-based permission management

## 🏗️ Smart Contract Architecture

The platform utilizes FHE-enabled smart contracts deployed on Sepolia testnet:

**Contract Address**: `0x13782134cE8cA22C432bb636B401884806799AD2`

### Key Features

- **Encrypted Data Storage**: All sensitive values (data, quality scores, budgets) are stored as encrypted uint32 values
- **Access Control**: Dataset owners can grant or revoke access permissions
- **Metadata Management**: IPFS integration for decentralized metadata storage
- **Usage Analytics**: Track dataset access patterns while maintaining privacy

## 🎥 Demo

Experience the platform in action:

**Live Demo**: [https://anonymous-research-data-sharing.vercel.app/](https://anonymous-research-data-sharing.vercel.app/)

**Demo Video**: AnonymousResearchDataSharing.mp4

## 🚀 Quick Start

### Prerequisites

- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection
2. **Switch Network**: Ensure you're on Sepolia testnet
3. **Contribute Data**:
   - Enter encrypted data value (uint32)
   - Set quality score (0-100)
   - Provide IPFS metadata hash
   - Choose access permissions (public/private)
4. **Request Data Access**:
   - Describe research topic
   - Submit encrypted budget
   - Set deadline for data access

## 🔐 Privacy Features

### Encrypted Data Types

- **euint32**: Encrypted 32-bit unsigned integers for data values
- **euint8**: Encrypted 8-bit values for quality scores
- **Private Budgets**: Research funding amounts kept confidential

### Access Control

- Dataset owners maintain full control over access permissions
- Smart contract enforces access rules automatically
- Transparent audit trail without revealing sensitive data

## 🛠️ Technology Stack

- **FHE Library**: Zama fhEVM for encrypted smart contracts
- **Blockchain**: Ethereum Sepolia Testnet
- **Frontend**: Vanilla JavaScript with ethers.js
- **Storage**: IPFS for decentralized metadata
- **Smart Contracts**: Solidity with FHE extensions

## 📊 Platform Statistics

The platform tracks:
- Total datasets contributed
- Data access requests submitted
- Active contributors in the ecosystem
- Dataset access patterns (privacy-preserved)

## 🤝 Use Cases

### Medical Research
Share patient data without revealing individual health information

### Clinical Trials
Collaborate on trial results while maintaining participant privacy

### Genomic Studies
Analyze genetic data without exposing sensitive genetic markers

### Drug Discovery
Pool research data from multiple institutions securely

### Environmental Studies
Aggregate sensor data while protecting proprietary methods

## 🔗 Links

- **GitHub Repository**: [https://github.com/MadgeNolan/AnonymousResearchDataSharing](https://github.com/MadgeNolan/AnonymousResearchDataSharing)
- **Live Application**: [https://anonymous-research-data-sharing.vercel.app/](https://anonymous-research-data-sharing.vercel.app/)
- **Zama Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Sepolia Testnet**: [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)

## 📝 Smart Contract Functions

### Core Functions

```solidity
// Contribute encrypted research data
function contributeData(
    uint32 _dataValue,
    uint8 _qualityScore,
    string memory _metadataHash,
    bool _isPublic
) external

// Request access to datasets
function requestDataAccess(
    string memory _researchTopic,
    uint32 _budget,
    uint256 _deadline
) external

// Grant access to specific researchers
function grantDataAccess(
    uint32 _datasetId,
    address _accessor
) external

// Retrieve dataset information
function getDatasetInfo(uint32 _datasetId)
    external view returns (...)
```

## 🌐 Network Information

- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/
- **Explorer**: https://sepolia.etherscan.io/

## 🔮 Future Roadmap

- [ ] Multi-party computation integration
- [ ] Advanced FHE operations (comparison, sorting)
- [ ] Cross-chain data sharing
- [ ] AI model training on encrypted data
- [ ] Decentralized identity integration
- [ ] Enhanced metadata privacy

## 🙏 Acknowledgments

Built with [Zama's fhEVM](https://www.zama.ai/fhevm) - making blockchain privacy-preserving by default.

---

**Note**: This is a testnet deployment for demonstration purposes. Do not use with real sensitive data without proper security audits.
