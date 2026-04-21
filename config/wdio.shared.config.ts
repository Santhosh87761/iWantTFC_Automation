import allure from '@wdio/allure-reporter';
import path from 'path';
 
// Extract grep pattern from command line arguments
function extractGrepPattern(): string | undefined {
    const args = process.argv;
    const grepIndex = args.indexOf('--grep');
    if (grepIndex !== -1 && grepIndex + 1 < args.length) {
        return args[grepIndex + 1];
    }
    return process.env.MOCHA_GREP;
}
 
const grepPattern = extractGrepPattern();
 
export const config = {
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
    logLevel: 'info' as const,
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 0,
 
    // Framework
    framework: 'mocha' as const,
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        retries: 1,
        ...(grepPattern && { grep: grepPattern })
    },
 
    onPrepare: function () {
        const fs = require('fs') as typeof import('fs');
        const path = require('path') as typeof import('path');
 
        const resultsDir = process.env.ALLURE_RESULTS_DIR || 'allure-results';
        const resolvedResultsDir = path.resolve(process.cwd(), resultsDir);
        fs.mkdirSync(resolvedResultsDir, { recursive: true });
        const platform = process.env.PLATFORM || 'unknown';
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
 
        // Restore history from a persisted folder so Trend widgets work even when `npm run clean` is used.
        const persistedHistoryDir = process.env.ALLURE_HISTORY_DIR || path.join('allure-history', platform);
        const persistedHistorySrc = path.resolve(process.cwd(), persistedHistoryDir);
        const resultsHistoryDst = path.join(resolvedResultsDir, 'history');
        if (fs.existsSync(persistedHistorySrc)) {
            fs.mkdirSync(resultsHistoryDst, { recursive: true });
            if (typeof (fs as any).cpSync === 'function') {
                (fs as any).cpSync(persistedHistorySrc, resultsHistoryDst, { recursive: true, force: true });
            }
        }
 
        const baseUrl = process.env.BASE_URL || '';
        const browserName = process.env.BROWSER || 'chrome';
        const osName =
            process.env.ALLURE_OS_NAME ||
            (process.platform === 'win32' ? 'windows' : process.platform);
        const environmentName = process.env.TEST_ENV || process.env.ENV || '';
 
        const envProps: string[] = [
            `platform=${platformName}`,
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
            name: process.env.ALLURE_EXECUTOR_NAME || process.env.CI_NAME || `${platformName} local`,
            type: process.env.ALLURE_EXECUTOR_TYPE || (process.env.CI ? 'ci' : 'local'),
            url: process.env.ALLURE_EXECUTOR_URL || process.env.CI_URL || '',
            buildOrder: process.env.BUILD_NUMBER || process.env.CI_BUILD_NUMBER || '',
            buildName: process.env.BUILD_NAME || process.env.CI_BUILD_NAME || `${platformName} run`,
            buildUrl: process.env.BUILD_URL || process.env.CI_BUILD_URL || '',
            reportName: process.env.ALLURE_REPORT_NAME || `${platformName} Allure Report`,
            reportUrl: process.env.ALLURE_REPORT_URL || ''
        };
 
        fs.writeFileSync(executorJsonPath, `${JSON.stringify(executor, null, 2)}\n`);
    },
 
    // Hooks
    beforeSuite: function (suite: any) {
        console.log(`Starting test suite: ${suite.title}`);
    },
 
    beforeTest: function (test: any) {
        const platform = process.env.PLATFORM || 'unknown';
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
        const fileName = test.file ? path.basename(test.file) : 'Spec';
        console.log(`Starting test: ${test.title}`);
        allure.addLabel('parentSuite', `Platform: ${platformName}`);
        allure.addLabel('suite', test.parent || 'Default Suite');
        allure.addLabel('subSuite', fileName);
        allure.addLabel('host', platformName);
        allure.addLabel('thread', platformName);
        allure.addTag(platformName);
        allure.addArgument('platform', platformName);
    },
 
    afterTest: async function (test: any, _context: any, { error, passed }: any) {
        // By default, only attach screenshots for failed tests.
        // To also capture one screenshot for passed tests, set `ALLURE_EACH_TEST_SCREENSHOT=true`.
        const attachPassedScreenshots = process.env.ALLURE_EACH_TEST_SCREENSHOT === 'true';
 
        if (passed && !attachPassedScreenshots) {
            if (error) {
                browser.saveScreenshot(`./screenshots/error-${test.title}-${Date.now()}.png`);
            }
            return;
        }
 
        try {
            const screenshot = await browser.takeScreenshot();
            const status = passed ? 'passed' : 'failed';
            allure.addAttachment(
                `Screenshot (${status})`,
                Buffer.from(screenshot, 'base64'),
                'image/png'
            );
        } catch {
            // If screenshot fails, don't fail the test because of reporting.
        }
    },
 
    beforeCommand: function (commandName: string, args: any[]) {
        if (process.env.DEBUG_MODE === 'true') {
            console.log(`Executing command: ${commandName} with args: ${JSON.stringify(args)}`);
        }
    },
 
    afterCommand: function (commandName: string, args: any[], result: any, error: any) {
        if (error && process.env.DEBUG_MODE === 'true') {
            console.log(`Command ${commandName} failed with error: ${error.message}`);
        }
    },
 
    onComplete: async function () {
        console.log('Test execution completed');
        if (process.env.GENERATE_ALLURE_REPORT === 'false') return;
 
        const resultsDir = process.env.ALLURE_RESULTS_DIR || 'allure-results';
        const reportDir = process.env.ALLURE_REPORT_DIR || 'allure-report';
        const platform = process.env.PLATFORM || 'unknown';
 
        try {
            const fs = require('fs') as typeof import('fs');
            const path = require('path') as typeof import('path');
 
            // Preserve history between runs so the Trend widgets show up.
            const historySrc = path.resolve(process.cwd(), reportDir, 'history');
            const historyDst = path.resolve(process.cwd(), resultsDir, 'history');
            if (fs.existsSync(historySrc)) {
                fs.mkdirSync(historyDst, { recursive: true });
                // Node 16+
                if (typeof (fs as any).cpSync === 'function') {
                    (fs as any).cpSync(historySrc, historyDst, { recursive: true, force: true });
                }
            }
 
            const allure = require('allure-commandline') as (args: string[]) => import('child_process').ChildProcess;
            const generation = allure(['generate', resultsDir, '--clean', '-o', reportDir]);
 
            await new Promise<void>((resolve, reject) => {
                generation.on('exit', function (exitCode: number) {
                    if (exitCode !== 0) {
                        reject(new Error(`Allure report generation failed (exit code: ${exitCode})`));
                        return;
                    }
                    console.log(`Allure report generated successfully: ${reportDir}`);
                    resolve();
                });
                generation.on('error', reject);
            }).catch((e: unknown) => {
                console.error(e instanceof Error ? e.message : e);
            });
 
            // Persist history to a stable folder (not wiped by the `clean` script).
            const persistedHistoryDir = process.env.ALLURE_HISTORY_DIR || path.join('allure-history', platform);
            const generatedHistorySrc = path.resolve(process.cwd(), reportDir, 'history');
            const persistedHistoryDst = path.resolve(process.cwd(), persistedHistoryDir);
            if (fs.existsSync(generatedHistorySrc) && typeof (fs as any).cpSync === 'function') {
                fs.mkdirSync(persistedHistoryDst, { recursive: true });
                (fs as any).cpSync(generatedHistorySrc, persistedHistoryDst, { recursive: true, force: true });
            }
        } catch (e) {
            console.error('Allure report generation failed: unable to load allure-commandline');
            console.error(e);
        }
    }
};

















































// import allure from '@wdio/allure-reporter';
// import path from 'path';

// export const config = {
//     // Test execution
//     autoCompileOpts: {
//         autoCompile: true,
//         tsNodeOpts: {
//             transpileOnly: true,
//             project: './tsconfig.json'
//         }
//     },

//     // Base configuration
//     maxInstances: 1,
//     logLevel: 'info' as const,
//     bail: 0,
//     waitforTimeout: 10000,
//     connectionRetryTimeout: 120000,
//     connectionRetryCount: 3,

//     // Framework
//     framework: 'mocha' as const,
//     mochaOpts: {
//         ui: 'bdd',
//         timeout: 60000,
//         retries: 0
//     },

//     onPrepare: function () {
//         const fs = require('fs') as typeof import('fs');
//         const path = require('path') as typeof import('path');

//         const resultsDir = process.env.ALLURE_RESULTS_DIR || 'allure-results';
//         const resolvedResultsDir = path.resolve(process.cwd(), resultsDir);
//         if (fs.existsSync(resolvedResultsDir)) {
//             fs.rmSync(resolvedResultsDir, { recursive: true, force: true });
//         }
//         fs.mkdirSync(resolvedResultsDir, { recursive: true });
//         const platform = process.env.PLATFORM || 'unknown';
//         const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

//         // Restore history from a persisted folder so Trend widgets work even when `npm run clean` is used.
//         const persistedHistoryDir = process.env.ALLURE_HISTORY_DIR || path.join('allure-history', platform);
//         const persistedHistorySrc = path.resolve(process.cwd(), persistedHistoryDir);
//         const resultsHistoryDst = path.join(resolvedResultsDir, 'history');
//         if (fs.existsSync(persistedHistorySrc)) {
//             fs.mkdirSync(resultsHistoryDst, { recursive: true });
//             if (typeof (fs as any).cpSync === 'function') {
//                 (fs as any).cpSync(persistedHistorySrc, resultsHistoryDst, { recursive: true, force: true });
//             }
//         }

//         const baseUrl = process.env.BASE_URL || '';
//         const browserName = process.env.BROWSER || 'chrome';
//         const osName =
//             process.env.ALLURE_OS_NAME ||
//             (process.platform === 'win32' ? 'windows' : process.platform);
//         const environmentName = process.env.TEST_ENV || process.env.ENV || '';

//         const envProps: string[] = [
//             `platform=${platformName}`,
//             baseUrl ? `host=${baseUrl}` : '',
//             browserName ? `browser=${browserName}` : '',
//             osName ? `os.name=${osName}` : '',
//             environmentName ? `environment=${environmentName}` : ''
//         ].filter(Boolean);

//         if (envProps.length) {
//             fs.writeFileSync(
//                 path.join(resolvedResultsDir, 'environment.properties'),
//                 `${envProps.join('\n')}\n`
//             );
//         }

//         const executorJsonPath = path.join(resolvedResultsDir, 'executor.json');
//         const executor = {
//             name: process.env.ALLURE_EXECUTOR_NAME || process.env.CI_NAME || `${platformName} local`,
//             type: process.env.ALLURE_EXECUTOR_TYPE || (process.env.CI ? 'ci' : 'local'),
//             url: process.env.ALLURE_EXECUTOR_URL || process.env.CI_URL || '',
//             buildOrder: process.env.BUILD_NUMBER || process.env.CI_BUILD_NUMBER || '',
//             buildName: process.env.BUILD_NAME || process.env.CI_BUILD_NAME || `${platformName} run`,
//             buildUrl: process.env.BUILD_URL || process.env.CI_BUILD_URL || '',
//             reportName: process.env.ALLURE_REPORT_NAME || `${platformName} Allure Report`,
//             reportUrl: process.env.ALLURE_REPORT_URL || ''
//         };

//         fs.writeFileSync(executorJsonPath, `${JSON.stringify(executor, null, 2)}\n`);
//     },

//     // Hooks
//     beforeSuite: function (suite: any) {
//         console.log(`Starting test suite: ${suite.title}`);
//     },

//     beforeTest: function (test: any) {
//         const platform = process.env.PLATFORM || 'unknown';
//         const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
//         const fileName = test.file ? path.basename(test.file) : 'Spec';
//         console.log(`Starting test: ${test.title}`);
//         allure.addLabel('parentSuite', `Platform: ${platformName}`);
//         allure.addLabel('suite', test.parent || 'Default Suite');
//         allure.addLabel('subSuite', fileName);
//         allure.addLabel('host', platformName);
//         allure.addLabel('thread', platformName);
//         allure.addTag(platformName);
//         allure.addArgument('platform', platformName);
//     },

//     afterTest: function (test: any, _context: any, { error }: any) {
//         if (error) {
//             browser.saveScreenshot(`./screenshots/error-${test.title}-${Date.now()}.png`);
//         }
//     },

//     beforeCommand: function (commandName: string, args: any[]) {
//         if (process.env.DEBUG_MODE === 'true') {
//             console.log(`Executing command: ${commandName} with args: ${JSON.stringify(args)}`);
//         }
//     },

//     afterCommand: function (commandName: string, args: any[], result: any, error: any) {
//         if (error && process.env.DEBUG_MODE === 'true') {
//             console.log(`Command ${commandName} failed with error: ${error.message}`);
//         }
//     },

//     onComplete: async function () {
//         console.log('Test execution completed');
//         if (process.env.GENERATE_ALLURE_REPORT === 'false') return;

//         const resultsDir = process.env.ALLURE_RESULTS_DIR || 'allure-results';
//         const reportDir = process.env.ALLURE_REPORT_DIR || 'allure-report';
//         const platform = process.env.PLATFORM || 'unknown';

//         try {
//             const fs = require('fs') as typeof import('fs');
//             const path = require('path') as typeof import('path');

//             // Preserve history between runs so the Trend widgets show up.
//             const historySrc = path.resolve(process.cwd(), reportDir, 'history');
//             const historyDst = path.resolve(process.cwd(), resultsDir, 'history');
//             if (fs.existsSync(historySrc)) {
//                 fs.mkdirSync(historyDst, { recursive: true });
//                 // Node 16+
//                 if (typeof (fs as any).cpSync === 'function') {
//                     (fs as any).cpSync(historySrc, historyDst, { recursive: true, force: true });
//                 }
//             }

//             const allure = require('allure-commandline') as (args: string[]) => NodeJS.EventEmitter;
//             const generation = allure(['generate', resultsDir, '--clean', '-o', reportDir]);

//             await new Promise<void>((resolve, reject) => {
//                 generation.on('exit', function (exitCode: number) {
//                     if (exitCode !== 0) {
//                         reject(new Error(`Allure report generation failed (exit code: ${exitCode})`));
//                         return;
//                     }
//                     console.log(`Allure report generated successfully: ${reportDir}`);
//                     resolve();
//                 });
//                 generation.on('error', reject);
//             }).catch((e: unknown) => {
//                 console.error(e instanceof Error ? e.message : e);
//             });

//             // Persist history to a stable folder (not wiped by the `clean` script).
//             const persistedHistoryDir = process.env.ALLURE_HISTORY_DIR || path.join('allure-history', platform);
//             const generatedHistorySrc = path.resolve(process.cwd(), reportDir, 'history');
//             const persistedHistoryDst = path.resolve(process.cwd(), persistedHistoryDir);
//             if (fs.existsSync(generatedHistorySrc) && typeof (fs as any).cpSync === 'function') {
//                 fs.mkdirSync(persistedHistoryDst, { recursive: true });
//                 (fs as any).cpSync(generatedHistorySrc, persistedHistoryDst, { recursive: true, force: true });
//             }
//         } catch (e) {
//             console.error('Allure report generation failed: unable to load allure-commandline');
//             console.error(e);
//         }
//     }
// };
