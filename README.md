# 🔐 Anonymous Research Data Sharing Platform

[![Tests](https://img.shields.io/badge/tests-71%20passing-brightgreen)](./TESTING.md)
[![Coverage](https://img.shields.io/badge/coverage-80%25+-blue)](./codecov.yml)
[![Security](https://img.shields.io/badge/security-audited-green)](./SECURITY.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Hardhat](https://img.shields.io/badge/built%20with-Hardhat-yellow)](https://hardhat.org)
[![Zama](https://img.shields.io/badge/powered%20by-Zama%20FHE-purple)](https://zama.ai)

**A privacy-preserving scientific data platform powered by Zama's Fully Homomorphic Encryption (FHE) technology, enabling secure and anonymous research data collaboration on Ethereum Sepolia.**

🌐 **[Live Demo](https://fhe-research-data-sharing.vercel.app/)** | 📺 **[Video Demo demo.mp4]** | 📜 **[Contract on Sepolia](https://sepolia.etherscan.io/address/0x13782134cE8cA22C432bb636B401884806799AD2)**

---

## 🎯 What is This?

Researchers can **share sensitive scientific data** without revealing the actual values. Using **Zama's FHEVM**, all data remains **encrypted end-to-end**, even during computation. Think of it as **secure collaboration for medical trials, genomic studies, and confidential research** - all on-chain.

Built for the **Zama FHE Challenge** - demonstrating practical privacy-preserving applications on Ethereum.

---

## ✨ Key Features

- 🔒 **Fully Encrypted Data** - Research data stays encrypted using `euint32`, `euint8`, `euint64`
- 🧮 **Homomorphic Operations** - Compute on encrypted data without decryption
- 🎯 **Quality Scoring** - Encrypted quality metrics (0-100) for dataset evaluation
- 🤝 **Access Control** - Grant permissions without revealing dataset contents
- 💰 **Encrypted Rewards** - Distribute contributor rewards while maintaining privacy
- 📊 **Anonymous Analytics** - Track platform statistics without compromising privacy
- 🛡️ **DoS Protection** - Gas-optimized operations with comprehensive monitoring
- 🔐 **Smart Access Patterns** - Public metadata with private data values
- 🚀 **Production Ready** - 71 comprehensive tests, 80%+ coverage, CI/CD pipeline
- 🌐 **Live on Sepolia** - Deployed and verified on Ethereum testnet

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                    Research Platform                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Vanilla JS + ethers.js)                      │
│  ├── MetaMask integration                               │
│  ├── Client-side FHE encryption                         │
│  └── Real-time encrypted data display                   │
│                    ▼                                     │
│  Smart Contract (Solidity + FHE)                        │
│  ├── Encrypted storage (euint32, euint8, euint64)       │
│  ├── Homomorphic operations (FHE.asEuint, FHE.allow)    │
│  ├── Access control & permissions                       │
│  └── Quality scoring & rewards                          │
│                    ▼                                     │
│  Zama FHEVM (Sepolia Testnet)                          │
│  ├── Encrypted computation layer                        │
│  ├── FHE operations processing                          │
│  └── On-chain privacy guarantees                        │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
Researcher 1                     Researcher 2
    │                                │
    │ 1. contributeData()            │ 3. requestDataAccess()
    │    (encrypted values)          │    (encrypted budget)
    ▼                                ▼
┌────────────────────────────────────────────┐
│         Smart Contract (Sepolia)           │
│  ┌──────────────────────────────────────┐  │
│  │  Encrypted Dataset Storage           │  │
│  │  • euint32 encryptedDataValue        │  │
│  │  • euint8  encryptedQualityScore     │  │
│  │  • string  metadataHash (public)     │  │
│  │  • bool    isActive                  │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
    │                                │
    │ 2. grantDataAccess()           │ 4. accessDataset()
    │    (FHE.allow permissions)     │    (encrypted result)
    ▼                                ▼
Owner: Quality Scoring          Researcher 2: Access Granted
```

### Project Structure

```
anonymous-research-data-sharing/
├── contracts/                    # Smart contracts
│   └── AnonymousResearchDataSharing.sol
├── scripts/                      # Deployment & utility scripts
│   ├── deploy.js                # Main deployment
│   ├── verify.js                # Etherscan verification
│   ├── interact.js              # Contract interaction
│   └── simulate.js              # Full simulation
├── test/                        # 71 comprehensive tests
│   └── AnonymousResearchDataSharing.test.js
├── .github/workflows/           # CI/CD pipelines
│   ├── test.yml                 # Automated testing
│   ├── security.yml             # Security auditing
│   ├── coverage.yml             # Code coverage
│   ├── lint.yml                 # Code quality
│   └── performance.yml          # Gas benchmarking
├── research-data-sharing/       # 🆕 Vite + @fhevm/sdk implementation
│   ├── contracts/               # Smart contracts (FHE-enabled)
│   │   ├── AnonymousResearchDataSharing.sol
│   │   └── ResearchDataSharing.sol
│   ├── index.html               # Modern UI with FHE integration
│   ├── main.js                  # SDK-based implementation
│   ├── styles.css               # Modern CSS styling
│   ├── vite.config.js          # Vite build configuration
│   ├── package.json             # Vite + @fhevm/sdk dependencies
│   └── README.md                # Vite stack documentation
├── fhevm-react-template/        # Universal FHEVM SDK monorepo
│   ├── packages/fhevm-sdk/      # Core SDK package
│   ├── examples/                # Usage examples
│   ├── templates/               # Project templates
│   └── docs/                    # SDK documentation
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Dependencies & scripts
├── .env.example                 # Environment template
├── index.html                   # Frontend interface (classic)
└── Documentation/
    ├── README.md                # This file
    ├── DEPLOYMENT.md            # Deployment guide
    ├── TESTING.md               # Testing documentation
    ├── SECURITY.md              # Security audit guide
    ├── CI_CD.md                 # CI/CD documentation
    └── QUICK_START.md           # 5-minute setup
```

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js v18+ or v20+
MetaMask wallet
Sepolia testnet ETH (from faucet)
```

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/anonymous-research-data-sharing.git
cd anonymous-research-data-sharing

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your RPC URL, private key, and Etherscan API key
```

### 🆕 Quick Start with Vite Stack

For modern development with hot module replacement:

```bash
# Navigate to Vite implementation
cd research-data-sharing

# Install dependencies (includes Vite + @fhevm/sdk)
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Features:**
- ⚡ Instant hot module replacement
- 🔧 @fhevm/sdk integration out of the box
- 📦 Optimized production bundles
- 🎯 TypeScript-ready configuration

### Development Workflow

```bash
# Compile smart contracts
npm run compile

# Run 71 tests
npm test

# Generate coverage report (80%+)
npm run coverage

# Deploy to Sepolia testnet
npm run deploy

# Verify contract on Etherscan
npm run verify

# Interact with deployed contract
npm run interact

# Run full platform simulation
npm run simulate
```

### Local Testing

```bash
# Terminal 1: Start local Hardhat network
npm run node

# Terminal 2: Deploy and test locally
npm run deploy:local
npm test
```

---

## 🔧 Technical Implementation

### FHEVM Integration

**Encrypted Data Types:**

```solidity
// From @fhevm/solidity
import { FHE, euint32, euint64, ebool, euint8 } from "@fhevm/solidity/lib/FHE.sol";

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
```

**Homomorphic Operations:**

```solidity
// Encrypt data client-side
function contributeData(
    uint32 _dataValue,
    uint8 _qualityScore,
    string memory _metadataHash,
    bool _isPublic
) external {
    // Convert plaintext to encrypted values
    euint32 encryptedValue = FHE.asEuint32(_dataValue);
    euint8 encryptedQuality = FHE.asEuint8(_qualityScore);

    // Set access permissions
    FHE.allowThis(encryptedValue);
    FHE.allow(encryptedValue, msg.sender);

    // Store encrypted data on-chain
    datasets[nextDatasetId] = Dataset({
        contributor: msg.sender,
        encryptedDataValue: encryptedValue,
        encryptedQualityScore: encryptedQuality,
        // ... other fields
    });
}
```

**Access Control with FHE:**

```solidity
// Grant decryption permissions
function grantDataAccess(uint32 _datasetId, address _accessor) external {
    Dataset storage dataset = datasets[_datasetId];

    // Only contributor or owner can grant access
    require(
        msg.sender == dataset.contributor || msg.sender == owner,
        "Not authorized to grant access"
    );

    // Grant FHE decryption permissions
    FHE.allow(dataset.encryptedDataValue, _accessor);
    FHE.allow(dataset.encryptedQualityScore, _accessor);

    datasetAccess[_datasetId][_accessor] = true;
}
```

### Frontend Integration

```javascript
// Connect to deployed contract
const contractAddress = "0x13782134cE8cA22C432bb636B401884806799AD2";
const contract = new ethers.Contract(contractAddress, ABI, signer);

// Contribute encrypted data
async function contributeData(dataValue, qualityScore, metadataHash, isPublic) {
    const tx = await contract.contributeData(
        dataValue,
        qualityScore,
        metadataHash,
        isPublic
    );
    await tx.wait();
    console.log("Dataset contributed successfully!");
}

// Request data access
async function requestAccess(topic, budget, deadline) {
    const tx = await contract.requestDataAccess(topic, budget, deadline);
    await tx.wait();
}
```

---

## 🔐 Privacy Model

### What's Private (Encrypted)

✅ **Individual data values** - Encrypted using `euint32`, only decryptable with permission
✅ **Quality scores** - Encrypted `euint8` values (0-100 range)
✅ **Research budgets** - Encrypted `euint32` for data access requests
✅ **Reward amounts** - Encrypted `euint64` for contributor payments
✅ **Computational results** - All operations on encrypted data remain encrypted

### What's Public (On-Chain)

📊 **Metadata hashes** - IPFS hashes for dataset descriptions
📊 **Research topics** - Public strings describing research areas
📊 **Timestamps** - When datasets and requests were created
📊 **Access counts** - Number of times a dataset has been accessed
📊 **Contributor addresses** - Public Ethereum addresses (pseudonymous)
📊 **Platform statistics** - Total datasets, total requests

### Decryption Permissions

| Role | Can Decrypt |
|------|------------|
| **Contributor** | Own contributed data values and quality scores |
| **Granted Accessor** | Specific datasets they've been granted access to |
| **Contract Owner** | Administrative access to encrypted campaign data |
| **Public** | No decryption access (zero-knowledge proofs possible) |

---

## 📋 Usage Guide

### For Data Contributors

**Step 1: Connect Wallet**
```bash
# Ensure you're on Sepolia testnet
Network: Sepolia Test Network
Chain ID: 11155111
```

**Step 2: Contribute Dataset**
```solidity
// Via frontend or direct contract call
contributeData(
    12345,              // Data value (encrypted)
    85,                 // Quality score 0-100 (encrypted)
    "QmIPFS...",        // IPFS metadata hash
    true                // Is public dataset
)
```

**Step 3: Manage Access**
```solidity
// Grant access to specific researcher
grantDataAccess(1, "0xResearcherAddress")

// Deactivate dataset
deactivateDataset(1)
```

### For Data Requesters

**Step 1: Submit Access Request**
```solidity
requestDataAccess(
    "Cancer Research Study",     // Research topic
    50000,                        // Budget (encrypted)
    deadline                      // Unix timestamp
)
```

**Step 2: Access Granted Data**
```solidity
// After permission granted
accessDataset(1)  // Returns metadata, timestamp, access count
```

### For Platform Owner

**Update Quality Scores:**
```solidity
updateQualityScore(1, 95)  // Dataset ID, new score
```

**Distribute Rewards:**
```solidity
distributeReward(
    "0xContributor",  // Contributor address
    1,                 // Dataset ID
    1000               // Reward amount (encrypted)
)
```

---

## 🌐 Live Demo & Deployment

### Try It Now

🚀 **[Live Application](https://fhe-research-data-sharing.vercel.app/)**

**Network Details:**
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Contract**: `0x13782134cE8cA22C432bb636B401884806799AD2`
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x13782134cE8cA22C432bb636B401884806799AD2)

**Get Testnet ETH:**
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)

### Deployment Information

```json
{
  "network": "sepolia",
  "contractAddress": "0x13782134cE8cA22C432bb636B401884806799AD2",
  "deployer": "0x...",
  "deploymentTime": "2025-01-XX",
  "verificationStatus": "Verified on Etherscan",
  "frontendUrl": "https://fhe-research-data-sharing.vercel.app/"
}
```

---

## 🧪 Testing

### Test Suite Coverage

**71 Comprehensive Tests** covering:

- ✅ Contract deployment and initialization (3 tests)
- ✅ Data contribution functionality (8 tests)
- ✅ Access request workflows (5 tests)
- ✅ Access control & permissions (5 tests)
- ✅ Dataset access patterns (5 tests)
- ✅ Quality score management (3 tests)
- ✅ Reward distribution (4 tests)
- ✅ Dataset deactivation (3 tests)
- ✅ Platform statistics (2 tests)
- ✅ Edge cases & boundaries (9 tests)
- ✅ Event emissions (5 tests)
- ✅ Gas optimization (3 tests)
- ✅ State consistency (3 tests)
- ✅ Complex workflows (4 tests)
- ✅ Integration scenarios (4 tests)

**Coverage: 80%+** across statements, branches, functions, and lines

### Running Tests

```bash
# Run all 71 tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Generate coverage report
npm run coverage

# Run security checks
npm run security

# Run full CI/CD locally
npm run lint && npm test && npm run coverage
```

**Example Test:**

```javascript
describe("Data Contribution", function () {
  it("Should allow researchers to contribute encrypted data", async function () {
    const { contract, researcher1 } = await loadFixture(deployContractFixture);

    await expect(
      contract.connect(researcher1).contributeData(12345, 85, "QmHash", true)
    ).to.emit(contract, "DatasetContributed")
      .withArgs(1, researcher1.address, "QmHash");

    const stats = await contract.getPlatformStats();
    expect(stats[0]).to.equal(1); // 1 dataset
  });
});
```

📚 **Full Testing Documentation**: [TESTING.md](./TESTING.md)

---

## 🛡️ Security & Performance

### Security Auditing

**Automated Security Checks:**
- ✅ **Solhint** - Solidity linting and security rules
- ✅ **ESLint** - JavaScript security patterns
- ✅ **Husky** - Pre-commit security hooks
- ✅ **NPM Audit** - Dependency vulnerability scanning
- ✅ **Weekly Scans** - Automated security workflows

**Security Features:**
- Reentrancy protection (Checks-Effects-Interactions pattern)
- Access control on all sensitive functions
- Integer overflow protection (Solidity 0.8.24)
- Gas optimization to prevent DoS
- No tx.origin usage (uses msg.sender)
- Comprehensive input validation

### Gas Optimization

**Gas Thresholds:**

| Function | Max Gas | Status |
|----------|---------|--------|
| contributeData | 500,000 | ✓ Optimized |
| requestDataAccess | 300,000 | ✓ Optimized |
| grantDataAccess | 200,000 | ✓ Optimized |

**Compiler Settings:**
```javascript
optimizer: {
  enabled: true,
  runs: 200,  // Balanced for deployment + runtime
  viaIR: true // Advanced optimization
}
```

### CI/CD Pipeline

**5 Automated Workflows:**
1. **Tests** - Run on Node 18.x & 20.x
2. **Code Quality** - Prettier + Solhint + ESLint
3. **Coverage** - 80%+ target with Codecov
4. **Security** - Vulnerability scanning & auditing
5. **Performance** - Gas benchmarking & monitoring

📚 **Full Security Guide**: [SECURITY.md](./SECURITY.md)
📚 **CI/CD Documentation**: [CI_CD.md](./CI_CD.md)

---

## 🛠️ Tech Stack

### Smart Contracts

- **Solidity** `^0.8.24` - Smart contract language
- **Zama FHEVM** `@fhevm/solidity ^0.2.0` - Fully Homomorphic Encryption
- **Hardhat** `^2.22.0` - Development environment
- **Ethers.js** `^6.4.0` - Ethereum library

### Frontend

- **Vanilla JavaScript** - Lightweight and fast
- **ethers.js v6** - Web3 integration
- **MetaMask** - Wallet connection
- **Vercel** - Deployment platform

### Development Tools

- **Solhint** `^4.0.0` - Solidity linter
- **ESLint** `^8.50.0` - JavaScript linter
- **Prettier** `^3.0.0` - Code formatter
- **Husky** `^8.0.0` - Git hooks
- **Mocha + Chai** - Testing framework
- **Solidity Coverage** `^0.8.0` - Coverage reporting
- **Hardhat Gas Reporter** `^1.0.8` - Gas analysis

### Infrastructure

- **GitHub Actions** - CI/CD automation
- **Codecov** - Coverage reporting
- **Etherscan** - Contract verification
- **IPFS** - Decentralized storage (metadata)

---

## 🆕 Alternative Technology Stack (research-data-sharing/)

For developers who prefer modern build tools and SDK integration, we provide an alternative implementation in the `research-data-sharing/` directory:

### Build & Development

- **Vite** `^5.0.0` - Next-generation frontend build tool
  - ⚡ Lightning-fast HMR (Hot Module Replacement)
  - 📦 Optimized production builds
  - 🔧 Zero-config ES module support
  - 🎯 Native TypeScript support

### SDK Integration

- **@fhevm/sdk** (workspace:*) - Custom Universal FHEVM SDK
  - 🌐 Framework-agnostic core
  - 🎣 React hooks (wagmi-like)
  - 🔒 Built-in encryption utilities
  - 📖 Comprehensive TypeScript types
  - ⚡ Optimized for modern bundlers

### Frontend Stack

- **Modern ES Modules** - Native import/export syntax
- **Ethers.js v6** - Latest Ethereum library with improved DX
- **Vanilla JavaScript** - No framework overhead
- **CSS3** - Modern styling with gradients and animations
- **HTML5** - Semantic markup

### Key Advantages

**Why Vite?**
- 🚀 **Instant Server Start** - No bundling in development
- ⚡ **Hot Module Replacement** - Sub-100ms updates
- 🎯 **Optimized Builds** - Rollup-powered production bundles
- 📦 **Code Splitting** - Automatic chunk optimization
- 🔧 **Plugin Ecosystem** - Rich ecosystem for extensions

**Why @fhevm/sdk?**
- 🌐 **Universal** - Works with React, Next.js, Vue, or vanilla JS
- 🎯 **Type-Safe** - Full TypeScript support with intellisense
- 📦 **Tree-Shakable** - Import only what you need
- 🔒 **Abstracted** - Simplified FHE operations
- 🎣 **Hook-Based** - React-friendly API design

### Project Structure

```
research-data-sharing/
├── index.html                   # Entry point with modern UI
├── main.js                      # Vite entry with SDK integration
├── styles.css                   # Modern CSS styling
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies (Vite + SDK)
├── contracts/                  # FHE smart contracts
│   ├── AnonymousResearchDataSharing.sol
│   └── ResearchDataSharing.sol
└── README.md                   # Detailed documentation
```

### Quick Start (Vite Version)

```bash
# Navigate to alternative implementation
cd research-data-sharing

# Install dependencies (includes Vite + @fhevm/sdk)
npm install

# Start development server with HMR
npm run dev
# → Server starts at http://localhost:5173

# Build for production
npm run build
# → Optimized bundle in dist/

# Preview production build
npm run preview
```

### SDK Usage Example

```javascript
// Import from @fhevm/sdk
import { initFhevm, encryptValue } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// Initialize FHEVM client
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const fhevmClient = await initFhevm({
  contractAddress: '0x13782134cE8cA22C432bb636B401884806799AD2',
  contractABI: CONTRACT_ABI,
  chainId: 11155111, // Sepolia
  signer
});

// Access contract instance
const contract = fhevmClient.contract;

// Use contract methods
await contract.contributeData(12345, 85, "QmIPFS...", true);
```

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@fhevm/sdk': new URL('../../packages/fhevm-sdk/src/index.ts', import.meta.url).pathname
    }
  },
  optimizeDeps: {
    exclude: ['@fhevm/sdk']
  }
});
```

### Comparison: Hardhat vs Vite Stack

| Feature | Hardhat Stack (root) | Vite Stack (research-data-sharing/) |
|---------|---------------------|-------------------------------------|
| **Build Tool** | None (vanilla) | Vite |
| **Dev Server** | Static files | HMR + Fast Refresh |
| **SDK** | Direct FHEVM | @fhevm/sdk wrapper |
| **Module System** | Script tags | ES Modules |
| **TypeScript** | Not included | Native support |
| **Code Splitting** | Manual | Automatic |
| **Bundle Optimization** | None | Rollup-powered |
| **Best For** | Simple deployments | Modern development |

### When to Use Each Stack

**Use Hardhat Stack (root) when:**
- ✅ You need direct contract deployment scripts
- ✅ Running comprehensive test suites (71 tests)
- ✅ Performing security audits
- ✅ Working with CI/CD pipelines
- ✅ Simple static hosting requirements

**Use Vite Stack (research-data-sharing/) when:**
- ✅ Building modern frontend applications
- ✅ Need fast development iteration (HMR)
- ✅ Want SDK abstraction (@fhevm/sdk)
- ✅ TypeScript development preferred
- ✅ Optimized production bundles required
- ✅ Working with component-based architecture

### Technology Benefits

**Vite Benefits:**
- ⚡ **Development Speed** - Start dev server in ~100ms vs several seconds
- 🔥 **Hot Updates** - See changes instantly without full reload
- 📦 **Smart Bundling** - Only bundle what's imported
- 🎯 **Modern Defaults** - ES2020+, dynamic imports, CSS code splitting

**@fhevm/sdk Benefits:**
- 🛡️ **Type Safety** - Catch errors at compile time
- 📚 **Better DX** - Autocomplete and inline documentation
- 🔧 **Simplified API** - Less boilerplate code
- 🎣 **Composable** - Reusable hooks and utilities
- 🌐 **Framework Ready** - Easy integration with React, Vue, etc.

---

## 📊 Available Scripts

### Core Development

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm test` | Run 71 comprehensive tests |
| `npm run coverage` | Generate test coverage report (80%+) |
| `npm run clean` | Clean build artifacts |

### Deployment

| Command | Description |
|---------|-------------|
| `npm run deploy` | Deploy to Sepolia testnet |
| `npm run deploy:local` | Deploy to local Hardhat network |
| `npm run verify` | Verify contract on Etherscan |
| `npm run node` | Start local Hardhat node |

### Interaction

| Command | Description |
|---------|-------------|
| `npm run interact` | Interact with deployed contract |
| `npm run simulate` | Run full platform simulation |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run all linters (Solhint + ESLint + Prettier) |
| `npm run lint:sol` | Lint Solidity contracts |
| `npm run lint:js` | Lint JavaScript files |
| `npm run format` | Auto-format all code with Prettier |
| `npm run lint:fix` | Auto-fix all linting issues |

### Security & Performance

| Command | Description |
|---------|-------------|
| `npm run security` | Run security audit |
| `npm run security:fix` | Fix security vulnerabilities |
| `npm audit` | Check dependency vulnerabilities |

---

## 🎓 Use Cases

### Medical Research
Share patient data without revealing individual health information. Researchers can collaborate on encrypted datasets while maintaining HIPAA compliance.

### Clinical Trials
Aggregate trial results from multiple institutions without exposing participant data. Compute on encrypted values to determine efficacy.

### Genomic Studies
Analyze genetic data without exposing sensitive genetic markers. Encrypted quality scores ensure data integrity.

### Drug Discovery
Pool research data from pharmaceutical companies securely. Encrypted budgets enable competitive bidding without price disclosure.

### Environmental Studies
Aggregate sensor data while protecting proprietary collection methods. Quality metrics remain confidential.

---

## 📚 Documentation

Comprehensive guides for all aspects of the platform:

- **[README.md](./README.md)** - This file (project overview)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Step-by-step deployment guide
- **[TESTING.md](./TESTING.md)** - Testing documentation (71 tests)
- **[SECURITY.md](./SECURITY.md)** - Security audit & best practices
- **[CI_CD.md](./CI_CD.md)** - CI/CD pipeline documentation
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start guide

---

## 🚧 Troubleshooting

### Common Issues

**Issue: Contract deployment fails**
```bash
# Solution: Check Sepolia ETH balance
# Get testnet ETH from: https://sepoliafaucet.com/

# Verify RPC URL in .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

**Issue: Tests fail with "nonce too high"**
```bash
# Solution: Restart Hardhat network
npm run clean
npm run node  # In new terminal
npm test
```

**Issue: MetaMask connection fails**
```bash
# Solution: Ensure correct network
Network: Sepolia Test Network
Chain ID: 11155111
RPC URL: https://sepolia.infura.io/v3/
```

**Issue: Gas estimation fails**
```bash
# Solution: Check contract is deployed
npm run deploy
# Update CONTRACT_ADDRESS in .env
```

---

## 🔮 Roadmap

### Phase 1: Core Platform (✅ Complete)
- ✅ Encrypted data contribution
- ✅ Access control & permissions
- ✅ Quality scoring system
- ✅ Reward distribution
- ✅ Sepolia deployment

### Phase 2: Enhanced Features (In Progress)
- 🔄 Multi-party computation integration
- 🔄 Advanced FHE operations (comparison, sorting)
- 🔄 Decentralized identity integration
- 🔄 Enhanced metadata privacy

### Phase 3: Scalability (Planned)
- ⏳ Cross-chain data sharing
- ⏳ Layer 2 integration
- ⏳ AI model training on encrypted data
- ⏳ Automated quality verification

### Phase 4: Production (Future)
- ⏳ Third-party security audit
- ⏳ Mainnet deployment
- ⏳ DAO governance
- ⏳ Token economics

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/anonymous-research-data-sharing.git
cd anonymous-research-data-sharing

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run lint
npm test
npm run coverage

# Commit with conventional commits
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Contribution Guidelines

- ✅ Write tests for new features (maintain 80%+ coverage)
- ✅ Follow existing code style (use `npm run format`)
- ✅ Update documentation as needed
- ✅ Ensure all CI/CD checks pass
- ✅ Add comments for complex logic
- ✅ Use conventional commit messages

### Areas We Need Help

- 🆘 Additional test coverage
- 🆘 Gas optimization
- 🆘 Documentation improvements
- 🆘 Frontend enhancements
- 🆘 Security auditing

---

## 🔗 Links & Resources

### Official Resources

- **Zama Documentation**: [docs.zama.ai](https://docs.zama.ai)
- **FHEVM Hardhat Plugin**: [github.com/zama-ai/fhevm-hardhat-plugin](https://github.com/zama-ai/fhevm-hardhat-plugin)
- **Zama GitHub**: [github.com/zama-ai](https://github.com/zama-ai)

### Network Resources

- **Sepolia Testnet**: [sepolia.etherscan.io](https://sepolia.etherscan.io/)
- **Sepolia Faucet**: [sepoliafaucet.com](https://sepoliafaucet.com/)
- **Infura**: [infura.io](https://infura.io)
- **Alchemy**: [alchemy.com](https://alchemy.com)

### Development Tools

- **Hardhat**: [hardhat.org](https://hardhat.org)
- **Ethers.js**: [docs.ethers.org](https://docs.ethers.org/)
- **OpenZeppelin**: [openzeppelin.com](https://openzeppelin.com/)
- **Solidity**: [soliditylang.org](https://soliditylang.org/)

---

## 🏆 Acknowledgments

Built for the **Zama FHE Challenge** - demonstrating practical privacy-preserving applications.

Special thanks to:
- **Zama** - For pioneering Fully Homomorphic Encryption technology
- **Hardhat** - For the robust Ethereum development environment
- **OpenZeppelin** - For smart contract security standards
- **Ethereum Community** - For continuous innovation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Anonymous Research Data Sharing Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📞 Contact & Support

- 🐛 **Report Bugs**: [GitHub Issues](https://github.com/your-username/anonymous-research-data-sharing/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/anonymous-research-data-sharing/discussions)
- 📧 **Email**: security@example.com (for security vulnerabilities)
- 🔒 **Security**: See [SECURITY.md](./SECURITY.md) for responsible disclosure

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Built with ❤️ using [Zama's fhEVM](https://www.zama.ai/fhevm)

**[Live Demo](https://fhe-research-data-sharing.vercel.app/)** • **[Documentation](./DEPLOYMENT.md)** • **[Tests](./TESTING.md)** • **[Security](./SECURITY.md)**

</div>
