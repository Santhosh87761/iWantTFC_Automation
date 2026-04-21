#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const platform = process.argv[2];
const passthroughArgs = process.argv.slice(3);

const platformToConfig = {
  web: path.join('config', 'wdio.web.config.ts'),
  android: path.join('config', 'wdio.android.config.ts'),
  ios: path.join('config', 'wdio.ios.config.ts'),
  api: path.join('config', 'wdio.api.config.ts'),
  cucumber: path.join('config', 'wdio.web.cucumber.config.ts'),
  multiremote: path.join('config', 'wdio.multiremote.config.ts'),
};

if (!platform || platform === '-h' || platform === '--help') {
  console.error(
    `Usage: node scripts/run-wdio.js <platform> [wdio args...]\n` +
      `Platforms: ${Object.keys(platformToConfig).join(', ')}`
  );
  process.exit(platform ? 0 : 2);
}

const configPath = platformToConfig[platform];
if (!configPath) {
  console.error(`Unknown platform "${platform}". Supported: ${Object.keys(platformToConfig).join(', ')}`);
  process.exit(2);
}

function getWdioBin() {
  const cliJs = path.resolve(process.cwd(), 'node_modules', '@wdio', 'cli', 'bin', 'wdio.js');
  return cliJs;
}

const wdioBin = getWdioBin();
const lastRunFile = path.resolve(process.cwd(), '.allure-last-run.json');

const child = spawn(process.execPath, [wdioBin, 'run', configPath, ...passthroughArgs], {
  stdio: 'inherit',
  env: (() => {
    const resolvedPlatform = process.env.PLATFORM || platform;
    const platformKey = resolvedPlatform === 'cucumber' ? 'web' : resolvedPlatform;

    return {
      ...process.env,
      PLATFORM: resolvedPlatform,
      ALLURE_RESULTS_DIR: process.env.ALLURE_RESULTS_DIR || path.join('allure-results', platformKey),
      TIMELINE_RESULTS_DIR: process.env.TIMELINE_RESULTS_DIR || path.join('timeline-reports', platformKey),
      ALLURE_HISTORY_DIR: process.env.ALLURE_HISTORY_DIR || path.join('allure-history', platformKey),
      ALLURE_REPORT_DIR: process.env.ALLURE_REPORT_DIR || 'allure-report',
    };
  })(),
});

try {
  const platformKey = (process.env.PLATFORM || platform) === 'cucumber' ? 'web' : (process.env.PLATFORM || platform);
  fs.writeFileSync(
    lastRunFile,
    JSON.stringify(
      {
        mode: 'single',
        platform: platformKey,
        inputs: [path.join('allure-results', platformKey)],
        historyDir: path.join('allure-history', platformKey),
        reportDir: 'allure-report',
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
} catch (error) {
  console.warn(`Unable to persist last Allure run metadata: ${error.message}`);
}

child.on('exit', (code) => process.exit(code ?? 1));
