
<!-- 
Best Practice #5: Structured Code Reviews with Focus on Types
This template helps reviewers focus on type safety and proper interface implementations
-->

## Description
<!-- Describe the changes made in this pull request -->

## Type of change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring (no functional changes, codebase improvements only)

## Type Safety Checklist
- [ ] All type declarations are properly defined
- [ ] No TypeScript `any` types used (except where absolutely necessary)
- [ ] Interface extensions and implementations are complete
- [ ] Static method declarations match their implementations
- [ ] Import/export paths are consistent with the module structure
- [ ] No duplicate type declarations across files

## General Code Quality
- [ ] Code follows the project style guide
- [ ] Tests added for new functionality
- [ ] Documentation updated (comments, README, etc.)
- [ ] No console.log statements left in production code
- [ ] Error handling is appropriate

## Additional Notes
<!-- Any additional information that might be helpful for reviewers -->
