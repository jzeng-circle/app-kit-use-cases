/**
 * Circle Web3 Services SDK Example
 *
 * Demonstrates Circle's Programmable Wallets SDK
 * for creating and managing Web3 wallets.
 */

import 'dotenv/config';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/w3s-pw-sdk';

async function circleWeb3Example() {
  console.log('=== Circle Web3 Services SDK Example ===\n');

  if (!process.env.CIRCLE_API_KEY) {
    console.log('⚠️  CIRCLE_API_KEY not found in .env file');
    console.log('Please set your Circle API key to run this example.\n');
    return;
  }

  try {
    // Initialize Circle W3S Client
    const client = initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET || ''
    });

    console.log('✓ Circle W3S Client initialized\n');

    // Example 1: Create a wallet
    console.log('--- Example: Create Wallet ---');
    console.log('To create a wallet, you would call:');
    console.log('const wallet = await client.createWallets({');
    console.log('  accountType: "SCA",');
    console.log('  blockchains: ["POLY-AMOY"],');
    console.log('  count: 1,');
    console.log('  walletSetId: "your-wallet-set-id"');
    console.log('});\n');

    // Example 2: Get wallet information
    console.log('--- Example: Get Wallet ---');
    console.log('const walletInfo = await client.getWallet({ id: "wallet-id" });\n');

    // Example 3: Transfer tokens
    console.log('--- Example: Transfer Tokens ---');
    console.log('const transfer = await client.createTransaction({');
    console.log('  walletId: "wallet-id",');
    console.log('  blockchain: "POLY-AMOY",');
    console.log('  tokenAddress: "0x...",');
    console.log('  destinationAddress: "0x...",');
    console.log('  amount: ["1.5"]');
    console.log('});\n');

    console.log('📚 Documentation: https://developers.circle.com/w3s/docs');

  } catch (error) {
    console.error('Error:', error);
  }
}

circleWeb3Example().catch(console.error);
