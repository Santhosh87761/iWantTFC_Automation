const path = require('path');
const { config: sharedConfig } = require('./wdio.shared.config');

const allureOutputDir = process.env.ALLURE_RESULTS_DIR || 'allure-results';
const timelineOutputDir = process.env.TIMELINE_RESULTS_DIR || 'timeline-reports';

exports.config = {
    ...sharedConfig,

    // Test execution
    specs: [
        path.join(__dirname, '../test/specs/**/*.spec.ts')
    ],
    exclude: [],

    // Web-specific base URL
    baseUrl: process.env.BASE_URL || 'https://example.com',

    // Capabilities for Chrome
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--window-size=1920,1080'
            ]
        }
    }],

    // Services
    services: [
        // Chrome will be managed by chromedriver package directly
    ],

    // Reporters
    reporters: [
        'spec',
        ['allure', {
            outputDir: allureOutputDir,
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false
        }],
        ['timeline', {
            outputDir: timelineOutputDir,
            embedImages: true,
            screenshotStrategy: 'on:error'
        }]
    ]
};
