# Testing Documentation

Comprehensive testing guide for the Anonymous Research Data Sharing platform.

## Overview

This project includes **71 comprehensive test cases** covering all aspects of the smart contract functionality, security, and edge cases.

## Test Infrastructure

### Technology Stack

- **Testing Framework**: Hardhat Test (Mocha + Chai)
- **Assertion Library**: Chai with hardhat-chai-matchers
- **Network Helpers**: @nomicfoundation/hardhat-network-helpers
- **Coverage Tool**: solidity-coverage
- **Gas Reporter**: hardhat-gas-reporter

### Test Environment

```bash
# Local Hardhat Network (default)
npx hardhat test

# With gas reporting
REPORT_GAS=true npx hardhat test

# Generate coverage report
npx hardhat coverage
```

## Test Suite Structure

### Test Categories (71 Total Tests)

#### 1. Deployment Tests (3 tests)
- Contract deployment verification
- Initial state validation
- Owner assignment

#### 2. Data Contribution Tests (8 tests)
- Basic data contribution
- Input validation (quality score, metadata)
- Contributor tracking
- Dataset information storage

#### 3. Data Access Request Tests (5 tests)
- Request submission
- Input validation (topic, deadline)
- Request information storage

#### 4. Access Control Tests (5 tests)
- Contributor access grant
- Owner access grant
- Unauthorized access rejection
- Invalid dataset handling

#### 5. Dataset Access Tests (5 tests)
- Public dataset access
- Private dataset access with permission
- Contributor self-access
- Unauthorized access rejection
- Inactive dataset handling

#### 6. Quality Score Management Tests (3 tests)
- Owner score updates
- Non-owner rejection
- Score validation (0-100)

#### 7. Reward Distribution Tests (4 tests)
- Owner reward distribution
- Non-owner rejection
- Invalid contributor rejection
- Multiple reward tracking

#### 8. Dataset Deactivation Tests (3 tests)
- Contributor deactivation
- Owner deactivation
- Unauthorized deactivation rejection

#### 9. Platform Statistics Tests (2 tests)
- Dataset and request counting
- Timestamp validation

#### 10. Edge Cases (5 tests)
- Multiple contributors
- Zero value handling
- Empty contributor arrays
- Maximum uint32 values
- Multiple access grants

#### 11. Complex Workflows (3 tests)
- Full lifecycle workflow
- Multiple datasets and requests
- Multiple contributor rewards

#### 12. Event Emissions (5 tests)
- DatasetContributed event
- DataRequested event
- DatasetAccessed event
- RewardDistributed event
- QualityScoreUpdated event

#### 13. Gas Optimization (3 tests)
- Data contribution gas cost
- Access request gas cost
- Access grant gas cost

#### 14. State Consistency (3 tests)
- Dataset counter consistency
- Request counter consistency
- Contributor list consistency

#### 15. Boundary Conditions (4 tests)
- Dataset ID boundaries
- Request ID boundaries
- Long metadata hash handling
- Long research topic handling

#### 16. Integration Tests (1 test)
- Complete research data sharing lifecycle

## Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/AnonymousResearchDataSharing.test.js

# Run with detailed output
npx hardhat test --verbose
```

### Advanced Test Execution

```bash
# Run with gas reporting
REPORT_GAS=true npm test

# Generate coverage report
npm run test:coverage

# Run on specific network
npx hardhat test --network localhost
```

## Test Patterns Used

### Pattern 1: Deployment Fixture

Every test uses a clean deployment fixture to ensure test isolation:

```javascript
async function deployContractFixture() {
  const [owner, researcher1, researcher2, researcher3, researcher4] = await ethers.getSigners();
  const AnonymousResearchDataSharing = await ethers.getContractFactory(
    "AnonymousResearchDataSharing"
  );
  const contract = await AnonymousResearchDataSharing.deploy();
  return { contract, owner, researcher1, researcher2, researcher3, researcher4 };
}
```

### Pattern 2: Multiple Signers

Tests use multiple signers to test different roles:

- `owner`: Contract owner with administrative privileges
- `researcher1`, `researcher2`, `researcher3`, `researcher4`: Regular users

### Pattern 3: Event Testing

All events are verified with correct parameters:

```javascript
await expect(contract.connect(researcher1).contributeData(...))
  .to.emit(contract, "DatasetContributed")
  .withArgs(1, researcher1.address, "QmHash");
```

### Pattern 4: Error Handling

Comprehensive error testing with specific revert messages:

```javascript
await expect(
  contract.connect(researcher2).ownerOnlyFunction()
).to.be.revertedWith("Not authorized");
```

### Pattern 5: State Verification

After each operation, relevant state is verified:

```javascript
const stats = await contract.getPlatformStats();
expect(stats[0]).to.equal(expectedDatasets);
expect(stats[1]).to.equal(expectedRequests);
```

## Test Coverage Goals

### Current Coverage

Run coverage report to see detailed metrics:

```bash
npm run test:coverage
```

### Coverage Targets

- **Statements**: > 95%
- **Branches**: > 90%
- **Functions**: > 95%
- **Lines**: > 95%

## Writing New Tests

### Test Naming Convention

Use descriptive test names that explain what is being tested:

```javascript
// ✅ Good
it("Should reject quality score above 100", async function () {});

// ❌ Bad
it("test1", async function () {});
```

### Test Organization

Group related tests using `describe` blocks:

```javascript
describe("ContractName", function () {
  describe("Feature Group", function () {
    it("Should test specific behavior", async function () {});
  });
});
```

### Assertion Guidelines

Use specific and clear assertions:

```javascript
// ✅ Good
expect(value).to.equal(expectedValue);
expect(address).to.equal(researcher1.address);

// ❌ Bad
expect(result).to.be.ok;
```

## Test Scenarios

### Scenario 1: Basic Data Contribution

```javascript
it("Should allow researchers to contribute data", async function () {
  const { contract, researcher1 } = await loadFixture(deployContractFixture);

  await expect(
    contract.connect(researcher1).contributeData(12345, 85, "QmHash", true)
  ).to.emit(contract, "DatasetContributed");

  expect(await contract.nextDatasetId()).to.equal(2);
});
```

### Scenario 2: Access Control

```javascript
it("Should reject unauthorized access grant", async function () {
  const { contract, researcher1, researcher2, researcher3 } = await loadFixture(
    deployContractFixture
  );

  await contract.connect(researcher1).contributeData(12345, 85, "QmHash", false);

  await expect(
    contract.connect(researcher3).grantDataAccess(1, researcher2.address)
  ).to.be.revertedWith("Not authorized to grant access");
});
```

### Scenario 3: Complete Workflow

```javascript
it("Should complete full research data sharing lifecycle", async function () {
  const { contract, owner, researcher1, researcher2 } = await loadFixture(
    deployContractFixture
  );

  // 1. Contribute data
  await contract.connect(researcher1).contributeData(12345, 85, "QmHash", false);

  // 2. Request access
  const deadline = Math.floor(Date.now() / 1000) + 86400;
  await contract.connect(researcher2).requestDataAccess("Topic", 50000, deadline);

  // 3. Grant access
  await contract.connect(researcher1).grantDataAccess(1, researcher2.address);

  // 4. Access dataset
  const info = await contract.connect(researcher2).accessDataset(1);
  expect(info[0]).to.equal("QmHash");

  // 5. Update quality score
  await contract.connect(owner).updateQualityScore(1, 95);

  // 6. Distribute reward
  await contract.connect(owner).distributeReward(researcher1.address, 1, 1000);

  // 7. Verify final state
  const rewardCount = await contract.getContributorRewardCount(researcher1.address);
  expect(rewardCount).to.equal(1);
});
```

## Gas Optimization Tests

### Purpose

Gas optimization tests ensure that contract functions remain efficient:

```javascript
it("Should have reasonable gas cost for data contribution", async function () {
  const { contract, researcher1 } = await loadFixture(deployContractFixture);

  const tx = await contract.connect(researcher1).contributeData(12345, 85, "QmGas", true);
  const receipt = await tx.wait();

  expect(receipt.gasUsed).to.be.lt(500000);
});
```

### Gas Limits

- **Data Contribution**: < 500,000 gas
- **Access Request**: < 300,000 gas
- **Access Grant**: < 200,000 gas

## Debugging Tests

### Enable Verbose Output

```bash
npx hardhat test --verbose
```

### Run Single Test

```bash
npx hardhat test --grep "Should allow researchers to contribute data"
```

### Debug with Console Logs

Add console logs in tests:

```javascript
console.log("Dataset ID:", datasetId.toString());
console.log("Address:", researcher1.address);
```

## Continuous Integration

### GitHub Actions

Add this workflow to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Best Practices

### 1. Test Isolation

Each test should be independent and not rely on other tests:

```javascript
beforeEach(async function () {
  ({ contract, owner, researcher1 } = await loadFixture(deployContractFixture));
});
```

### 2. Comprehensive Coverage

Test both success and failure cases:

```javascript
// Success case
it("Should allow owner to update quality score", async function () {
  // Test successful operation
});

// Failure case
it("Should reject quality score update from non-owner", async function () {
  // Test rejected operation
});
```

### 3. Edge Cases

Always test boundary conditions:

```javascript
it("Should handle zero value", async function () {
  await contract.contributeData(0, 0, "QmHash", true);
});

it("Should handle maximum uint32 value", async function () {
  const maxUint32 = 2n ** 32n - 1n;
  await contract.contributeData(maxUint32, 100, "QmHash", true);
});
```

### 4. Event Verification

Verify that events are emitted correctly:

```javascript
await expect(tx)
  .to.emit(contract, "EventName")
  .withArgs(arg1, arg2, arg3);
```

### 5. State Consistency

Verify state changes after operations:

```javascript
expect(await contract.nextDatasetId()).to.equal(2);
expect(await contract.getContributorDatasetCount(researcher1.address)).to.equal(1);
```

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "nonce too high"
**Solution**: Restart Hardhat network

**Issue**: Gas estimation fails
**Solution**: Check that contract is deployed correctly

**Issue**: Timeout errors
**Solution**: Increase test timeout:

```javascript
it("Should complete long operation", async function () {
  this.timeout(60000); // 60 seconds
  // Test logic
});
```

## Additional Resources

### Documentation

- [Hardhat Testing Guide](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Chai Matchers](https://hardhat.org/hardhat-chai-matchers/docs/overview)

### Example Projects

- Hardhat example projects
- OpenZeppelin test patterns
- Zama fhEVM examples

## Summary

This test suite provides comprehensive coverage of all contract functionality with:

- **71 test cases** covering all features
- **Multiple test categories**: deployment, functionality, security, edge cases
- **Gas optimization tests** for performance monitoring
- **Event emission tests** for proper event handling
- **Integration tests** for complete workflows
- **Boundary condition tests** for robustness

Run `npm test` to execute all tests and verify contract correctness.
