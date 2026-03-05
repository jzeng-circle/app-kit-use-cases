/**
 * Web3.js and Ethers.js Examples
 *
 * Demonstrates common blockchain interactions using both libraries.
 */

import 'dotenv/config';
import { ethers } from 'ethers';
import Web3 from 'web3';

async function web3Example() {
  console.log('=== Web3.js & Ethers.js Examples ===\n');

  // Check configuration
  const rpcUrl = process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com';
  console.log('Using RPC URL:', rpcUrl);
  console.log('');

  // ======================
  // ETHERS.JS EXAMPLES
  // ======================
  console.log('--- Ethers.js Examples ---\n');

  try {
    // Create provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Example 1: Get block number
    console.log('1. Getting latest block number...');
    const blockNumber = await provider.getBlockNumber();
    console.log(`   Latest block: ${blockNumber}\n`);

    // Example 2: Get account balance
    console.log('2. Getting account balance...');
    const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Vitalik's address
    const balance = await provider.getBalance(vitalikAddress);
    console.log(`   Balance: ${ethers.formatEther(balance)} ETH\n`);

    // Example 3: Get gas price
    console.log('3. Getting current gas price...');
    const feeData = await provider.getFeeData();
    console.log(`   Gas Price: ${ethers.formatUnits(feeData.gasPrice || 0n, 'gwei')} gwei\n`);

    // Example 4: ERC20 Token interaction (USDC on Ethereum)
    console.log('4. Reading USDC token info...');
    const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
    const erc20Abi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)'
    ];

    const usdcContract = new ethers.Contract(usdcAddress, erc20Abi, provider);
    const [name, symbol, decimals] = await Promise.all([
      usdcContract.name(),
      usdcContract.symbol(),
      usdcContract.decimals()
    ]);

    console.log(`   Token: ${name} (${symbol})`);
    console.log(`   Decimals: ${decimals}\n`);

    // Example 5: Parse transaction
    console.log('5. Example transaction parsing...');
    const exampleTx = {
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      value: ethers.parseEther('1.0'),
      gasLimit: 21000
    };
    console.log('   To:', exampleTx.to);
    console.log('   Value:', ethers.formatEther(exampleTx.value), 'ETH');
    console.log('   Gas Limit:', exampleTx.gasLimit.toString(), '\n');

  } catch (error) {
    console.error('Ethers.js error:', error);
  }

  // ======================
  // WEB3.JS EXAMPLES
  // ======================
  console.log('\n--- Web3.js Examples ---\n');

  try {
    const web3 = new Web3(rpcUrl);

    // Example 1: Get network ID
    console.log('1. Getting network ID...');
    const networkId = await web3.eth.net.getId();
    console.log(`   Network ID: ${networkId}\n`);

    // Example 2: Utility functions
    console.log('2. Web3 utility functions...');
    const weiValue = web3.utils.toWei('1', 'ether');
    console.log(`   1 ETH = ${weiValue} wei`);

    const hexValue = web3.utils.toHex('12345');
    console.log(`   12345 in hex = ${hexValue}\n`);

    // Example 3: Generate account (for demo only - don't use in production)
    console.log('3. Generate random account (demo only)...');
    const account = web3.eth.accounts.create();
    console.log(`   Address: ${account.address}`);
    console.log(`   Private Key: ${account.privateKey.slice(0, 10)}...***\n`);

    console.log('✓ All examples completed successfully');

  } catch (error) {
    console.error('Web3.js error:', error);
  }

  console.log('\n📚 Documentation:');
  console.log('   Ethers.js: https://docs.ethers.org/');
  console.log('   Web3.js: https://web3js.readthedocs.io/');
}

web3Example().catch(console.error);
