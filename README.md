# app-kit-use-cases

Production-ready examples demonstrating real-world stablecoin operations using [Circle App Kit](https://developers.circle.com/app-kit).

## Use Cases

### 01. Stablecoin Acquiring (Payment Processing)
Accept payments in any token (USDT, DAI, ETH) and settle stable USDC to merchants on their preferred chain, with built-in platform fee collection.

**Read More**: [app-kit-use-cases/01-PAYMENT-PROCESSOR.md](./app-kit-use-cases/01-PAYMENT-PROCESSOR.md)

---

### 02. Multi-Chain Treasury Management
Consolidate funds from multiple chains to a central treasury. Threshold-based automation, minimum balance protection, and zero bridge fees with SLOW mode.

**Read More**: [app-kit-use-cases/02-TREASURY-MANAGEMENT.md](./app-kit-use-cases/02-TREASURY-MANAGEMENT.md)

---

Browse all use cases: [app-kit-use-cases/INDEX.md](./app-kit-use-cases/INDEX.md)

## Setup

```bash
npm install
cp .env.example .env
# Fill in your credentials in .env
```

## Running Examples

```bash
# Stablecoin acquiring
npm run app-kit:payment

# Treasury management
npm run app-kit:treasury

```

Or run any file directly:

```bash
npx tsx app-kit-use-cases/01-payment-processor.ts
```

## Environment Variables

| Variable | Description |
|---|---|
| `CIRCLE_API_KEY` | Circle API key from [console.circle.com](https://console.circle.com/) |
| `CIRCLE_ENTITY_SECRET` | Entity secret from Circle Console |
| `INTERNAL_WALLET_ID` | Wallet ID for your internal/aggregation wallet |
| `TREASURY_WALLET_ID` | Wallet ID for your treasury wallet |
| `TREASURY_ADDRESS` | On-chain address of your main treasury |
| `KIT_KEY` | Circle Kit API key (required for swap operations) |

## Resources

- [Circle App Kit Documentation](https://developers.circle.com/app-kit)
- [Circle CCTP Documentation](https://developers.circle.com/cctp)
- [Circle Developer Console](https://console.circle.com/)
