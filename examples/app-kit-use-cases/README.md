# Circle App Kit - Real-World Use Cases

This folder contains comprehensive, production-ready examples of real business use cases built with Circle App Kit SDK.

## 📚 Use Cases

Each use case file starts with:
1. **Business Scenario** - The real-world problem being solved
2. **Solution Explanation** - How App Kit solves it
3. **Business Logic Flow** - Step-by-step breakdown
4. **Benefits** - Value proposition for all parties
5. **Complete Code Example** - Production-ready implementation
6. **Integration Tips** - Deployment checklist and best practices

---

## 1. Payment Processor (`01-payment-processor.ts`)

### Business Scenario
Build a payment platform where customers pay with any crypto, but merchants receive USDC on their preferred blockchain.

### Key Features
- Accept payments in any token (USDT, DAI, ETH, etc.)
- Automatic conversion to USDC
- Collect platform processing fees
- Bridge to merchant's preferred chain
- Direct settlement (no custody)

### Run Example
```bash
npm run app-kit:payment-processor
```

### Use Cases
- E-commerce payment gateway
- SaaS subscription payments
- Freelance marketplace payments
- Digital goods checkout

---

## 2. Treasury Management (`02-treasury-management.ts`)

### Business Scenario
Manage company treasury with USDC across multiple blockchains. Automatically consolidate funds to main treasury while maintaining operational balances on each chain.

### Key Features
- Monitor balances across all chains
- Automatic consolidation of excess funds
- Maintain minimum operational reserves
- Scheduled execution (cron-ready)
- Cost optimization with SLOW mode

### Run Example
```bash
npm run app-kit:treasury
```

### Use Cases
- Corporate treasury management
- DAO fund management
- Multi-chain protocol treasuries
- CFO dashboards

---

## 3. Cross-Chain DEX (`03-cross-chain-dex.ts`)

### Business Scenario
Build a DEX that allows users to swap tokens across different blockchains in a single transaction.

### Key Features
- Swap from any token on any chain
- Automatic routing (swap → bridge → swap)
- Real-time rate estimation
- Slippage protection
- Support 40+ blockchains

### Run Example
```bash
npm run app-kit:dex
```

### Use Cases
- Cross-chain swap aggregator
- Portfolio rebalancing tools
- Arbitrage platforms
- Multi-chain wallets

---

## 4. Merchant Payment Flow (`04-merchant-payment-flow.ts`)

### Business Scenario
Complete payment gateway for e-commerce businesses. Merchants get instant USDC settlement, customers pay with any token.

### Key Features
- Quote generation for customers
- Instant payment confirmation
- Webhook notifications for merchants
- Receipt generation with TX links
- Fee collection automation

### Run Example
```bash
npm run app-kit:merchant
```

### Use Cases
- Shopify plugin
- WooCommerce integration
- Custom e-commerce solutions
- Subscription billing

---

## 5. Liquidity Rebalancing (`05-liquidity-rebalancing.ts`)

### Business Scenario
Maintain optimal liquidity distribution across multiple chains for a DeFi protocol or exchange.

### Key Features
- Real-time liquidity monitoring
- Automatic imbalance detection
- Urgency-based rebalancing
- Cost optimization
- Emergency fast-track for critical chains

### Run Example
```bash
npm run app-kit:rebalancing
```

### Use Cases
- DEX liquidity management
- Bridge operators
- Lending protocol balancing
- Payment provider reserves

---

## 🚀 Quick Start

### 1. Set Up Environment

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# - KIT_KEY: Get from https://console.circle.com/
# - PRIVATE_KEY: Your wallet private key (testnet recommended)
```

### 2. Run an Example

```bash
# Choose a use case
npm run app-kit:payment-processor
npm run app-kit:treasury
npm run app-kit:dex
npm run app-kit:merchant
npm run app-kit:rebalancing
```

### 3. Customize for Your Needs

Each file contains:
- Detailed inline comments
- Type definitions
- Helper functions
- Integration checklist
- Production deployment guide

---

## 📖 Common Patterns

### Pattern 1: Swap + Bridge
Convert token on source chain, bridge to destination
```typescript
// Swap USDT → USDC on Ethereum
await kit.swap({...});

// Bridge USDC to Base
await kit.bridge({...});
```

### Pattern 2: Fee Collection
Monetize your platform
```typescript
config: {
  customFee: {
    value: "1.00",  // $1 fee
    recipientAddress: "YOUR_ADDRESS"
  }
}
```

### Pattern 3: Estimate First
Always show users costs upfront
```typescript
const estimate = await kit.estimateSwap({...});
// Show to user
if (userApproves) {
  await kit.swap({...});
}
```

---

## 🏗️ Architecture Patterns

### For Payment Systems
```
Customer Payment
    ↓
Convert to USDC (if needed)
    ↓
Collect Platform Fee
    ↓
Bridge to Merchant Chain (if needed)
    ↓
Settlement Complete
```

### For Treasury Management
```
Monitor Balances
    ↓
Detect Imbalances
    ↓
Plan Rebalancing
    ↓
Execute Bridges
    ↓
Verify & Report
```

### For DEX Systems
```
User Input (Token A, Chain X)
    ↓
Calculate Route
    ↓
Estimate Output
    ↓
Execute: Swap → Bridge → Swap
    ↓
Deliver Token B on Chain Y
```

---

## 💡 Integration Tips

### 1. Always Estimate First
```typescript
// Bad
await kit.bridge({...});

// Good
const estimate = await kit.estimateBridge({...});
showUserEstimate(estimate);
if (await getUserApproval()) {
  await kit.bridge({...});
}
```

### 2. Use Event Tracking
```typescript
kit.on('bridge.burn', (payload) => {
  updateUI('Step 2/4: Burning on source chain...');
});

kit.on('bridge.mint', (payload) => {
  updateUI('Complete! Tokens minted on destination');
});
```

### 3. Handle Errors Gracefully
```typescript
try {
  await kit.swap({...});
} catch (error) {
  if (error.message.includes('slippage')) {
    // Suggest increasing slippage
  } else if (error.message.includes('insufficient')) {
    // Show balance error
  }
}
```

---

## 🔐 Security Best Practices

1. **Never expose private keys in frontend**
2. **Use environment variables for all secrets**
3. **Validate all user inputs**
4. **Implement rate limiting**
5. **Use custom RPC endpoints in production**
6. **Enable 2FA for Circle Console**
7. **Monitor all transactions**
8. **Implement circuit breakers**

---

## 🧪 Testing Checklist

- [ ] Test on testnets first (Sepolia, Base Sepolia)
- [ ] Test with small amounts
- [ ] Test all token combinations
- [ ] Test both FAST and SLOW bridges
- [ ] Test error scenarios
- [ ] Test with insufficient balance
- [ ] Load test for production
- [ ] Monitor gas costs

---

## 📊 Performance Optimization

### Use SLOW Mode for Non-Urgent Operations
```typescript
config: {
  transferSpeed: 'SLOW'  // FREE but ~20 min
}
```

### Batch Operations When Possible
```typescript
// Instead of 10 separate $1 operations
// Do 1 operation of $10
```

### Cache Token Prices
```typescript
// Cache for 1 minute to reduce API calls
const cachedPrices = new Map();
```

---

## 📈 Monitoring & Analytics

### Key Metrics to Track
- Transaction success rate
- Average processing time
- Fee collection totals
- Bridge costs vs revenue
- User conversion rates

### Alerting Thresholds
- Failed transaction rate > 5%
- Processing time > 5 minutes
- Balance below threshold
- Unusual activity detected

---

## 🌟 Advanced Features

### Multi-Signature Support
For large operations, implement multi-sig approval:
```typescript
if (amount > 10000) {
  await requestMultiSigApproval(operation);
}
```

### Dynamic Fee Adjustment
Adjust fees based on market conditions:
```typescript
computeFee: async (params) => {
  const marketFee = await getMarketRate();
  return (parseFloat(params.amount) * marketFee).toString();
}
```

### Automatic Retry Logic
Handle transient failures:
```typescript
async function robustBridge(params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await kit.bridge(params);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

---

## 📞 Support & Resources

- **Circle Documentation**: https://developers.circle.com/app-kit
- **Developer Console**: https://console.circle.com/
- **GitHub Issues**: Report bugs and request features
- **Community**: Join Circle's developer community

---

## 🎯 Next Steps

1. **Run the examples** to understand the patterns
2. **Choose a use case** that matches your needs
3. **Customize the code** for your specific requirements
4. **Test thoroughly** on testnets
5. **Deploy to production** with monitoring
6. **Scale and optimize** based on metrics

---

## 📝 License

MIT - Feel free to use these examples in your projects!

---

**Last Updated**: 2026-03-04
**App Kit Version**: Latest
**Examples**: 5 complete use cases
**Lines of Code**: ~2,000 lines of production-ready examples
