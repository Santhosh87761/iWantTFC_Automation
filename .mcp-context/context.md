# Mobile Testing Framework — WebDriverIO + Appium (Android)

## Framework Overview
This is a comprehensive mobile test automation framework built with **WebDriverIO v9+** and **Appium** for Android app testing. The framework follows best practices for maintainable, scalable mobile test automation.

## Architecture Layers
1) **Tests**: BDD-style test scenarios that orchestrate user flows by calling **Business Functions**. Use Gherkin syntax with Given-When-Then structure.
2) **Business Functions**: Express user intent and business logic; compose Page Objects; handle test data and validations.
3) **Page Objects**: Own mobile selectors, waits, and element interactions; expose semantic methods for UI actions.
4) **Test Data**: JSON files containing validation messages, test inputs, and expected results.

## Technology Stack
- **WebDriverIO v9.21+**: Test automation framework
- **Appium**: Mobile automation server
- **UiAutomator2**: Android automation driver  
- **TypeScript**: Type-safe test development
- **Mocha**: Test runner with BDD support
- **Allure**: Test reporting and documentation
- **JSON**: External test data management

## Mobile-Specific Patterns

### Selector Strategy
- **Primary**: `accessibility id` for stable element 
identification
-**Secondary**: `id`, `resource id`,`class name`, when accessibility id unavailable
-**Fallback**: `-android uiautomator` for complex element queries
- **Avoid**: XPath selectors unless absolutely necessary
