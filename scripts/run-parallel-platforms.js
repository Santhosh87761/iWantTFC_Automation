#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

const args = process.argv.slice(2);

const defaultMobile = process.env.MOBILE_PLATFORM || 'android';

const platformToConfig = {
  web: path.join('config', 'wdio.web.config.ts'),
  android: path.join('config', 'wdio.android.config.ts'),
  ios: path.join('config', 'wdio.ios.config.ts'),
};

function normalizePlatform(platform) {
  if (platform === 'mobile') {
    return defaultMobile;
  }

  return platform;
}

const requestedPlatforms = args.length ? args : ['web', 'mobile'];
const platforms = [...new Set(requestedPlatforms.map(normalizePlatform))];

for (const p of platforms) {
  if (!platformToConfig[p]) {
    console.error(`Unknown platform "${p}". Supported: ${Object.keys(platformToConfig).join(', ')}`);
    process.exit(2);
  }
}

function getWdioBin() {
  const cliJs = path.resolve(process.cwd(), 'node_modules', '@wdio', 'cli', 'bin', 'wdio.js');
  return cliJs;
}

const wdioBin = getWdioBin();
const lastRunFile = path.resolve(process.cwd(), '.allure-last-run.json');

function prefixStream(stream, prefix) {
  const rl = readline.createInterface({ input: stream });
  rl.on('line', (line) => {
    process.stdout.write(`[${prefix}] ${line}\n`);
  });
}

function spawnWdio(platform) {
  const configPath = platformToConfig[platform];
  const env = {
    ...process.env,
    PLATFORM: platform,
    GENERATE_ALLURE_REPORT: 'false',
    ALLURE_RESULTS_DIR: path.join('allure-results', platform),
    TIMELINE_RESULTS_DIR: path.join('timeline-reports', platform),
  };

  console.log(`[runner] starting ${platform} using ${configPath}`);

  const child = spawn(process.execPath, [wdioBin, 'run', configPath], {
    env,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  prefixStream(child.stdout, platform);
  prefixStream(child.stderr, platform);

  return new Promise((resolve) => {
    child.on('error', (error) => {
      console.error(`[runner] failed to start ${platform}: ${error.message}`);
      resolve({ platform, code: 1 });
    });

    child.on('exit', (code) => resolve({ platform, code: code ?? 1 }));
  });
}

(async () => {
  try {
    fs.writeFileSync(
      lastRunFile,
      JSON.stringify(
        {
          mode: 'multi',
          platforms,
          inputs: platforms.map((p) => path.join('allure-results', p)),
          historyDir: path.join('allure-history', 'combined'),
          reportDir: 'allure-report',
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
  } catch (error) {
    console.warn(`[runner] unable to persist last Allure run metadata: ${error.message}`);
  }

  const results = await Promise.all(platforms.map(spawnWdio));
  const failed = results.filter((r) => r.code !== 0);

  // Generate a single combined report unless explicitly disabled.
  if (process.env.GENERATE_ALLURE_REPORT !== 'false') {
    const reportInputs = platforms.map((p) => path.join('allure-results', p));
    const generator = spawn(process.execPath, [path.join('scripts', 'generate-allure-report.js'), 'allure-report', ...reportInputs], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ALLURE_HISTORY_DIR: process.env.ALLURE_HISTORY_DIR || path.join('allure-history', 'combined'),
      },
    });

    await new Promise((resolve) => generator.on('exit', resolve));
  }

  if (failed.length) {
    console.error(
      `One or more platforms failed: ${failed.map((f) => `${f.platform} (exit ${f.code})`).join(', ')}`
    );
    process.exit(1);
  }
})();
