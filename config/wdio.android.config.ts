import { config as sharedConfig } from './wdio.shared.config';
import { spawn, type ChildProcess } from 'child_process';
import net from 'net';
import path from 'path';

const allureOutputDir = process.env.ALLURE_RESULTS_DIR || path.join('allure-results', 'android');
const timelineOutputDir = process.env.TIMELINE_RESULTS_DIR || path.join('timeline-reports', 'android');
process.env.ALLURE_RESULTS_DIR = process.env.ALLURE_RESULTS_DIR || allureOutputDir;
process.env.TIMELINE_RESULTS_DIR = process.env.TIMELINE_RESULTS_DIR || timelineOutputDir;
process.env.ALLURE_HISTORY_DIR = process.env.ALLURE_HISTORY_DIR || path.join('allure-history', 'android');
process.env.ALLURE_REPORT_DIR = process.env.ALLURE_REPORT_DIR || 'allure-report';
process.env.APPIUM_HOME = process.env.APPIUM_HOME || path.join(process.cwd(), '.appium');

const sharedOnPrepare = (sharedConfig as any).onPrepare;
const sharedOnComplete = (sharedConfig as any).onComplete;

const testType = process.env.TEST_TYPE || 'prod';
const appPath = testType === 'download'
    ? './src/utilities/26.03.04-1-qa-260304012.apk'
    : './src/utilities/26.02.19-2 (260219022) Android Mobile.apk';
const androidDeviceName = process.env.ANDROID_DEVICE_NAME || '963060614200188';
const androidPlatformVersion = process.env.ANDROID_PLATFORM_VERSION || '13';
const appiumPort = Number(process.env.APPIUM_PORT || '4723');
const appiumHost = process.env.APPIUM_HOST || '127.0.0.1';
const appiumBasePath = process.env.APPIUM_BASE_PATH || '/wd/hub';
let appiumProcess: ChildProcess | undefined;

function prefixAppiumStream(stream: NodeJS.ReadableStream | null, prefix: string): void {
    if (!stream) {
        return;
    }

    stream.on('data', (chunk: Buffer | string) => {
        process.stdout.write(`[appium:${prefix}] ${chunk.toString()}`);
    });
}

async function waitForPort(host: string, port: number, timeoutMs: number): Promise<void> {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
        const isOpen = await new Promise<boolean>((resolve) => {
            const socket = net.createConnection({ host, port }, () => {
                socket.end();
                resolve(true);
            });

            socket.on('error', () => resolve(false));
        });

        if (isOpen) {
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    throw new Error(`Appium did not become reachable on ${host}:${port} within ${timeoutMs}ms`);
}

async function startLocalAppium(): Promise<void> {
    if (appiumProcess && !appiumProcess.killed) {
        return;
    }

    const appiumEntry = path.resolve(process.cwd(), 'node_modules', 'appium', 'index.js');
    const appiumArgs = [
        appiumEntry,
        '--base-path', appiumBasePath,
        '--port', String(appiumPort),
        '--relaxed-security',
        '--address', appiumHost,
        '--log-level', 'info'
    ];

    appiumProcess = spawn(process.execPath, appiumArgs, {
        cwd: process.cwd(),
        env: {
            ...process.env,
            APPIUM_HOME: process.env.APPIUM_HOME
        },
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: false
    });

    prefixAppiumStream(appiumProcess.stdout, 'stdout');
    prefixAppiumStream(appiumProcess.stderr, 'stderr');

    appiumProcess.once('exit', (code, signal) => {
        if (code !== null || signal !== null) {
            console.log(`Appium process exited (code: ${code ?? 'null'}, signal: ${signal ?? 'null'})`);
        }
        appiumProcess = undefined;
    });

    await waitForPort(appiumHost, appiumPort, 30000);
}

async function stopLocalAppium(): Promise<void> {
    if (!appiumProcess || appiumProcess.killed) {
        return;
    }

    await new Promise<void>((resolve) => {
        const current = appiumProcess!;
        current.once('exit', () => resolve());
        current.kill();
        setTimeout(resolve, 5000);
    });
}

console.log('====================================');
console.log(`Running on: ${testType.toUpperCase()} BUILD`);
console.log(`App used: ${appPath}`);
console.log(`Appium home: ${process.env.APPIUM_HOME}`);
console.log('====================================');

export const config = {
    ...sharedConfig,

    specs: [
        path.join(__dirname, '../test/specs/sanity.spec.ts')
    ],

    exclude: [
        './test/specs/**/*.web.spec.ts',
        './test/specs/**/*.ios.spec.ts',
        './test/specs/**/*.api.spec.ts'
    ],

    maxInstances: 1,
    waitforTimeout: 30000,
    hostname: appiumHost,
    port: appiumPort,
    path: appiumBasePath,

    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': androidDeviceName,
        'appium:platformVersion': androidPlatformVersion,
        'appium:automationName': 'UiAutomator2',
        'appium:app': appPath,
         'appium:noReset': false,
        'appium:fullReset': true, 
        'appium:newCommandTimeout': 240,
        'appium:autoGrantPermissions': true,
        'appium:skipDeviceInitialization': true,
        'appium:skipServerInstallation': true,
        'appium:autoAcceptAlerts': true
    }],

    mochaOpts: {
        ...sharedConfig.mochaOpts,
        timeout: 120000
    },

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

    onPrepare: async function (...hookArgs: any[]) {
        await startLocalAppium();

        if (typeof sharedOnPrepare === 'function') {
            await sharedOnPrepare.apply(this, hookArgs);
        }

        console.log('Starting Android mobile test execution...');
        console.log(`Test Type: ${testType}`);
        console.log(`App: ${appPath}`);

        await new Promise(resolve => setTimeout(resolve, 2000));
    },

    onComplete: async function (exitCode: any, ...hookArgs: any[]) {
        console.log('Android mobile test execution completed');
        if (exitCode === 0) {
            console.log('All mobile tests passed');
        } else {
            console.log('Some mobile tests failed');
        }

        if (typeof sharedOnComplete === 'function') {
            await sharedOnComplete.apply(this, [exitCode, ...hookArgs]);
        }

        await stopLocalAppium();
    },

    beforeSession: function (_config: any, capabilities: any) {
        console.log('Initializing mobile session...');
        console.log(`Target device: ${capabilities['appium:deviceName']}`);
        console.log(`Android version: ${capabilities['appium:platformVersion']}`);
        console.log(`Installing: ${capabilities['appium:app']}`);
    },

    afterSession: function () {
        console.log('Mobile session completed');
    }
};
