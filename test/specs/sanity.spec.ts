import { ConfigHelper } from '@utilities/index';
import { sanityBusinessLogic } from '../../src/utilities/business/sanityBusinessLogic';
import { Platform } from '../../src/utilities/enum/Platform';
import { TestDataHelper } from '../../src/utilities/generic/TestDataHelper';
import { PlatformHelper } from '../../src/utilities/helpers/PlatformHelper';
import loginTestData from '../data/login-test-data.json';

type UserType = 'subscribed' | 'nonsubscribed' | 'guest' | 'gma';

type LoginCredentials = {
  email: string;
  password: string;
};

type TaggedUser = {
  type: string;
  primaryTag: UserType;
  tags: UserType[];
  credentials: LoginCredentials;
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

function createTagPrefix(tags: UserType[]): string {
  return tags.map((tag) => `[${tag}]`).join('');
}

function shouldRunForTags(tags: UserType[]): boolean {
  return !selectedUserType || tags.includes(selectedUserType);
}

function getAndroidAppId(): string {
  const capabilities = browser.capabilities as Record<string, any>;
  return capabilities['appium:appPackage'] || capabilities.appPackage || DEFAULT_ANDROID_APP_ID;
}

function getAndroidAppPath(): string | undefined {
  const capabilities = browser.capabilities as Record<string, any>;
  return capabilities['appium:app'] || capabilities.app;
}

function credentialsMatch(credentials: LoginCredentials): boolean {
  return Boolean(
    currentCredentials &&
    currentCredentials.email === credentials.email &&
    currentCredentials.password === credentials.password
  );
}

async function waitForWebReady(): Promise<void> {
  await browser.waitUntil(
    async () => (await browser.execute(() => document.readyState)) === 'complete',
    { timeout: 10000 }
  );
}

async function launchWebHome(): Promise<void> {
  await browser.url(ConfigHelper.getBaseUrl());
  await waitForWebReady();
}

async function reinstallAndLaunchAndroidApp(): Promise<void> {
  const appId = getAndroidAppId();
  const appPath = getAndroidAppPath();

  console.log(`Recovering Android app with a fresh install for: ${appId}`);

  try {
    await driver.terminateApp(appId);
  } catch {
  }

  try {
    const isInstalled = await driver.isAppInstalled(appId);
    if (isInstalled) {
      await driver.removeApp(appId);
    }
  } catch {
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
  }
}

async function recoverPlatform(platform: Platform | string): Promise<void> {
  if (platform === Platform.WEB || platform === 'web') {
    try {
      await browser.deleteAllCookies();
    } catch {
    }

    await launchWebHome();
  } else if (platform === Platform.ANDROID || platform === 'android') {
    await reinstallAndLaunchAndroidApp();
  }

  currentUserType = null;
  currentCredentials = null;
}

async function ensurePlatformReady(platform: Platform | string): Promise<void> {
  if (platform === Platform.WEB || platform === 'web') {
    try {
      await browser.getUrl();
    } catch {
      await recoverPlatform(platform);
    }
    return;
  }

  if (platform === Platform.ANDROID || platform === 'android') {
    const appId = getAndroidAppId();

    try {
      await driver.getCurrentPackage();
      await driver.activateApp(appId);
    } catch {
      await recoverPlatform(platform);
    }
  }
}

async function loginForPlatform(platform: Platform | string, credentials: LoginCredentials): Promise<void> {
  if (platform === Platform.WEB || platform === 'web') {
    await sanityBusinessLogic.loginToIwant(credentials.email, credentials.password);
    return;
  }

  if (platform === Platform.ANDROID || platform === 'android') {
    await sanityBusinessLogic.loginToMobile(credentials.email, credentials.password);
    return;
  }

  throw new Error(`Login helper is not configured for platform: ${platform}`);
}

async function logoutForPlatform(platform: Platform | string): Promise<void> {
  if (platform === Platform.WEB || platform === 'web') {
    await sanityBusinessLogic.signOutFromIwant();
    return;
  }

  if (platform === Platform.ANDROID || platform === 'android') {
    await sanityBusinessLogic.logoutFromApplication();
    return;
  }

  throw new Error(`Logout helper is not configured for platform: ${platform}`);
}

async function ensureUserSession(userType: UserType, credentials: LoginCredentials): Promise<void> {
  const platform = sanityBusinessLogic.getPlatform();

  await ensurePlatformReady(platform);

  if (credentialsMatch(credentials)) {
    console.log(`Continuing with existing ${userType} session`);
    currentUserType = userType;
    return;
  }

  if (currentCredentials) {
    try {
      await logoutForPlatform(platform);
    } catch {
      await recoverPlatform(platform);
    } finally {
      currentUserType = null;
      currentCredentials = null;
    }
  }

  await loginForPlatform(platform, credentials);
  currentUserType = userType;
  currentCredentials = credentials;
}

async function returnToHomePage(platform: Platform | string): Promise<void> {
  try {
    if (platform === Platform.WEB || platform === 'web') {
      await launchWebHome();
    } else if (platform === Platform.ANDROID || platform === 'android') {
      await sanityBusinessLogic.navigateBackUntilHomeTabVisible();
    }
  } catch {
    try {
      await recoverPlatform(platform);

      if (currentCredentials) {
        await loginForPlatform(platform, currentCredentials);
      }

      if (platform === Platform.WEB || platform === 'web') {
        await launchWebHome();
      } else if (platform === Platform.ANDROID || platform === 'android') {
        await sanityBusinessLogic.navigateBackUntilHomeTabVisible();
      }
    } catch (error) {
      console.log(`Cleanup warning while returning to home page: ${error}`);
    }
  }
}

const subscribedUser: TaggedUser = {
  type: 'Subscribed User',
  primaryTag: 'subscribed',
  tags: ['subscribed'],
  credentials: loginTestData.premiumUserCredentials
};

const nonSubscribedUser: TaggedUser = {
  type: 'Non Subscribed User',
  primaryTag: 'nonsubscribed',
  tags: ['nonsubscribed', 'guest'],
  credentials: loginTestData.guestUserCredentials
};

const gmaUser: TaggedUser = {
  type: 'GMA User',
  primaryTag: 'gma',
  tags: ['gma'],
  credentials: loginTestData.gmaUserCredentials
};

describe('Sanity Test', () => {
  before(async () => {
    sanityBusinessLogic.initializePlatform();

    const platform = PlatformHelper.getCurrentPlatform();
    const caps = browser.capabilities as any;

    if (platform === Platform.WEB) {
      await launchWebHome();
    } else if (platform === Platform.ANDROID) {
      if (caps.appPackage) {
        await driver.activateApp(caps.appPackage);
      }
    } else if (platform === Platform.IOS) {
      if (caps.bundleId) {
        await driver.activateApp(caps.bundleId);
      }
    } else if (platform === Platform.TV) {
      const tvAppId = caps.appPackage || caps.bundleId;
      if (tvAppId) {
        await driver.activateApp(tvAppId);
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  });

  after(async () => {
    const platform = PlatformHelper.getCurrentPlatform();
    const caps = browser.capabilities as any;

    currentUserType = null;
    currentCredentials = null;

    if (platform === Platform.WEB) {
      await browser.deleteAllCookies();
      await browser.execute(() => localStorage.clear());
      await browser.execute(() => sessionStorage.clear());
      await browser.url('about:blank');
    } else if (platform === Platform.ANDROID) {
      if (caps.appPackage) {
        const appId = getAndroidAppId();
        await driver.terminateApp(appId);
        await driver.execute('mobile: clearApp', { appId });
        await driver.activateApp(appId);
      }
    } else if (platform === Platform.IOS) {
      if (caps.bundleId) {
        await driver.terminateApp(caps.bundleId);
      }
    } else if (platform === Platform.TV) {
      const tvAppId = caps.appPackage || caps.bundleId;
      if (tvAppId) {
        await driver.terminateApp(tvAppId);
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  });
  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify Edit Profile functionality in My Space for ${type} (Android only)`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform !== 'android') {
        console.log('Edit Profile test skipped - only supported on Android platform');
        return;
      }
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifyEditProfileFunctionality(loginTestData.editProfile);
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  it(`${createTagPrefix(nonSubscribedUser.tags)} Verify free users are able to play "Free" contents.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    const runTags: UserType[] = platform === 'web' ? ['guest'] : ['nonsubscribed'];
    const sessionUserType: UserType = platform === 'web' ? 'guest' : 'nonsubscribed';

    if (!shouldRunForTags(runTags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }

    try {
      if (platform === 'web') {
        if (currentCredentials) {
          try {
            await logoutForPlatform(platform);
          } catch {
            await recoverPlatform(platform);
          } finally {
            currentUserType = null;
            currentCredentials = null;
          }
        }
      } else {
        await ensureUserSession(sessionUserType, nonSubscribedUser.credentials);
      }

      await sanityBusinessLogic.playFreeContentAndValidate();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify premium users are allowed to play all contents except GMA contents.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    let subscribeText: string;
    let subscribeBtnText: string;
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      if (platform === 'web') {
        subscribeText = loginTestData.premiumUserCredentials.subscribeOrrenewText;
        subscribeBtnText = loginTestData.premiumUserCredentials.subscribeToWatchBtnText;
      } else if (platform === 'android') {
        subscribeText = loginTestData.premiumUserCredentials.subscribeText;
        subscribeBtnText = loginTestData.premiumUserCredentials.subscribeBtnText;
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
      await sanityBusinessLogic.verifyGmaAllContents(subscribeText, subscribeBtnText);
    } finally {
      await returnToHomePage(platform);
    }
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify the "Share" functionality from the content from details page ${type} (Android only)`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform !== 'android') {
        console.log('Share functionality test skipped - only supported on Android platform social media');
        return;
      }
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifyShareFunctionality(loginTestData.searchContent.shareBtnContentEpisode);
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify the functionality of "Add To Watchlist" CTA displayed from the CW tray bottom bar popup. ${type} (Android only)`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform !== 'android') {
        console.log('Share functionality test skipped - only supported on Android platform social media');
        return;
      }
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifyAddToWatchlistFromCWTrayBottomBarPopup();
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  it(`${createTagPrefix(gmaUser.tags)} Verify the GMA content playback for GMA users.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(gmaUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(gmaUser.primaryTag, gmaUser.credentials);
    try {
      await sanityBusinessLogic.playGmaContent();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify the player controls (Pause, play, Seek forward, backward, Full screen, subtitle, Volume)`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyPlayerControlsFunctionality();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify the auto upnext playback at the end of the current episode playback.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyAutoUpnextPlayback(
        loginTestData.episodes.episode1,
        loginTestData.episodes.episode2,
        loginTestData.searchContent.multipleEpisodesContent
      );
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify PiP mode during active video playback for VOD content.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'android') {
      console.log('PiP mode test skipped - only supported on Android platform');
      return;
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyPipModeDuringPlayback();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify PiP mode during active video playback for Live content.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'android') {
      console.log('Live PiP mode test skipped - only supported on Android platform');
      return;
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyPipModeDuringLivePlayback();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify PiP playback controls for VOD content.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'android') {
      console.log('PiP playback controls test skipped - only supported on Android platform');
      return;
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyPipPlaybackControls();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify PiP playback controls for Live stream.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'android') {
      console.log('PiP playback controls for live stream test skipped - only supported on Android platform');
      return;
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyPipPlaybackControlsForLive();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify the Full screen transition from PiP.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'android') {
      console.log('PiP fullscreen transition test skipped - only supported on Android platform');
      return;
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyPipFullscreenTransition();
    } finally {
      await returnToHomePage(platform);
    }
  });
  it(`${createTagPrefix(subscribedUser.tags)} Verify the Upnext binge marker appears at the end of the current episode playback.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyUpnextBingeMarker(
        loginTestData.episodes.episode1,
        loginTestData.episodes.episode2,
        loginTestData.searchContent.multipleEpisodesContent
      );
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify presence of "Skip Intro" marker during intial content Playback`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifySkipIntroMarker(loginTestData.searchContent.contentTitleBatang);
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify presence of "Skip Recap" marker during initial content Playback`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'web' && platform !== 'android') {
      console.log('Skip Recap test skipped - unsupported platform');
      return;
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifySkipRecapMarkerWithSearch(loginTestData.searchContent.contentTitleBatang);
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify presence of "Skip Outro" marker at end of the content playback`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'web' && platform !== 'android') {
      console.log('Skip Outro test skipped - unsupported platform');
      return;
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifySkipOutroMarkerWithSearch(loginTestData.searchContent.contentTitleBatang);
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify "X" button on the Skip Outro marker closes the outro and playback continues`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifySkipOutroCloseMarkerWithSearch(loginTestData.searchContent.contentTitleWalang);
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify clicking "Skip Outro" moves to next episode when user click on Skip Outro`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyAfterClickingOnSkipOutroNextEpisodePlayed(
        loginTestData.searchContent.contentTitleWalang,
        loginTestData.episodes.episodeS1E1Title,
        loginTestData.episodes.episodeS1E2Title
      );
    } finally {
      await returnToHomePage(platform);
    }
  });

  //*[contains(translate(normalize-space(.),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'skip')]

  it(`${createTagPrefix(nonSubscribedUser.tags)} Verify the Ads playback for free user.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(nonSubscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(nonSubscribedUser.primaryTag, nonSubscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyPrerollAndMidrollAds();
    } finally {
      await returnToHomePage(platform);
    }
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify user navigates to correct screen on tapping the shared deeplink. ${type}`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform !== 'web' && platform !== 'android') {
        throw new Error(`Unsupported platform: ${platform}`);
      }
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifySharedDeeplinkFunctionality(
          loginTestData.searchContent.linkCopiedToastMessage,
          loginTestData.searchContent.shareBtnContentEpisode
        );
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  it(`${createTagPrefix(nonSubscribedUser.tags)} Verify the Subscription blocker screen on tapping Subscribe CTA.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(nonSubscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    let subscribeText: string;
    let subscribeBtnText: string;
    await ensureUserSession(nonSubscribedUser.primaryTag, nonSubscribedUser.credentials);
    try {
      if (platform === 'web') {
        subscribeText = loginTestData.premiumUserCredentials.subscribeOrrenewText;
        subscribeBtnText = loginTestData.premiumUserCredentials.subscribeToWatchBtnText;
      } else if (platform === 'android') {
        subscribeText = loginTestData.premiumUserCredentials.freeUserSubscribeText;
        subscribeBtnText = loginTestData.premiumUserCredentials.subscribeBtnText;
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
      await sanityBusinessLogic.verifySubscriptionBlockerScreen(subscribeText, subscribeBtnText);
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify that "Resume" CTA is displayed inside the details screen for the partially watched contents and content starts playing from the last watched postion on tapping "Resume" CTA.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyResumeCTAIsDisplayed(loginTestData.searchContent.removedContinueToWatchToastMsg);
    } finally {
      await returnToHomePage(platform);
    }
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify the functionality of "Watchlist" icon displayed on the content details screen. ${type}`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifyWatchlistFunctionality(
          loginTestData.searchContent.watchListAddedToastMsg,
          loginTestData.searchContent.watchListRemovedToastMsg
        );
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify the functionality of "Remove from watchlist" icon displayed below the player screen in portrait screen. ${type}`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform !== 'web') {
        console.log('Remove from watchlist portrait test skipped - only applicable for WEB');
        return;
      }
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifyRemoveFromWatchlistFunctionality(
          loginTestData.searchContent.watchListAddedToastMsg,
          loginTestData.searchContent.watchListRemovedToastMsg
        );
      } finally {
        await returnToHomePage(platform);
      }
    });
  });
  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it.skip(`${createTagPrefix(tags)} Verify that the user is able to initiate video playback directly from the My Watchlist page by selecting any listed content. ${type}`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        if (primaryTag === 'subscribed') {
          await sanityBusinessLogic.verifyVideoPlaybackFromWatchlist(
            loginTestData.searchContent.watchListAddedToastMsg,
            loginTestData.searchContent.watchListRemovedToastMsg
          );
        } else {
          await sanityBusinessLogic.verifyFreeUserVideoPlaybackFromWatchlist(
            loginTestData.searchContent.watchListAddedToastMsg,
            loginTestData.searchContent.watchListRemovedToastMsg
          );
        }
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify user is able to add content to My Watchlist via hover from search page. ${type}`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform !== 'web') {
        console.log('Hover watchlist add test skipped - only applicable for WEB');
        return;
      }
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifyAbleToAddContentToMyWatchlistFromSearchPage(
          loginTestData.searchContent.showSearchToWatchList,
          loginTestData.searchContent.watchListAddedToastMsg,
          loginTestData.searchContent.watchListRemovedToastMsg
        );
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify user is able to remove content from my watchlist via hover from search page. ${type}`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform !== 'web') {
        console.log('Hover watchlist remove test skipped - only applicable for WEB');
        return;
      }
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifyAbleToRemoveContentFromMyWatchlistFromSearchPage(
          loginTestData.searchContent.showSearchToWatchList,
          loginTestData.searchContent.watchListAddedToastMsg,
          loginTestData.searchContent.watchListRemovedToastMsg
        );
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify that "Top picks near you" tray is displayed on navigating to search tab. ${type}`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifySearchPageTopPicksNearYouTrayIsDisplayed(
          loginTestData.searchContent.showSearchToWatchList,
          loginTestData.searchContent.moviesAndShowsText,
          loginTestData.searchContent.topPicksNearYouText
        );
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify the auto-suggestions while typing in the search field. ${type}`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform === 'android' && primaryTag !== 'subscribed') {
        console.log('Android auto-suggestions test is currently configured only for subscribed users');
        return;
      }
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifySearchPageAutoSuggestions(
          loginTestData.searchContent.autoSearchVal,
          loginTestData.searchContent.moviesAndShowsText,
          loginTestData.searchContent.popularSearchContent
        );
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify content metadata, watchlist, share and episode details on content details screen`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await sanityBusinessLogic.launchApplication(platform);
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      if (platform === 'web') {
        await sanityBusinessLogic.openAnyShowContent();
      }
      await sanityBusinessLogic.verifyContentDetails('Subscribed');
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} should display "No results found" for irrelevant search terms`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await sanityBusinessLogic.launchApplication(platform);
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      const randomSearch = TestDataHelper.getInstance().generateRandomText(20);
      await sanityBusinessLogic.verifyNoSearchResultsForIrrelevantTerms(
        randomSearch,
        loginTestData.search.message
      );
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(nonSubscribedUser.tags)} Verify if free and premium content are labeled accordingly on the Search page / redirects to Detail page / "Clear All" removes the Search text`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(nonSubscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await sanityBusinessLogic.launchApplication(platform);
    await ensureUserSession(nonSubscribedUser.primaryTag, nonSubscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyFreeOrPrimiumContentTagDisplayed(
        loginTestData.searchContent.autoSearchVal,
        loginTestData.premiumUserCredentials.subscribeToWatchBtnText,
        loginTestData.searchContent.placeHoderText,
        loginTestData.searchContent.popularSearchContent
      );
    } finally {
      await returnToHomePage(platform);
    }
  });
  it(`${createTagPrefix(subscribedUser.tags)} Verify subscription details are displayed in My Account for subscribed user`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await sanityBusinessLogic.launchApplication(platform);
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifySubscriptionDetailsInMyAccount();
    } finally {
      await returnToHomePage(platform);
    }
  });
  it(`${createTagPrefix(nonSubscribedUser.tags)} Verify Mid rail banner Ad is displayed on Home, Shows, Movies, GMA, Search pages (Web only).`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'web') {
      console.log('Mid rail banner ad test skipped - only applicable for WEB');
      return;
    }
    if (!shouldRunForTags(nonSubscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(nonSubscribedUser.primaryTag, nonSubscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyMidRailBannerAdDisplayedOnLandingPages();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify the navigation to "Privacy Policy", "Terms and Conditions" and "Help Centre" pages.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyNavigationToPrivacyPolicyTermsAndHelpCentrePages(
        loginTestData.page.privacyPolicyUrlFragment,
        loginTestData.page.termsAndConditionsUrlFragment,
        loginTestData.page.helpCentreUrlFragment
      );
    } finally {
      await returnToHomePage(platform);
    }
  });

  [subscribedUser, nonSubscribedUser].forEach(({ type, primaryTag, tags, credentials }) => {
    it(`${createTagPrefix(tags)} Verify View More icon appears below player for show with >5 episodes (${type})`, async () => {
      const platform = sanityBusinessLogic.getPlatform();
      if (platform !== 'android') {
        console.log('View More icon test skipped - only supported on Android platform');
        return;
      }
      if (!shouldRunForTags(tags)) {
        console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
        return;
      }
      await ensureUserSession(primaryTag, credentials);
      try {
        await sanityBusinessLogic.verifyViewMoreIconForMultiEpisodeShow();
      } finally {
        await returnToHomePage(platform);
      }
    });
  });

  it(`${createTagPrefix(nonSubscribedUser.tags)} Verify that "Subscribe" CTA is displayed on Carousel contents and Details page for free users.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(nonSubscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    // await sanityBusinessLogic.launchApplication(platform);
    await sanityBusinessLogic.waitUntilPageDisplayed();
    await ensureUserSession(nonSubscribedUser.primaryTag, nonSubscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifySubscribeCTAForFreeUser();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Preview thumbnail are displayed on scrubbing content`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    // await sanityBusinessLogic.launchApplication(platform);
    await sanityBusinessLogic.waitUntilPageDisplayed();
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyPreviewThumbnailOnScrubbing();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify the content playback from the Continue Watching tray.`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    // await sanityBusinessLogic.launchApplication(platform);
    await sanityBusinessLogic.waitUntilPageDisplayed();
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyContinueWatchingResumePlayback();
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify parental pin setup is displayed when toggle is enabled`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'web') {
      throw new Error('This test is only applicable for WEB');
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await sanityBusinessLogic.launchApplication(platform);
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyParentalPinSetupFlow(
        subscribedUser.credentials.password,
        loginTestData.setPin
      );
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify parental PIN prompt is displayed when playing restricted content`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'web') {
      throw new Error('This test is only applicable for WEB');
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    // await sanityBusinessLogic.launchApplication(platform);
    await sanityBusinessLogic.waitUntilPageDisplayed();
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyParentalPinPromptOnPlayback(loginTestData.setPin);
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify Playback will not be started until user will enter correct pin`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'web') {
      throw new Error('This test is only applicable for WEB');
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await sanityBusinessLogic.launchApplication(platform);
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.verifyParentalPinPromptOnPlayback(loginTestData.setPin);
    } finally {
      await returnToHomePage(platform);
    }
  });

  it(`${createTagPrefix(subscribedUser.tags)} Verify content plays without PIN when parental control is turned OFF`, async () => {
    const platform = sanityBusinessLogic.getPlatform();
    if (platform !== 'web') {
      throw new Error('This test is only applicable for WEB');
    }
    if (!shouldRunForTags(subscribedUser.tags)) {
      console.log(`Skipping test because USER_TYPE filter is set to ${selectedUserType}`);
      return;
    }
    await sanityBusinessLogic.launchApplication(platform);
    await ensureUserSession(subscribedUser.primaryTag, subscribedUser.credentials);
    try {
      await sanityBusinessLogic.disableParentalControl(subscribedUser.credentials.password);
      await sanityBusinessLogic.verifyPlaybackWithoutParentalPin();
    } finally {
      await returnToHomePage(platform);
    }
  });
});
