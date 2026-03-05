# Skills Documentation

This folder contains documentation and guidelines that help maintain consistency across the project.

## Available Skills

### 1. Sample Code Style Guide
**File**: `SAMPLE_CODE_STYLE_GUIDE.md`

Guidelines for writing clean, simple SDK example code:
- Configuration and initialization at the top
- Descriptive adapter naming
- Helper functions at the bottom
- Minimal logging (< 3 lines)
- Inline comments for logic
- Global configs (not in interfaces)
- Autonomous, runnable examples
- File size targets (100-600 lines)

**Use when**: Writing any SDK example or sample code

### 2. Use Case Documentation Guide
**File**: `USE_CASE_DOCUMENTATION_GUIDE.md`

Guidelines for creating developer-friendly use case documentation:
- Business case explanation
- Wallet & fund flow diagrams (ASCII art)
- Step-by-step code walkthrough
- Complete runnable example scripts
- Key takeaways and next steps
- Must be copy-paste ready

**Use when**: Creating documentation (`.md` files) that explain SDK examples to developers

---

## How to Use

When writing code for this project:

1. Check if there's a relevant skill document in this folder
2. Follow the guidelines and best practices
3. Reference the examples provided
4. Update the skill document if you discover new best practices

### Writing SDK Examples

1. Follow `SAMPLE_CODE_STYLE_GUIDE.md` for code structure
2. Follow `USE_CASE_DOCUMENTATION_GUIDE.md` for documentation
3. Code goes in `.ts` files, documentation in `.md` files
4. Keep code under 600 lines, documentation under 1000 lines

## Adding New Skills

To add a new skill:

1. Create a new `.md` file in this folder
2. Use a descriptive name (e.g., `API_TESTING_GUIDE.md`)
3. Include clear examples and guidelines
4. Update this README with a link and description

---

**Last Updated**: 2026-03-04
