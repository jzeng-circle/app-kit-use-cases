/**
 * Circle Bridge Kit Example
 *
 * This example demonstrates how to use Circle's Bridge Kit for cross-chain transfers.
 * Note: Circle Bridge Kit is typically used in frontend applications.
 * For backend integration, you'll use Circle's API directly.
 */

import 'dotenv/config';

async function circleBridgeExample() {
  console.log('=== Circle Bridge Kit Example ===\n');

  // Circle Bridge is primarily a frontend SDK
  // For backend/Node.js usage, you would interact with Circle's API directly

  const exampleBridgeRequest = {
    source: {
      chain: 'ETH',
      amount: '100',
      currency: 'USDC'
    },
    destination: {
      chain: 'AVAX',
      address: '0x...'
    }
  };

  console.log('Example bridge request structure:', exampleBridgeRequest);
  console.log('\nNote: To use Circle Bridge Kit in a web application:');
  console.log('1. Install: npm install @circle-fin/circle-bridge-kit');
  console.log('2. Initialize the widget in your React/Vue/Angular app');
  console.log('3. Configure supported chains and tokens');

  // For backend API integration with Circle
  console.log('\n--- Circle API Integration ---');
  console.log('API Key configured:', !!process.env.CIRCLE_API_KEY);

  if (!process.env.CIRCLE_API_KEY) {
    console.log('\n⚠️  Set CIRCLE_API_KEY in your .env file to make API calls');
    return;
  }

  // Example: Making a Circle API call (placeholder)
  console.log('\nTo interact with Circle\'s backend API:');
  console.log('- Use Circle\'s REST API for transfers and wallet operations');
  console.log('- Endpoint: https://api.circle.com/v1/');
  console.log('- Documentation: https://developers.circle.com/');
}

circleBridgeExample().catch(console.error);
