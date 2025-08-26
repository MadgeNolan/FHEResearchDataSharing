# CI/CD Documentation

Comprehensive guide for Continuous Integration and Continuous Deployment workflows.

## Overview

This project uses **GitHub Actions** for automated testing, code quality checks, and deployment processes. All workflows are automatically triggered on push and pull requests to ensure code quality and reliability.

## Workflows

### 1. Test Workflow (`.github/workflows/test.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Matrix Testing:**
- Node.js versions: `18.x`, `20.x`
- Operating system: `ubuntu-latest`

**Steps:**
1. Checkout repository
2. Setup Node.js environment
3. Install dependencies
4. Code formatting check (Prettier)
5. Solidity linting (Solhint)
6. Compile smart contracts
7. Run test suite
8. Generate coverage report
9. Upload coverage to Codecov

**Usage:**
```bash
# Run locally to match CI
npm ci
npm run prettier:check
npm run lint:sol
npm run compile
npm test
npm run coverage
```

### 2. Code Quality Workflow (`.github/workflows/lint.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Checks:**
1. Prettier formatting
2. Solhint linting
3. Console.log detection in contracts

**Usage:**
```bash
# Run all quality checks
npm run lint

# Run individually
npm run prettier:check
npm run lint:sol
```

### 3. Coverage Workflow (`.github/workflows/coverage.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Steps:**
1. Generate comprehensive test coverage
2. Upload to Codecov
3. Archive coverage artifacts (7-day retention)

**Coverage Targets:**
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Code Quality Tools

### Solhint

Solidity linter for security and style checking.

**Configuration:** `.solhint.json`

**Rules:**
- Code complexity: max 10
- Compiler version: ^0.8.24
- Function visibility: enforced
- Max line length: 120 characters
- Security checks: enabled

**Commands:**
```bash
# Lint all contracts
npm run lint:sol

# Lint with auto-fix
npm run lint:fix
```

**Common Issues:**

```solidity
// ❌ Bad - Missing visibility
function getData() returns (uint256) {}

// ✅ Good - Explicit visibility
function getData() external view returns (uint256) {}

// ❌ Bad - Too complex (complexity > 10)
function complexLogic() external {
  if (a && b || c && (d || e)) {
    // ... many nested conditions
  }
}

// ✅ Good - Split into smaller functions
function complexLogic() external {
  if (checkConditionA()) {
    handleA();
  }
}
```

### Prettier

Code formatter for consistent styling.

**Configuration:** `.prettierrc.json`

**Settings:**
- Print width: 100 characters (JavaScript)
- Print width: 120 characters (Solidity)
- Tab width: 2 spaces
- Semicolons: required
- Single quotes: no
- Trailing commas: ES5

**Commands:**
```bash
# Check formatting
npm run prettier:check

# Auto-format all files
npm run prettier:write
npm run format
```

**Supported Files:**
- Solidity (`.sol`)
- JavaScript (`.js`)
- TypeScript (`.ts`)
- JSON (`.json`)
- Markdown (`.md`)
- YAML (`.yml`)

### Coverage Reporting

Test coverage powered by `solidity-coverage` and reported via Codecov.

**Configuration:** `codecov.yml`

**Targets:**
- Project coverage: 80% (±2% threshold)
- Patch coverage: 80% (±5% threshold)

**Commands:**
```bash
# Generate coverage report
npm run coverage

# View HTML report
open coverage/index.html
```

## Setting Up CI/CD

### 1. GitHub Repository Setup

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit with CI/CD"

# Add remote and push
git remote add origin https://github.com/username/repo.git
git branch -M main
git push -u origin main
```

### 2. Codecov Setup

1. Visit [codecov.io](https://codecov.io)
2. Sign in with GitHub
3. Add your repository
4. Get Codecov token
5. Add to GitHub Secrets:
   - Go to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `CODECOV_TOKEN`
   - Value: Your Codecov token

### 3. Branch Protection Rules

Configure branch protection for `main`:

1. Go to Settings > Branches
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Tests workflow
   - ✅ Code Quality workflow
   - ✅ Coverage workflow
   - ✅ Require pull request reviews

## Workflow Badges

Add status badges to your README.md:

```markdown
![Tests](https://github.com/username/repo/workflows/Tests/badge.svg)
![Code Quality](https://github.com/username/repo/workflows/Code%20Quality/badge.svg)
![Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)
```

## Local Development

### Pre-commit Checks

Run before committing:

```bash
# Format code
npm run format

# Run linting
npm run lint

# Run tests
npm test

# Full check (matches CI)
npm run format && npm run lint && npm test
```

### Git Hooks (Optional)

Install husky for automatic pre-commit checks:

```bash
npm install --save-dev husky lint-staged

# Add to package.json
{
  "lint-staged": {
    "*.{js,json,md,yml}": ["prettier --write"],
    "*.sol": ["prettier --write", "solhint"]
  }
}

# Initialize husky
npx husky init
npx husky add .husky/pre-commit "npx lint-staged"
```

## Continuous Deployment

### Automatic Deployment (Future)

Add deployment workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - run: npm ci
      - run: npm run compile
      - name: Deploy to Sepolia
        env:
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
          SEPOLIA_RPC_URL: ${{ secrets.SEPOLIA_RPC_URL }}
          ETHERSCAN_API_KEY: ${{ secrets.ETHERSCAN_API_KEY }}
        run: npm run deploy
```

### Required Secrets for Deployment

Add these to GitHub Secrets:

- `PRIVATE_KEY`: Deployer wallet private key
- `SEPOLIA_RPC_URL`: Infura/Alchemy RPC URL
- `ETHERSCAN_API_KEY`: Etherscan API key

## Monitoring

### Workflow Status

Check workflow status:

1. Go to "Actions" tab in GitHub
2. View workflow runs
3. Check logs for failures
4. Review coverage reports

### Coverage Trends

Monitor coverage on Codecov:

1. Visit codecov.io/gh/username/repo
2. View coverage graphs
3. Track coverage over time
4. Review file-by-file coverage

## Troubleshooting

### Common Issues

#### 1. Workflow Fails on Formatting

```bash
# Error: Code is not formatted
npm run prettier:check

# Fix: Format all files
npm run format

# Commit and push
git add .
git commit -m "Format code"
git push
```

#### 2. Solhint Errors

```bash
# View errors
npm run lint:sol

# Auto-fix where possible
npm run lint:fix

# Manual fixes required for:
# - Visibility specifiers
# - Function complexity
# - Security issues
```

#### 3. Test Failures

```bash
# Run tests locally
npm test

# Run specific test
npx hardhat test --grep "test name"

# Debug with gas reporting
REPORT_GAS=true npm test
```

#### 4. Coverage Below Threshold

```bash
# Generate coverage report
npm run coverage

# View HTML report
open coverage/index.html

# Add missing tests for uncovered code
```

#### 5. Node Version Mismatch

```bash
# Check Node version
node --version

# Install correct version (18.x or 20.x)
nvm install 20
nvm use 20
```

## Best Practices

### 1. Commit Frequently

```bash
# Small, focused commits
git add specific-file.js
git commit -m "Add feature X"
```

### 2. Run Checks Before Push

```bash
# Full pre-push check
npm run format && npm run lint && npm test
```

### 3. Write Descriptive Commit Messages

```bash
# ✅ Good
git commit -m "Add dataset deactivation feature with access control"

# ❌ Bad
git commit -m "updates"
```

### 4. Keep Tests Updated

- Add tests for new features
- Update tests for changed functionality
- Maintain >80% coverage

### 5. Review CI Failures

- Don't ignore CI failures
- Fix immediately or revert
- Update tests if needed

## Performance Optimization

### Caching

Workflows use npm caching:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    cache: 'npm'  # Speeds up dependency installation
```

### Parallel Jobs

Tests run in parallel for different Node versions:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

## Security

### Secrets Management

- Never commit secrets
- Use GitHub Secrets for sensitive data
- Rotate keys regularly

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

## Additional Resources

### Documentation

- [GitHub Actions](https://docs.github.com/en/actions)
- [Codecov Documentation](https://docs.codecov.com/)
- [Solhint Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)
- [Prettier Options](https://prettier.io/docs/en/options.html)

### Tools

- [Codecov](https://codecov.io) - Coverage reporting
- [Solhint](https://github.com/protofire/solhint) - Solidity linter
- [Prettier](https://prettier.io) - Code formatter

## Summary

This CI/CD setup provides:

- ✅ Automated testing on multiple Node versions
- ✅ Code quality checks (Solhint + Prettier)
- ✅ Test coverage reporting
- ✅ Artifact archiving
- ✅ Branch protection integration
- ✅ Codecov integration
- ✅ Matrix testing strategy

All checks run automatically on every push and pull request to ensure code quality and reliability.
