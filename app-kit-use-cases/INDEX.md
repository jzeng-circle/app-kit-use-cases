# Circle App Kit - Use Cases Index

Navigate through production-ready examples that demonstrate real-world blockchain payment and treasury operations.

---

## 🎯 Production Use Cases

### 01. Stablecoin Acquiring (Payment Processing)

**Files**:
- `01-payment-processor.ts` - Implementation code
- `01-PAYMENT-PROCESSOR.md` - Complete guide with diagrams

**Business Problem**:

Accept payments in any cryptocurrency (USDT, DAI, ETH) while merchants receive stable USDC on their preferred blockchain, with platform fee collection.

**Solution Highlights**:

- Multi-token payment acceptance with temporary wallets
- Automatic aggregation to internal wallet
- Batch swap processing for operational efficiency
- Flexible settlement (daily/on-demand) with built-in fee collection
- Cross-chain bridging to merchant's preferred chain

**Best For**:

Payment gateways, e-commerce platforms, merchant acquiring, crypto checkout systems

**Read More**: [01-PAYMENT-PROCESSOR.md](./01-PAYMENT-PROCESSOR.md)

---

### 02. Multi-Chain Treasury Management

**Files**:
- `02-treasury-management.ts` - Implementation code
- `02-TREASURY-MANAGEMENT.md` - Complete guide with diagrams

**Business Problem**:

Manage funds across multiple blockchains. Consolidate to central treasury or redistribute to maintain optimal liquidity ratios.

**Solution Highlights**:

- Multi-chain fund consolidation (many → one)
- Liquidity rebalancing (redistribute across chains)
- Automated monitoring and threshold-based actions
- Optimized gas management with SLOW/FAST modes
- Treasury reporting and audit trails

**Use Cases**:

- **Treasury Consolidation**: Bring funds from multiple chains to main treasury
- **Liquidity Rebalancing**: Maintain target ratios across chains for DEX/DeFi operations
- **Cash Management**: Ensure operational balances on all chains

**Best For**:

Corporate treasuries, DAO management, DEX operators, DeFi protocols, multi-chain platforms

**Read More**: [02-TREASURY-MANAGEMENT.md](./02-TREASURY-MANAGEMENT.md)

---

### 03. Cross-Chain DEX (Token Swaps)

**Files**:
- `03-cross-chain-dex.ts` - Implementation code

**Business Problem**:

Enable users to swap tokens across different blockchains in a single transaction without manually bridging.

**Solution Highlights**:

- Cross-chain token swaps (any token → any token, any chain → any chain)
- Automatic routing: swap → bridge → swap
- Multi-hop optimization for best prices
- Slippage protection and quote generation
- Real-time execution tracking

**Examples**:

- USDT on Ethereum → USDC on Base
- DAI on Polygon → USDC on Arbitrum
- Any token cross-chain conversion

**Best For**:

Trading platforms, wallet applications, DEX aggregators, cross-chain DeFi

---

## 🚀 Getting Started

### For Developers New to App Kit

Start with Use Case 01: Stablecoin Acquiring which includes complete business case explanation, visual wallet and fund flow diagrams, step-by-step code walkthrough, and copy-paste ready implementation.

Read the guide: [01-PAYMENT-PROCESSOR.md](./01-PAYMENT-PROCESSOR.md)

### For Production Implementation

Each use case includes working TypeScript implementation, Circle Wallet adapter integration (replaceable with your own), error handling and retry logic, cost optimization strategies, and production-ready patterns.

---

## 📖 Key Features Demonstrated

All use cases leverage App Kit's built-in capabilities:

- **Simple APIs**: `kit.send()`, `kit.swap()`, `kit.bridge()`
- **Fee Collection**: Built-in `customFee` parameter
- **Token Support**: Use aliases (USDT, USDC, DAI) without contract addresses
- **Cross-Chain**: Seamless bridging with CCTP
- **Error Handling**: Automatic retries and detailed error messages

---

## 💡 Choose Your Use Case

- Accept crypto payments for merchants → **Use Case 01**
- Add crypto checkout to e-commerce → **Use Case 01**
- Consolidate treasury across chains → **Use Case 02**
- Rebalance DEX liquidity → **Use Case 02**
- Build a cross-chain trading platform → **Use Case 03**

---

**Last Updated**: 2026-03-04
