# Use Case Documentation Guide

Guidelines for creating developer-friendly use case documentation that explains SDK examples step-by-step.

## Purpose

Use case documentation bridges the gap between code and understanding. It helps developers:
1. Understand the business context and value
2. Visualize the complete flow
3. Learn each step with simple explanations
4. Get started quickly with copy-paste examples

## Document Structure

### 1. Title and Business Case

Start with a clear title and business explanation:

```markdown
# [Use Case Name]

## Business Case

### The Problem

You're building [business context] where:
- **Actor 1** wants to [need/pain point]
- **Actor 2** wants to [different need/pain point]
- **Your platform** needs to [platform requirement]
- **Challenge** [key challenge to solve]

### The Solution

[Brief solution description] that:
1. [Key capability 1]
2. [Key capability 2]
3. [Key capability 3]
4. [Key capability 4]

### Cost Savings (if applicable)

**Without Optimization:**
- [Cost breakdown]
- **Total: $X**

**With Optimization:**
- [Improved cost breakdown]
- **Total: $Y (Z% savings!)**
```

**Guidelines:**
- Use bullet points for clarity
- Bold key actors (Customer, Merchant, Platform)
- Quantify benefits when possible
- Keep it under 20 lines

---

### 2. Wallet & Fund Flow Diagram

Provide ASCII art diagram showing the complete flow:

```markdown
## Wallet & Fund Flow Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                        [USE CASE NAME]                              │
└─────────────────────────────────────────────────────────────────────┘

WALLETS:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Wallet 1   │  │   Wallet 2   │  │   Wallet 3   │
│              │  │              │  │              │
│ Token/Chain  │  │ Token/Chain  │  │ Token/Chain  │
└──────────────┘  └──────────────┘  └──────────────┘

FLOW:

Step 1: [Action Name]
    [From] → [To]
    [Brief description]

Step 2: [Action Name]
    [From] → [To]
    [Brief description]

[Continue for all steps...]

FINAL STATE:
- [Actor 1]: [Outcome]
- [Actor 2]: [Outcome]
- [Actor 3]: [Outcome]
\`\`\`
```

**Guidelines:**
- Use simple ASCII boxes for wallets
- Show token types and chains
- Number steps clearly
- Show final state for all actors
- Keep under 50 lines

---

### 3. Code Walkthrough

Break down the code step-by-step with explanations:

```markdown
## Code Walkthrough

### Step 1: [Step Name]

\`\`\`typescript
// Show actual code snippet
async function exampleFunction() {
  // Key code here
}
\`\`\`

**What this does:**
- [Key point 1]
- [Key point 2]
- [Key point 3]

**Customer sees:** (if applicable)
\`\`\`
[User-facing output]
\`\`\`

---

### Step 2: [Next Step Name]

[Repeat pattern...]
```

**Guidelines for each step:**
- Show **actual working code** (not pseudo-code)
- Keep code snippets focused (10-20 lines max)
- Use "What this does" section with 3-5 bullet points
- Add "Customer sees" or "Result" for user-facing steps
- Add horizontal rule `---` between steps

**Example Breakdown:**

```markdown
### Step 3: Monitor for Payment

\`\`\`typescript
async function monitorPayment(session: PaymentSession): Promise<boolean> {
  for (let attempt = 0; attempt < 60; attempt++) {
    const balance = await adapter.getBalance({
      walletId: session.walletId,
      token: session.expectedToken
    });

    if (parseFloat(balance.amount) >= parseFloat(session.expectedAmount)) {
      return true;
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  return false;
}
\`\`\`

**What this does:**
- Polls wallet balance every 5 seconds
- Checks if expected amount was received
- Returns `true` when payment confirmed
- Times out after 5 minutes

**Result:** Customer gets instant order confirmation!
```

---

### 4. Complete Example Script

Provide a full, runnable example:

```markdown
## Complete Example Script

### Prerequisites

\`\`\`bash
# Installation commands
npm install package1 package2

# Setup commands
touch .env
\`\`\`

### Environment Variables

\`\`\`bash
# .env
API_KEY=your_api_key
WALLET_ID=your_wallet_id
# ... all required vars
\`\`\`

### Full Code

\`\`\`typescript
// Complete, runnable code
// Include all imports
// Include all functions
// Include execution code
\`\`\`

### Run the Example

\`\`\`bash
# Exact commands to run
node example.ts

# Or alternative
npx ts-node example.ts
\`\`\`
```

**Guidelines:**
- **Must be fully runnable** - no placeholders
- Include ALL imports and dependencies
- Include environment variable template
- Show exact commands to execute
- Test that it actually works before documenting

---

### 5. Key Takeaways

Summarize the most important points:

```markdown
## Key Takeaways

### 1. **[Takeaway Title]**
- [Explanation]
- [Why it matters]

### 2. **[Next Takeaway Title]**
- [Explanation]
- [Why it matters]

[Continue for 3-5 key points...]
```

**Guidelines:**
- 3-5 key takeaways maximum
- Bold the title
- 2-3 bullet points per takeaway
- Focus on benefits and best practices

---

### 6. Next Steps & Resources

End with actionable next steps:

```markdown
## Next Steps

1. **[Action 1]**: [Brief description]
2. **[Action 2]**: [Brief description]
3. **[Action 3]**: [Brief description]
4. **[Action 4]**: [Brief description]
5. **[Action 5]**: [Brief description]

---

## Resources

- [Link 1 Title](url)
- [Link 2 Title](url)
- [Full Example Code](./filename.ts)
- [Related Documentation](./filename.md)

---

**Questions?** [Where to get help]
```

**Guidelines:**
- 3-5 concrete next steps
- Link to full code example
- Link to related documentation
- Provide support contact

---

## Complete Template

```markdown
# [Use Case Name]

## Business Case

### The Problem
[Bullet points describing the business problem]

### The Solution
[Numbered list of key capabilities]

### Cost Savings
[Before/after comparison if applicable]

---

## Wallet & Fund Flow Diagram

\`\`\`
[ASCII diagram showing wallets and flow]
\`\`\`

---

## Code Walkthrough

### Step 1: [Name]
\`\`\`typescript
[Code snippet]
\`\`\`
**What this does:**
- [Points]

---

### Step 2: [Name]
[Repeat pattern...]

---

## Complete Example Script

### Prerequisites
\`\`\`bash
[Commands]
\`\`\`

### Environment Variables
\`\`\`bash
[.env template]
\`\`\`

### Full Code
\`\`\`typescript
[Complete runnable code]
\`\`\`

### Run the Example
\`\`\`bash
[Execution commands]
\`\`\`

---

## Key Takeaways

### 1. **[Point]**
- [Details]

[Continue...]

---

## Next Steps

1. **[Action]**: [Description]
[Continue...]

---

## Resources

- [Links]

---

**Questions?** [Support info]
```

---

## Writing Tips

### Do's ✅

1. **Start with Business Context**
   - Explain WHY before HOW
   - Use real-world scenarios
   - Quantify benefits

2. **Use Visual Diagrams**
   - ASCII art for simple flows
   - Show all actors/wallets
   - Number steps clearly

3. **Break Code into Steps**
   - One step = one function/concept
   - 10-20 lines of code per step
   - Always explain "what this does"

4. **Provide Complete Examples**
   - Must be copy-pasteable
   - Must actually run
   - Include all dependencies

5. **Make it Scannable**
   - Use headers (###)
   - Use bullet points properly
   - Bold key terms
   - Use horizontal rules (---)

### Don'ts ❌

1. **Don't Write Walls of Text**
   - Break into sections
   - Use lists instead of paragraphs
   - Keep paragraphs under 3 lines

2. **Don't Show Incomplete Code**
   - No "// ... rest of code" comments
   - No "TODO" placeholders
   - Always show working examples

3. **Don't Skip Environment Setup**
   - Document ALL required env vars
   - Show installation commands
   - Explain prerequisites

4. **Don't Use Jargon Without Explanation**
   - Define technical terms
   - Use simple language
   - Assume reader is learning

5. **Don't Make Giant Code Blocks**
   - Break into logical steps
   - Maximum 30 lines per snippet
   - Use "Full Code" section for complete example

6. **Don't Mix Bullet Points and Inline Text**
   - ❌ Bad: "Includes: point 1, point 2, point 3"
   - ✅ Good: Use proper bullet list or write as paragraph
   - Either use full bullet point format or write as a complete sentence
   - Never use "✅" or dashes in a single-line comma-separated list

---

## File Naming Convention

```
[number]-[use-case-name].md

Examples:
01-STABLECOIN-ACQUIRING.md
02-TREASURY-MANAGEMENT.md
03-CROSS-CHAIN-DEX.md
```

**Guidelines:**
- Use numbers for ordering
- Use UPPERCASE for visibility
- Use hyphens for spaces
- Keep names concise

---

## Example: Good vs Bad

### ❌ Bad Example

```markdown
## Payment Processing

This code processes payments using our SDK.

\`\`\`typescript
// Process payment
const result = await processPayment(order);
// ... rest of code
\`\`\`

The function processes the payment and returns a result.
```

**Problems:**
- No business context
- Incomplete code
- No visual flow
- No explanation of what happens
- Can't copy and run

### ✅ Good Example

```markdown
## Step 3: Monitor for Payment

\`\`\`typescript
async function monitorPayment(session: PaymentSession): Promise<boolean> {
  const maxAttempts = 60;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const balance = await adapter.getBalance({
      walletId: session.walletId,
      token: session.expectedToken
    });

    if (parseFloat(balance.amount) >= parseFloat(session.expectedAmount)) {
      console.log('✓ Payment received!');
      return true;
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  return false;
}
\`\`\`

**What this does:**
- Polls wallet balance every 5 seconds for up to 5 minutes
- Checks if customer sent the expected amount
- Returns `true` when payment is confirmed
- Times out and returns `false` if payment not received

**Result:** Customer gets instant order confirmation once payment detected!
```

**Why it's good:**
- Complete, runnable code
- Clear explanation of functionality
- Shows the outcome
- Proper formatting

---

## Checklist for Use Case Documentation

Before publishing, verify:

- [ ] Business case clearly explained (under 20 lines)
- [ ] ASCII diagram shows complete flow
- [ ] Code broken into 4-6 logical steps
- [ ] Each step has "What this does" section
- [ ] Complete runnable example provided
- [ ] All environment variables documented
- [ ] Installation commands included
- [ ] Execution commands shown
- [ ] 3-5 key takeaways listed
- [ ] Next steps are actionable
- [ ] Resources linked
- [ ] Code tested and works
- [ ] File named correctly (XX-NAME.md)

---

## Summary

**Good use case documentation:**
1. Explains the business value first
2. Visualizes the complete flow
3. Breaks code into digestible steps
4. Provides copy-paste examples
5. Ends with clear next actions

**Remember:** Developers should be able to understand and run your example in under 10 minutes.
