/**
 * USE CASE: Cross-Chain DEX (Decentralized Exchange)
 *
 * ===========================
 * BUSINESS SCENARIO
 * ===========================
 *
 * You're building a DEX that allows users to swap tokens across different blockchains
 * in a single transaction. Users want to convert tokens they have on one chain to
 * different tokens on another chain without manually bridging.
 *
 * PROBLEM:
 * - User has USDT on Ethereum but wants USDC on Base
 * - Existing DEXs only work within a single chain
 * - Manual process: Swap → Bridge → (optional) Swap again
 * - Users find this complex and time-consuming
 *
 * SOLUTION WITH APP KIT:
 * 1. Accept any token on any supported chain as input
 * 2. Automatically swap to USDC if needed (for bridging)
 * 3. Bridge USDC to destination chain
 * 4. Automatically swap to desired output token if needed
 * 5. All in one seamless transaction flow
 *
 * ===========================
 * BUSINESS LOGIC FLOW
 * ===========================
 *
 * Scenario: User has 100 USDT on Ethereum, wants USDC on Base
 *
 * Step 1: Analyze the swap request
 *   - Input: 100 USDT on Ethereum
 *   - Output: USDC on Base
 *   - Strategy: Swap → Bridge
 *
 * Step 2: Swap on source chain (if needed)
 *   - If input token !== USDC, swap to USDC
 *   - USDT → USDC on Ethereum
 *
 * Step 3: Bridge to destination chain
 *   - Bridge USDC from Ethereum → Base
 *   - User can choose FAST or SLOW
 *
 * Step 4: Swap on destination chain (if needed)
 *   - If output token !== USDC, swap from USDC
 *   - Already USDC, so skip this step
 *
 * Step 5: Return result to user
 *   - Show final amount received
 *   - Provide transaction links
 *   - Display total fees paid
 *
 * ===========================
 * SUPPORTED SCENARIOS
 * ===========================
 *
 * 1. Same token, different chains
 *    - USDC Ethereum → USDC Base (bridge only)
 *
 * 2. Different token, same chain
 *    - USDT → USDC on Ethereum (swap only)
 *
 * 3. Different tokens, different chains (most complex)
 *    - USDT Ethereum → USDC Base (swap + bridge)
 *    - USDT Ethereum → DAI Base (swap + bridge + swap)
 *
 * ===========================
 * BENEFITS
 * ===========================
 *
 * For Users:
 * ✓ Single interface for cross-chain swaps
 * ✓ No need to understand bridging
 * ✓ Automatic routing finds best path
 * ✓ Clear upfront fee disclosure
 *
 * For DEX Platform:
 * ✓ Unique competitive advantage
 * ✓ Can charge fees on each step
 * ✓ Aggregate more liquidity
 * ✓ Better user retention
 */

import 'dotenv/config';
import { StablecoinKit } from '@circle-fin/stablecoin-kit';
import { createViemAdapterFromPrivateKey } from '@circle-fin/adapter-viem-v2';
import { inspect } from 'util';

// ===========================
// TYPE DEFINITIONS
// ===========================

interface CrossChainSwapRequest {
  // Input (what user has)
  inputToken: string;               // e.g., "USDT"
  inputChain: string;               // e.g., "Ethereum"
  inputAmount: string;              // e.g., "100.00"

  // Output (what user wants)
  outputToken: string;              // e.g., "USDC"
  outputChain: string;              // e.g., "Base"

  // Options
  maxSlippageBps?: number;          // Max slippage for swaps (default: 300 = 3%)
  bridgeSpeed?: 'FAST' | 'SLOW';    // Bridge speed preference (default: FAST)
  minOutputAmount?: string;         // Minimum acceptable output
}

interface SwapStep {
  type: 'swap' | 'bridge';
  chain: string;
  description: string;
  tokenIn?: string;
  tokenOut?: string;
  amount: string;
  txHash?: string;
  explorerUrl?: string;
  fees?: Array<{ token: string; amount: string; type: string }>;
}

interface CrossChainSwapResult {
  success: boolean;
  steps: SwapStep[];
  inputAmount: string;
  outputAmount: string;
  totalFees: string;
  executionTime: number;            // milliseconds
  error?: string;
}

// ===========================
// SWAP STRATEGY PLANNER
// ===========================

function planSwapStrategy(request: CrossChainSwapRequest): SwapStep[] {
  const steps: SwapStep[] = [];

  const needsInitialSwap = request.inputToken !== 'USDC';
  const needsBridge = request.inputChain !== request.outputChain;
  const needsFinalSwap = request.outputToken !== 'USDC';

  // Step 1: Swap to USDC on source chain (if needed)
  if (needsInitialSwap) {
    steps.push({
      type: 'swap',
      chain: request.inputChain,
      description: `Swap ${request.inputToken} to USDC on ${request.inputChain}`,
      tokenIn: request.inputToken,
      tokenOut: 'USDC',
      amount: request.inputAmount
    });
  }

  // Step 2: Bridge USDC to destination chain (if needed)
  if (needsBridge) {
    steps.push({
      type: 'bridge',
      chain: `${request.inputChain} → ${request.outputChain}`,
      description: `Bridge USDC from ${request.inputChain} to ${request.outputChain}`,
      tokenIn: 'USDC',
      tokenOut: 'USDC',
      amount: needsInitialSwap ? 'calculated after swap' : request.inputAmount
    });
  }

  // Step 3: Swap from USDC to desired token on destination (if needed)
  if (needsFinalSwap) {
    steps.push({
      type: 'swap',
      chain: request.outputChain,
      description: `Swap USDC to ${request.outputToken} on ${request.outputChain}`,
      tokenIn: 'USDC',
      tokenOut: request.outputToken,
      amount: 'calculated after bridge'
    });
  }

  return steps;
}

// ===========================
// MAIN CROSS-CHAIN SWAP
// ===========================

async function executeCrossChainSwap(
  request: CrossChainSwapRequest
): Promise<CrossChainSwapResult> {
  const kit = new StablecoinKit();
  const adapter = createViemAdapterFromPrivateKey({
    privateKey: process.env.PRIVATE_KEY as string,
  });

  const startTime = Date.now();
  const result: CrossChainSwapResult = {
    success: false,
    steps: [],
    inputAmount: request.inputAmount,
    outputAmount: '0',
    totalFees: '0',
    executionTime: 0
  };

  console.log('\n=== Cross-Chain Swap ===\n');
  console.log('Request:');
  console.log(`  Input: ${request.inputAmount} ${request.inputToken} on ${request.inputChain}`);
  console.log(`  Output: ${request.outputToken} on ${request.outputChain}`);

  // Plan the strategy
  const strategy = planSwapStrategy(request);
  console.log('\nExecution Strategy:');
  strategy.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step.description}`);
  });
  console.log('');

  try {
    let currentAmount = request.inputAmount;
    let currentToken = request.inputToken;
    let currentChain = request.inputChain;

    // Execute each step
    for (let i = 0; i < strategy.length; i++) {
      const step = strategy[i];
      console.log(`--- Step ${i + 1}/${strategy.length}: ${step.description} ---`);

      if (step.type === 'swap') {
        // Execute swap
        console.log(`Swapping ${currentAmount} ${step.tokenIn} → ${step.tokenOut}`);

        const swapResult = await kit.swap({
          from: { adapter, chain: step.chain },
          tokenIn: step.tokenIn!,
          tokenOut: step.tokenOut!,
          amount: currentAmount,
          config: {
            kitKey: process.env.KIT_KEY as string,
            slippageBps: request.maxSlippageBps || 300
          }
        });

        // Update current state
        currentAmount = swapResult.amount;
        currentToken = step.tokenOut!;

        // Record step
        result.steps.push({
          ...step,
          amount: currentAmount,
          txHash: swapResult.txHash,
          explorerUrl: swapResult.explorerUrl,
          fees: swapResult.fees
        });

        console.log(`✓ Swap complete`);
        console.log(`  Received: ${currentAmount} ${currentToken}`);
        console.log(`  TX: ${swapResult.txHash}`);
        console.log(`  Fees:`, swapResult.fees);

      } else if (step.type === 'bridge') {
        // Execute bridge
        console.log(`Bridging ${currentAmount} USDC`);

        const bridgeResult = await kit.bridge({
          from: { adapter, chain: currentChain },
          to: { adapter, chain: request.outputChain },
          amount: currentAmount,
          config: {
            transferSpeed: request.bridgeSpeed || 'FAST'
          }
        });

        // Update current state
        currentChain = request.outputChain;

        // Record step
        result.steps.push({
          ...step,
          amount: currentAmount,
          txHash: bridgeResult.steps[0]?.txHash,
          explorerUrl: bridgeResult.steps[0]?.explorerUrl,
          fees: bridgeResult.fees
        });

        console.log(`✓ Bridge complete`);
        console.log(`  State: ${bridgeResult.state}`);
        bridgeResult.steps.forEach((s, idx) => {
          console.log(`  Step ${idx + 1}: ${s.action} - ${s.txHash}`);
        });
      }

      console.log('');
    }

    // Final result
    result.success = true;
    result.outputAmount = currentAmount;
    result.executionTime = Date.now() - startTime;

    // Calculate total fees
    const allFees = result.steps.flatMap(s => s.fees || []);
    const totalFeesNum = allFees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
    result.totalFees = totalFeesNum.toFixed(4);

    console.log('=== ✓ Cross-Chain Swap Complete ===\n');
    console.log('Summary:');
    console.log(`  Input: ${result.inputAmount} ${request.inputToken} on ${request.inputChain}`);
    console.log(`  Output: ${result.outputAmount} ${request.outputToken} on ${request.outputChain}`);
    console.log(`  Total Fees: ${result.totalFees} (various tokens)`);
    console.log(`  Execution Time: ${(result.executionTime / 1000).toFixed(1)}s`);
    console.log(`  Steps Completed: ${result.steps.length}`);

  } catch (error: any) {
    result.success = false;
    result.error = error.message;
    result.executionTime = Date.now() - startTime;

    console.error('\n✗ Cross-Chain Swap Failed');
    console.error(`Error: ${error.message}`);
  }

  return result;
}

// ===========================
// ESTIMATE BEFORE EXECUTION
// ===========================

async function estimateCrossChainSwap(
  request: CrossChainSwapRequest
): Promise<{
  estimatedOutput: string;
  estimatedFees: string;
  steps: SwapStep[];
}> {
  const kit = new StablecoinKit();
  const adapter = createViemAdapterFromPrivateKey({
    privateKey: process.env.PRIVATE_KEY as string,
  });

  console.log('\n=== Estimating Cross-Chain Swap ===\n');

  const strategy = planSwapStrategy(request);
  let estimatedAmount = request.inputAmount;
  let estimatedFees = 0;

  for (const step of strategy) {
    if (step.type === 'swap') {
      // Estimate swap
      const estimate = await kit.estimateSwap({
        from: { adapter, chain: step.chain },
        tokenIn: step.tokenIn!,
        tokenOut: step.tokenOut!,
        amount: estimatedAmount,
        config: { kitKey: process.env.KIT_KEY as string }
      });

      console.log(`${step.description}:`);
      console.log(`  Input: ${estimatedAmount}`);
      console.log(`  Estimated Output: ${estimate.estimatedOutput}`);
      console.log(`  Fees:`, estimate.fees);

      estimatedAmount = estimate.estimatedOutput;
      estimatedFees += estimate.fees.reduce((sum, f) => sum + parseFloat(f.amount), 0);

    } else if (step.type === 'bridge') {
      // Estimate bridge
      const estimate = await kit.estimateBridge({
        from: { adapter, chain: request.inputChain },
        to: { adapter, chain: request.outputChain },
        amount: estimatedAmount,
        config: { transferSpeed: request.bridgeSpeed || 'FAST' }
      });

      console.log(`${step.description}:`);
      console.log(`  Amount: ${estimatedAmount}`);
      console.log(`  Gas Fees:`, estimate.gasFees);
      console.log(`  Bridge Fees:`, estimate.fees);

      estimatedFees += estimate.fees.reduce((sum, f) => sum + parseFloat(f.amount), 0);
    }
  }

  console.log('\nEstimation Summary:');
  console.log(`  You will receive approximately: ${estimatedAmount} ${request.outputToken}`);
  console.log(`  Total fees: ~${estimatedFees.toFixed(4)}`);

  return {
    estimatedOutput: estimatedAmount,
    estimatedFees: estimatedFees.toFixed(4),
    steps: strategy
  };
}

// ===========================
// EXAMPLE USAGE
// ===========================

async function runExamples() {
  console.log('=== Cross-Chain DEX Examples ===\n');

  // Check environment
  if (!process.env.PRIVATE_KEY || !process.env.KIT_KEY) {
    console.log('⚠️  Missing required environment variables:');
    console.log('   - PRIVATE_KEY: Your wallet private key');
    console.log('   - KIT_KEY: Your Circle Kit API key');
    console.log('\nSet these in your .env file to run examples.\n');
    return;
  }

  // Example 1: Different token, different chain (swap + bridge)
  console.log('Example 1: USDT on Ethereum → USDC on Base\n');

  const swap1: CrossChainSwapRequest = {
    inputToken: 'USDT',
    inputChain: 'Ethereum',
    inputAmount: '100.00',
    outputToken: 'USDC',
    outputChain: 'Base',
    bridgeSpeed: 'FAST',
    maxSlippageBps: 50  // 0.5% slippage
  };

  console.log('This swap requires:');
  console.log('  1. Swap USDT → USDC on Ethereum');
  console.log('  2. Bridge USDC from Ethereum → Base');
  console.log('\nTo execute, uncomment the line below:\n');

  // Uncomment to run:
  // const result1 = await executeCrossChainSwap(swap1);
  // console.log('\nResult:', result1);

  // Example 2: Same token, different chain (bridge only)
  console.log('\n---\n');
  console.log('Example 2: USDC on Ethereum → USDC on Polygon\n');

  const swap2: CrossChainSwapRequest = {
    inputToken: 'USDC',
    inputChain: 'Ethereum',
    inputAmount: '50.00',
    outputToken: 'USDC',
    outputChain: 'Polygon',
    bridgeSpeed: 'SLOW'  // Free bridge
  };

  console.log('This is simpler - only bridge needed:');
  console.log('  1. Bridge USDC from Ethereum → Polygon (FREE with SLOW mode)');

  // Uncomment to run:
  // const result2 = await executeCrossChainSwap(swap2);

  // Example 3: Complex - different tokens on different chains
  console.log('\n---\n');
  console.log('Example 3: USDT on Ethereum → DAI on Base\n');

  const swap3: CrossChainSwapRequest = {
    inputToken: 'USDT',
    inputChain: 'Ethereum',
    inputAmount: '100.00',
    outputToken: 'DAI',
    outputChain: 'Base',
    bridgeSpeed: 'FAST'
  };

  console.log('Most complex scenario - three steps:');
  console.log('  1. Swap USDT → USDC on Ethereum');
  console.log('  2. Bridge USDC from Ethereum → Base');
  console.log('  3. Swap USDC → DAI on Base');

  // Uncomment to run:
  // const result3 = await executeCrossChainSwap(swap3);

  // Example 4: Estimate before executing
  console.log('\n---\n');
  console.log('Example 4: Estimate Before Executing\n');

  console.log('Always estimate first to show users expected output:');

  // Uncomment to run:
  // const estimate = await estimateCrossChainSwap(swap1);
  // console.log('\nShow this to user, then execute if they approve:');
  // if (userApproves) {
  //   const result = await executeCrossChainSwap(swap1);
  // }

  console.log('\n---\n');
  console.log('To run these examples:');
  console.log('1. Set up your .env with PRIVATE_KEY and KIT_KEY');
  console.log('2. Fund your wallet with the input tokens');
  console.log('3. Uncomment the execution lines above');
  console.log('4. Run: npm run dev examples/app-kit/03-cross-chain-dex.ts');
}

// ===========================
// UI INTEGRATION EXAMPLE
// ===========================

/*
SAMPLE UI FLOW:

1. User Interface:
   ┌─────────────────────────────────────┐
   │ From:                               │
   │   [100] [USDT ▼] [Ethereum ▼]      │
   │                                     │
   │ To:                                 │
   │   [~99.8] [USDC ▼] [Base ▼]        │
   │                                     │
   │ ⚡ Fast (~2 min) | 🐌 Slow (~20 min)│
   │                                     │
   │ Estimated fees: $0.20               │
   │                                     │
   │         [  Swap  ]                  │
   └─────────────────────────────────────┘

2. On "Swap" click:
   - Call estimateCrossChainSwap()
   - Show confirmation modal with exact amounts
   - User approves
   - Call executeCrossChainSwap()

3. Show progress:
   ┌─────────────────────────────────────┐
   │ ✓ Swapping USDT to USDC...          │
   │ ⏳ Bridging to Base...              │
   │ ⏹ Finalizing...                     │
   └─────────────────────────────────────┘

4. Success screen:
   ┌─────────────────────────────────────┐
   │ ✓ Swap Complete!                    │
   │                                     │
   │ You received: 99.8 USDC on Base     │
   │                                     │
   │ [View Transaction]                  │
   └─────────────────────────────────────┘
*/

// ===========================
// INTEGRATION TIPS
// ===========================

/*
PRODUCTION CHECKLIST:

1. Always estimate first:
   - Show user exact output amount
   - Display all fees upfront
   - Calculate price impact
   - Show exchange rate

2. Handle edge cases:
   - Insufficient balance
   - Token not supported
   - Slippage exceeded
   - Bridge delays
   - Network congestion

3. User experience:
   - Real-time progress updates
   - Transaction links at each step
   - Estimated completion time
   - Cancel option (before execution)

4. Safety features:
   - Maximum slippage protection
   - Minimum output amount
   - Timeout handling
   - Retry logic

5. Advanced features:
   - Route optimization (find cheapest path)
   - Split orders for better rates
   - Limit orders
   - Historical swap data

6. Monetization:
   - Collect fee on swaps
   - Premium fast bridge option
   - Affiliate commissions
   - Volume discounts
*/

runExamples().catch(console.error);
