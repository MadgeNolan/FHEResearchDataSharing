# Deployment Guide

Complete guide for deploying and managing the Anonymous Research Data Sharing platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Compilation](#compilation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Verification](#verification)
- [Interaction](#interaction)
- [Network Information](#network-information)

## Prerequisites

### Required Software

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **MetaMask** or compatible Web3 wallet

### Required Accounts

1. **Infura Account** (or Alchemy)
   - Sign up at [infura.io](https://infura.io)
   - Create a new project
   - Get your API key

2. **Etherscan Account**
   - Sign up at [etherscan.io](https://etherscan.io)
   - Create an API key at [etherscan.io/myapikey](https://etherscan.io/myapikey)

3. **Sepolia Testnet ETH**
   - Get test ETH from:
     - [Sepolia Faucet](https://sepoliafaucet.com/)
     - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
     - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

## Installation

### 1. Clone and Setup

```bash
# Navigate to project directory
cd anonymous-research-data-sharing

# Install dependencies
npm install
```

### 2. Install Hardhat

```bash
# Hardhat is already included in package.json
# If you need to reinstall:
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

## Configuration

### 1. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your details
nano .env  # or use your preferred editor
```

### 2. Configure Environment Variables

Edit `.env` with your actual values:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_ACTUAL_INFURA_PROJECT_ID

# Private Key (from MetaMask)
# IMPORTANT: Never commit this file with real keys!
PRIVATE_KEY=your_actual_private_key_without_0x_prefix

# Etherscan API Key
ETHERSCAN_API_KEY=your_actual_etherscan_api_key

# Optional: Enable gas reporting
REPORT_GAS=true
```

### 3. Getting Your Private Key from MetaMask

1. Open MetaMask extension
2. Click on account menu (three dots)
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key (without the 0x prefix)

⚠️ **SECURITY WARNING**: Never share your private key or commit it to version control!

## Compilation

### Compile Smart Contracts

```bash
# Compile all contracts
npm run compile

# Or using Hardhat directly
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### Clean and Recompile

```bash
# Clean artifacts and cache
npm run clean

# Then recompile
npm run compile
```

## Testing

### Run All Tests

```bash
# Run test suite
npm test

# Or using Hardhat
npx hardhat test
```

### Run Specific Tests

```bash
# Run specific test file
npx hardhat test test/AnonymousResearchDataSharing.test.js

# Run with gas reporting
REPORT_GAS=true npm test
```

### Generate Coverage Report

```bash
# Run tests with coverage
npm run test:coverage
```

### Expected Test Results

All tests should pass:
```
  AnonymousResearchDataSharing
    Deployment
      ✓ Should set the correct owner
      ✓ Should initialize with correct starting values
    Data Contribution
      ✓ Should allow researchers to contribute data
      ✓ Should reject quality score above 100
    ...
  XX passing
```

## Deployment

### 1. Local Deployment (Development)

```bash
# Terminal 1: Start local Hardhat network
npm run node

# Terminal 2: Deploy to local network
npm run deploy:local
```

### 2. Sepolia Testnet Deployment

```bash
# Ensure your .env is configured correctly
# Check your balance first
npx hardhat run scripts/check-balance.js --network sepolia

# Deploy to Sepolia
npm run deploy

# Or with explicit network
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Deployment Output

The deployment script will:
- Deploy the contract
- Display the contract address
- Save deployment info to `deployments/` directory
- Show transaction details

Example output:
```
Starting deployment process...
----------------------------------------
Deploying contracts with account: 0x1234...
Account balance: 0.5 ETH
----------------------------------------
Deploying AnonymousResearchDataSharing contract...
✓ Contract deployed successfully!
Contract address: 0xABCD...
----------------------------------------
Transaction hash: 0x5678...
Block number: 1234567
----------------------------------------
Explorer: https://sepolia.etherscan.io/address/0xABCD...
```

### 4. Save Contract Address

```bash
# Add to your .env file
echo "CONTRACT_ADDRESS=0xYourContractAddress" >> .env
```

## Verification

### Verify on Etherscan

```bash
# Automatic verification using saved deployment
npm run verify

# Or specify contract address
CONTRACT_ADDRESS=0xYourContractAddress npm run verify

# Or using Hardhat directly
npx hardhat verify --network sepolia 0xYourContractAddress
```

### Verification Success

When successful, you'll see:
```
✓ Contract verified successfully!
View on Etherscan: https://sepolia.etherscan.io/address/0x...
```

The contract source code will now be viewable on Etherscan.

## Interaction

### Using the Interaction Script

The `interact.js` script provides various actions:

```bash
# View platform statistics (default)
ACTION=1 npm run interact

# Contribute a dataset
ACTION=2 DATA_VALUE=12345 QUALITY_SCORE=85 METADATA_HASH=QmHash IS_PUBLIC=true npm run interact

# Request data access
ACTION=3 RESEARCH_TOPIC="Medical Research" BUDGET=50000 DEADLINE=1735689600 npm run interact

# Grant data access
ACTION=4 DATASET_ID=1 ACCESSOR_ADDRESS=0x... npm run interact

# View dataset information
ACTION=5 DATASET_ID=1 npm run interact

# View contributor datasets
ACTION=6 CONTRIBUTOR_ADDRESS=0x... npm run interact

# Update quality score (owner only)
ACTION=8 DATASET_ID=1 NEW_SCORE=90 npm run interact

# Distribute reward (owner only)
ACTION=9 CONTRIBUTOR_ADDRESS=0x... DATASET_ID=1 REWARD_AMOUNT=1000 npm run interact

# Deactivate dataset
ACTION=10 DATASET_ID=1 npm run interact
```

### Using the Simulation Script

Run a complete platform simulation:

```bash
# Run full simulation
npm run simulate

# Or with explicit network
npx hardhat run scripts/simulate.js --network sepolia
```

The simulation will:
- Contribute multiple datasets from different researchers
- Submit data access requests
- Grant permissions
- Update quality scores
- Distribute rewards
- Generate a report in `reports/` directory

### Direct Contract Interaction

```bash
# Start Hardhat console
npx hardhat console --network sepolia

# In the console:
const Contract = await ethers.getContractAt("AnonymousResearchDataSharing", "0xYourAddress");
const stats = await Contract.getPlatformStats();
console.log("Total datasets:", stats[0].toString());
```

## Network Information

### Sepolia Testnet

- **Network Name**: Sepolia Test Network
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **Block Explorer**: https://sepolia.etherscan.io/
- **Currency Symbol**: ETH
- **Faucets**:
  - https://sepoliafaucet.com/
  - https://www.infura.io/faucet/sepolia

### Adding Sepolia to MetaMask

1. Open MetaMask
2. Click on network dropdown
3. Select "Add Network"
4. Enter Sepolia details:
   - Network Name: Sepolia Test Network
   - RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io/

## Deployed Contract Information

### Current Deployment

- **Network**: Sepolia Testnet
- **Contract Address**: `0x13782134cE8cA22C432bb636B401884806799AD2`
- **Etherscan**: [View on Etherscan](https://sepolia.etherscan.io/address/0x13782134cE8cA22C432bb636B401884806799AD2)

### Contract Functions

#### Public Functions

```solidity
// Contribute encrypted research data
contributeData(uint32 _dataValue, uint8 _qualityScore, string _metadataHash, bool _isPublic)

// Request access to datasets
requestDataAccess(string _researchTopic, uint32 _budget, uint256 _deadline)

// Grant access to specific researchers
grantDataAccess(uint32 _datasetId, address _accessor)

// Retrieve dataset information (view)
getDatasetInfo(uint32 _datasetId) returns (address, string, bool, uint256, uint32, bool)

// Get platform statistics (view)
getPlatformStats() returns (uint32, uint32, uint256)
```

#### Owner-Only Functions

```solidity
// Update dataset quality score
updateQualityScore(uint32 _datasetId, uint8 _newScore)

// Distribute rewards to contributors
distributeReward(address _contributor, uint32 _datasetId, uint64 _rewardAmount)
```

## Troubleshooting

### Common Issues

#### 1. Compilation Errors

```bash
# Clean and rebuild
npm run clean
npm run compile
```

#### 2. Insufficient Funds

```
Error: insufficient funds for intrinsic transaction cost
```

**Solution**: Get more Sepolia ETH from a faucet.

#### 3. Nonce Issues

```
Error: nonce too low
```

**Solution**: Reset your MetaMask account or wait for pending transactions.

#### 4. RPC Connection Issues

```
Error: could not detect network
```

**Solution**:
- Check your `SEPOLIA_RPC_URL` in `.env`
- Try alternative RPC provider
- Check internet connection

#### 5. Verification Fails

```
Error: Already Verified
```

**Solution**: Contract is already verified, no action needed.

### Getting Help

1. Check the error message carefully
2. Review your `.env` configuration
3. Ensure you have sufficient Sepolia ETH
4. Check Sepolia network status
5. Review deployment logs in `deployments/` directory

## Security Best Practices

### Private Key Security

- ✅ **DO**: Store private keys in `.env` (which is gitignored)
- ✅ **DO**: Use environment variables for sensitive data
- ✅ **DO**: Use different keys for testnet and mainnet
- ❌ **DON'T**: Commit `.env` to version control
- ❌ **DON'T**: Share your private keys
- ❌ **DON'T**: Use mainnet keys on testnet

### Smart Contract Security

- Always test thoroughly on testnet first
- Get professional audit before mainnet deployment
- Use multi-sig wallets for contract ownership
- Implement emergency pause functionality
- Monitor contract activity regularly

## Production Deployment

### Before Mainnet Deployment

1. ✅ Complete comprehensive testing on testnet
2. ✅ Get professional security audit
3. ✅ Prepare deployment plan and rollback strategy
4. ✅ Set up monitoring and alerting
5. ✅ Prepare user documentation
6. ✅ Calculate gas costs and budget
7. ✅ Test with small amounts first

### Mainnet Deployment Checklist

- [ ] Security audit completed
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Backup and recovery plan
- [ ] Sufficient ETH for deployment
- [ ] Team trained on operations
- [ ] Monitoring configured
- [ ] Emergency contacts listed

## Additional Resources

### Documentation

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [Solidity Documentation](https://docs.soliditylang.org/)

### Tools

- [Hardhat](https://hardhat.org/) - Development environment
- [Etherscan](https://etherscan.io/) - Block explorer
- [MetaMask](https://metamask.io/) - Web3 wallet
- [Remix](https://remix.ethereum.org/) - Online IDE

### Support

- GitHub Issues: [Project Repository](https://github.com/your-repo)
- Ethereum Stack Exchange: [ethereum.stackexchange.com](https://ethereum.stackexchange.com/)
- Hardhat Discord: [hardhat.org/discord](https://hardhat.org/discord)

---

**Last Updated**: January 2025

**Version**: 1.0.0

For questions or issues, please open a GitHub issue or contact the development team.
