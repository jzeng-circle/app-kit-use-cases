# Circle App Kit - Quick Start Guide

Get started with Circle App Kit in 5 minutes.

## Prerequisites

- Node.js v22+ installed
- A wallet with some testnet tokens
- Circle Kit API key from https://console.circle.com/

## Step 1: Installation

```bash
cd sdk-samples
npm install
```

## Step 2: Configuration

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add:

```bash
# Get this from https://console.circle.com/
KIT_KEY=your_kit_key_here

# Your wallet private key (for testing only!)
PRIVATE_KEY=0x_your_private_key_here
```

## Step 3: Your First Bridge

Create a file `my-first-bridge.ts`:

```typescript
import 'dotenv/config';
import { StablecoinKit } from '@circle-fin/stablecoin-kit';
import { createViemAdapterFromPrivateKey } from '@circle-fin/adapter-viem-v2';

async function bridgeUSDC() {
  // Initialize the SDK
  const kit = new StablecoinKit();

  // Create adapter from your private key
  const adapter = createViemAdapterFromPrivateKey({
    privateKey: process.env.PRIVATE_KEY as string,
  });

  // Bridge 10 USDC from Ethereum to Base
  console.log('Starting bridge...');

  const result = await kit.bridge({
    from: { adapter, chain: "Ethereum" },
    to: { adapter, chain: "Base" },
    amount: "10.00"
  });

  console.log('Bridge complete!');
  console.log('State:', result.state);

  // Print transaction links
  result.steps.forEach((step, i) => {
    console.log(`Step ${i + 1}: ${step.action}`);
    console.log(`TX: ${step.explorerUrl}`);
  });
}

bridgeUSDC().catch(console.error);
```

Run it:

```bash
npm run dev my-first-bridge.ts
```

## Step 4: Add a Swap

Create `my-first-swap.ts`:

```typescript
import 'dotenv/config';
import { StablecoinKit } from '@circle-fin/stablecoin-kit';
import { createViemAdapterFromPrivateKey } from '@circle-fin/adapter-viem-v2';

async function swapTokens() {
  const kit = new StablecoinKit();

  const adapter = createViemAdapterFromPrivateKey({
    privateKey: process.env.PRIVATE_KEY as string,
  });

  // Swap 10 USDT for USDC on Ethereum
  console.log('Starting swap...');

  const result = await kit.swap({
    from: { adapter, chain: "Ethereum" },
    tokenIn: "USDT",
    tokenOut: "USDC",
    amount: "10.00",
    config: {
      kitKey: process.env.KIT_KEY as string
    }
  });

  console.log('Swap complete!');
  console.log('TX:', result.explorerUrl);
  console.log('Fees:', result.fees);
}

swapTokens().catch(console.error);
```

Run it:

```bash
npm run dev my-first-swap.ts
```

## Common Patterns

### Estimate Before Executing

```typescript
// Estimate bridge cost
const estimate = await kit.estimateBridge({
  from: { adapter, chain: "Ethereum" },
  to: { adapter, chain: "Base" },
  amount: "100.00"
});

console.log('Estimated fees:', estimate.fees);

// Show to user, then proceed
const result = await kit.bridge({...});
```

### Track Progress with Events

```typescript
// Listen for bridge events
kit.on('bridge.burn', (payload) => {
  console.log('Step 1/2: USDC burned on source chain');
});

kit.on('bridge.mint', (payload) => {
  console.log('Step 2/2: USDC minted on destination');
});

// Execute bridge
await kit.bridge({...});
```

### Collect Fees

```typescript
// Add a fee to your operation
const result = await kit.bridge({
  from: { adapter, chain: "Ethereum" },
  to: { adapter, chain: "Base" },
  amount: "100.00",
  config: {
    customFee: {
      value: "1.00",  // $1 fee
      recipientAddress: "0xYourAddress"
    }
  }
});
```

## Next Steps

Explore more examples:

- **Send Tokens**: `npm run app-kit:send`
- **Bridge Guide**: `npm run app-kit:bridge`
- **Swap Guide**: `npm run app-kit:swap`
- **Real Workflows**: `npm run app-kit:workflows`
- **Advanced Patterns**: `npm run app-kit:advanced`

## Need Help?

- [Circle App Kit Docs](https://developers.circle.com/app-kit)
- [Circle Developer Console](https://console.circle.com/)
- [Get a Kit Key](https://console.circle.com/)

## Testnet Faucets

Get testnet tokens:
- **Ethereum Sepolia**: https://sepoliafaucet.com/
- **Base Sepolia**: https://portal.cdp.coinbase.com/products/faucet
- **USDC Faucet**: https://faucet.circle.com/

## Security Notes

- Never commit your `.env` file
- Never share your private keys
- Test on testnets first
- Use separate wallets for development and production
