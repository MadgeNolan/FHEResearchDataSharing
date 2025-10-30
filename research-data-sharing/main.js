import { initFhevm, encryptValue } from '@fhevm/sdk';
import { BrowserProvider, Contract } from 'ethers';

// Contract ABI (simplified for demo)
const CONTRACT_ABI = [
  'function contributeData(uint32, uint8, string, bool) external',
  'function requestDataAccess(string, uint32, uint256) external',
  'function accessDataset(uint32) external view returns (string, uint256, uint32)',
  'function getPlatformStats() external view returns (uint32, uint32)',
  'event DatasetContributed(uint32 indexed, address indexed, string)',
  'event DataRequested(uint32 indexed, address indexed, string)'
];

const CONTRACT_ADDRESS = '0x13782134cE8cA22C432bb636B401884806799AD2';

let provider, signer, fhevmClient, contract;

// Connect wallet
document.getElementById('connectBtn').addEventListener('click', async () => {
  try {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    provider = new BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();

    // Initialize FHEVM client
    fhevmClient = await initFhevm({
      contractAddress: CONTRACT_ADDRESS,
      contractABI: CONTRACT_ABI,
      chainId: 11155111, // Sepolia
      signer
    });

    contract = fhevmClient.contract;

    // Check network
    const network = await provider.getNetwork();
    const networkInfo = document.getElementById('networkInfo');

    if (network.chainId === 11155111n) {
      networkInfo.className = 'network-info sepolia';
      networkInfo.textContent = '✅ Connected to Sepolia Testnet';
    } else {
      networkInfo.className = 'network-info';
      networkInfo.textContent = '⚠️ Please switch to Sepolia Testnet';
      return;
    }

    // Show main content
    document.getElementById('walletSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';

    // Load stats
    await loadStats();

  } catch (error) {
    console.error('Connection failed:', error);
    alert('Failed to connect: ' + error.message);
  }
});

// Load platform statistics
async function loadStats() {
  try {
    const [totalDatasets, totalRequests] = await contract.getPlatformStats();
    document.getElementById('totalDatasets').textContent = totalDatasets.toString();
    document.getElementById('totalRequests').textContent = totalRequests.toString();
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Contribute dataset
document.getElementById('contributeBtn').addEventListener('click', async () => {
  const btn = document.getElementById('contributeBtn');
  const originalText = btn.textContent;

  try {
    btn.textContent = 'Processing...';
    btn.disabled = true;

    const dataValue = parseInt(document.getElementById('dataValue').value);
    const qualityScore = parseInt(document.getElementById('qualityScore').value);
    const metadataHash = document.getElementById('metadataHash').value;
    const isPublic = document.getElementById('isPublic').checked;

    if (!dataValue || !qualityScore || !metadataHash) {
      alert('Please fill in all fields');
      return;
    }

    if (qualityScore < 0 || qualityScore > 100) {
      alert('Quality score must be between 0 and 100');
      return;
    }

    // Note: In production, use fhevmClient to encrypt values
    // For demo, we pass plaintext values (contract will encrypt)
    const tx = await contract.contributeData(
      dataValue,
      qualityScore,
      metadataHash,
      isPublic
    );

    btn.textContent = 'Waiting for confirmation...';
    await tx.wait();

    alert('Dataset contributed successfully! 🎉');
    await loadStats();

    // Clear form
    document.getElementById('dataValue').value = '';
    document.getElementById('qualityScore').value = '';
    document.getElementById('metadataHash').value = '';
    document.getElementById('isPublic').checked = false;

  } catch (error) {
    console.error('Contribution failed:', error);
    alert('Failed to contribute dataset: ' + error.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

// Request data access
document.getElementById('requestBtn').addEventListener('click', async () => {
  const btn = document.getElementById('requestBtn');
  const originalText = btn.textContent;

  try {
    btn.textContent = 'Processing...';
    btn.disabled = true;

    const researchTopic = document.getElementById('researchTopic').value;
    const budget = parseInt(document.getElementById('budget').value);
    const deadlineDays = parseInt(document.getElementById('deadlineDays').value);

    if (!researchTopic || !budget || !deadlineDays) {
      alert('Please fill in all fields');
      return;
    }

    const deadline = Math.floor(Date.now() / 1000) + (deadlineDays * 24 * 60 * 60);

    const tx = await contract.requestDataAccess(
      researchTopic,
      budget,
      deadline
    );

    btn.textContent = 'Waiting for confirmation...';
    await tx.wait();

    alert('Access request submitted successfully! 🎉');
    await loadStats();

    // Clear form
    document.getElementById('researchTopic').value = '';
    document.getElementById('budget').value = '';
    document.getElementById('deadlineDays').value = '';

  } catch (error) {
    console.error('Request failed:', error);
    alert('Failed to submit request: ' + error.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

// Access dataset
document.getElementById('accessBtn').addEventListener('click', async () => {
  const btn = document.getElementById('accessBtn');
  const originalText = btn.textContent;

  try {
    btn.textContent = 'Loading...';
    btn.disabled = true;

    const datasetId = parseInt(document.getElementById('datasetId').value);

    if (!datasetId) {
      alert('Please enter a dataset ID');
      return;
    }

    const [metadataHash, timestamp, accessCount] = await contract.accessDataset(datasetId);

    const date = new Date(Number(timestamp) * 1000).toLocaleString();

    document.getElementById('datasetResult').innerHTML = `
      <h3>Dataset #${datasetId}</h3>
      <p><strong>Metadata Hash:</strong> ${metadataHash}</p>
      <p><strong>Created:</strong> ${date}</p>
      <p><strong>Access Count:</strong> ${accessCount.toString()}</p>
      <p class="info">🔒 Encrypted data values are protected by FHEVM</p>
    `;

  } catch (error) {
    console.error('Access failed:', error);
    document.getElementById('datasetResult').innerHTML = `
      <p class="error">❌ ${error.message}</p>
    `;
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});
