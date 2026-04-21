exports.config = {
    // Test execution
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: './tsconfig.json'
        }
    },

    // Base configuration
    maxInstances: 1,
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // Framework
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    onPrepare: function () {
        const fs = require('fs');
        const path = require('path');

        const resultsDir = process.env.ALLURE_RESULTS_DIR || 'allure-results';
        const resolvedResultsDir = path.resolve(process.cwd(), resultsDir);
        fs.mkdirSync(resolvedResultsDir, { recursive: true });

        // Restore history from a persisted folder so Trend widgets work even when `npm run clean` is used.
        const persistedHistoryDir = process.env.ALLURE_HISTORY_DIR || 'allure-history';
        const persistedHistorySrc = path.resolve(process.cwd(), persistedHistoryDir);
        const resultsHistoryDst = path.join(resolvedResultsDir, 'history');
        if (fs.existsSync(persistedHistorySrc)) {
            fs.mkdirSync(resultsHistoryDst, { recursive: true });
            if (typeof fs.cpSync === 'function') {
                fs.cpSync(persistedHistorySrc, resultsHistoryDst, { recursive: true, force: true });
            }
        }

        const baseUrl = process.env.BASE_URL || '';
        const browserName = process.env.BROWSER || 'chrome';
        const osName =
            process.env.ALLURE_OS_NAME ||
            (process.platform === 'win32' ? 'windows' : process.platform);
        const environmentName = process.env.TEST_ENV || process.env.ENV || '';

        const envProps = [
            baseUrl ? `host=${baseUrl}` : '',
            browserName ? `browser=${browserName}` : '',
            osName ? `os.name=${osName}` : '',
            environmentName ? `environment=${environmentName}` : ''
        ].filter(Boolean);

        if (envProps.length) {
            fs.writeFileSync(
                path.join(resolvedResultsDir, 'environment.properties'),
                `${envProps.join('\n')}\n`
            );
        }

        const executorJsonPath = path.join(resolvedResultsDir, 'executor.json');
        const executor = {
            name: process.env.ALLURE_EXECUTOR_NAME || process.env.CI_NAME || 'local',
            type: process.env.ALLURE_EXECUTOR_TYPE || (process.env.CI ? 'ci' : 'local'),
            url: process.env.ALLURE_EXECUTOR_URL || process.env.CI_URL || '',
            buildOrder: process.env.BUILD_NUMBER || process.env.CI_BUILD_NUMBER || '',
            buildName: process.env.BUILD_NAME || process.env.CI_BUILD_NAME || '',
            buildUrl: process.env.BUILD_URL || process.env.CI_BUILD_URL || '',
            reportName: process.env.ALLURE_REPORT_NAME || 'Allure Report',
            reportUrl: process.env.ALLURE_REPORT_URL || ''
        };

        fs.writeFileSync(executorJsonPath, `${JSON.stringify(executor, null, 2)}\n`);
    },

    // Hooks
    beforeSuite: function (suite) {
        console.log(`Starting test suite: ${suite.title}`);
    },

    beforeTest: function (test) {
        console.log(`Starting test: ${test.title}`);
    },

    afterTest: function (test, _context, { error }) {
        if (error) {
            browser.saveScreenshot(`./screenshots/error-${test.title}-${Date.now()}.png`);
        }
    },

    beforeCommand: function (commandName, args) {
        if (process.env.DEBUG_MODE === 'true') {
            console.log(`Executing command: ${commandName} with args: ${JSON.stringify(args)}`);
        }
    },

    afterCommand: function (commandName, args, result, error) {
        if (error && process.env.DEBUG_MODE === 'true') {
            console.log(`Command ${commandName} failed with error: ${error.message}`);
        }
    },

    onComplete: async function () {
        console.log('Test execution completed');
        if (process.env.GENERATE_ALLURE_REPORT === 'false') return;

        const resultsDir = process.env.ALLURE_RESULTS_DIR || 'allure-results';
        const reportDir = process.env.ALLURE_REPORT_DIR || 'allure-report';

        try {
            const fs = require('fs');
            const path = require('path');

            // Preserve history between runs so the Trend widgets show up.
            const historySrc = path.resolve(process.cwd(), reportDir, 'history');
            const historyDst = path.resolve(process.cwd(), resultsDir, 'history');
            if (fs.existsSync(historySrc)) {
                fs.mkdirSync(historyDst, { recursive: true });
                if (typeof fs.cpSync === 'function') {
                    fs.cpSync(historySrc, historyDst, { recursive: true, force: true });
                }
            }

            const allure = require('allure-commandline');
            const generation = allure(['generate', resultsDir, '--clean', '-o', reportDir]);

            await new Promise((resolve, reject) => {
                generation.on('exit', function (exitCode) {
                    if (exitCode !== 0) {
                        reject(new Error(`Allure report generation failed (exit code: ${exitCode})`));
                        return;
                    }
                    console.log(`Allure report generated successfully: ${reportDir}`);
                    resolve();
                });
                generation.on('error', reject);
            }).catch((e) => {
                console.error(e instanceof Error ? e.message : e);
            });

            // Persist history to a stable folder (not wiped by the `clean` script).
            const persistedHistoryDir = process.env.ALLURE_HISTORY_DIR || 'allure-history';
            const generatedHistorySrc = path.resolve(process.cwd(), reportDir, 'history');
            const persistedHistoryDst = path.resolve(process.cwd(), persistedHistoryDir);
            if (fs.existsSync(generatedHistorySrc) && typeof fs.cpSync === 'function') {
                fs.mkdirSync(persistedHistoryDst, { recursive: true });
                fs.cpSync(generatedHistorySrc, persistedHistoryDst, { recursive: true, force: true });
            }
        } catch (e) {
            console.error('Allure report generation failed: unable to load allure-commandline');
            console.error(e);
        }
    }
};
