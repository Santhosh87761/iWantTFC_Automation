# Web and Mobile Testing Framework — WebDriverIO + Appium (Android)

## Framework Overview
This is a comprehensive mobile test automation framework built with **WebDriverIO v9+** and **Appium** for Android app testing. The framework follows best practices for maintainable, scalable mobile test automation.

# ASB — GAP Prompt (Create ONE Business Function + Page Objects WITH DISCOVERY)

The following Gherkin step(s) are **not** covered by any existing ASB Business Function in `apps/ASB/manifest.yaml`.
Before generating code, first **discover the page** to identify stable, resilient locators. Then create ONE new Business Function (BF) and any missing Page Objects (POs).

## Inputs
**Unmet Step(s)**
```



{{unmet_steps}}
```

**Scenario Context (if provided)**
{{gherkin}}

**Data hints (if provided)**


## Phase 0 — Page Discovery (required before code)
1) Navigate from BASE_URL to the relevant page for the unmet step(s).
    - If login/context is needed, use env placeholders: username=<<<USERNAME>>>, password=<<<PASSWORD>>>.
    - If selection is needed, set environment/study/role first.
2) Inventory elements and propose candidate locators, preferring in order:
    - getByTestId → getByRole({ name, exact: true }) → getByLabel → stable attributes.
3) Output:
    - **Element Inventory Table**: #, role, name, candidateLocator, unique?(y/n), rationale.
    - **Locator Decision List**: which locator you’ll use and why.
If no stable locator exists, STOP and output **REQUEST-FOR-TESTIDS** with suggested data-testids (no code generation).

## Phase 1 — Create ONE Business Function (ASB scope only)
1) **Business Function Input/Output**: Use precise input/output types directly in the Business Function file (no DTO files required). Inputs map to JSON keys like selection.environment/study/role/app. Outputs are assertions tests will use (e.g., contextEstablished, catalogContains, launchSuccess, appShellVisible, urlContains).
2) **BF implementation** (`businessFunction/<domain>/<bfName>.ts`): call POs only (no selectors). Timeboxed, deterministic. Return typed result DTO.
3) **PO Needs**: list the PO classes + method signatures (no selectors here). Example:
    - ASBLoginPage.goto(), login(user, pass)
    - ASBDashboardPage.selectEnvironment(name), isStudySelectorEnabled(), selectStudy(name), selectRole(name)
    - ASBCatalogPage.launchAppByName(name), waitForAppShellVisible(), currentUrlContains(fragment)
4) **Page Objects (full code)** under `pageObjects/pages/*.ts` using the chosen locators from discovery. Add comments like `// EI#3` to link decisions.
5) **manifest.yaml patch** with id, name, path, export, inputType, outputType, tags, dependsOn.
6) **Data JSON keys**: show a scenarios[0] object with required keys (secrets as env placeholders).

## Output (strict)
1) DISCOVERY → inventory table + locator decisions
2) Business Function input/output types → included in BF file (no DTO files required)
3) Business Function → file path + full code
4) Page Objects → file path(s) + full code
5) manifest.yaml patch → YAML block
6) Data JSON keys → JSON block

## Locator Policy (apply in order)
1) getByTestId
2) getByRole({ name, exact: true })
3) getByLabel
4) attribute strategy with rationale. Avoid index-based selectors.

## Success markers (ASB)
- Login success → tabs “Administrative” and “Testing” visible.
- After environment selection → Study & Role selectors are enabled.
- Catalog loaded → contains target app name (e.g., “Study Builder”).
- App launch → app shell visible; URL contains app fragment (e.g., “/asb”).
