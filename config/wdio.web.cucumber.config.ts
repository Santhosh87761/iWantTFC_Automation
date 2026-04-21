import { config as sharedConfig } from './wdio.shared.config';
import * as path from 'path';

export const config = {
    ...sharedConfig,

    // Override with Cucumber framework
    framework: 'cucumber' as const,
    cucumberOpts: {
        require: [path.join(__dirname, '../test/specs/webOTT/**/*.ts')],
        requireModule: ['tsx/cjs'],
        format: ['progress-bar', 'html:./cucumber-report.html'],
        strict: true,
        dryRun: false
    },

    // Test specs - only feature files
    specs: [
        path.join(__dirname, '../test/features/**/*.feature')
    ],
    exclude: [
        './test/specs/mobile.simple.spec.ts',
        './test/specs/api.simple.spec.ts',
        './test/specs/multiremote.simple.spec.ts'
    ],

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
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false
        }],
        ['timeline', {
            outputDir: 'timeline-reports',
            outputFile: 'timeline.html'
        }]
    ]
};
