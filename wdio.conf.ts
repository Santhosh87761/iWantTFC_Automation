export const config = {

    runner: 'local',

    automationProtocol: 'webdriver',  // Use classic WebDriver to avoid Bidi issues

    specs: [
        './test/specs/sanity.spec.ts'
    ],

    maxInstances: 2,   // total parallel workers
capabilities: [
{
    browserName: 'chrome',
    maxInstances: 1,
    'goog:chromeOptions': {
        args: [
            '--start-maximized',
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-notifications'
        ],
        prefs: {
            "profile.default_content_setting_values.notifications": 1,
            "profile.default_content_setting_values.clipboard": 1
        }
    }
}
    ],

    // reduce verbosity to avoid BiDi/command spam in terminal
    // level can be 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'
    logLevel: 'error',

    framework: 'mocha',

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false
        }]
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 600000
    }
}
