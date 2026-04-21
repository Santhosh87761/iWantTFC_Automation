import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {

    //
    // =====================================================
    // BASIC
    // =====================================================
    //
    runner: 'local',

    specs: [
        './test/specs/**/*.ts'
    ],

    //
    // 👉 Total parallel workers across ALL capabilities
    //
    maxInstances: 3,

    logLevel: 'warn',

    framework: 'mocha',

    mochaOpts: {
        ui: 'bdd',
        timeout: 300000
    },

    //
    // =====================================================
    // CAPABILITIES (All run in parallel)
    // =====================================================
    //
    capabilities: [

        // 🔵 CHROME
        {
            browserName: 'chrome',
            maxInstances: 1,
            acceptInsecureCerts: true,
            'goog:chromeOptions': {
                args: [
                    '--start-maximized',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-infobars',
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-notifications',
                    '--disable-infobars',
                ],
                   prefs: {
                    "profile.default_content_setting_values.notifications": 2,
            "profile.default_content_setting_values.clipboard": 1

                }
            }
        },

        // 🟢 EDGE
        {
            browserName: 'MicrosoftEdge',
            maxInstances: 1,
            acceptInsecureCerts: true,
            'ms:edgeOptions': {
                args: [
                    '--start-maximized'
                ]
            }
        },

        // 📱 ANDROID (Appium - Parallel Safe)
        {
            platformName: 'Android',
            maxInstances: 1,

            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': 'Android Emulator',
            'appium:platformVersion': '14',   // change if needed
            'appium:appPackage': 'your.app.package',
            'appium:appActivity': 'your.app.activity',
            'appium:noReset': true,

            // 🔥 Important for parallel stability
            'appium:systemPort': 8201
        }

    ],

    //
    // =====================================================
    // SERVICES
    // =====================================================
    //
    services: [

        'chromedriver',
        'edgedriver',

        ['appium', {
            command: 'appium',
            args: {
                relaxedSecurity: true
            }
        }]

    ],

    //
    // =====================================================
    // REPORTERS
    // =====================================================
    //
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false
        }]
    ],

};
