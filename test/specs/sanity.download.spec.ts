import { sanityBusinessLogic } from '../../src/utilities/business/sanityBusinessLogic';
import loginTestData from '../data/login-test-data.json';

type UserType = 'subscribed' | 'nonsubscribed' | 'guest' | 'gma';

type LoginCredentials = {
  email: string;
  password: string;
};

const DEFAULT_ANDROID_APP_ID = 'com.absi.tfctv';
const selectedUserType = normalizeUserType(process.env.USER_TYPE || process.env.TEST_USER_TYPE || '');

let currentUserType: UserType | null = null;
let currentCredentials: LoginCredentials | null = null;

function normalizeUserType(value: string): UserType | null {
  const normalized = value.trim().toLowerCase().replace(/[\s_-]+/g, '');

  switch (normalized) {
    case '':
      return null;
    case 'subscribed':
      return 'subscribed';
    case 'nonsubscribed':
    case 'nonsubscribeduser':
    case 'nonsub':
      return 'nonsubscribed';
    case 'guest':
      return 'guest';
    case 'gma':
      return 'gma';
    default:
      return null;
  }
}

function shouldRunForUserType(userType: UserType): boolean {
  return !selectedUserType || selectedUserType === userType;
}

function getAndroidAppId(): string {
  const capabilities = browser.capabilities as Record<string, any>;
  return capabilities['appium:appPackage'] || capabilities.appPackage || DEFAULT_ANDROID_APP_ID;
}

function getAndroidAppPath(): string | undefined {
  const capabilities = browser.capabilities as Record<string, any>;
  return capabilities['appium:app'] || capabilities.app;
}

async function reinstallAndLaunchAndroidApp(): Promise<void> {
  const appId = getAndroidAppId();
  const appPath = getAndroidAppPath();

  console.log(`Recovering Android app with a fresh install for: ${appId}`);

  try {
    await driver.terminateApp(appId);
  } catch {
    // Ignore if app is already closed or unavailable.
  }

  try {
    const isInstalled = await driver.isAppInstalled(appId);
    if (isInstalled) {
      await driver.removeApp(appId);
    }
  } catch {
    // Ignore install-state lookup failures and continue with best effort.
  }

  if (appPath) {
    try {
      await driver.installApp(appPath);
    } catch (error) {
      console.log(`App reinstall failed, continuing with launch attempt: ${error}`);
    }
  }

  await driver.activateApp(appId);
  currentUserType = null;
  currentCredentials = null;

  try {
    await sanityBusinessLogic.handleNotificationPopup();
  } catch {
    // Ignore popup handling errors during recovery.
  }
}

async function ensureAndroidAppReady(): Promise<void> {
  const appId = getAndroidAppId();

  try {
    await driver.getCurrentPackage();
    await driver.activateApp(appId);
  } catch {
    await reinstallAndLaunchAndroidApp();
  }
}

async function ensureUserSession(userType: UserType, credentials: LoginCredentials): Promise<void> {
  await ensureAndroidAppReady();

  if (currentUserType === userType) {
    console.log(`Continuing with existing ${userType} session`);
    return;
  }

  if (currentUserType) {
    try {
      await sanityBusinessLogic.logoutFromApplication();
    } catch {
      await reinstallAndLaunchAndroidApp();
    } finally {
      currentUserType = null;
      currentCredentials = null;
    }
  }

  await sanityBusinessLogic.loginToMobile(credentials.email, credentials.password);
  currentUserType = userType;
  currentCredentials = credentials;
}

async function returnToHomePage(): Promise<void> {
  try {
    await sanityBusinessLogic.navigateBackUntilHomeTabVisible();
  } catch {
    await reinstallAndLaunchAndroidApp();

    if (currentUserType && currentCredentials) {
      await sanityBusinessLogic.loginToMobile(currentCredentials.email, currentCredentials.password);
      await sanityBusinessLogic.navigateBackUntilHomeTabVisible();
    }
  }
}

describe('Sanity - DOWNLOAD (UAT Build) Tests', () => {
  before(async () => {
    sanityBusinessLogic.initializePlatform();
  });

  const userTab = [
    {
      type: 'Subscribed User',
      tag: 'subscribed' as UserType,
      credentials: loginTestData.premiumUserCredentials
    },
    {
      type: 'Non Subscribed User',
      tag: 'nonsubscribed' as UserType,
      credentials: loginTestData.guestUserCredentials
    }
  ];

  userTab.forEach(({ type, tag, credentials }) => {
    it(`[${tag}] Verify Download icon on Home, Shows, Movies, and GMA pages ${type} (Android only)`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform !== 'android') {
        console.log('Download icon landing pages test skipped - only supported on Android platform');
        return;
      }

      if (!shouldRunForUserType(tag)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }

      console.log(`Executing test for: ${type}`);

      await ensureUserSession(tag, credentials);

      try {
        await sanityBusinessLogic.verifyDownloadIconOnLandingPages();
      } finally {
        await returnToHomePage();
      }
    });
  });

  it('[subscribed] Verify the "Download" button next to the episodes inside shows details page.', async () => {
    const platform = sanityBusinessLogic.getPlatform();
    const userType: UserType = 'subscribed';
    const credentials = loginTestData.premiumUserCredentials;

    if (platform !== 'android') {
      console.log('Skipping test: Download button in show details is only for Android platform');
      return;
    }

    if (!shouldRunForUserType(userType)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }

    await ensureUserSession(userType, credentials);

    try {
      await sanityBusinessLogic.verifyDownloadButtonInShowDetailsPage();
    } finally {
      await returnToHomePage();
    }
  });

  it('[subscribed] Verify the "Download" button below the metadata of the content inside movie details page.', async () => {
    const platform = sanityBusinessLogic.getPlatform();
    const userType: UserType = 'subscribed';
    const credentials = loginTestData.premiumUserCredentials;

    if (platform !== 'android') {
      console.log('Skipping test: Download button in movie details is only for Android platform');
      return;
    }

    if (!shouldRunForUserType(userType)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }

    await ensureUserSession(userType, credentials);

    try {
      await sanityBusinessLogic.verifyDownloadButtonInMovieDetailsPage();
    } finally {
      await returnToHomePage();
    }
  });

  it('[subscribed] Verify on tapping "Download" icon download animation starts and content gets downloaded.', async () => {
    const platform = sanityBusinessLogic.getPlatform();
    const userType: UserType = 'subscribed';
    const credentials = loginTestData.premiumUserCredentials;

    if (platform !== 'android') {
      console.log('Skipping test: Download animation on tapping download icon is only for Android platform');
      return;
    }

    if (!shouldRunForUserType(userType)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }

    await ensureUserSession(userType, credentials);

    try {
      await sanityBusinessLogic.verifyDownloadAnimationOnTappingDownloadIcon();
    } finally {
      await returnToHomePage();
    }
  });

  it('[subscribed] Verify that downloaded contents displayed under "Downloads" screen.', async () => {
    const platform = sanityBusinessLogic.getPlatform();
    const userType: UserType = 'subscribed';
    const credentials = loginTestData.premiumUserCredentials;

    if (platform !== 'android') {
      console.log('Skipping test: Downloaded contents verification is only for Android platform');
      return;
    }

    if (!shouldRunForUserType(userType)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }

    await ensureUserSession(userType, credentials);

    try {
      await sanityBusinessLogic.verifyDownloadedContentsOnDownloadsScreen();
    } finally {
      await returnToHomePage();
    }
  });

  it('[subscribed] Verify user can able to play downloaded contents.', async () => {
    const platform = sanityBusinessLogic.getPlatform();
    const userType: UserType = 'subscribed';
    const credentials = loginTestData.premiumUserCredentials;

    if (platform !== 'android') {
      console.log('Skipping test: Downloaded contents verification is only for Android platform');
      return;
    }

    if (!shouldRunForUserType(userType)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }

    await ensureUserSession(userType, credentials);

    try {
      await sanityBusinessLogic.verifyUserAbleToPlayDownloadedContentsOnDownloadsScreen();
    } finally {
      await returnToHomePage();
    }
  });

  it('[subscribed] Verify user can able to delete downloaded contents.', async () => {
    const platform = sanityBusinessLogic.getPlatform();
    const userType: UserType = 'subscribed';
    const credentials = loginTestData.premiumUserCredentials;

    if (platform !== 'android') {
      console.log('Skipping test: Downloaded contents verification is only for Android platform');
      return;
    }

    if (!shouldRunForUserType(userType)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }

    await ensureUserSession(userType, credentials);

    try {
      await sanityBusinessLogic.verifyUserAbleToDeleteDownloadedContentsOnDownloadsScreen();
    } finally {
      await returnToHomePage();
    }
  });

  after(async () => {
    const appId = getAndroidAppId();

    currentUserType = null;
    currentCredentials = null;

    try {
      await driver.terminateApp(appId);
    } catch {
      // Ignore cleanup failure.
    }

    try {
      await driver.execute('mobile: clearApp', { appId });
    } catch {
      // Ignore cleanup failure.
    }

    try {
      await driver.activateApp(appId);
    } catch {
      // Ignore cleanup failure.
    }
  });
});
