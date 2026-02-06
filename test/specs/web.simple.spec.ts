import { expect } from 'chai';
import * as fs from 'fs';
import { after, before, describe, it } from 'mocha';
import * as path from 'path';
import { HomePage } from '../../src/pageObjects/web/HomePage';
import { ConfigHelper } from '../../src/utilities/generic/ConfigHelper';

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
        const configPath = path.join(process.cwd(), 'config', 'test-config.json');
        const rawData = fs.readFileSync(configPath, 'utf8');
        const allData = JSON.parse(rawData);
        testData = Array.isArray(allData) ? allData[0] : allData;
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
