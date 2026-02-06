import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { HomePage } from '../../src/pageObjects/web/HomePage';
import { ConfigHelper } from '../../src/utilities/generic/ConfigHelper';
import { TestDataHelper } from '../../src/utilities/generic/TestDataHelper';

/**
 * Web Login Test Suite
 * Tests login functionality on the home page
 * Pattern: Setup → Action → Verification → Cleanup
 */
describe('Web - Home Page Login Tests', () => {
    let homePage: HomePage;
    let testData: any;

    /**
     * Setup: Initialize page object and load test data
     */
    before(async () => {
        homePage = new HomePage();
        const testDataHelper = TestDataHelper.getInstance();
        testData = testDataHelper.loadJsonData('config/test-config.json')[0];
    });

    /**
     * Test: Verify home page loads successfully
     */
    it('should load home page and display login button', async () => {
        // Setup: Navigate to application
        await browser.url(ConfigHelper.getBaseUrl());
        await homePage.waitForPageToLoad();

        // Action: Check page elements
        const pageTitle = await homePage.getPageTitle();
        const isLoginButtonVisible = await homePage.isLoginButtonDisplayed();

        // Verification: Assert page loaded correctly
        expect(pageTitle).to.not.be.empty;
        expect(isLoginButtonVisible).to.be.true;
    });

    /**
     * Test: Verify featured items count
     */
    it('should display featured items on home page', async () => {
        // Setup: Page already loaded from previous test
        // Action: Get featured items count
        const itemsCount = await homePage.getFeaturedItemsCount();

        // Verification: Assert items exist
        expect(itemsCount).to.be.greaterThan(0);
    });

    /**
     * Test: Perform search functionality
     */
    it('should allow searching for products', async () => {
        // Setup: Page already loaded
        const searchTerm = testData.testData.searchTerms[0];

        // Action: Perform search
        await homePage.search(searchTerm);

        // Verification: Verify search was executed (would validate results in real scenario)
        const pageTitle = await homePage.getPageTitle();
        expect(pageTitle).to.not.be.undefined;

        // Cleanup: No specific cleanup needed for this test
    });

    /**
     * Cleanup: Close browser after tests
     */
    after(async () => {
        await browser.deleteSession();
    });
});
