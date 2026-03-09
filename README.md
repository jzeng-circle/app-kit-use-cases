# app-kit-use-cases

This project demonstrates real-world business use cases built with [Circle App Kit](https://developers.circle.com/app-kit). Each example is designed to show developers what is possible with App Kit — from accepting crypto payments to managing multi-chain treasuries — and to give them a working, production-ready starting point they can adapt directly in their own products.

## About Circle App Kit

Circle App Kit (`@circle-fin/stablecoin-kit`) is a TypeScript SDK for building cross-chain payment and liquidity applications. It exposes three core operations:

- `kit.send()` — transfer tokens between wallets on the same chain
- `kit.swap()` — exchange one token for another on the same chain (requires `KIT_KEY`)
- `kit.bridge()` — move USDC across chains via CCTP (`FAST` ~2 block confirmations, `SLOW` ~65 blocks and free)

It works with multiple wallet adapters (Viem, Ethers, Solana, Circle Wallets) and supports 40+ blockchains.

## Use Cases

### 01. [Stablecoin Acquiring](./app-kit-use-cases/01-STABLECOIN-ACQUIRING.md)
Accept payments in any token (USDT, DAI, ETH) from any chain and settle USDC to merchants on their preferred chain, with batch processing and built-in fee collection.
[[source]](./app-kit-use-cases/01-stablecoin-acquiring.ts)

### 02. [Multi-Chain Treasury Management](./app-kit-use-cases/02-TREASURY-MANAGEMENT.md)
Monitor USDC balances across chains and automatically consolidate excess funds to a central treasury using SLOW mode for zero bridge fees.
[[source]](./app-kit-use-cases/02-treasury-management.ts)

## Setup

```bash
npm install
cp .env.example .env
# Fill in your credentials in .env
```

### Environment Variables

| Variable | Description |
|---|---|
| `CIRCLE_API_KEY` | Circle API key from [console.circle.com](https://console.circle.com/) |
| `CIRCLE_ENTITY_SECRET` | Entity secret from Circle Console |
| `INTERNAL_WALLET_ID` | Wallet ID for your internal/aggregation wallet |
| `TREASURY_WALLET_ID` | Wallet ID for your treasury wallet |
| `TREASURY_ADDRESS` | On-chain address of your main treasury |
| `KIT_KEY` | Circle Kit API key (required for swap operations) |

## Running Examples

```bash
npm run app-kit:stablecoin-acquiring
npm run app-kit:treasury-management
```

Or run directly:

```bash
npx tsx app-kit-use-cases/01-stablecoin-acquiring.ts
npx tsx app-kit-use-cases/02-treasury-management.ts
```

## Resources

- [Circle App Kit Documentation](https://developers.circle.com/app-kit)
- [Circle CCTP Documentation](https://developers.circle.com/cctp)
- [Circle Developer Console](https://console.circle.com/)
