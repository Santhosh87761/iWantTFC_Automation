# Mobile Testing Framework Coding Standards

## General Principles

- Write clean, maintainable, and readable code
- Follow TypeScript best practices and strict typing
- Use descriptive names for tests, functions, and variables
- Keep functions small and focused on single responsibilities
- Write self-documenting code with clear intent

## Selector Strategy

- **Prefer accessibility id over other selectors** for better maintainability
- Use `accessibility id`/ `id` / `resource id'/ `content-desc` for primary element identification
- Use `-android uiautomator` for complex element queries when needed
- Avoid hardcoded XPath selectors unless absolutely necessary
- Use semantic selectors that describe the element's purpose, not implementation


