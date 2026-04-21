const path = require('path');
const { config: sharedConfig } = require('./wdio.shared.config');

const allureOutputDir = process.env.ALLURE_RESULTS_DIR || 'allure-results';
const timelineOutputDir = process.env.TIMELINE_RESULTS_DIR || 'timeline-reports';

const sharedOnPrepare = sharedConfig.onPrepare;
const sharedOnComplete = sharedConfig.onComplete;

exports.config = {
    ...sharedConfig,

    // Test execution
    specs: [
        path.join(__dirname, '../test/specs/sanity.spec.ts')
    ],
    exclude: [
    ],

    // Android-specific settings
    maxInstances: 1,
    waitforTimeout: 30000,

    // Capabilities for Android
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'emulator-5554',
        'appium:platformVersion': '16',
        'appium:automationName': 'UiAutomator2',
        'appium:app': './src/utilities/AEC.apk',
        'appium:noReset': false,
        'appium:fullReset': true, 
        'appium:newCommandTimeout': 240,
        'appium:autoGrantPermissions': true,
        'appium:skipDeviceInitialization': true,
        'appium:skipServerInstallation': true
    }],

    // Services
    services: [
        ['appium', {
            args: {
                port: 4723,
                basePath: '/wd/hub',
                relaxedSecurity: true,
                address: '127.0.0.1',
                logLevel: 'info'
            },
            logPath: './logs/'
        }]
    ],

    // Mobile-specific Mocha configuration
    mochaOpts: {
        ...sharedConfig.mochaOpts,
        timeout: 120000
    },

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
    ],

    // Hooks for better Appium management
    onPrepare: async function (...hookArgs) {
        if (typeof sharedOnPrepare === 'function') {
            await sharedOnPrepare.apply(this, hookArgs);
        }
        console.log('🚀 Starting Android mobile test execution...');
        console.log('📱 Checking for available Android devices...');

        // Add a small delay to ensure Appium service starts properly
        await new Promise(resolve => setTimeout(resolve, 2000));
    },

    onComplete: async function (exitCode, ...hookArgs) {
        console.log('✅ Android mobile test execution completed');
        if (exitCode === 0) {
            console.log('🎉 All mobile tests passed!');
        } else {
            console.log('❌ Some mobile tests failed');
        }

        if (typeof sharedOnComplete === 'function') {
            await sharedOnComplete.apply(this, [exitCode, ...hookArgs]);
        }
    },

    beforeSession: function (_config, capabilities) {
        console.log('🔧 Initializing mobile session...');
        console.log(`📋 Target device: ${capabilities['appium:deviceName']}`);
        console.log(`🤖 Android version: ${capabilities['appium:platformVersion']}`);
    },

    afterSession: function () {
        console.log('🏁 Mobile session completed');
    }
};
