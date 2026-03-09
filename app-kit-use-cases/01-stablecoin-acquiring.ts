/**
 * Stablecoin Acquiring with Aggregation & Batch Processing
 *
 * Flow:
 * 1. Customer pays to temporary address → Order confirmed immediately
 * 2. Funds aggregated to internal wallet
 * 3. Batch swap (hourly) - all USDT, all DAI → USDC
 * 4. Settlement (daily/on-demand) - bridge to merchants with fee collection
 *
 * Benefits: 85% gas savings at scale through batching
 */

import 'dotenv/config';
import { StablecoinKit } from '@circle-fin/stablecoin-kit';
import { createCircleWalletAdapter } from '@circle-fin/adapter-circle-wallet';

// ===========================
// TYPES
// ===========================

interface PaymentOrder {
  orderId: string;
  merchantId: string;
  orderAmount: string;
  customerToken: string;
  customerChain: string;
}

interface PaymentSession {
  sessionId: string;
  paymentAddress: string;
  walletId: string;
  expectedAmount: string;
  expectedToken: string;
  expiresAt: Date;
}

interface MerchantConfig {
  merchantId: string;
  settlementAddress: string;
  settlementChain: string;
  minimumSettlement: string;
}

// ===========================
// CONFIGURATION
// ===========================

const PLATFORM_FEE_PERCENT = 2.5; // 2.5% processing fee
const SESSION_EXPIRY_MINUTES = 15;
const SLIPPAGE_BPS = 50; // 0.5% slippage tolerance

// ===========================
// INITIALIZATION
// ===========================

const kit = new StablecoinKit();

// Internal wallet adapter (for aggregation, swaps, settlements)
const internalWalletAdapter = createCircleWalletAdapter({
  apiKey: process.env.CIRCLE_API_KEY as string,
  walletId: process.env.INTERNAL_WALLET_ID as string,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET as string
});

// Wallet addresses
const INTERNAL_WALLET_ID = process.env.INTERNAL_WALLET_ID || 'internal-wallet-id';
const PLATFORM_FEE_WALLET = process.env.PLATFORM_FEE_ADDRESS || '0xPlatformFee';

// ===========================
// STEP 1: CREATE PAYMENT SESSION
// ===========================

async function createPaymentSession(order: PaymentOrder): Promise<PaymentSession> {
  // Create temporary wallet for this payment
  const tempWallet = await internalWalletAdapter.createWallet({
    name: `Payment-${order.orderId}`,
    blockchain: order.customerChain
  });

  const amounts = calculateAmounts(order.orderAmount);

  const session: PaymentSession = {
    sessionId: `session_${order.orderId}`,
    paymentAddress: tempWallet.address,
    walletId: tempWallet.id,
    expectedAmount: amounts.total.toFixed(2),
    expectedToken: order.customerToken,
    expiresAt: new Date(Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000)
  };

  console.log(`\n✓ Payment session created`);
  console.log(`  Address: ${session.paymentAddress}`);
  console.log(`  Amount: ${session.expectedAmount} ${order.customerToken}`);

  return session;
}

// ===========================
// STEP 2: MONITOR PAYMENT
// ===========================

async function monitorPayment(session: PaymentSession): Promise<boolean> {
  console.log(`\n⏳ Monitoring for payment...`);
  console.log(`  Address: ${session.paymentAddress}`);
  console.log(`  Token: ${session.expectedToken}`);

  const maxAttempts = 60; // Poll for 5 minutes (60 * 5 seconds)

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Check wallet balance using Circle Wallet API
      const balance = await internalWalletAdapter.getBalance({
        walletId: session.walletId,
        token: session.expectedToken
      });

      const currentBalance = parseFloat(balance.amount);
      const expectedAmount = parseFloat(session.expectedAmount);

      if (currentBalance >= expectedAmount) {
        console.log(`  ✓ Payment received!`);
        console.log(`  Balance: ${balance.amount} ${session.expectedToken}`);
        return true;
      }

      // Wait 5 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 5000));

      if (attempt % 12 === 0) { // Log every minute
        console.log(`  Still waiting... (${Math.floor(attempt / 12)} min)`);
      }
    } catch (error) {
      console.log(`  Error checking balance: ${error}`);
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      console.log(`  ✗ Session expired`);
      return false;
    }
  }

  console.log(`  ✗ Payment timeout`);
  return false;
}

// ===========================
// STEP 3: AGGREGATE TO INTERNAL WALLET
// ===========================

async function aggregateToInternalWallet(
  order: PaymentOrder,
  session: PaymentSession
): Promise<string> {
  const amounts = calculateAmounts(order.orderAmount);

  // Create adapter for temporary payment wallet
  const tempPaymentAdapter = createCircleWalletAdapter({
    apiKey: process.env.CIRCLE_API_KEY as string,
    walletId: session.walletId,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET as string
  });

  // Transfer from temporary wallet to internal wallet
  const result = await kit.send({
    from: { adapter: tempPaymentAdapter, chain: order.customerChain },
    to: INTERNAL_WALLET_ID,
    amount: amounts.total.toFixed(2),
    token: order.customerToken
  });

  console.log(`\n✓ Aggregated to internal wallet`);
  console.log(`  TX: ${result.txHash}`);

  return result.txHash;
}

// ===========================
// STEP 4: BATCH SWAP (Hourly Job)
// ===========================

async function batchSwapToUSDC(
  chain: string,
  token: string,
  orders: PaymentOrder[]
): Promise<string> {
  // Calculate total amount from all orders
  const totalAmount = orders.reduce((sum, o) => {
    const amounts = calculateAmounts(o.orderAmount);
    return sum + amounts.total;
  }, 0);

  if (token === 'USDC') {
    console.log(`\n✓ Already in USDC, no swap needed`);
    return 'no-swap';
  }

  // Swap all accumulated tokens in ONE transaction
  const result = await kit.swap({
    from: { adapter: internalWalletAdapter, chain },
    tokenIn: token,
    tokenOut: 'USDC',
    amount: totalAmount.toFixed(2),
    config: {
      kitKey: process.env.KIT_KEY as string,
      slippageBps: SLIPPAGE_BPS
    }
  });

  console.log(`\n✓ Batch swap completed`);
  console.log(`  ${token} → USDC: ${totalAmount.toFixed(2)}`);
  console.log(`  Orders: ${orders.length}`);
  console.log(`  TX: ${result.txHash}`);

  return result.txHash;
}

// ===========================
// STEP 5: SETTLEMENT (Daily Job)
// ===========================

async function settleMerchant(
  merchant: MerchantConfig,
  orders: PaymentOrder[]
): Promise<string[]> {
  // Calculate totals
  const totalAmount = orders.reduce((sum, o) => {
    const amounts = calculateAmounts(o.orderAmount);
    return sum + amounts.baseAmount;
  }, 0);

  const totalFees = orders.reduce((sum, o) => {
    const amounts = calculateAmounts(o.orderAmount);
    return sum + amounts.fee;
  }, 0);

  console.log(`\n✓ Settling ${orders.length} orders for merchant ${merchant.merchantId}`);
  console.log(`  Amount: $${totalAmount.toFixed(2)} USDC`);
  console.log(`  Fees: $${totalFees.toFixed(2)} USDC`);

  const txHashes: string[] = [];

  // Bridge to merchant with fee collection in ONE transaction
  if (merchant.settlementChain === 'Ethereum') {
    // Same chain - send to merchant and collect fee separately
    const sendResult = await kit.send({
      from: { adapter: internalWalletAdapter, chain: 'Ethereum' },
      to: merchant.settlementAddress,
      amount: totalAmount.toFixed(2),
      token: 'USDC'
    });
    txHashes.push(sendResult.txHash);

    const feeResult = await kit.send({
      from: { adapter: internalWalletAdapter, chain: 'Ethereum' },
      to: PLATFORM_FEE_WALLET,
      amount: totalFees.toFixed(2),
      token: 'USDC'
    });
    txHashes.push(feeResult.txHash);

    console.log(`  Sent: ${sendResult.txHash}`);
    console.log(`  Fee: ${feeResult.txHash}`);
  } else {
    // Different chain - bridge with custom fee (fee collected in ONE transaction)
    const bridgeResult = await kit.bridge({
      from: { adapter: internalWalletAdapter, chain: 'Ethereum' },
      to: {
        adapter: internalWalletAdapter,
        chain: merchant.settlementChain,
        recipientAddress: merchant.settlementAddress
      },
      amount: totalAmount.toFixed(2),
      config: {
        transferSpeed: 'SLOW', // Use SLOW for cost savings
        customFee: {
          value: totalFees.toFixed(2),
          recipientAddress: PLATFORM_FEE_WALLET
        }
      }
    });
    txHashes.push(...bridgeResult.steps.map(s => s.txHash));

    console.log(`  Bridged with fee collection: ${bridgeResult.steps[0].txHash}`);
    console.log(`  Merchant receives: $${totalAmount.toFixed(2)}`);
    console.log(`  Platform fee collected: $${totalFees.toFixed(2)}`);
  }

  return txHashes;
}

// ===========================
// SCHEDULED JOBS
// ===========================

async function hourlyBatchSwapJob() {
  console.log('\n=== HOURLY BATCH SWAP JOB ===');

  // In production: Query DB for pending orders grouped by token
  const usdtOrders: PaymentOrder[] = [
    { orderId: '001', merchantId: 'm1', orderAmount: '100', customerToken: 'USDT', customerChain: 'Ethereum' },
    { orderId: '002', merchantId: 'm2', orderAmount: '50', customerToken: 'USDT', customerChain: 'Ethereum' }
  ];

  if (usdtOrders.length > 0) {
    await batchSwapToUSDC('Ethereum', 'USDT', usdtOrders);
  }

  // Repeat for DAI, other tokens...
}

async function dailySettlementJob() {
  console.log('\n=== DAILY SETTLEMENT JOB ===');

  // In production: Query DB for merchants with pending settlements
  const merchant: MerchantConfig = {
    merchantId: 'm1',
    settlementAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    settlementChain: 'Base',
    minimumSettlement: '100'
  };

  const readyOrders: PaymentOrder[] = [
    { orderId: '001', merchantId: 'm1', orderAmount: '100', customerToken: 'USDT', customerChain: 'Ethereum' },
    { orderId: '002', merchantId: 'm1', orderAmount: '50', customerToken: 'USDT', customerChain: 'Ethereum' }
  ];

  if (readyOrders.length > 0) {
    await settleMerchant(merchant, readyOrders);
  }
}

// ===========================
// EXAMPLE: SINGLE PAYMENT FLOW
// ===========================

async function processSinglePayment() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   STABLECOIN ACQUIRING - SINGLE PAYMENT ║');
  console.log('╚════════════════════════════════════════╝');

  const order: PaymentOrder = {
    orderId: `order_${Date.now()}`,
    merchantId: 'merch_123',
    orderAmount: '100.00',
    customerToken: 'USDT',
    customerChain: 'Ethereum'
  };

  // Step 1: Create payment session
  const session = await createPaymentSession(order);

  console.log(`\n📱 Customer Payment Instructions:`);
  console.log(`   Send ${session.expectedAmount} ${order.customerToken} to:`);
  console.log(`   ${session.paymentAddress}`);
  console.log(`   Expires in ${SESSION_EXPIRY_MINUTES} minutes\n`);

  // Step 2: Monitor for payment
  const received = await monitorPayment(session);

  if (!received) {
    console.log('\n✗ Payment not received - order cancelled');
    return;
  }

  // Step 3: Aggregate to internal wallet
  await aggregateToInternalWallet(order, session);

  console.log('\n✓ Payment flow complete');
  console.log('  Customer: Order confirmed');
  console.log('  Backend: Funds aggregated, awaiting batch processing');
}

// ===========================
// EXAMPLE: BATCH PROCESSING
// ===========================

async function runBatchProcessing() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   STABLECOIN ACQUIRING - BATCH JOBS    ║');
  console.log('╚════════════════════════════════════════╝');

  // Run hourly swap job
  await hourlyBatchSwapJob();

  // Run daily settlement job
  await dailySettlementJob();

  console.log('\n✓ Batch processing complete');
}

// ===========================
// COST COMPARISON
// ===========================

function showCostComparison() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   STABLECOIN ACQUIRING - COST SAVINGS  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('\nIndividual Processing:');
  console.log('  Swaps: 100 × $15 = $1,500');
  console.log('  Bridges: 100 × $10 = $1,000');
  console.log('  Total: $2,500');
  console.log('\nBatch Processing:');
  console.log('  Aggregation: 100 × $2 = $200');
  console.log('  Batch swaps: 3 × $20 = $60');
  console.log('  Settlements: 10 × $10 = $100');
  console.log('  Total: $360');
  console.log('\n  💰 Savings: $2,140 (85%)');
}

// ===========================
// RUN EXAMPLES
// ===========================

async function main() {
  if (!process.env.CIRCLE_API_KEY || !process.env.KIT_KEY) {
    console.log('\n⚠️  Set CIRCLE_API_KEY and KIT_KEY in .env file\n');
    showCostComparison();
    return;
  }

  console.log('\n🚀 Stablecoin Acquiring Ready');
  console.log('   Internal Wallet: ' + INTERNAL_WALLET_ID);
  console.log('   Fee Wallet: ' + PLATFORM_FEE_WALLET);
  console.log('   Platform Fee: ' + PLATFORM_FEE_PERCENT + '%\n');

  // Uncomment to run examples:
  // await processSinglePayment(); // Creates session and waits for real payment
  // await runBatchProcessing();

  showCostComparison();
}

// ===========================
// HELPER FUNCTIONS
// ===========================

function calculateAmounts(orderAmount: string) {
  const baseAmount = parseFloat(orderAmount);
  const fee = baseAmount * PLATFORM_FEE_PERCENT / 100;
  const total = baseAmount + fee;

  return {
    baseAmount,
    fee,
    total
  };
}

main().catch(console.error);
