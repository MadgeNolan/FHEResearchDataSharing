# Deployment Instructions

## Quick Deployment to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. **Prepare Your Repository**
   - Push this project to GitHub
   - Ensure all files are committed

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select this repository
   - Click "Deploy"

3. **Configure Contract Address**
   - After deployment, update the `CONTRACT_ADDRESS` in `index.html`
   - Redeploy if needed

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# In project directory
vercel --prod

# Follow the prompts
```

## Contract Deployment (Optional)

If you want to deploy your own contract instead of using the existing one:

### Prerequisites
- Node.js installed
- MetaMask with Sepolia ETH
- Infura or Alchemy API key

### Steps

1. **Setup Hardhat Project** (in a separate directory):
```bash
mkdir contract-deployment
cd contract-deployment
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

2. **Configure Hardhat** (`hardhat.config.js`):
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  }
};
```

3. **Copy Contract**:
   - Copy `contracts/AnonymousResearchDataSharing.sol` to the Hardhat project

4. **Deploy Script** (`scripts/deploy.js`):
```javascript
async function main() {
  const AnonymousResearchDataSharing = await ethers.getContractFactory("AnonymousResearchDataSharing");
  const contract = await AnonymousResearchDataSharing.deploy();

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

5. **Deploy**:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

6. **Update Frontend**:
   - Replace `CONTRACT_ADDRESS` in `index.html` with the new address
   - Redeploy to Vercel

## Environment Setup

### MetaMask Configuration
1. Install MetaMask browser extension
2. Add Sepolia testnet:
   - Network Name: Sepolia Test Network
   - RPC URL: https://sepolia.infura.io/v3/
   - Chain ID: 11155111
   - Currency Symbol: SEP
   - Block Explorer: https://sepolia.etherscan.io/

### Get Test ETH
1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Request test ETH

## Testing the Deployment

1. **Open the deployed site**
2. **Connect MetaMask** to Sepolia testnet
3. **Test features**:
   - Connect wallet
   - View platform stats
   - Contribute test data
   - Submit data request
   - Check transaction on Etherscan

## Troubleshooting

### Common Issues

**Contract not found**:
- Verify contract address is correct
- Ensure you're on Sepolia testnet

**Transaction fails**:
- Check you have sufficient Sepolia ETH
- Verify network connection

**MetaMask connection issues**:
- Refresh page
- Reconnect wallet
- Check network settings

**Vercel deployment fails**:
- Check all files are properly formatted
- Verify `vercel.json` configuration

### Getting Help

1. Check browser console for errors
2. Verify contract on [Sepolia Etherscan](https://sepolia.etherscan.io/)
3. Test with different browsers
4. Ensure MetaMask is updated

## Production Considerations

### Before Mainnet Deployment

1. **Security Audit**: Have the smart contract audited
2. **Gas Optimization**: Optimize contract for lower gas costs
3. **Error Handling**: Add comprehensive error handling
4. **User Experience**: Add loading states and better feedback
5. **Documentation**: Provide detailed user guides

### Mainnet Deployment Differences

1. Change network to Ethereum mainnet
2. Use real ETH instead of test ETH
3. Update contract address
4. Consider gas fees for users
5. Implement proper backup strategies

---

**Note**: Always test thoroughly on testnet before any mainnet deployment.