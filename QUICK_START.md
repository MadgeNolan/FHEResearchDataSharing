# Quick Start Guide

Get up and running with the Anonymous Research Data Sharing platform in 5 minutes.

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your keys:
# - SEPOLIA_RPC_URL (from Infura or Alchemy)
# - PRIVATE_KEY (from MetaMask, without 0x prefix)
# - ETHERSCAN_API_KEY (from Etherscan)
```

## 3. Compile Contracts

```bash
npm run compile
```

## 4. Run Tests

```bash
npm test
```

## 5. Deploy to Sepolia

```bash
# Make sure you have Sepolia testnet ETH
npm run deploy
```

## 6. Verify Contract

```bash
npm run verify
```

## 7. Interact with Contract

```bash
# View platform statistics
npm run interact

# Or customize interaction
ACTION=2 DATA_VALUE=12345 QUALITY_SCORE=85 npm run interact
```

## 8. Run Full Simulation

```bash
npm run simulate
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile contracts |
| `npm test` | Run tests |
| `npm run deploy` | Deploy to Sepolia |
| `npm run verify` | Verify on Etherscan |
| `npm run interact` | Interact with contract |
| `npm run simulate` | Run full simulation |

## Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- Review [README.md](./README.md) for project overview
- Ensure you have Sepolia testnet ETH from [faucet](https://sepoliafaucet.com/)

## Troubleshooting

**No funds?**
```bash
# Get Sepolia ETH from: https://sepoliafaucet.com/
```

**Compilation errors?**
```bash
npm run clean
npm run compile
```

**Connection issues?**
```bash
# Check your .env file
# Verify RPC URL is correct
# Ensure you have internet connection
```

---

For more detailed information, see [DEPLOYMENT.md](./DEPLOYMENT.md)
