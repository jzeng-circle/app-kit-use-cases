# Circle App Kit - Complete Examples Summary

This document provides an overview of all the Circle App Kit example use cases created for this project.

## 📁 Files Created

### Core Examples
1. **app-kit-send.ts** - Send tokens across wallets
2. **app-kit-bridge.ts** - Cross-chain bridging examples
3. **app-kit-swap.ts** - Token swap examples
4. **app-kit-workflows.ts** - Real-world business workflows
5. **app-kit-advanced.ts** - Advanced patterns and features

### Documentation
- **README.md** - Complete project documentation
- **QUICKSTART.md** - 5-minute getting started guide
- **APP_KIT_EXAMPLES.md** - This file

## 🚀 Quick Overview

### Send Examples (6 use cases)
```typescript
// 1. Basic USDC send
await kit.send({
  from: { adapter, chain: "Ethereum" },
  to: "0x742d35...",
  amount: "10.00",
  token: "USDC"
});

// 2. Estimate before sending
const estimate = await kit.estimateSend({...});

// 3. Send USDT
// 4. Send native token (ETH)
// 5. Error handling
// 6. Send to another adapter
```

### Bridge Examples (9 use cases)
```typescript
// 1. Basic bridge
await kit.bridge({
  from: { adapter, chain: "Ethereum" },
  to: { adapter, chain: "Base" },
  amount: "100.00"
});

// 2. Estimate bridge costs
// 3. Fast vs Slow transfer modes
// 4. Bridge with max fee limit
// 5. Bridge to custom recipient
// 6. Event tracking
// 7. EVM to Solana bridge
// 8. Collect developer fee
// 9. Global fee policy
```

### Swap Examples (10 use cases)
```typescript
// 1. Basic swap
await kit.swap({
  from: { adapter, chain: "Ethereum" },
  tokenIn: "USDT",
  tokenOut: "USDC",
  amount: "100.00",
  config: { kitKey: process.env.KIT_KEY }
});

// 2. Estimate swap rate
// 3. Swap with slippage tolerance
// 4. Swap with stop limit
// 5. Slippage vs Stop Limit explanation
// 6. Collect swap fee
// 7. Swap different token pairs
// 8. Multi-chain swaps
// 9. Error handling
// 10. Custom token by address
```

### Workflow Examples (5 use cases)

#### 1. Stablecoin Acquiring
Accept customer payment in any token, convert to USDC, bridge to merchant.
```typescript
async function processPayment(
  paymentAmount: string,
  merchantChain: string,
  merchantAddress: string
) {
  // Swap USDT → USDC
  const swapResult = await kit.swap({...});

  // Bridge to merchant's chain
  const bridgeResult = await kit.bridge({
    to: { chain: merchantChain, recipientAddress: merchantAddress }
  });

  return { swapTx, bridgeTxs, merchantReceivedChain };
}
```

#### 2. Multi-Chain Treasury Management
Consolidate funds from multiple chains to central treasury.
```typescript
async function consolidateTreasury(
  treasuryChain: string,
  treasuryAddress: string
) {
  const chains = ["Base", "Arbitrum", "Polygon", "Optimism"];

  for (const sourceChain of chains) {
    const balance = await getUSDCBalance(sourceChain);
    if (balance > 10) {
      await kit.bridge({ from: sourceChain, to: treasuryChain });
    }
  }
}
```

#### 3. Cross-chain DEX
Convert user's token on one chain to desired token on another chain.
```typescript
async function crossChainSwap(
  inputAmount: string,
  fromChain: string,
  fromToken: string,
  toChain: string,
  toToken: string
) {
  // Step 1: Swap to USDC if needed
  if (fromToken !== 'USDC') {
    await kit.swap({ tokenIn: fromToken, tokenOut: "USDC" });
  }

  // Step 2: Bridge USDC to destination
  await kit.bridge({ from: fromChain, to: toChain });

  // Step 3: Swap to desired token if needed
  if (toToken !== 'USDC') {
    await kit.swap({ tokenIn: "USDC", tokenOut: toToken });
  }
}
```

#### 4. Merchant Payment Flow
Customer pays in any token, platform collects fee, merchant receives USDC.
```typescript
async function processMerchantPayment(payment: PaymentRequest) {
  // Calculate platform fee
  const feeAmount = (paymentAmount * platformFeePercent / 100);
  const merchantAmount = paymentAmount - feeAmount;

  // Swap customer's token to USDC
  await kit.swap({ tokenIn: customerToken, tokenOut: "USDC" });

  // Send platform fee
  await kit.send({ to: platformFeeAddress, amount: feeAmount });

  // Bridge to merchant
  await kit.bridge({ to: merchantAddress, amount: merchantAmount });
}
```

#### 5. Liquidity Rebalancing
Maintain optimal fund distribution across chains.
```typescript
async function rebalanceLiquidity(
  mainChain: string,
  balances: ChainBalance[]
) {
  for (const chainInfo of balances) {
    const difference = chainInfo.balance - chainInfo.target;

    if (Math.abs(difference) > 100) {
      if (difference > 0) {
        // Excess - send to main chain
        await kit.bridge({ from: chainInfo.chain, to: mainChain });
      } else {
        // Deficit - send from main chain
        await kit.bridge({ from: mainChain, to: chainInfo.chain });
      }
    }
  }
}
```

### Advanced Examples (7 use cases)

#### 1. Custom RPC Configuration
```typescript
const adapter = createViemAdapterFromPrivateKey({
  privateKey: process.env.PRIVATE_KEY,
  getPublicClient: ({ chain }) => {
    const rpcUrl = RPC_BY_CHAIN_NAME[chain.name];
    return createPublicClient({
      chain,
      transport: http(rpcUrl, { retryCount: 3, timeout: 10000 })
    });
  }
});
```

#### 2. Browser Wallet Integration
```typescript
const adapter = await createViemAdapterFromProvider({
  provider: window.ethereum
});
```

#### 3. Comprehensive Event Tracking
```typescript
kit.on('bridge.approve', (payload) => {...});
kit.on('bridge.burn', (payload) => {...});
kit.on('bridge.attestation', (payload) => {...});
kit.on('bridge.mint', (payload) => {...});
kit.on('*', (event) => {...});  // Catch all
```

#### 4. Dynamic Global Fee Policy
```typescript
const kit = new StablecoinKit({
  customFeePolicy: {
    computeFee: async (params) => {
      // Tiered fee structure
      const amount = parseFloat(params.amount);
      if (amount < 100) return '0.50';
      if (amount < 1000) return (amount * 0.005).toFixed(2);
      return (amount * 0.003).toFixed(2);
    },
    resolveFeeRecipientAddress: async (chain, params) => {
      return feeAddresses[chain.type];
    }
  }
});
```

#### 5. Error Recovery with Retry
```typescript
async function robustBridge(fromChain, toChain, amount, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await kit.bridge({...});
    } catch (error) {
      if (error.includes('insufficient funds')) throw error;

      // Exponential backoff
      const backoff = 1000 * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, backoff));
      attempt++;
    }
  }
}
```

#### 6. Multi-Adapter Setup (EVM + Solana)
```typescript
const evmAdapter = createViemAdapterFromPrivateKey({...});
const solanaAdapter = createSolanaKitAdapterFromPrivateKey({...});

// Bridge from EVM to Solana
await kit.bridge({
  from: { adapter: evmAdapter, chain: "Ethereum" },
  to: { adapter: solanaAdapter, chain: "Solana" },
  amount: "100.00"
});
```

#### 7. Batch Operations
```typescript
async function executeBatch(operations: Operation[]) {
  const results = [];

  for (const op of operations) {
    try {
      let result;
      switch (op.type) {
        case 'send': result = await kit.send(op.params); break;
        case 'bridge': result = await kit.bridge(op.params); break;
        case 'swap': result = await kit.swap(op.params); break;
      }
      results.push({ type: op.type, status: 'success', result });
    } catch (error) {
      results.push({ type: op.type, status: 'failed', error });
    }
  }

  return results;
}
```

## 📊 Total Use Cases by Category

- **Send**: 6 examples
- **Bridge**: 9 examples
- **Swap**: 10 examples
- **Workflows**: 5 real-world scenarios
- **Advanced**: 7 production patterns

**Total: 37+ comprehensive use cases**

## 🎯 Key Features Demonstrated

### Core Functionality
- ✅ Send tokens across wallets
- ✅ Bridge USDC cross-chain
- ✅ Swap tokens on same chain
- ✅ Estimate costs before execution
- ✅ Track operation progress

### Configuration Options
- ✅ Fast vs Slow transfer speeds
- ✅ Max fee limits
- ✅ Custom recipient addresses
- ✅ Slippage tolerance
- ✅ Stop limit (minimum output)
- ✅ Custom RPC endpoints

### Monetization
- ✅ Per-operation custom fees
- ✅ Global fee policies
- ✅ Tiered fee structures
- ✅ Dynamic fee calculation
- ✅ Multi-chain fee addresses

### Advanced Features
- ✅ Event listeners for all operations
- ✅ Browser wallet integration
- ✅ Error recovery patterns
- ✅ Retry logic with backoff
- ✅ Multi-adapter setup (EVM + Solana)
- ✅ Batch operation execution

### Real-world Workflows
- ✅ Stablecoin acquiring
- ✅ Multi-chain treasury management
- ✅ Cross-chain DEX functionality
- ✅ Merchant payment flows
- ✅ Liquidity rebalancing

## 🏗️ Supported Use Cases

### DeFi & Trading
- Cross-chain arbitrage
- Multi-chain yield farming
- Portfolio rebalancing
- Liquidity management

### Payments & Commerce
- E-commerce payments
- B2B settlements
- Remittances
- Payroll distribution

### Treasury Operations
- Fund consolidation
- Multi-chain treasury
- Automated rebalancing
- Cost optimization

### Platform Features
- Embedded wallets
- Cross-chain swaps
- Bridge-as-a-service
- Payment rails

## 🔗 Resources

- **Documentation**: https://developers.circle.com/app-kit
- **Console**: https://console.circle.com/
- **CCTP Info**: https://developers.circle.com/cctp
- **Support**: https://circle.com/support

## 📝 Notes

All examples include:
- Complete code samples
- Error handling patterns
- Best practice recommendations
- Real transaction flows
- Production-ready patterns

These examples are designed to be:
- Copy-paste ready
- Well-documented
- Production-focused
- Security-conscious
- Extensible

## 🚀 Getting Started

1. Read **QUICKSTART.md** for 5-minute setup
2. Run examples: `npm run app-kit:send`
3. Explore workflows: `npm run app-kit:workflows`
4. Learn advanced patterns: `npm run app-kit:advanced`

## 💡 Tips

- Start with send examples (simplest)
- Test on testnets first
- Always estimate before executing
- Use event tracking for UX
- Implement proper error handling
- Consider fee collection for monetization

---

**Last Updated**: 2026-03-04
**SDK Version**: Circle App Kit (latest)
**Total Examples**: 37+ use cases
