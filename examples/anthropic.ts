/**
 * Anthropic SDK Example
 *
 * Demonstrates how to use the Anthropic SDK to interact with Claude API.
 */

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

async function anthropicExample() {
  console.log('=== Anthropic SDK Example ===\n');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️  ANTHROPIC_API_KEY not found in .env file');
    console.log('Get your API key from: https://console.anthropic.com/\n');
    return;
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    // Example 1: Simple message
    console.log('--- Example 1: Simple Message ---');
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: 'What are the key benefits of using blockchain technology?'
        }
      ],
    });

    console.log('Response:', message.content[0].type === 'text' ? message.content[0].text : '');
    console.log('\n');

    // Example 2: Streaming response
    console.log('--- Example 2: Streaming Response ---');
    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: 'Explain USDC in one sentence.'
        }
      ],
      stream: true,
    });

    process.stdout.write('Streaming: ');
    for await (const event of stream) {
      if (event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta') {
        process.stdout.write(event.delta.text);
      }
    }
    console.log('\n\n');

    // Example 3: System prompt with structured output
    console.log('--- Example 3: With System Prompt ---');
    const structuredMessage = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: 'You are a blockchain expert. Provide concise technical answers.',
      messages: [
        {
          role: 'user',
          content: 'What is the difference between ETH and USDC?'
        }
      ],
    });

    console.log('Response:', structuredMessage.content[0].type === 'text' ? structuredMessage.content[0].text : '');
    console.log('\n');

    console.log('✓ All examples completed successfully');
    console.log('📚 Documentation: https://docs.anthropic.com/');

  } catch (error) {
    console.error('Error:', error);
  }
}

anthropicExample().catch(console.error);
