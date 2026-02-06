# Mobile Testing Framework Guidelines

## Project Structure

### Per-App Organization
- **App folders**: `app/demoApp/` with subfolders:
  - `businessFunction/` - Test logic and validation functions
  - `pageObjects/` - Mobile page object classes
  - `tests/` - BDD test scenarios and test files
  - `data/` - JSON files for test data and validation messages
- **Configuration**: `config/` folder for WebDriverIO and capability settings
- **Application Files**: `apk/` folder for Android app packages

### Shared Resources
- Keep app-specific code within `app/demoApp/` structure
- Shared utilities and helpers can be added to root-level `utilities/` folder
- Configuration files centralized in `config/` for reusability across apps
