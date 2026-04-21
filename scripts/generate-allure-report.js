#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function normalizeJavaHome(javaHome) {
  if (!javaHome) return javaHome;
  return javaHome.replace(/[\\/]+bin[\\/]*$/i, '');
}

function hasAllureResultFiles(directory) {
  if (!fs.existsSync(directory)) {
    return false;
  }

  const stack = [directory];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
        continue;
      }
      if (/.*-result\.json$/.test(entry.name) || /.*container\.json$/.test(entry.name)) {
        return true;
      }
    }
  }
  return false;
}

async function main() {
  const reportDir = process.argv[2] || 'allure-report';
  const resultsDirs = process.argv.slice(3);
  const lastRunFile = path.resolve(process.cwd(), '.allure-last-run.json');
  let configuredHistoryDir = process.env.ALLURE_HISTORY_DIR;
  let configuredReportDir = process.env.ALLURE_REPORT_DIR;

  let candidateInputs = resultsDirs;
  if (!candidateInputs.length && fs.existsSync(lastRunFile)) {
    try {
      const lastRun = JSON.parse(fs.readFileSync(lastRunFile, 'utf8'));
      if (Array.isArray(lastRun.inputs) && lastRun.inputs.length) {
        candidateInputs = lastRun.inputs;
      }
      if (!configuredHistoryDir && typeof lastRun.historyDir === 'string') {
        configuredHistoryDir = lastRun.historyDir;
      }
      if (!configuredReportDir && typeof lastRun.reportDir === 'string') {
        configuredReportDir = lastRun.reportDir;
      }
    } catch (error) {
      console.warn(`Unable to read last Allure run metadata: ${error.message}`);
    }
  }

  const existingInputs = (candidateInputs.length ? candidateInputs : ['allure-results']).filter((p) =>
    fs.existsSync(path.resolve(process.cwd(), p))
  );

  const inputs = existingInputs.filter((p) =>
    hasAllureResultFiles(path.resolve(process.cwd(), p))
  );

  if (!inputs.length && existingInputs.length) {
    const fallback = 'allure-results';
    const fallbackPath = path.resolve(process.cwd(), fallback);
    if (fallback !== existingInputs[0] && hasAllureResultFiles(fallbackPath)) {
      console.warn(`Configured Allure input paths did not contain result files. Falling back to ${fallback}`);
      inputs.push(fallback);
    }
  }

  if (!inputs.length) {
    console.error('No Allure results directories found. Expected something like: allure-results/');
    process.exit(1);
  }

  const javaHome = normalizeJavaHome(process.env.JAVA_HOME);
  if (javaHome) process.env.JAVA_HOME = javaHome;

  const allure = require('allure-commandline');

  const persistedHistoryDir = configuredHistoryDir || path.join('allure-history', 'combined');
  const persistedHistorySrc = path.resolve(process.cwd(), persistedHistoryDir);

  if (fs.existsSync(persistedHistorySrc)) {
    for (const inputDir of inputs) {
      const historyDst = path.resolve(process.cwd(), inputDir, 'history');
      fs.mkdirSync(historyDst, { recursive: true });
      if (typeof fs.cpSync === 'function') {
        fs.cpSync(persistedHistorySrc, historyDst, { recursive: true, force: true });
      }
    }
  }

  const generation = allure(['generate', ...inputs, '--clean', '-o', reportDir]);

  await new Promise((resolve, reject) => {
    generation.on('exit', (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error(`Allure report generation failed (exit code: ${exitCode})`));
        return;
      }
      resolve();
    });
    generation.on('error', reject);
  });

  const generatedHistorySrc = path.resolve(process.cwd(), configuredReportDir || reportDir, 'history');
  const persistedHistoryDst = path.resolve(process.cwd(), persistedHistoryDir);
  if (fs.existsSync(generatedHistorySrc) && typeof fs.cpSync === 'function') {
    fs.mkdirSync(persistedHistoryDst, { recursive: true });
    fs.cpSync(generatedHistorySrc, persistedHistoryDst, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
