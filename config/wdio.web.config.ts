import { config as sharedConfig } from './wdio.shared.config';
import path from 'path';

const allureOutputDir = process.env.ALLURE_RESULTS_DIR || path.join('allure-results', 'web');
const timelineOutputDir = process.env.TIMELINE_RESULTS_DIR || path.join('timeline-reports', 'web');
process.env.ALLURE_RESULTS_DIR = process.env.ALLURE_RESULTS_DIR || allureOutputDir;
process.env.TIMELINE_RESULTS_DIR = process.env.TIMELINE_RESULTS_DIR || timelineOutputDir;
process.env.ALLURE_HISTORY_DIR = process.env.ALLURE_HISTORY_DIR || path.join('allure-history', 'web');
process.env.ALLURE_REPORT_DIR = process.env.ALLURE_REPORT_DIR || 'allure-report';

export const config = {
    ...sharedConfig,

    mochaOpts: {
        ...sharedConfig.mochaOpts,
        timeout: 300000
    },

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
            ],
            prefs: {
                "profile.default_content_setting_values.notifications": 1,
                "profile.default_content_setting_values.clipboard": 1
            }
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
