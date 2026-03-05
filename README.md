# SDK Samples

Sample code for experimenting with various SDK services, featuring **Circle App Kit** for cross-chain stablecoin operations.

## Included SDKs

### Circle App Kit (Featured)
- **Send** - Transfer tokens between wallets on the same chain
- **Bridge** - Cross-chain USDC transfers using Circle's CCTP
- **Swap** - Same-chain token swaps (USDC, USDT, DAI, etc.)
- **40+ Supported Blockchains** - Ethereum, Base, Arbitrum, Polygon, Solana, and more

### Other SDKs
- **Circle Web3 Services SDK** - Programmable wallets
- **Anthropic SDK** - Claude API integration
- **Web3.js / Ethers.js** - Ethereum and blockchain interactions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment template:
```bash
cp .env.example .env
```

3. Edit `.env` and add your credentials:
   - **KIT_KEY**: Circle Kit API key (get from https://console.circle.com/)
   - **PRIVATE_KEY**: Your wallet private key (for testing)
   - **ANTHROPIC_API_KEY**: Anthropic API key from https://console.anthropic.com/
   - **ETHEREUM_RPC_URL**: Optional custom RPC endpoint

## Running Examples

### Circle App Kit Examples

```bash
# Send tokens across wallets
npm run app-kit:send

# Bridge USDC across chains
npm run app-kit:bridge

# Swap tokens on same chain
npm run app-kit:swap

# Real-world workflow examples
npm run app-kit:workflows

# Advanced features and patterns
npm run app-kit:advanced
```

### Other SDK Examples

```bash
# Circle Web3 Services example
npm run circle-web3

# Anthropic SDK example
npm run anthropic

# Web3.js/Ethers.js example
npm run web3
```

Or run any TypeScript file directly:
```bash
npm run dev examples/your-file.ts
```

## Circle App Kit Examples Overview

### 1. Send Examples (`app-kit-send.ts`)
Basic token transfers on the same chain:
- Send USDC to another wallet
- Send USDT and native tokens
- Estimate send costs before executing
- Error handling patterns

### 2. Bridge Examples (`app-kit-bridge.ts`)
Cross-chain USDC transfers:
- Bridge USDC from Ethereum to Base
- Fast vs Slow transfer modes
- Bridge with max fee limits
- Bridge to custom recipient addresses
- Event tracking for bridge progress
- Cross-chain bridging (EVM to Solana)
- Collect developer fees on bridges

### 3. Swap Examples (`app-kit-swap.ts`)
Token swaps on the same chain:
- Swap USDT to USDC
- Estimate swap rates
- Control slippage tolerance
- Set minimum output (stop limit)
- Collect developer fees on swaps
- Multi-chain swap support

### 4. Workflow Examples (`app-kit-workflows.ts`)
Real-world business scenarios:
- **Payment Processor**: Accept USDT, convert to USDC, bridge to merchant
- **Treasury Management**: Consolidate funds from multiple chains
- **Cross-chain DEX**: Swap on one chain, bridge to another
- **Merchant Payments**: Customer pays in any token, merchant receives USDC
- **Liquidity Rebalancing**: Keep funds balanced across chains

### 5. Advanced Examples (`app-kit-advanced.ts`)
Production-ready patterns:
- Custom RPC configuration
- Browser wallet integration (MetaMask, Phantom)
- Comprehensive event tracking system
- Dynamic global fee policies
- Error recovery with retry logic
- Multi-adapter setup (EVM + Solana)
- Batch operation execution

## Key Features

### Simple Setup
Perform complex cross-chain operations in just a few lines:
```typescript
const kit = new StablecoinKit();

// Bridge USDC from Ethereum to Base
await kit.bridge({
  from: { adapter, chain: "Ethereum" },
  to: { adapter, chain: "Base" },
  amount: "100.00"
});
```

### Monetization Built-in
Collect fees from end-users easily:
```typescript
await kit.bridge({
  from: { adapter, chain: "Ethereum" },
  to: { adapter, chain: "Base" },
  amount: "100.00",
  config: {
    customFee: {
      value: "0.5",  // $0.50 fee
      recipientAddress: "YOUR_WALLET_ADDRESS"
    }
  }
});
```

### Event Tracking
Real-time progress updates:
```typescript
kit.on('bridge.burn', (payload) => {
  console.log('USDC burned on source chain:', payload.values.txHash);
});

kit.on('bridge.mint', (payload) => {
  console.log('USDC minted on destination:', payload.values.txHash);
});
```

## Supported Chains

**Bridge Support (40+ chains):**
- Ethereum, Base, Arbitrum, Optimism, Polygon
- Avalanche, Solana, Sonic, Unichain, World Chain
- Arc, Codex, HyperEVM, Ink, Linea, Monad, Plume, Sei, XDC
- And many testnets

**Swap Support (20+ chains):**
- Ethereum, Arbitrum, Avalanche, Base, Polygon
- OP Mainnet, Solana, HyperEVM, Ink, Linea
- Monad, Plume, Sei, Sonic, Unichain, World Chain, XDC

## Supported Tokens

**Built-in aliases:**
- `USDC` - USD Coin
- `EURC` - Euro Coin
- `USDT` - Tether
- `DAI` - Dai
- `USDe` - Ethena USDe
- `PYUSD` - PayPal USD
- `NATIVE` - Chain's native token (ETH, SOL, etc.)

For any other token, use the contract address directly.

## Project Structure

```
sdk-samples/
├── examples/
│   ├── app-kit-send.ts          # Send token examples
│   ├── app-kit-bridge.ts        # Bridge examples
│   ├── app-kit-swap.ts          # Swap examples
│   ├── app-kit-workflows.ts     # Real-world workflows
│   ├── app-kit-advanced.ts      # Advanced patterns
│   ├── circle-web3.ts           # Circle W3S SDK
│   ├── anthropic.ts             # Anthropic SDK
│   └── web3.ts                  # Web3.js/Ethers.js
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Common Use Cases

### Payment Processing
Accept any token, convert to USDC, and deliver to merchant on their preferred chain.

### Treasury Management
Automatically consolidate funds from multiple chains to a central treasury.

### Cross-chain Commerce
Enable users to pay on one chain while merchants receive on another.

### Liquidity Management
Maintain optimal fund distribution across chains for better UX.

### DeFi Integrations
Combine swaps and bridges for complex DeFi workflows.

## Resources

- [Circle App Kit Documentation](https://developers.circle.com/app-kit)
- [Circle Developer Console](https://console.circle.com/)
- [Circle CCTP Documentation](https://developers.circle.com/cctp)
- [Anthropic Documentation](https://docs.anthropic.com/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)

## Notes

- The App Kit examples are for educational purposes and use placeholder values
- Always test on testnets before using mainnet
- Never commit your `.env` file with real credentials
- Circle App Kit requires a Kit Key from the Circle Developer Console
- Swap operations specifically require the Kit Key in the config

## License

MIT
