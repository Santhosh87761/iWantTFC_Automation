# context.md

## Framework Standards & Structure

- **Spec files** (e.g., sanity.spec.ts):
  - Only call business logic methods from the business logic layer.
  - No raw selectors or direct element interaction in spec files.
  - Each test case should be concise and readable, delegating all actions and assertions to business logic methods.

- **Business Logic files** (e.g., sanityBusinessLogic.ts):
  - Contain all test actions and assertions as reusable static async methods.
  - Each business logic method should encapsulate a complete user flow or logical group of actions/assertions (e.g., playAndControlPlayer, verifyPlayerControlsFunctionality).
  - Use ElementHelper and AssertionHelper for all element interactions and assertions.
  - No direct selectors; always use locators from PageObject files.
  - Platform handling must use the Platform enum.

- **PageObject files** (e.g., sanityPageLocator.ts):
  - Store all selectors/locators, mapped by platform using the Platform enum.
  - No logic or test code, only locator definitions.

- **Enums**:
  - Platform enum is used for all platform-specific logic and locator mapping.

## Naming Conventions
- Use camelCase for methods and variables.
- Use PascalCase for classes and enums.
- Business logic methods should be descriptive of the user action or verification.

## Example Test Flow

```
// sanity.spec.ts
it('Verify the player controls (Pause, play, Seek forward, backward, Full screen, subtitle, Volume)', async () => {
  await sanityBusinessLogic.loginToIwant(loginTestData.validCredentials.email, loginTestData.validCredentials.password);
  await sanityBusinessLogic.playAndControlPlayer();
  await sanityBusinessLogic.verifyPlayerControlsFunctionality();
});

// sanityBusinessLogic.ts
static async playAndControlPlayer(): Promise<void> {
  await ElementHelper.cmdClick(sanityPageLocator.freetraycontentsLinks[this.platform][0]);
  await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);
  // ...other player actions...
  await ElementHelper.cmdClick(sanityPageLocator.subtitleButton[this.platform][0]);
}

static async verifyPlayerControlsFunctionality(): Promise<void> {
  // ...assertions for player controls...
}
```

## MCP Prompt
Always follow the above structure and standards for all new test scripts and business logic. When prompted for MCP input, ensure your implementation matches this architecture and coding style.
