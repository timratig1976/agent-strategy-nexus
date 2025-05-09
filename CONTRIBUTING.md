
# Contributing Guidelines

## Best Practices for Type Safety

Our codebase follows these 5 key best practices for preventing build errors:

### 1. Centralized Type Definitions
- All shared interfaces and types are defined in `src/services/ai/types.ts`
- Don't define the same interface in multiple files
- Use explicit type imports: `import type { MyType } from './types'`

### 2. Proper Static Class Extensions
- When adding static methods to classes, update the class interface
- Use declaration merging with TypeScript interfaces when extending classes
- Document all static method additions clearly

### 3. Strict TypeScript Configuration
- We use strict type checking settings in our ESLint configuration
- Use TypeScript's built-in type checking during development
- Avoid using `any` types wherever possible

### 4. Automated Type Safety Tests
- Special test files validate our type definitions and API signatures
- Run TypeScript type checking as part of CI/CD pipelines
- Write proper return types for all functions

### 5. Structured Code Reviews for Type Safety
- Follow the PR template when submitting changes
- Pay special attention to type declarations in code reviews
- Use pre-commit hooks to prevent type errors from being committed

## Setting up pre-commit hooks

```bash
# Make pre-commit hook executable
chmod +x .hooks/pre-commit

# Set up git hooks directory
git config core.hooksPath .hooks
```
