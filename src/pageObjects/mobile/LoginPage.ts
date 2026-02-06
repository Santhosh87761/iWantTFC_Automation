import { BasePage } from '../BasePage';

/**
 * Android Login Page Object
 * Handles login flow for mobile app with example Android selectors
 */
export class LoginPage extends BasePage {
    // Page elements - Using accessibility id as primary strategy (UiAutomator2)
    private get usernameField() {
        return $('~username_input'); // accessibility id
    }

    private get passwordField() {
        return $('~password_input'); // accessibility id
    }

    private get loginButton() {
        return $('~login_button'); // accessibility id
    }

    private get errorMessage() {
        return $('~error_message'); // accessibility id
    }

    private get loadingSpinner() {
        return $('~loading_spinner'); // accessibility id
    }

    private get successMessage() {
        return $('~success_message'); // accessibility id
    }

    /**
     * Wait for login page to load
     */
    async waitForPageToLoad(): Promise<void> {
        await this.waitForDisplayed(this.usernameField);
        await this.waitForDisplayed(this.passwordField);
        await this.waitForDisplayed(this.loginButton);
    }

    /**
     * Enter username in username field
     * @param username - Username to enter
     */
    async enterUsername(username: string): Promise<void> {
        await this.typeText(this.usernameField, username);
    }

    /**
     * Enter password in password field
     * @param password - Password to enter
     */
    async enterPassword(password: string): Promise<void> {
        await this.typeText(this.passwordField, password);
    }

    /**
     * Click login button
     */
    async clickLogin(): Promise<void> {
        await this.clickElement(this.loginButton);
    }

    /**
     * Perform complete login flow
     * @param username - Username to login with
     * @param password - Password to login with
     */
    async login(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    /**
     * Get error message text
     * @returns Error message text
     */
    async getErrorMessage(): Promise<string> {
        return await this.getText(this.errorMessage);
    }

    /**
     * Check if error message is displayed
     * @returns Boolean indicating if error is visible
     */
    async isErrorDisplayed(): Promise<boolean> {
        return await this.isDisplayed(this.errorMessage);
    }

    /**
     * Check if loading spinner is displayed
     * @returns Boolean indicating if loading is visible
     */
    async isLoading(): Promise<boolean> {
        return await this.isDisplayed(this.loadingSpinner);
    }

    /**
     * Wait for loading to complete
     */
    async waitForLoadingComplete(): Promise<void> {
        // Wait for loading spinner to disappear
        const spinner = this.loadingSpinner;
        await spinner.waitForDisplayed({ timeout: 15000, reverse: true });
    }

    /**
     * Check if success message is displayed
     * @returns Boolean indicating if success message is visible
     */
    async isLoginSuccessful(): Promise<boolean> {
        return await this.isDisplayed(this.successMessage);
    }
}
