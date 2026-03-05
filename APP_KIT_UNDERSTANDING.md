# Circle App Kit SDK - Understanding & Capabilities

## Overview

Circle App Kit is a TypeScript SDK that simplifies building cross-chain payment and liquidity applications. It abstracts away the complexity of blockchain interactions and provides a unified interface for three core actions: **Send**, **Bridge**, and **Swap**.

The SDK works with multiple wallet adapters (Viem, Ethers, Solana, Circle Wallets) and supports 40+ blockchains including Ethereum, Base, Arbitrum, Polygon, Solana, and more.

---

## Core Concepts

### 1. The Three Main Actions

#### **SEND**
- **Purpose**: Transfer tokens from one wallet to another on the **same blockchain**
- **Use Case**: Simple peer-to-peer transfers, payments within the same network
- **Example**: Send 100 USDC from your Ethereum wallet to another Ethereum address

```typescript
await kit.send({
  from: { adapter, chain: "Ethereum" },
  to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  amount: "100.00",
  token: "USDC"
});
```

#### **BRIDGE**
- **Purpose**: Transfer USDC **across different blockchains** using Circle's CCTP protocol
- **Use Case**: Cross-chain transfers, moving liquidity between networks
- **Example**: Transfer 100 USDC from Ethereum to Base

```typescript
await kit.bridge({
  from: { adapter, chain: "Ethereum" },
  to: { adapter, chain: "Base" },
  amount: "100.00"
});
```

**Key Feature - Transfer Speed:**
- **FAST mode**: ~2 block confirmations, costs ~0.01 USDC fee
- **SLOW mode**: ~65 block confirmations, FREE

#### **SWAP**
- **Purpose**: Exchange one token for another on the **same blockchain**
- **Use Case**: Token conversions, stablecoin swaps
- **Example**: Swap 100 USDT for USDC on Ethereum

```typescript
await kit.swap({
  from: { adapter, chain: "Ethereum" },
  tokenIn: "USDT",
  tokenOut: "USDC",
  amount: "100.00",
  config: { kitKey: process.env.KIT_KEY }
});
```

---

## Key Features & Capabilities

### 1. **Adapter System**

App Kit uses adapters to support different wallet types and blockchain libraries:

**Chain Client Adapters:**
- **Viem v2** - Modern, lightweight library for EVM chains
- **Ethers v6** - Popular library for EVM chains
- **Solana Web3.js** - For Solana blockchain

**Circle Wallets Adapter:**
- Server-side only (requires API key)
- For Circle's developer-controlled wallets
- Never use in browser (credentials must stay secret)

**Setup Example:**
```typescript
// Viem adapter
import { createViemAdapterFromPrivateKey } from '@circle-fin/adapter-viem-v2';

const adapter = createViemAdapterFromPrivateKey({
  privateKey: process.env.PRIVATE_KEY as string
});
```

### 2. **Supported Blockchains**

**Bridge Support** (40+ chains):
- Ethereum, Base, Arbitrum, Optimism, Polygon, Avalanche
- Solana, Sei, Sonic, Unichain, World Chain
- Plus testnets for all major chains

**Swap Support** (20+ chains):
- Ethereum, Base, Arbitrum, Optimism, Polygon
- Solana, Avalanche, and more

**Send Support**: All supported chains

### 3. **Supported Tokens**

**Built-in Aliases** (no need to provide contract addresses):
- `USDC` - USD Coin
- `EURC` - Euro Coin
- `USDT` - Tether
- `NATIVE` - Chain's native token (ETH, SOL, MATIC, etc.)
- `DAI`, `USDe`, `PYUSD`

**Custom Tokens**: You can provide any ERC-20 contract address

### 4. **Fee Configuration**

App Kit supports custom developer fees for monetization:

**Per-Operation Fee:**
```typescript
await kit.swap({
  from: { adapter, chain: "Ethereum" },
  tokenIn: "USDT",
  tokenOut: "USDC",
  amount: "100.00",
  config: {
    kitKey: process.env.KIT_KEY,
    customFee: {
      value: "0.1",  // Collect 0.1 USDT as fee
      recipientAddress: "YOUR_FEE_WALLET_ADDRESS"
    }
  }
});
```

**Global Fee Policy:**
```typescript
kit.setCustomFeePolicy({
  computeFee: async (params) => {
    // Dynamic fee calculation
    return (parseFloat(params.amount) * 0.001).toString(); // 0.1% fee
  },
  resolveFeeRecipientAddress: async (chain, params) => {
    if (chain.type === 'solana') return 'YOUR_SOLANA_ADDRESS';
    return '0xYOUR_ETH_ADDRESS';
  }
});
```

**Fee Structure:**
- Developer fee: You set the amount
- Circle takes 10% of your developer fee
- You receive 90% of the developer fee

### 5. **Slippage & Stop Limits (for Swaps)**

**Slippage Tolerance** - Maximum price movement you'll accept:
```typescript
config: {
  slippageBps: 300  // 3% slippage tolerance (300 basis points)
}
```

**Stop Limit** - Exact minimum output you'll accept:
```typescript
config: {
  stopLimit: "99.5"  // Won't accept less than 99.5 USDC
}
```

**Note**: If both are set, stop limit takes precedence.

### 6. **Estimation Methods**

Before executing operations, you can estimate costs and outputs:

```typescript
// Estimate swap output
const swapEstimate = await kit.estimateSwap({
  from: { adapter, chain: "Ethereum" },
  tokenIn: "USDT",
  tokenOut: "USDC",
  amount: "100.00"
});
console.log('You will receive approximately:', swapEstimate.estimatedOutput);

// Estimate bridge costs
const bridgeEstimate = await kit.estimateBridge({
  from: { adapter, chain: "Ethereum" },
  to: { adapter, chain: "Base" },
  amount: "100.00"
});
console.log('Gas fees:', bridgeEstimate.gasFees);

// Estimate send costs
const sendEstimate = await kit.estimateSend({
  from: { adapter, chain: "Ethereum" },
  to: "0x...",
  amount: "100.00",
  token: "USDC"
});
console.log('Gas needed:', sendEstimate.gas);
```

### 7. **Event Tracking**

Monitor the progress of bridge operations:

```typescript
// Listen to specific events
kit.on('bridge.approve', (payload) => {
  console.log('Step 1: Token approval complete');
});

kit.on('bridge.burn', (payload) => {
  console.log('Step 2: Tokens burned on source chain');
});

kit.on('bridge.attestation', (payload) => {
  console.log('Step 3: CCTP attestation received');
});

kit.on('bridge.mint', (payload) => {
  console.log('Step 4: Tokens minted on destination chain');
});

// Listen to all events
kit.on('*', (event) => {
  console.log(`Event: ${event.method}`, event.values);
});
```

### 8. **Custom RPC Configuration**

For production, use your own RPC providers instead of public endpoints:

```typescript
import { createPublicClient, http } from 'viem';

const adapter = createViemAdapterFromPrivateKey({
  privateKey: process.env.PRIVATE_KEY as string,
  getPublicClient: ({ chain }) => {
    const rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
    return createPublicClient({
      chain,
      transport: http(rpcUrl, {
        retryCount: 3,
        timeout: 10000
      })
    });
  }
});
```

### 9. **Browser Wallet Support**

Connect to MetaMask or other browser wallets:

```typescript
import { createViemAdapterFromProvider } from '@circle-fin/adapter-viem-v2';

if (!window.ethereum) {
  throw new Error('No wallet provider found');
}

const adapter = await createViemAdapterFromProvider({
  provider: window.ethereum
});
```

---

## Common Use Cases & Patterns

### Use Case 1: Simple Payment
**Scenario**: Send USDC from one wallet to another on Ethereum

```typescript
const result = await kit.send({
  from: { adapter, chain: "Ethereum" },
  to: "0xRecipientAddress",
  amount: "50.00",
  token: "USDC"
});
```

### Use Case 2: Cross-Chain Transfer
**Scenario**: Move USDC from Ethereum to Base (cheaper gas fees)

```typescript
const result = await kit.bridge({
  from: { adapter, chain: "Ethereum" },
  to: { adapter, chain: "Base" },
  amount: "100.00",
  config: {
    transferSpeed: 'FAST'  // Pay ~0.01 USDC for fast transfer
  }
});
```

### Use Case 3: Token Swap
**Scenario**: Convert USDT to USDC on Ethereum

```typescript
const result = await kit.swap({
  from: { adapter, chain: "Ethereum" },
  tokenIn: "USDT",
  tokenOut: "USDC",
  amount: "100.00",
  config: {
    kitKey: process.env.KIT_KEY,
    slippageBps: 50  // 0.5% max slippage
  }
});
```

### Use Case 4: Multi-Step Workflow
**Scenario**: Swap USDT to USDC, then bridge to Solana

```typescript
// Step 1: Swap on Ethereum
const swapResult = await kit.swap({
  from: { adapter: ethAdapter, chain: "Ethereum" },
  tokenIn: "USDT",
  tokenOut: "USDC",
  amount: "100.00",
  config: { kitKey: process.env.KIT_KEY }
});

// Step 2: Bridge to Solana
const bridgeResult = await kit.bridge({
  from: { adapter: ethAdapter, chain: "Ethereum" },
  to: { adapter: solanaAdapter, chain: "Solana" },
  amount: "100.00"
});
```

### Use Case 5: Monetization with Fees
**Scenario**: Collect a 0.1% fee on every swap transaction

```typescript
const kit = new StablecoinKit({
  customFeePolicy: {
    computeFee: async (params) => {
      const amount = parseFloat(params.amount);
      const feeAmount = amount * 0.001; // 0.1% fee
      return feeAmount.toString();
    },
    resolveFeeRecipientAddress: async (chain) => {
      return process.env.FEE_RECIPIENT_ADDRESS as string;
    }
  }
});

// Now all swaps automatically collect your fee
const result = await kit.swap({...});
```

### Use Case 6: Bridge with Custom Recipient
**Scenario**: Send USDC from your Ethereum wallet to someone else's Base wallet

```typescript
const result = await kit.bridge({
  from: { adapter, chain: "Ethereum" },
  to: {
    adapter,
    chain: "Base",
    recipientAddress: "0xDifferentPersonsBaseAddress"
  },
  amount: "50.00"
});
```

---

## Error Handling

Common errors and how to handle them:

```typescript
try {
  const result = await kit.swap({...});
} catch (error: any) {
  if (error.message.includes('insufficient allowance')) {
    // User needs to approve token spending
  } else if (error.message.includes('slippage')) {
    // Price moved too much, increase slippage tolerance
  } else if (error.message.includes('insufficient funds')) {
    // Not enough balance
  } else if (error.message.includes('No token pairs')) {
    // Swap not available for this token pair
  }
}
```

---

## Requirements

1. **Kit Key**: Obtain from [Circle Developer Console](https://console.circle.com/)
   - Required for: Swap operations
   - Optional for: Bridge and Send operations

2. **Private Key**: Your wallet's private key
   - Keep this SECRET
   - Never commit to version control
   - Store in `.env` file

3. **Funded Wallet**: Your wallet needs:
   - The token you want to transfer (USDC, USDT, etc.)
   - Native token for gas fees (ETH, SOL, etc.)

---

## Installation

```bash
# Core package
npm install @circle-fin/stablecoin-kit

# Choose your adapter(s)
npm install @circle-fin/adapter-viem-v2 viem
npm install @circle-fin/adapter-ethers-v6 ethers
npm install @circle-fin/adapter-solana @solana/web3.js

# For Circle Wallets (server-side only)
npm install @circle-fin/adapter-circle-wallets
```

---

## Security Best Practices

1. **Never expose private keys** in frontend code
2. **Use Circle Wallets adapter only on server-side**
3. **Use custom RPC endpoints** for production (not public RPCs)
4. **Always estimate before executing** expensive operations
5. **Implement proper error handling** for all operations
6. **Validate user inputs** before passing to SDK
7. **Use environment variables** for all sensitive data

---

## When to Use Each Action

| Action | When to Use | Example Scenario |
|--------|-------------|------------------|
| **Send** | Same-chain token transfer | Pay a merchant in USDC on Ethereum |
| **Bridge** | Cross-chain USDC transfer | Move USDC from expensive Ethereum to cheap Base |
| **Swap** | Token exchange on same chain | Convert USDT to USDC before bridging |

---

## Advanced Patterns

### Pattern 1: Swap + Bridge (Cross-chain token conversion)
```typescript
// User has USDT on Ethereum, wants USDC on Base
// 1. Swap USDT → USDC on Ethereum
// 2. Bridge USDC from Ethereum → Base
```

### Pattern 2: Bridge + Send (Cross-chain payment to different recipient)
```typescript
// 1. Bridge from Ethereum → Base (to your wallet)
// 2. Send on Base to final recipient
```

### Pattern 3: Multi-chain treasury management
```typescript
// Automatically rebalance USDC across chains based on liquidity needs
// - Bridge to chains with low balance
// - Consolidate from chains with excess balance
```

---

## Return Values

All operations return detailed results:

```typescript
{
  state: 'success' | 'pending' | 'error',
  txHash: '0x...',
  explorerUrl: 'https://etherscan.io/tx/0x...',
  fromAddress: '0x...',
  toAddress: '0x...',
  amount: '100.00',
  fees: [
    { token: 'USDC', amount: '0.001', type: 'provider' },
    { token: 'USDC', amount: '0.1', type: 'developer' }
  ],
  steps: [...]  // For bridge operations
}
```

---

## Summary

Circle App Kit SDK provides:
- ✅ Simple API for complex cross-chain operations
- ✅ Type-safe TypeScript interfaces
- ✅ Support for 40+ blockchains
- ✅ Built-in fee monetization
- ✅ Flexible adapter system
- ✅ Estimation before execution
- ✅ Event tracking for transparency
- ✅ Production-ready error handling

Perfect for building:
- Payment applications
- DeFi platforms
- Cross-chain bridges
- Stablecoin exchanges
- Treasury management tools
