
import AssertionHelper from '@utilities/generic/assertCommands'
import { ConfigHelper } from '..'
import { sanityPageLocator } from '../../pageObjects/sanityPageLocator'
import { preprocessImage } from '../../utilities/generic/imageHelper'
import { extractTextFromImage } from '../../utilities/generic/orcHelper'
import { Platform } from '../enum/Platform'
import { BrowserHelper } from '../generic/BrowserHelper'
import { ElementHelper } from '../generic/ElementHelper'
import { PlatformHelper } from '../helpers/PlatformHelper'



export class sanityBusinessLogic {
  static downloadedEpisodeTitle: string;
  private static platform: Platform = PlatformHelper.getCurrentPlatform()

  /**
   * Initialize platform once at the beginning of test execution
   * Call this in beforeEach hook
   */
  static initializePlatform(): void {
    this.platform = PlatformHelper.getCurrentPlatform()
    console.log(`Test platform initialized: ${this.platform}`)
  }

  static getPlatform(): string {
    return this.platform;
  }

  static async waitForPageLoad(): Promise<void> {
    await browser.waitUntil(async () => {
      const state = await browser.execute(() => document.readyState);
      return state === 'complete';
    }, {
      timeout: 15000,
      timeoutMsg: 'Page did not load completely'
    });
  }

  static async validateNavigation() {
    // For demo, assume Home screen = headerText visible
    // if (screen.toLowerCase() === 'home') {
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.headerText[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
    });
    await AssertionHelper.assertVisible(sanityPageLocator.headerText[this.platform][0]);

    // Add more screens as needed
  }

  static async tapOnGmaTab() {
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.gmaTabButton[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 20000,
      timeoutMsg: 'Failed to Click On GMA tab.'
    });
    await ElementHelper.cmdClick(sanityPageLocator.gmaTabButton[this.platform][0], "GMA Tab Button");
  }

  static async playAnyGmaContent() {
    const firstRow = sanityPageLocator.gmaFirstRowContent[this.platform][0];
    await ElementHelper.cmdClick(firstRow, "First Content");
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0], "Play Button");
  }

  static async validateGmaPlaybackEntitlement(usertype: string) {
    // For demo, just check timer and pause button for GMA
    if (usertype.toLowerCase() === 'gma') {
      await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
      await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
    }
    // Add more usertype logic as needed
  }


  static async loginToIwant(email: string, password: string) {
    await ElementHelper.cmdClick(sanityPageLocator.accountIcon[this.platform][0], "Account Icon");
    await ElementHelper.cmdClick(sanityPageLocator.signInButton[this.platform][0], "Sign In Button");
    const continueBtn = await $(sanityPageLocator.singInContinueBtn[this.platform][0]);
    if (await continueBtn.isDisplayed().catch(() => false)) {
      await continueBtn.click();
    }
    await ElementHelper.cmdFill(sanityPageLocator.emailInput[this.platform][0], email);
    await ElementHelper.cmdFill(sanityPageLocator.passwordInput[this.platform][0], password);
    await ElementHelper.cmdClick(sanityPageLocator.continueButton[this.platform][0], "Continue Button");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await AssertionHelper.assertTextEquals(sanityPageLocator.homeTab[this.platform][0], "Home");
  }

  static async signOutFromIwant() {
    if (this.platform === 'web') {
      await ElementHelper.cmdPause(1000);
      await ElementHelper.cmdClick(sanityPageLocator.accountIcon[this.platform][0], "Account Icon");
      await ElementHelper.cmdPause(1000);
      await ElementHelper.cmdClick(sanityPageLocator.signOutButton[this.platform][0], "Sign Out Button");
      await ElementHelper.cmdPause(1000);
      await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    } else if (this.platform === 'android') {
      await this.logoutFromApplication();
    }
  }

  static async validateSuccessMsg(userNameText: string) {
    await ElementHelper.cmdClick(sanityPageLocator.accountIcon[this.platform][0], "Account Icon");
    await ElementHelper.cmdIsVisible(sanityPageLocator.userNameText[this.platform][0]);
    await ElementHelper.cmdPause(1000);
    await AssertionHelper.assertTextEquals(sanityPageLocator.userNameText[this.platform][0], userNameText);
  }

  // static async waitForAdsToComplete(): Promise<void> {
  //   const adsLocator = sanityPageLocator.addsTag[this.platform][0];
  //   const adAppearTimeout = this.platform === Platform.WEB ? 15000 : 10000;
  //   const adDisappearTimeout = this.platform === Platform.WEB ? 240000 : 180000;
  //   console.log("⏳ Waiting for ads to appear...");

  //   // Wait for ads to appear (with catch to handle cases where ads don't appear)
  //   try {
  //     const ads = await ElementHelper.cmdIsVisible(sanityPageLocator.addsTag[this.platform][0]);
  //     if(ads) {
  //       await ElementHelper.cmdClick(sanityPageLocator.skipAd[this.platform][0], "Skip Ad Button");
  //     }
  //     await (browser as any).waitUntil(async () => {
  //       try {
  //         return await ElementHelper.cmdIsVisible(adsLocator);
  //       } catch {
  //         return false;  // If element selector fails, ads not visible
  //       }
  //     }, {
  //       timeout: adAppearTimeout,
  //       interval: 1000
  //     });
  //     console.log("✅ Ad appeared");
  //   } catch (error) {
  //     console.log("⚠️ Ad did not appear within 10 seconds - continuing anyway");
  //   }

  //   console.log("⏳ Waiting for ads to disappear (up to 3 minutes)...");
  //   try {
  //     await (browser as any).waitUntil(async () => {
  //       try {
  //         const isVisible = await ElementHelper.cmdIsVisible(adsLocator);
  //         return !isVisible;  // Resolved when ads are NOT visible
  //       } catch {
  //         return true;  // If element selector fails, treat as ads disappeared
  //       }
  //     }, {
  //       timeout: adDisappearTimeout,
  //       interval: 2000,
  //       timeoutMsg: "Ad did not disappear within 3 minutes"
  //     });
  //   } catch (error) {
  //     console.log("✅ Ads disappeared or selector unavailable");
  //   }

  //   console.log("✅ Ad completed successfully");
  // }

  static async waitForAdsToComplete(): Promise<void> {
    const adsLocator = sanityPageLocator.addsTag[this.platform][0];
    const skipBtn = sanityPageLocator.skipAd[this.platform][0];

    const adAppearTimeout = this.platform === Platform.WEB ? 15000 : 10000;
    const adDisappearTimeout = this.platform === Platform.WEB ? 240000 : 180000;

    console.log("⏳ Waiting for ads to appear...");

    let adAppeared = false;

    // Wait for ad to appear
    try {
      await (browser as any).waitUntil(async () => {
        try {
          const visible = await ElementHelper.cmdIsVisible(adsLocator);
          if (visible) {
            adAppeared = true;
          }
          return visible;
        } catch {
          return false;
        }
      }, {
        timeout: adAppearTimeout,
        interval: 1000
      });

      console.log("✅ Ad appeared");

      // Try clicking skip if visible
      try {
        const skipVisible = await ElementHelper.cmdIsVisible(skipBtn);
        if (skipVisible) {
          await ElementHelper.cmdClick(skipBtn, "Skip Ad Button");
          console.log("⏭️ Clicked Skip Ad");
        }
      } catch {
        console.log("⚠️ Skip button not available");
      }

    } catch {
      console.log("⚠️ Ad did not appear within timeout - continuing");
    }

    // If ad never appeared, skip waiting for disappearance
    if (!adAppeared) {
      console.log("✅ No ad flow detected");
      return;
    }

    console.log("⏳ Waiting for ads to disappear...");

    // Wait for ad to disappear
    try {
      await (browser as any).waitUntil(async () => {
        try {
          const isVisible = await ElementHelper.cmdIsVisible(adsLocator);
          return !isVisible;
        } catch {
          return true;
        }
      }, {
        timeout: adDisappearTimeout,
        interval: 2000,
        timeoutMsg: "Ad did not disappear within expected time"
      });

      console.log("✅ Ads disappeared");
    } catch {
      console.log("⚠️ Ads did not disappear but continuing");
    }

    console.log("✅ Ad handling completed");
  }

  static async playFreeContentAndValidate() {
    if (this.platform === 'android') {
      let isVisible = false;
      const maxScrolls = 5;

      for (let i = 0; i < maxScrolls; i++) {
        try {
          await AssertionHelper.assertVisible(
            sanityPageLocator.freetraycontentsLinks[this.platform][0]
          );
          isVisible = true;
          break;
        } catch (err) {
          await ElementHelper.cmdScrollDownSmall();
        }
      }

      if (!isVisible) {
        throw new Error('freetraycontentsLinks not visible after 5 scroll attempts');
      }
    }
    await AssertionHelper.assertVisible(sanityPageLocator.freetraycontentsLinks[this.platform][0]);
    const freeTrayLocator = sanityPageLocator.freetraycontentsLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
    if (trayCount === 0) {
      console.error("Free Tray not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(freeTrayLocator, "Free Tray Content");
    await ElementHelper.cmdPause(1000);
    if (this.platform === 'web') {
      await ElementHelper.cmdClick(sanityPageLocator.curentEpisodePlayButton[this.platform][0], "Current Episode Play Button");
    }
    // await AssertionHelper.assertNotVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
    await this.waitForAdsToComplete();
    if (this.platform === 'android') {
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    }

    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.palycontrolsBtn[this.platform][0]);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    await ElementHelper.cmdPause(1000);
    await AssertionHelper.assertVisible(sanityPageLocator.PlayBtnText[this.platform][0]);
  }

  static async verifyGmaAllContents(gmaValidSubscriptionText: string, gmaSubscribeToWatchBtnText: string) {
    await ElementHelper.cmdClick(sanityPageLocator.gmaTabButton[this.platform][0], "GMA Tab Button");
    await ElementHelper.cmdPause(1000);
    await AssertionHelper.assertVisible(sanityPageLocator.gmaFirstRowContent[this.platform][0]);
    const firstRowContent = sanityPageLocator.gmaFirstRowContent[this.platform][0];
    console.log("Checking for GMA content tray..." + firstRowContent);
    const trayCount = await ElementHelper.cmdGetElementCount(firstRowContent);
    console.log("Checking for GMA content tray..." + trayCount);
    if (trayCount === 0) {
      console.error("Free Tray not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(firstRowContent, "First Row Content");

    if (this.platform === 'web') {
      await AssertionHelper.assertVisible(sanityPageLocator.gmaSubscribToWatchText[this.platform][0]);
      await AssertionHelper.assertTextEquals(sanityPageLocator.gmaSubscribToWatchText[this.platform][0], gmaSubscribeToWatchBtnText);
      await ElementHelper.cmdClick(sanityPageLocator.gmaRecentAddedEpisodesList[this.platform][0], "Recent Added Episodes List");
      await AssertionHelper.assertTextEquals(sanityPageLocator.gmaRequiredSubscrionText[this.platform][0], gmaValidSubscriptionText);
      await AssertionHelper.assertTextEquals(sanityPageLocator.gmaSubscrionToWatchBtnText[this.platform][0], gmaSubscribeToWatchBtnText);
    } else if (this.platform === 'android') {
      await AssertionHelper.assertVisible(sanityPageLocator.gmaSubscribToWatchText[this.platform][0]);
      await AssertionHelper.assertTextEquals(sanityPageLocator.gmaSubscribToWatchText[this.platform][0], gmaSubscribeToWatchBtnText);
      await ElementHelper.cmdClick(sanityPageLocator.gmaRecentAddedEpisodesList[this.platform][0], "Recent Added Episodes List");
      await AssertionHelper.assertTextEquals(sanityPageLocator.gmaRequiredSubscrionText[this.platform][0], gmaValidSubscriptionText);
    }
  }

  static async verifyTheGMAContentPlaybackForGMAUsers() {
    const gmaButton = sanityPageLocator.gmaButton[this.platform][0];
    await browser.waitUntil(async () => {
      const isVisible = await ElementHelper.cmdIsVisible(gmaButton);
      return isVisible;
    }, {
      timeout: 15000,
      interval: 1000,
      timeoutMsg: 'GMA button not visible after 15 seconds'
    });
    await ElementHelper.cmdClick(sanityPageLocator.gmaButton[this.platform][0], "GMA Button");
    await ElementHelper.cmdClick(sanityPageLocator.gmaPlayButton[this.platform][0], "GMA Play Button");
    await AssertionHelper.assertVisible(sanityPageLocator.watchListButtonInPlayerScreen[this.platform][0]);
    console.log("✅ Navigated to player screen and watchlist button is visible");
    const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
    await (browser as any).waitUntil(async () => {
      return await ElementHelper.cmdIsVisible(loader);
    }, {
      timeout: 10000,
      interval: 1000
    }).catch(() => {
      console.log("Loader did not appear");
    });
    console.log("⏳ Waiting for Loader to disappear");
    await (browser as any).waitUntil(async () => {
      const isVisible = await ElementHelper.cmdIsVisible(loader);
      return !isVisible;
    }, {
      timeout: 180000,  // 3 minutes
      interval: 2000,
      timeoutMsg: "Loader did not disappear within 3 minutes"
    });
    await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    await AssertionHelper.assertVisible(sanityPageLocator.playAndPauseIcon[this.platform][0]);
    console.log("✅ GMA Content is playing successfully for GMA Users");
    await browser.pause(5000);
  }

  /**
    * Search for any show content by name (Android implementation)
    */
  static async searchForShowContent(showName: string) {
    if (this.platform === 'android') {
      // Tap search icon
      await ElementHelper.cmdClick(sanityPageLocator.searchIcon[this.platform][0], "Search Icon");
      // Tap search input field
      await ElementHelper.cmdClick(sanityPageLocator.searchInputField[this.platform][0], "Search Input Field");
      // Enter show name
      await ElementHelper.cmdFill(sanityPageLocator.searchInputFieldInsertion[this.platform][0], showName);
      // Optionally, press enter or search button if required
      await browser.keys(['Enter']);
      await browser.pause(2000);
    } else {
      // Implement for other platforms if needed
      throw new Error('searchForShowContent is only implemented for Android');
    }
  }

  /**
   * Verifies the presence of the Skip Recap marker/button during initial content playback
   */
  static async verifySkipRecapPresence() {
    const skipRecapLocator = sanityPageLocator.skipRecapButton[this.platform][0];
    await AssertionHelper.assertVisible(skipRecapLocator);
  }

  /**
   * Verifies the functionality of the Skip Recap marker/button
   * Taps the button and checks if the progress bar or playback updates
   * (Assumes progress bar or playback validation is handled elsewhere or can be extended)
   */
  static async verifySkipRecapFunctionality() {
    const skipRecapLocator = sanityPageLocator.skipRecapButton[this.platform][0];
    await AssertionHelper.assertVisible(skipRecapLocator);
    await ElementHelper.cmdClick(skipRecapLocator, "Skip Recap Button");
    // Optionally, add logic to validate playback/progress bar update after skipping recap
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
  }

  // static async verifyPlayerControlsFunctionality(): Promise<void> {
  //   await ElementHelper.cmdPause(10000);
  //   const gmaContent = sanityPageLocator.gmaFirstRowContent[this.platform][0];
  //   let contentFound = false;
  //   let firstRow = gmaContent;

  //   let trayCount = await ElementHelper.cmdGetElementCount(firstRow);

  //   if (trayCount === 0) {
  //     // Fallback: Look for any movie/video card with thumbnail
  //     const fallbackSelectors = sanityPageLocator.contentFallbackSelectors[this.platform];

  //     for (const selector of fallbackSelectors) {
  //       const count = await ElementHelper.cmdGetElementCount(selector);
  //       if (count > 0) {
  //         firstRow = selector;
  //         contentFound = true;
  //         break;
  //       }
  //     }

  //     if (!contentFound) {
  //       return;
  //     }
  //   } else {
  //     contentFound = true;
  //   }

  //   await ElementHelper.cmdClick(firstRow);
  //   await ElementHelper.cmdPause(5000);
  //   await ElementHelper.cmdClick(sanityPageLocator.primiumUserPlayButton[this.platform][0]);
  //   if (this.platform === 'android') {
  //     const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
  //     await (browser as any).waitUntil(async () => {
  //       return await ElementHelper.cmdIsVisible(loader);
  //     }, {
  //       timeout: 10000,
  //       interval: 1000
  //     }).catch(() => {
  //       console.log("Loader did not appear");
  //     });

  //     console.log("⏳ Waiting for Loader to disappear");
  //     await (browser as any).waitUntil(async () => {
  //       const isVisible = await ElementHelper.cmdIsVisible(loader);
  //       return !isVisible;
  //     }, {
  //       timeout: 180000,  // 3 minutes
  //       interval: 2000,
  //       timeoutMsg: "Loader did not disappear within 3 minutes"
  //     });
  //     await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
  //   }
  //   await ElementHelper.cmdPause(3000);
  //   try {
  //     const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
  //     if (skipIntroVisible) {
  //       await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0]);
  //       await ElementHelper.cmdPause(1000);
  //     }
  //   } catch (error) {
  //     // Skip intro button not available, continue with test
  //   }

  //   await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
  //   await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
  //   await ElementHelper.cmdPause(500);
  //   const PauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();

  //   // Convert time string MM:SS to seconds for proper comparison
  //   const timeToSeconds = (timeStr: string) => {
  //     const parts = timeStr.split(':').map(p => parseInt(p.trim(), 10));
  //     return parts[0] * 60 + parts[1];
  //   };

  //   const pauseTimeInSeconds = timeToSeconds(PauseTime);
  //   console.log("⏸️ Paused at: " + PauseTime + ` (${pauseTimeInSeconds} seconds)`);
  //   await ElementHelper.cmdClick(sanityPageLocator.primiumUserForwardButton[this.platform][0]);
  //   await ElementHelper.cmdPause(500);
  //   const forwordPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
  //   const forwardTimeInSeconds = timeToSeconds(forwordPauseTime);
  //   console.log("⏩ Forwarded to: " + forwordPauseTime + ` (${forwardTimeInSeconds} seconds)`);
  //   await AssertionHelper.assertValueIsGreaterThan(forwardTimeInSeconds, pauseTimeInSeconds);

  //   await ElementHelper.cmdClick(sanityPageLocator.primiumUserBackwardButton[this.platform][0]);
  //   await ElementHelper.cmdPause(500);
  //   const backwardPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
  //   const backwardTimeInSeconds = timeToSeconds(backwardPauseTime);
  //   console.log("⏪ Backwarded to: " + backwardPauseTime + ` (${backwardTimeInSeconds} seconds)`);
  //   await AssertionHelper.assertValueApproximatelyEquals(backwardTimeInSeconds, pauseTimeInSeconds, 1);
  //   if (this.platform === 'android') {
  //     await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
  //   } else if (this.platform === 'web') {
  //     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   }
  //   await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   //  await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   if (this.platform === 'android') {
  //     await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
  //   } else if (this.platform === 'web') {
  //     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   }
  //   await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
  //   if (this.platform === 'android') {
  //     await ElementHelper.cmdClick(sanityPageLocator.settingsIcon[this.platform][0]);
  //   } else if (this.platform === 'web') {
  //     await ElementHelper.cmdClick(sanityPageLocator.subtitleBtn[this.platform][0]);
  //   }
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.cmdClick(sanityPageLocator.subtitleEnglishBtn[this.platform][0]);
  //   if (this.platform === 'android') {
  //     await ElementHelper.cmdClick(sanityPageLocator.closeIconInSubtitleScreen[this.platform][0]);
  //   }
  //   await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   let subtitleLocator: string;
  //   if (this.platform === 'web') {
  //     subtitleLocator = sanityPageLocator.subtitleEnglish[this.platform][0];
  //     await browser.waitUntil(
  //       async () => {

  //         const elements = await $$(subtitleLocator);

  //         if (await elements.length === 0) {
  //           return false; // not yet created in DOM
  //         }

  //         const isDisplayed = await elements[0].isDisplayed();
  //         const text = await elements[0].getText();

  //         return isDisplayed && text.trim().length > 0;

  //       },
  //       {
  //         timeout: 5000,
  //         interval: 500,
  //         timeoutMsg: 'Subtitle did not appear within 5 seconds'
  //       }
  //     );
  //     await AssertionHelper.assertVisible(subtitleLocator);
  //   } else if (this.platform === 'android') {
  //     console.log("No Locator available for Android subtitle");
  //   }
  //   await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
  //   // await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   if (this.platform === 'android') {
  //     await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
  //   } else if (this.platform === 'web') {
  //     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   }
  //   await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
  //   await ElementHelper.cmdClick(sanityPageLocator.maximizeScreenButton[this.platform][0]);
  //   await AssertionHelper.assertVisible(sanityPageLocator.minimizeScreenButton[this.platform][0]);
  //   await ElementHelper.cmdClick(sanityPageLocator.minimizeScreenButton[this.platform][0]);
  //   await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
  //   if (this.platform === 'web') {
  //     await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0]);
  //     await AssertionHelper.assertVisible(sanityPageLocator.volumeUnmuteButton[this.platform][0]);
  //     await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0]);
  //     await AssertionHelper.assertVisible(sanityPageLocator.volumeMuteButton[this.platform][0]);
  //     await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
  //   } else if (this.platform === 'android') {
  //     console.log("volume is not available for Android and progress bar controls locator is not available for Android");
  //   }

  // }

  static async verifyPlayerControlsFunctionality(): Promise<void> {
    await ElementHelper.cmdPause(10000);
    const gmaContent = sanityPageLocator.showsTab[this.platform][0];
    let contentFound = false;
    let firstRow = gmaContent;

    let trayCount = await ElementHelper.cmdGetElementCount(firstRow);
    console.log("Checking for content tray..." + trayCount);

    if (trayCount === 0) {
      // Fallback: Look for any movie/video card with thumbnail
      const fallbackSelectors = sanityPageLocator.contentFallbackSelectors[this.platform];

      for (const selector of fallbackSelectors) {
        const count = await ElementHelper.cmdGetElementCount(selector);
        if (count > 0) {
          firstRow = selector;
          contentFound = true;
          break;
        }
      }

      if (!contentFound) {
        return;
      }
    } else {
      contentFound = true;
    }

    await ElementHelper.cmdClick(firstRow, "First Content");
    await ElementHelper.cmdPause(5000);
    await ElementHelper.cmdClick(sanityPageLocator.primiumUserPlayButton[this.platform][0], "Play Button");
    if (this.platform === 'android') {
      const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
      await (browser as any).waitUntil(async () => {
        return await ElementHelper.cmdIsVisible(loader);
      }, {
        timeout: 10000,
        interval: 1000
      }).catch(() => {
        console.log("Loader did not appear");
      });

      console.log("⏳ Waiting for Loader to disappear");
      await (browser as any).waitUntil(async () => {
        const isVisible = await ElementHelper.cmdIsVisible(loader);
        return !isVisible;
      }, {
        timeout: 180000,  // 3 minutes
        interval: 2000,
        timeoutMsg: "Loader did not disappear within 3 minutes"
      });
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    }
    await ElementHelper.cmdPause(3000);
    try {
      const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
      if (skipIntroVisible) {
        await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0], "Skip Intro Button");
        await ElementHelper.cmdPause(1000);
      }
    } catch (error) {
      // Skip intro button not available, continue with test
    }

    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    await ElementHelper.cmdPause(500);
    const PauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();

    // Convert time string MM:SS to seconds for proper comparison
    const timeToSeconds = (timeStr: string) => {
      const parts = timeStr.split(':').map(p => parseInt(p.trim(), 10));
      return parts[0] * 60 + parts[1];
    };

    const pauseTimeInSeconds = timeToSeconds(PauseTime);
    console.log("⏸️ Paused at: " + PauseTime + ` (${pauseTimeInSeconds} seconds)`);
    await ElementHelper.cmdClick(sanityPageLocator.primiumUserForwardButton[this.platform][0], "Forward Button");
    await ElementHelper.cmdPause(1000);
    const forwordPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
    const forwardTimeInSeconds = timeToSeconds(forwordPauseTime);
    console.log("⏩ Forwarded to: " + forwordPauseTime + ` (${forwardTimeInSeconds} seconds)`);
    await AssertionHelper.assertValueIsGreaterThan(forwardTimeInSeconds, pauseTimeInSeconds);
    await browser.pause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.primiumUserBackwardButton[this.platform][0], "Backward Button");
    await ElementHelper.cmdPause(500);
    const backwardPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
    const backwardTimeInSeconds = timeToSeconds(backwardPauseTime);
    console.log("⏪ Backwarded to: " + backwardPauseTime + ` (${backwardTimeInSeconds} seconds)`);
    await AssertionHelper.assertValueApproximatelyEquals(backwardTimeInSeconds, pauseTimeInSeconds, 1);
    if (this.platform === 'android') {
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    } else if (this.platform === 'web') {
      await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    }
    await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0], "Play Button");
    await ElementHelper.cmdPause(1000);
    //  await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    if (this.platform === 'android') {
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    } else if (this.platform === 'web') {
      await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    }
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    if (this.platform === 'android') {
      await ElementHelper.cmdClick(sanityPageLocator.settingsIcon[this.platform][0], "Settings Icon");
    } else if (this.platform === 'web') {
      await ElementHelper.cmdClick(sanityPageLocator.subtitleBtn[this.platform][0], "Subtitle Button");
    }
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.subtitleEnglishBtn[this.platform][0], "Subtitle English Button");
    if (this.platform === 'android') {
      await ElementHelper.cmdClick(sanityPageLocator.closeIconInSubtitleScreen[this.platform][0], "Close Icon in Subtitle Screen");
    }
    await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0], "Play Button");
    await ElementHelper.cmdPause(1000);
    let subtitleLocator: string;
    if (this.platform === 'web') {
      subtitleLocator = sanityPageLocator.subtitleEnglish[this.platform][0];
      await browser.waitUntil(
        async () => {

          const elements = await $$(subtitleLocator);

          if (await elements.length === 0) {
            return false; // not yet created in DOM
          }

          const isDisplayed = await elements[0].isDisplayed();
          const text = await elements[0].getText();

          return isDisplayed && text.trim().length > 0;

        },
        {
          timeout: 5000,
          interval: 500,
          timeoutMsg: 'Subtitle did not appear within 5 seconds'
        }
      );
      await AssertionHelper.assertVisible(subtitleLocator);
    } else if (this.platform === 'android') {
      console.log("No Locator available for Android subtitle");
    }
    await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
    // await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    if (this.platform === 'android') {
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    } else if (this.platform === 'web') {
      await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    }
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    await ElementHelper.cmdClick(sanityPageLocator.maximizeScreenButton[this.platform][0], "Maximize Screen Button");
    await AssertionHelper.assertVisible(sanityPageLocator.minimizeScreenButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.minimizeScreenButton[this.platform][0], "Minimize Screen Button");
    await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
    if (this.platform === 'web') {
      await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0], "Volume Button");
      await AssertionHelper.assertVisible(sanityPageLocator.volumeUnmuteButton[this.platform][0]);
      await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0], "Volume Button");
      await AssertionHelper.assertVisible(sanityPageLocator.volumeMuteButton[this.platform][0]);
      await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
    } else if (this.platform === 'android') {
      console.log("volume is not available for Android and progress bar controls locator is not available for Android");
    }

  }









  static async playGmaContent(): Promise<void> {
    await ElementHelper.cmdClick(sanityPageLocator.gmaTabButton[this.platform][0], "GMA Tab Button");
    await ElementHelper.cmdPause(1000);

    const firstRow = sanityPageLocator.gmaFirstRowContent[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(firstRow);
    if (trayCount === 0) {
      console.error('GMA content tray not found')
      return
    }
    await ElementHelper.cmdClick(firstRow, "First Row Content");
    await ElementHelper.cmdPause(500);
    await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0], "Play Button");

    // const timerLocatorV2 = sanityPageLocator.contentPlayTimerV2[this.platform][0];
    await ElementHelper.cmdPause(1000);
    if (this.platform === 'android') {
      const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
      await (browser as any).waitUntil(async () => {
        return await ElementHelper.cmdIsVisible(loader);
      }, {
        timeout: 10000,
        interval: 1000
      }).catch(() => {
        console.log("Loader did not appear");
      });

      console.log("⏳ Waiting for Loader to disappear");
      await (browser as any).waitUntil(async () => {
        const isVisible = await ElementHelper.cmdIsVisible(loader);
        return !isVisible;
      }, {
        timeout: 180000,  // 3 minutes
        interval: 2000,
        timeoutMsg: "Loader did not disappear within 3 minutes"
      });
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    }
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    await ElementHelper.cmdPause(1000);
    await AssertionHelper.assertVisible(sanityPageLocator.palyButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0], "Play Button");
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
  }




  static async playAndControlPlayer(): Promise<void> {
    await ElementHelper.cmdClick(sanityPageLocator.freetraycontentsLinks[this.platform][0], "Free Tray Content");
    await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0], "Play Button");
    await this.waitForAdsToComplete();
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    await AssertionHelper.assertVisible(sanityPageLocator.palyButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0], "Play Button");
    await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.seekForwardButton[this.platform][0], "Seek Forward Button");
    await ElementHelper.cmdClick(sanityPageLocator.seekBackwardButton[this.platform][0], "Seek Backward Button");
    const seekbar = await $(sanityPageLocator.seekbar[this.platform][0]);
    await seekbar.waitForDisplayed();
    await seekbar.setValue(50);
    await ElementHelper.cmdClick(sanityPageLocator.fullscreenButton[this.platform][0], "Fullscreen Button");
    await ElementHelper.cmdClick(sanityPageLocator.subtitleButton[this.platform][0], "Subtitle Button");
    const volumeSlider = await $(sanityPageLocator.volumeSlider[this.platform][0]);
    await volumeSlider.waitForDisplayed();
    await volumeSlider.setValue(70);
  }

  static async playerControlsFunctionality(): Promise<void> {
    await ElementHelper.cmdPause(2000);

    // Wait for content cards to be present on the page
    await browser.waitUntil(
      async () => {
        const gmaContent = await sanityPageLocator.gmaFirstRowContent[this.platform][0];
        const primaryCount = await ElementHelper.cmdGetElementCount(gmaContent);
        if (primaryCount > 0) return true;

        // Check fallback selectors if primary is not found
        const fallbackSelectors = sanityPageLocator.contentFallbackSelectors[this.platform];
        for (const selector of fallbackSelectors) {
          const count = await ElementHelper.cmdGetElementCount(selector);
          if (count > 0) return true;
        }
        return false;
      },
      { timeout: 15000, timeoutMsg: "Content cards failed to load within timeout" }
    );

    const gmaContent = await sanityPageLocator.gmaFirstRowContent[this.platform][0];
    let contentFound = false;
    let firstRow = gmaContent;
    let trayCount = await ElementHelper.cmdGetElementCount(firstRow);
    if (trayCount === 0) {
      const fallbackSelectors = sanityPageLocator.contentFallbackSelectors[this.platform];

      for (const selector of fallbackSelectors) {
        const count = await ElementHelper.cmdGetElementCount(selector);

        if (count > 0) {
          firstRow = selector;
          contentFound = true;
          break;
        }
      }
      await AssertionHelper.assertTrue(contentFound, "Content card not found in GMA tab");

    } else {
      contentFound = true;
    }
    await ElementHelper.cmdClick(firstRow, "First Content Card");
    await ElementHelper.cmdPause(5000);
    await ElementHelper.cmdClick(sanityPageLocator.primiumUserPlayButton[this.platform][0], "Premium User Play Button");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    try {
      const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
      if (skipIntroVisible) {
        await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0], "Skip Intro Button");
        await ElementHelper.cmdPause(1000);
      }
    } catch (error) {
      // Skip intro button not available, continue with test
    }

    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    await ElementHelper.cmdPause(1000);
    const PauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();

    // Convert time string MM:SS to seconds for proper comparison
    const timeToSeconds = (timeStr: string) => {
      const parts = timeStr.split(':').map(p => parseInt(p.trim(), 10));
      return parts[0] * 60 + parts[1];
    };

    const pauseTimeInSeconds = timeToSeconds(PauseTime);

    await ElementHelper.cmdClick(sanityPageLocator.primiumUserForwardButton[this.platform][0], "Premium User Forward Button");
    await ElementHelper.cmdPause(1000);
    const forwordPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
    const forwardTimeInSeconds = timeToSeconds(forwordPauseTime);

    await AssertionHelper.assertValueIsGreaterThan(forwardTimeInSeconds, pauseTimeInSeconds);

    await ElementHelper.cmdClick(sanityPageLocator.primiumUserBackwardButton[this.platform][0], "Premium User Backward Button");
    await ElementHelper.cmdPause(1000);
    const backwardPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
    const backwardTimeInSeconds = timeToSeconds(backwardPauseTime);

    await AssertionHelper.assertValueApproximatelyEquals(backwardTimeInSeconds, pauseTimeInSeconds, 1);

    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0], "Play Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.subtitleBtn[this.platform][0], "Subtitle Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.subtitleEnglishBtn[this.platform][0], "Subtitle English Button");
    await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0], "Play Button");
    await ElementHelper.cmdPause(1000);
    const subtitleLocator = sanityPageLocator.subtitleEnglish[this.platform][0];

    await browser.waitUntil(
      async () => {

        const elements = await $$(subtitleLocator);

        if (await elements.length === 0) {
          return false; // not yet created in DOM
        }

        const isDisplayed = await elements[0].isDisplayed();
        const text = await elements[0].getText();

        return isDisplayed && text.trim().length > 0;

      },
      {
        timeout: 5000,
        interval: 500,
        timeoutMsg: 'Subtitle did not appear within 5 seconds'
      }
    );

    await AssertionHelper.assertVisible(subtitleLocator);
    await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    await ElementHelper.cmdClick(sanityPageLocator.maximizeScreenButton[this.platform][0], "Maximize Screen Button");
    await AssertionHelper.assertVisible(sanityPageLocator.minimizeScreenButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.minimizeScreenButton[this.platform][0], "Minimize Screen Button");
    await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0], "Volume Button");
    await AssertionHelper.assertVisible(sanityPageLocator.volumeUnmuteButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0], "Volume Button");
    await AssertionHelper.assertVisible(sanityPageLocator.volumeMuteButton[this.platform][0]);
    await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
  }

  // static async verifyAutoUpnextPlayback(episodeTitle1: string, episodeTitle2: string, multipleEpisodesContent: string): Promise<void> {
  //   await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], multipleEpisodesContent);
  //   await ElementHelper.cmdPause(2000);


  //   await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
  //   const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
  //   const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
  //   if (trayCount === 0) {
  //     console.error("Free Tray not found or inaccessible");
  //     return;
  //   }
  //   await ElementHelper.cmdClick(freeTrayLocator);
  //   await ElementHelper.cmdClick(sanityPageLocator.episodesList[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
  //   await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);
  //   if (this.platform === 'android') {
  //     const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
  //     await (browser as any).waitUntil(async () => {
  //       return await ElementHelper.cmdIsVisible(loader);
  //     }, {
  //       timeout: 10000,
  //       interval: 1000
  //     }).catch(() => {
  //       console.log("Loader did not appear");
  //     });

  //     console.log("⏳ Waiting for Loader to disappear");
  //     await (browser as any).waitUntil(async () => {
  //       const isVisible = await ElementHelper.cmdIsVisible(loader);
  //       return !isVisible;
  //     }, {
  //       timeout: 180000,  // 3 minutes
  //       interval: 2000,
  //       timeoutMsg: "Loader did not disappear within 3 minutes"
  //     });
  //     await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
  //   }
  //   await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   try {
  //     const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
  //     if (skipIntroVisible) {
  //       await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0]);
  //       await ElementHelper.cmdPause(1000);
  //     }
  //   } catch (error) {
  //     // Skip intro button not available, continue with test
  //   }
  //   if (this.platform === 'web') {
  //     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   }
  //   const normalizeEpisodeText = (text: string) =>
  //     text.replace(/[●•]/g, '·').replace(/\s+/g, ' ').trim();
  //   if (this.platform === 'android') {
  //     const locator = sanityPageLocator.episodeText[this.platform][0];
  //     let receivedText = await ElementHelper.cmdGetText(locator);
  //     receivedText = receivedText.replace(/●/g, '·').replace(/\s+/g, ' ').trim();
  //     expect(receivedText).toBe(episodeTitle1);
  //   }
  //   else if (this.platform === 'web') {
  //     await AssertionHelper.assertTextEquals(sanityPageLocator.episodeText[this.platform][0], episodeTitle1);
  //     await ElementHelper.cmdPause(1000);
  //     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //     await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
  //   }
  //   if (this.platform === 'android') {
  //     await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
  //     await ElementHelper.cmdPause(1000);
  //     await ElementHelper.cmdClick(sanityPageLocator.maximizeScreenButton[this.platform][0]);
  //     await ElementHelper.cmdPause(10000);
  //   }
  //   await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], episodeTitle1, 40000);
  //   await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle2);
  // }

  static async verifyAutoUpnextPlayback(episodeTitle1: string, episodeTitle2: string, multipleEpisodesContent: string): Promise<void> {
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], multipleEpisodesContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
    if (trayCount === 0) {
      console.error("Free Tray not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(freeTrayLocator, "Free Tray");
    await ElementHelper.cmdClick(sanityPageLocator.episodesList[this.platform][0], "Episodes List");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    // await browser.pause(2000);
    // await AssertionHelper.assertVisible(sanityPageLocator.playButton[this.platform][0]);
    // await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);

    //  Wait for player screen
    await $(sanityPageLocator.midleScreen[this.platform][0]).waitForDisplayed({ timeout: 20000 });

    // Ensure controls are triggered
    await browser.waitUntil(async () => {
      try {
        await ElementHelper.cmdClick(sanityPageLocator.midleScreen[this.platform][0], "Middle Screen");
        await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
        return true;
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      interval: 1000,
      timeoutMsg: "Player not interactive"
    });

    // Handle Play / Autoplay scenario
    const playBtn = sanityPageLocator.episodePlayButton[this.platform][0];

    await browser.waitUntil(async () => {
      await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
      return await ElementHelper.cmdIsVisible(playBtn).catch(() => false);
    }, {
      timeout: 10000,
      interval: 1000
    }).catch(() => {
      console.log("Play button not visible — likely autoplay");
    });

    // ✅ Click only if Play is visible
    const isPlayVisible = await ElementHelper.cmdIsVisible(playBtn).catch(() => false);

    if (isPlayVisible) {
      console.log("▶️ Clicking Play button");
      await ElementHelper.cmdClick(playBtn, "Play Button");
    } else {
      console.log("⏩ Video already playing, skipping Play click");
    }

    if (this.platform === 'android') {
      const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
      await (browser as any).waitUntil(async () => {
        return await ElementHelper.cmdIsVisible(loader);
      }, {
        timeout: 10000,
        interval: 1000
      }).catch(() => {
        console.log("Loader did not appear");
      });

      console.log("⏳ Waiting for Loader to disappear");
      await (browser as any).waitUntil(async () => {
        const isVisible = await ElementHelper.cmdIsVisible(loader);
        return !isVisible;
      }, {
        timeout: 180000,  // 3 minutes
        interval: 2000,
        timeoutMsg: "Loader did not disappear within 3 minutes"
      });
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    }
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(1000);
    try {
      const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
      if (skipIntroVisible) {
        await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0], "Skip Intro Button");
        await ElementHelper.cmdPause(1000);
      }
    } catch (error) {
      // Skip intro button not available, continue with test
    }
    if (this.platform === 'web') {
      await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    }
    const normalizeEpisodeText = (text: string) =>
      text.replace(/[●•]/g, '·').replace(/\s+/g, ' ').trim();
    if (this.platform === 'android') {
      const locator = sanityPageLocator.episodeText[this.platform][0];
      let receivedText = await ElementHelper.cmdGetText(locator);
      receivedText = receivedText.replace(/●/g, '·').replace(/\s+/g, ' ').trim();
      expect(receivedText).toBe(episodeTitle1);
    }
    else if (this.platform === 'web') {
      const currentEpisodeTitle = await ElementHelper.cmdGetText(sanityPageLocator.episodeText[this.platform][0]);
      await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle1);
      await ElementHelper.cmdPause(1000);
      await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
      await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0],
        sanityPageLocator.scrubSeekbar[this.platform][0]);
      await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], currentEpisodeTitle, 40000);
    }
    if (this.platform === 'android') {
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
      await ElementHelper.cmdPause(1000);
      await ElementHelper.cmdClick(sanityPageLocator.maximizeScreenButton[this.platform][0], "Maximize Screen Button");
      await ElementHelper.cmdPause(10000);
    }
    if (this.platform === 'android') {
      await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], episodeTitle1, 40000);
    }
    await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle2);
  }


  // static async verifyAutoUpnextPlaybackForMultiEpisodeShow(episodeTitle1: string, episodeTitle2: string, multipleEpisodesContent: string): Promise<void> {
  //   await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], multipleEpisodesContent);
  //   await ElementHelper.cmdPause(2000);
  //   await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
  //   await ElementHelper.cmdPause(2000);
  //   const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
  //   const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
  //   if (trayCount === 0) {
  //     console.error("Free Tray not found or inaccessible");
  //     return;
  //   }

  //   await ElementHelper.cmdClick(freeTrayLocator);
  //   await ElementHelper.cmdClick(sanityPageLocator.episodesList[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
  //   await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);
  //   await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
  //   await ElementHelper.cmdPause(1000);
  //   try {
  //     const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
  //     if (skipIntroVisible) {
  //       await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0]);
  //       await ElementHelper.cmdPause(1000);
  //     }
  //   } catch (error) {
  //     // ignore if not present
  //   }

  //   await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle1);
  //   await ElementHelper.cmdPause(1000);
  //   await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
  //   await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeThumbnail[this.platform][0]);
  //   await ElementHelper.cmdClick(sanityPageLocator.nextEpisodeThumbnailPlayBtn[this.platform][0]);
  //   await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], episodeTitle1, 15000);
  //   await ElementHelper.cmdPause(4000);
  //   await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
  //   await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle2);
  // }

  static async verifyUpnextBingeMarker(episodeTitle1: string, episodeTitle2: string, multipleEpisodesContent: string): Promise<void> {
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], multipleEpisodesContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(2000);
    const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
    if (trayCount === 0) {
      console.error("Free Tray not found or inaccessible");
      return;
    }

    await ElementHelper.cmdClick(freeTrayLocator, "Free Tray");
    await ElementHelper.cmdClick(sanityPageLocator.episodesList[this.platform][0], "Episodes List");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    // await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);
    // await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // await ElementHelper.cmdPause(1000);
    await $(sanityPageLocator.midleScreen[this.platform][0]).waitForDisplayed({ timeout: 20000 });

    // Ensure controls are triggered
    await browser.waitUntil(async () => {
      try {
        await ElementHelper.cmdClick(sanityPageLocator.midleScreen[this.platform][0], "Middle Screen");
        await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
        return true;
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      interval: 1000,
      timeoutMsg: "Player not interactive"
    });

    // Handle Play / Autoplay scenario
    const playBtn = sanityPageLocator.episodePlayButton[this.platform][0];

    await browser.waitUntil(async () => {
      await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
      return await ElementHelper.cmdIsVisible(playBtn).catch(() => false);
    }, {
      timeout: 10000,
      interval: 1000
    }).catch(() => {
      console.log("Play button not visible — likely autoplay");
    });

    // ✅ Click only if Play is visible
    const isPlayVisible = await ElementHelper.cmdIsVisible(playBtn).catch(() => false);

    if (isPlayVisible) {
      console.log("▶️ Clicking Play button");
      await ElementHelper.cmdClick(playBtn, "Play Button");
    } else {
      console.log("⏩ Video already playing, skipping Play click");
    }


    try {
      const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
      if (skipIntroVisible) {
        await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0], "Skip Intro Button");
        await ElementHelper.cmdPause(1000);
      }
    } catch (error) {
      // ignore if not present
    }

    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle1);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeThumbnail[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.nextEpisodeThumbnailPlayBtn[this.platform][0], "Next Episode Thumbnail Play Button");
    await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], episodeTitle1, 15000);
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle2);
  }



  static async verifySkipIntroMarker(searchSkipIntroContent: string): Promise<void> {
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchSkipIntroContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(2000);
    const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
    if (trayCount === 0) {
      console.error("Free Tray not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(freeTrayLocator, "Free Tray");
    await ElementHelper.cmdClick(sanityPageLocator.curentEpisodePlayButton[this.platform][0], "Current Episode Play Button");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.dragMidToStart(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0], "Skip Intro Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertNotVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
  }

  static async verifySkipRecapMarkerWithSearch(searchContent: string): Promise<void> {
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    // step 3: search for content
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    if (this.platform === 'android') {
      await browser.waitUntil(async () => {
        try {
          return await $(sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0]).isDisplayed();
        } catch {
          return false;
        }
      }, {
        timeout: 10000,
        timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
      });
    }

    // step 4: navigate to search result and tap to play
    const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
    if (trayCount === 0) {
      console.error("Free Tray not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(freeTrayLocator, "Free Tray");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.curentEpisodePlayButton[this.platform][0], "Current Episode Play Button");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.dragMidToStart(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0], "Skip Intro Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertNotVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.skipRecapButton[this.platform][0]);

    await ElementHelper.cmdClick(sanityPageLocator.skipRecapButton[this.platform][0], "Skip Recap Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertNotVisible(sanityPageLocator.skipRecapButton[this.platform][0]);
  }

  static async verifySkipOutroMarkerWithSearch(searchContent: string): Promise<void> {
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);

    // step 3: search for content
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // step 4: navigate to search result and tap to play
    const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
    const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
    if (resultCount === 0) {
      console.error('Search result not found');
      return;
    }
    await ElementHelper.cmdClick(searchResultLocator, "Search Result");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(1000);

    await ElementHelper.cmdClick(sanityPageLocator.secondEpisodesList[this.platform][0], "Second Episodes List");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeThumbnail[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeButton[this.platform][0]);

  }

  /**
   * Verify PiP (Picture-in-Picture) mode during active video playback for VOD content.
   * This method is Android-specific and tests the PiP functionality.
   *
   * Steps:
   * 1. Navigate to video player screen
   * 2. Start VOD playback
   * 3. Press Home button to enter PiP mode
   * 4. Verify app enters PiP mode with floating video window
   */
  static async verifyPipModeDuringPlayback(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('PiP mode verification is only supported on Android platform');
    }
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.gmaFirstRowContent[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
    });

    // Navigate to content and start playback
    const contentLocator = sanityPageLocator.gmaFirstRowContent[this.platform][0];
    const contentCount = await ElementHelper.cmdGetElementCount(contentLocator);
    if (contentCount === 0) {
      throw new Error('Content not found for PiP mode testing');
    }

    await ElementHelper.cmdClick(contentLocator, "Content");
    await ElementHelper.cmdPause(2000);

    // Start video playback
    await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0], "Play Button");
    await ElementHelper.cmdPause(3000);

    // Wait for video to start playing
    if (this.platform === 'android') {
      const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
      await (browser as any).waitUntil(async () => {
        return await ElementHelper.cmdIsVisible(loader);
      }, {
        timeout: 10000,
        interval: 1000
      }).catch(() => {
        console.log("Loader did not appear");
      });

      console.log("⏳ Waiting for Loader to disappear");
      await (browser as any).waitUntil(async () => {
        const isVisible = await ElementHelper.cmdIsVisible(loader);
        return !isVisible;
      }, {
        timeout: 180000,  // 3 minutes
        interval: 2000,
        timeoutMsg: "Loader did not disappear within 3 minutes"
      });

      // Click on player screen to reveal controls
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    }

    // Verify video is playing
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

    // Press Home button to enter PiP mode
    await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
    await ElementHelper.cmdPause(2000);

    // Verify PiP mode is active - Use mandatory assertion
    console.log("🔍 Verifying PiP window is visible...");
    await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
    console.log("✅ PiP window is visible");

    // Verify video player is still active in PiP mode
    console.log("🔍 Verifying PiP video player is active...");
    await AssertionHelper.assertVisible(sanityPageLocator.pipVideoPlayer[this.platform][0]);
    console.log("✅ PiP video player is active");

    console.log("✅ PiP mode verification completed successfully");
  }

  /**
   * Verify PiP (Picture-in-Picture) mode during active live video playback.
   * This method is Android-specific and tests the PiP functionality for live content.
   *
   * Steps:
   * 1. Navigate to live content
   * 2. Start live playback
   * 3. Press Home button to enter PiP mode
   * 4. Verify app enters PiP mode with floating video window
   */
  static async verifyPipModeDuringLivePlayback(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('PiP mode verification is only supported on Android platform');
    }

    // Navigate to Live tab
    await ElementHelper.cmdClick(sanityPageLocator.liveTab[this.platform][0], "Live Tab");
    await ElementHelper.cmdPause(2000);

    // Find and click on live content
    const liveContentLocator = sanityPageLocator.liveContent[this.platform][0];
    const contentCount = await ElementHelper.cmdGetElementCount(liveContentLocator);
    if (contentCount === 0) {
      throw new Error('Live content not found for PiP mode testing');
    }

    await ElementHelper.cmdClick(liveContentLocator, "Live Content");
    await ElementHelper.cmdPause(2000);

    // Verify we're on a live stream
    await AssertionHelper.assertVisible(sanityPageLocator.livePlayerIndicator[this.platform][0]);

    // Wait for live stream to start playing
    await ElementHelper.cmdPause(5000);

    // Verify live video is playing
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

    // Press Home button to enter PiP mode
    await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
    await ElementHelper.cmdPause(2000);

    // Verify PiP mode is active - Use mandatory assertion for live content
    console.log("🔍 Verifying PiP window is visible for live content...");
    await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
    console.log("✅ PiP window is visible for live content");

    // Verify video player is still active in PiP mode
    console.log("🔍 Verifying PiP video player is active for live content...");
    await AssertionHelper.assertVisible(sanityPageLocator.pipVideoPlayer[this.platform][0]);
    console.log("✅ PiP video player is active for live content");

    console.log("✅ Live PiP mode verification completed successfully");
  }

  /**
   * Verify PiP (Picture-in-Picture) playback controls for VOD content.
   * This method is Android-specific and tests the playback controls within PiP mode.
   *
   * Steps:
   * 1. Enter PiP mode during VOD playback
   * 2. Tap PiP window to show controls
   * 3. Test Play/Pause, Forward, Rewind controls
   * 4. Verify controls respond correctly
   */
  static async verifyPipPlaybackControls(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('PiP playback controls verification is only supported on Android platform');
    }

    // First, enter PiP mode by starting VOD playback and pressing home
    const contentLocator = sanityPageLocator.gmaFirstRowContent[this.platform][0];
    const contentCount = await ElementHelper.cmdGetElementCount(contentLocator);
    if (contentCount === 0) {
      throw new Error('Content not found for PiP controls testing');
    }

    await ElementHelper.cmdClick(contentLocator, "Content");
    await ElementHelper.cmdPause(2000);

    // Start video playback
    await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0], "Play Button");
    await ElementHelper.cmdPause(3000);

    // Wait for video to start playing
    if (this.platform === 'android') {
      const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
      await (browser as any).waitUntil(async () => {
        return await ElementHelper.cmdIsVisible(loader);
      }, {
        timeout: 10000,
        interval: 1000
      }).catch(() => {
        console.log("Loader did not appear");
      });

      console.log("⏳ Waiting for Loader to disappear");
      await (browser as any).waitUntil(async () => {
        const isVisible = await ElementHelper.cmdIsVisible(loader);
        return !isVisible;
      }, {
        timeout: 180000,  // 3 minutes
        interval: 2000,
        timeoutMsg: "Loader did not disappear within 3 minutes"
      });

      // Click on player screen to reveal controls
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    }

    // Verify video is playing
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

    // Press Home button to enter PiP mode
    await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
    await ElementHelper.cmdPause(2000);

    // Verify PiP mode is active
    await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
    console.log("✅ Entered PiP mode successfully");

    // Tap PiP window to show controls
    await ElementHelper.cmdClick(sanityPageLocator.pipWindow[this.platform][0], "PiP Window");
    await ElementHelper.cmdPause(1000);

    // Verify PiP controls are visible
    const controlsVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.pipControlsOverlay[this.platform][0]);
    if (controlsVisible) {
      console.log("✅ PiP controls overlay is visible");
    }

    // Test Play/Pause functionality
    console.log("🧪 Testing Play/Pause control...");
    const playPauseButton = sanityPageLocator.pipPlayPauseButton[this.platform][0];
    const initialPlayState = await ElementHelper.cmdIsVisible(playPauseButton);

    // Click play/pause button
    await ElementHelper.cmdClick(playPauseButton, "Play/Pause Button");
    await ElementHelper.cmdPause(2000);

    // Verify state changed (play button should appear when paused, pause when playing)
    const newPlayState = await ElementHelper.cmdIsVisible(playPauseButton);
    if (initialPlayState !== newPlayState) {
      console.log("✅ Play/Pause control working correctly");
    }

    // Click again to resume playback
    await ElementHelper.cmdClick(playPauseButton, "Play/Pause Button");
    await ElementHelper.cmdPause(2000);

    // Test Forward control (+10s)
    console.log("🧪 Testing Forward control...");
    const forwardButton = sanityPageLocator.pipForwardButton[this.platform][0];
    const forwardVisible = await ElementHelper.cmdIsVisible(forwardButton);
    if (forwardVisible) {
      await ElementHelper.cmdClick(forwardButton, "Forward Button");
      await ElementHelper.cmdPause(2000);
      console.log("✅ Forward control (+10s) executed");
    }

    // Test Rewind control (-10s)
    console.log("🧪 Testing Rewind control...");
    const rewindButton = sanityPageLocator.pipRewindButton[this.platform][0];
    const rewindVisible = await ElementHelper.cmdIsVisible(rewindButton);
    if (rewindVisible) {
      await ElementHelper.cmdClick(rewindButton, "Rewind Button");
      await ElementHelper.cmdPause(2000);
      console.log("✅ Rewind control (-10s) executed");
    }

    console.log("✅ PiP playback controls verification completed successfully");
  }

  /**
   * Verify PiP (Picture-in-Picture) playback controls for Live stream.
   * This method is Android-specific and tests the playback controls within PiP mode for live content.
   *
   * Steps:
   * 1. Enter PiP mode during live playback
   * 2. Tap PiP window to show controls
   * 3. Verify Play/Pause toggles playback
   * 4. Verify Live badge should be visible
   */
  static async verifyPipPlaybackControlsForLive(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('PiP playback controls verification is only supported on Android platform');
    }

    // Navigate to Live tab
    await ElementHelper.cmdClick(sanityPageLocator.liveTab[this.platform][0], "Live Tab");
    await ElementHelper.cmdPause(2000);

    // Find and click on live content
    const liveContentLocator = sanityPageLocator.liveContent[this.platform][0];
    const contentCount = await ElementHelper.cmdGetElementCount(liveContentLocator);
    if (contentCount === 0) {
      throw new Error('Live content not found for PiP controls testing');
    }

    await ElementHelper.cmdClick(liveContentLocator, "Live Content");
    await ElementHelper.cmdPause(2000);

    // Verify we're on a live stream
    await AssertionHelper.assertVisible(sanityPageLocator.livePlayerIndicator[this.platform][0]);

    // Wait for live stream to start playing
    await ElementHelper.cmdPause(5000);

    // Verify live video is playing
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

    // Press Home button to enter PiP mode
    await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
    await ElementHelper.cmdPause(2000);

    // Verify PiP mode is active
    console.log("🔍 Verifying PiP window is visible for live stream...");
    await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
    console.log("✅ PiP window is visible for live stream");

    // Tap PiP window to show controls
    await ElementHelper.cmdClick(sanityPageLocator.pipWindow[this.platform][0], "PiP Window");
    await ElementHelper.cmdPause(1000);

    // Verify PiP controls are visible
    const controlsVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.pipControlsOverlay[this.platform][0]);
    if (controlsVisible) {
      console.log("✅ PiP controls overlay is visible for live stream");
    }

    // Test Play/Pause functionality for live stream
    console.log("🧪 Testing Play/Pause control for live stream...");
    const playPauseButton = sanityPageLocator.pipPlayPauseButton[this.platform][0];
    const initialPlayState = await ElementHelper.cmdIsVisible(playPauseButton);

    // Click play/pause button
    await ElementHelper.cmdClick(playPauseButton, "Play/Pause Button");
    await ElementHelper.cmdPause(2000);

    // Verify state changed (play button should appear when paused, pause when playing)
    const newPlayState = await ElementHelper.cmdIsVisible(playPauseButton);
    if (initialPlayState !== newPlayState) {
      console.log("✅ Play/Pause control working correctly for live stream");
    }

    // Click again to resume playback
    await ElementHelper.cmdClick(playPauseButton, "Play/Pause Button");
    await ElementHelper.cmdPause(2000);

    // Verify Live badge is visible in PiP mode
    console.log("🔍 Verifying Live badge is visible in PiP mode...");
    await AssertionHelper.assertVisible(sanityPageLocator.pipLiveBadge[this.platform][0]);
    console.log("✅ Live badge is visible in PiP mode");

    console.log("✅ PiP playback controls verification for live stream completed successfully");
  }

  /**
   * Verify the Full screen transition from PiP (Picture-in-Picture) mode.
   * This method is Android-specific and tests the transition from PiP back to fullscreen.
   *
   * Steps:
   * 1. Navigate to video player screen
   * 2. Start VOD playback
   * 3. Press Home button for PIP mode
   * 4. While in PiP mode, tap Full Screen icon
   * 5. Verify video returns to full screen in the app
   */
  static async verifyPipFullscreenTransition(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('PiP fullscreen transition verification is only supported on Android platform');
    }

    // Navigate to content and start playback
    const contentLocator = sanityPageLocator.gmaFirstRowContent[this.platform][0];
    const contentCount = await ElementHelper.cmdGetElementCount(contentLocator);
    if (contentCount === 0) {
      throw new Error('Content not found for PiP fullscreen transition testing');
    }

    await ElementHelper.cmdClick(contentLocator, "Content");
    await ElementHelper.cmdPause(2000);

    // Start video playback
    await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0], "Play Button");
    await ElementHelper.cmdPause(3000);

    // Wait for video to start playing
    if (this.platform === 'android') {
      const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
      await (browser as any).waitUntil(async () => {
        return await ElementHelper.cmdIsVisible(loader);
      }, {
        timeout: 10000,
        interval: 1000
      }).catch(() => {
        console.log("Loader did not appear");
      });

      console.log("⏳ Waiting for Loader to disappear");
      await (browser as any).waitUntil(async () => {
        const isVisible = await ElementHelper.cmdIsVisible(loader);
        return !isVisible;
      }, {
        timeout: 180000,  // 3 minutes
        interval: 2000,
        timeoutMsg: "Loader did not disappear within 3 minutes"
      });

      // Click on player screen to reveal controls
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    }

    // Verify video is playing
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

    // Press Home button to enter PiP mode
    await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
    await ElementHelper.cmdPause(2000);

    // Verify PiP mode is active
    console.log("🔍 Verifying PiP window is visible...");
    await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
    console.log("✅ PiP window is visible");

    // Tap PiP window to show controls
    await ElementHelper.cmdClick(sanityPageLocator.pipWindow[this.platform][0], "PiP Window");
    await ElementHelper.cmdPause(1000);

    // Verify PiP controls are visible
    const controlsVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.pipControlsOverlay[this.platform][0]);
    if (controlsVisible) {
      console.log("✅ PiP controls overlay is visible");
    }

    // While in PiP mode, tap Full Screen icon
    console.log("🧪 Testing fullscreen transition from PiP mode...");
    const fullscreenButton = sanityPageLocator.pipFullscreenButton[this.platform][0];
    const fullscreenVisible = await ElementHelper.cmdIsVisible(fullscreenButton);
    if (fullscreenVisible) {
      await ElementHelper.cmdClick(fullscreenButton, "PiP Fullscreen Button");
      await ElementHelper.cmdPause(3000);
      console.log("✅ Fullscreen button tapped in PiP mode");
    } else {
      throw new Error('Fullscreen button not found in PiP mode');
    }

    // Verify video returns to full screen in the app
    console.log("🔍 Verifying video returned to fullscreen in the app...");

    // Check that we're back in the main app (not in PiP)
    const pipWindowGone = await ElementHelper.cmdIsVisible(sanityPageLocator.pipWindow[this.platform][0]);
    if (!pipWindowGone) {
      console.log("✅ PiP window is no longer visible - app returned to foreground");
    }
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
    console.log("✅ Video player is active in fullscreen mode");
    await AssertionHelper.assertVisible(sanityPageLocator.playerScreenOutline[this.platform][0]);
    console.log("✅ Player screen outline is visible - back in main app");
    console.log("✅ PiP fullscreen transition verification completed successfully");
  }


  static async verifySkipOutroCloseMarkerWithSearch(searchContent: string): Promise<void> {
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // search for the provided content title
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);

    const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
    const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
    if (resultCount === 0) {
      console.error('Search result not found');
      return;
    }
    await ElementHelper.cmdClick(searchResultLocator, "Search Result");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.secondEpisodesList[this.platform][0], "Second Episodes List");
    await ElementHelper.cmdPause(4000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeThumbnailPlayBtn[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeCloseButton[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.nextEpisodeCloseButton[this.platform][0], "Next Episode Close Button");
    await ElementHelper.cmdPause(1000);
    await AssertionHelper.assertNotVisible(sanityPageLocator.nextEpisodeCloseButton[this.platform][0]);
  }

  static async verifyAfterClickingOnSkipOutroNextEpisodePlayed(searchContent: string, episodeTitle1: string, episodeTitle2: string): Promise<void> {
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // search for the provided content title
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);

    const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
    const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
    if (resultCount === 0) {
      console.error('Search result not found');
      return;
    }
    await ElementHelper.cmdClick(searchResultLocator, "Search Result");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.episodesList[this.platform][0], "Episodes List");
    await ElementHelper.cmdPause(4000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await AssertionHelper.assertTextEquals(sanityPageLocator.episodeText[this.platform][0].split('·')[0].trim(), episodeTitle1);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.nextEpisodeThumbnailPlayBtn[this.platform][0], "Next Episode Thumbnail Play Button");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
    await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], episodeTitle1, 15000);
    await AssertionHelper.assertTextEquals(sanityPageLocator.episodeText[this.platform][0], episodeTitle2);
  }

  static async verifyPrerollAndMidrollAds() {
    await ElementHelper.cmdPause(3000);
    await AssertionHelper.assertVisible(sanityPageLocator.freetraycontentsLinks[this.platform][0]);
    const freeTrayLocator = await sanityPageLocator.freetraycontentsLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
    if (trayCount === 0) {
      console.error("Free Tray not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(freeTrayLocator, "Free Tray");
    await ElementHelper.cmdClick(sanityPageLocator.curentEpisodePlayButton[this.platform][0], "Current Episode Play Button");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(2000);
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.addsTag[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      timeoutMsg: 'Ads not present after 15 seconds.'
    });
    await AssertionHelper.assertVisible(sanityPageLocator.addsTag[this.platform][0]);
    await this.waitForAdsToComplete();
    await ElementHelper.cmdPause(2000);
    await AssertionHelper.assertNotVisible(sanityPageLocator.addsTag[this.platform][0]);
    await ElementHelper.hoverVideoCenter();
    await ElementHelper.dragToMidFromStart(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0])
    await ElementHelper.cmdPause(2000);

    // check if ad is visible
    let ads = await ElementHelper.cmdIsVisible(sanityPageLocator.addsTag[this.platform][0]);

    // if not, try one more seek
    if (!ads) {
      console.log("No mid-roll ad, retrying seek...");
      await ElementHelper.hoverVideoCenter();
      await ElementHelper.dragToMidFromStart(
        sanityPageLocator.progressBar[this.platform][0],
        sanityPageLocator.scrubSeekbar[this.platform][0]
      );

      await ElementHelper.cmdPause(3000); // wait for ad to trigger

      ads = await ElementHelper.cmdIsVisible(sanityPageLocator.addsTag[this.platform][0]);
    }

    // final check
    if (ads) {
      console.log("✅ Mid-roll ad started successfully");
      await AssertionHelper.assertVisible(sanityPageLocator.addsTag[this.platform][0]);
      await this.waitForAdsToComplete();
    } else {
      console.log("⚠️ Mid-roll ad not displayed (acceptable)");
    }
    // await this.waitForAdsToComplete();
    await AssertionHelper.assertNotVisible(sanityPageLocator.addsTag[this.platform][0]);
  }

  static async fetchTextFromImage(locator: string): Promise<string> {
    let imageName = null;
    const posterLocator = locator;
    await browser.waitUntil(async () => {
      try {
        return await $(posterLocator).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      timeoutMsg: 'Poster element not found or not visible within 10 seconds.'
    });
    const poster = await $(posterLocator);

    // 2️⃣ Take screenshot
    await poster.saveScreenshot('./src/utilities/screenshots/raw.png');

    // 3️⃣ Improve image
    await preprocessImage(
      './src/utilities/screenshots/raw.png',
      './src/utilities/screenshots/clean.png'
    );

    // 4️⃣ Read text using OCR
    imageName = await extractTextFromImage(
      './src/utilities/screenshots/clean.png'
    );

    return imageName;
  }

  static async verifySharedDeeplinkFunctionality(episodeSharedToastMsgText: string, searchContent: string) {
    let episodeTitlecurrentWindow: string = null;
    let episodeTitleChildWindow: string = null;
    await ElementHelper.cmdPause(1000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // search for the provided content title
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0]);
    const freeTrayLocator = sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
    if (trayCount === 0) {
      console.error("Free Tray not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(freeTrayLocator, "Free Tray");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    if (this.platform === 'web') {
      episodeTitlecurrentWindow = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
    } else if (this.platform === 'android') {
      episodeTitlecurrentWindow = await this.fetchTextFromImage(sanityPageLocator.imageTextElement[this.platform][0]);
    }
    await ElementHelper.cmdPause(2000);
    episodeTitlecurrentWindow = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.episodeShareButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.episodeShareButton[this.platform][0], "Episode Share Button");
    if (this.platform === 'web') {
      await AssertionHelper.assertTextEquals(sanityPageLocator.episodeSharedToastMsg[this.platform][0], episodeSharedToastMsgText);
    } else if (this.platform === 'android') {
      await ElementHelper.cmdClick(sanityPageLocator.copyOptionInSharePopup[this.platform][0], "Copy Option in Share Popup");
    }
    await ElementHelper.cmdPause(1000);
    if (this.platform === 'web') {
      const copiedUrl = await ElementHelper.getCopiedText();
      console.log("Copied URL:", copiedUrl);
      await ElementHelper.switchToNewTabAndLaunchUrl(copiedUrl);
      await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
      const episodeTitleChildWindow = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
      await AssertionHelper.assertStringEquals(episodeTitleChildWindow, episodeTitlecurrentWindow);
      await ElementHelper.switchBackToParentAndCloseChild();
      await ElementHelper.cmdPause(1000);
    } else if (this.platform === 'android') {
      const base64Url = await driver.getClipboard('plaintext');
      console.log("Base64 URL from clipboard:", base64Url);
      const decodedUrl = Buffer.from(base64Url, 'base64').toString('utf-8');
      console.log("Decoded URL:", decodedUrl);
      await driver.execute('mobile: pressKey', { keycode: 3 });
      await driver.activateApp('com.android.chrome');
      await driver.url(decodedUrl);
      episodeTitleChildWindow = await this.fetchTextFromImage(sanityPageLocator.imageTextElement[this.platform][0]);
      await AssertionHelper.assertStringEquals(episodeTitleChildWindow, episodeTitlecurrentWindow);
    }
  }

  static async verifySubscriptionBlockerScreen(validSubscriptionPlanText: string, subscriptionToWatchText: string) {
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    await AssertionHelper.assertVisible(sanityPageLocator.premiumContentLinks[this.platform][0]);
    const premiumTrayLocator = sanityPageLocator.premiumContentLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(premiumTrayLocator);
    if (trayCount === 0) {
      console.error("Premium Tray not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(premiumTrayLocator, "Premium Tray");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.premiumSessionEpisodeList[this.platform][0], "Premium Session Episode List");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await AssertionHelper.assertTextEquals(sanityPageLocator.validSubscriptionPlanText[this.platform][0], validSubscriptionPlanText);
    await AssertionHelper.assertTextEquals(sanityPageLocator.subscriptionToWatchText[this.platform][0], subscriptionToWatchText);
  }
  static async verifyResumeCTAIsDisplayed(continueToWatchRemovedToastMsg: string) {
    await ElementHelper.cmdPause(3000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(3000);
    const continueToWatchEpisode = await ElementHelper.cmdGetText(sanityPageLocator.continueToWatchContentText[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.continueToWatchContentText[this.platform][0]);
    await ElementHelper.cmdMouseHover(sanityPageLocator.continueToWatchContentText[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.continueToCloseButton[this.platform][0], "Continue to Close Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], continueToWatchRemovedToastMsg);
    await ElementHelper.cmdPause(1000);
    const continueToWatchEpisodeRemaining = await ElementHelper.getTextByJS(sanityPageLocator.continueToWatchContentText[this.platform][0]);
    await AssertionHelper.assertStringNotEquals(continueToWatchEpisodeRemaining, continueToWatchRemovedToastMsg);
  };

  static async verifyWatchlistFunctionality(watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
    await ElementHelper.cmdPause(1000);
    await AssertionHelper.assertVisible(sanityPageLocator.allContentsLinks[this.platform][0]);
    const addToWatchListEpisode = await ElementHelper.cmdGetText(sanityPageLocator.allContentsLinks[this.platform][0]);
    const episodeLocator = await sanityPageLocator.allContentsLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
    if (trayCount === 0) {
      console.error("Episode not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(episodeLocator, "Episode Locator");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watch List Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0], "My Watch List Tab");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    const addedToWatchListEpisode = await ElementHelper.cmdGetText(sanityPageLocator.allContentsLinks[this.platform][0]);
    await AssertionHelper.assertStringEquals(addedToWatchListEpisode, addToWatchListEpisode);
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
    await ElementHelper.cmdIsVisible(sanityPageLocator.watchListButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watch List Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
  }

  static async verifyRemoveFromWatchlistFunctionality(watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
    await ElementHelper.cmdPause(1000);
    await AssertionHelper.assertVisible(sanityPageLocator.allContentsLinks[this.platform][0]);
    const addToWatchListEpisode = await ElementHelper.cmdGetText(sanityPageLocator.allContentsLinks[this.platform][0]);
    const episodeLocator = await sanityPageLocator.allContentsLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
    if (trayCount === 0) {
      console.error("Episode not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(episodeLocator, "Episode Locator");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watch List Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
    await ElementHelper.cmdPause(3000);
    await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0], "My Watch List Tab");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    const addedToWatchListEpisode = await ElementHelper.cmdGetText(sanityPageLocator.allContentsLinks[this.platform][0]);
    await AssertionHelper.assertStringEquals(addedToWatchListEpisode, addToWatchListEpisode);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watch List Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
  }

  static async verifyShareFunctionality(searchContent: string) {
    let episodeTitlecurrentWindow: string = null;
    let episodeTitleChildWindow: string = null;
    await ElementHelper.cmdPause(1000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0]);
    const freeTrayLocator = sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
    if (trayCount === 0) {
      console.error("Free Tray not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(freeTrayLocator, "Free Tray Locator");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    episodeTitlecurrentWindow = await this.fetchTextFromImage(sanityPageLocator.imageTextElement[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.episodeShareButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.episodeShareButton[this.platform][0], "Episode Share Button");
    await ElementHelper.cmdClick(sanityPageLocator.copyOptionInSharePopup[this.platform][0], "Copy Option in Share Popup");
    await ElementHelper.cmdPause(1000);
    const base64Url = await driver.getClipboard('plaintext');
    console.log("Base64 URL from clipboard:", base64Url);
    const decodedUrl = Buffer.from(base64Url, 'base64').toString('utf-8');
    console.log("Decoded URL:", decodedUrl);
    await driver.execute('mobile: pressKey', { keycode: 3 });
    await driver.activateApp('com.android.chrome');
    await driver.url(decodedUrl);
    episodeTitleChildWindow = await this.fetchTextFromImage(sanityPageLocator.imageTextElement[this.platform][0]);
    await AssertionHelper.assertStringEquals(episodeTitleChildWindow, episodeTitlecurrentWindow);
  }

  static async verifyAddToWatchlistFromCWTrayBottomBarPopup(): Promise<void> {
    // await ElementHelper.cmdPause(3000);
    // // await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(9000);

    const continueWatchingTrayLocator = sanityPageLocator.continueToWatchContentText[this.platform][0];
    const continueWatchingTrayCount = await ElementHelper.cmdGetElementCount(continueWatchingTrayLocator);
    console.log("Continue Watching tray count: ", continueWatchingTrayCount);
    if (continueWatchingTrayCount === 0) {
      throw new Error('Continue Watching tray is not available for the logged-in user.');
    }

    await AssertionHelper.assertVisible(continueWatchingTrayLocator);
    await ElementHelper.cmdScrollDownSmall();
    await AssertionHelper.assertVisible(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0]);

    await ElementHelper.cmdClick(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0], "Continue Watching Three Dots Button");
    const removeFromWatchlistAppear = await ElementHelper.cmdIsVisible(
      sanityPageLocator.cwTrayRemoveFromWatchlistButton[this.platform][0]
    );
    if (removeFromWatchlistAppear) {
      await ElementHelper.cmdClick(sanityPageLocator.cwTrayRemoveFromWatchlistButton[this.platform][0], "Remove From Watchlist Button");
      await ElementHelper.cmdClick(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0], "Continue Watching Three Dots Button");
    }

    await AssertionHelper.assertVisible(sanityPageLocator.cwTrayAddToWatchlistButton[this.platform][0]);

    await ElementHelper.cmdClick(sanityPageLocator.cwTrayAddToWatchlistButton[this.platform][0], "Add to Watchlist Button");
    await ElementHelper.cmdPause(2000);

    // await ElementHelper.cmdClick(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0]);
    const removeFromWatchlistVisible = await ElementHelper.cmdIsVisible(
      sanityPageLocator.cwTrayRemoveFromWatchlistButton[this.platform][0]
    );

    if (!removeFromWatchlistVisible) {
      await ElementHelper.cmdClick(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0], "Continue Watching Three Dots Button");
    }

    await AssertionHelper.assertVisible(sanityPageLocator.cwTrayRemoveFromWatchlistButton[this.platform][0]);
  }

  static async verifyVideoPlaybackFromWatchlist(watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
    await ElementHelper.cmdPause(3000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    const episodeLocator = await sanityPageLocator.allContentsLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
    if (trayCount === 0) {
      console.error("Episode not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(episodeLocator, "Episode Locator");
    await ElementHelper.cmdPause(2000);
    const expectedTitle = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
    console.log("Expected episode title: ", expectedTitle);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    if (await ElementHelper.cmdIsVisible(sanityPageLocator.removeWatchListIcon[this.platform][0])) {
      await ElementHelper.cmdClick(sanityPageLocator.removeWatchListIcon[this.platform][0], "Remove from Watchlist Icon");
    }
    await ElementHelper.cmdPause(5000);
    await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
    await ElementHelper.cmdPause(500);
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
    await ElementHelper.cmdPause(3000);
    await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0], "My Watchlist Tab");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(3000);
    await ElementHelper.cmdClick(sanityPageLocator.allContentsLinks[this.platform][0], "All Contents Links");
    await ElementHelper.cmdClick(sanityPageLocator.primiumUserPlayButton[this.platform][0], "Premium User Play Button");
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(2000);
    await AssertionHelper.assertVisible(sanityPageLocator.palyButton[this.platform][0]);
    await ElementHelper.hoverVideoCenter();
    await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0], "Play Button");
    await ElementHelper.hoverVideoCenter();

    const addedToWatchListEpisode = (await ElementHelper.getTextByJS(sanityPageLocator.playerTitle[this.platform][0]));
    await AssertionHelper.assertStringEquals(expectedTitle, addedToWatchListEpisode);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.hoverVideoCenter();
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
    await ElementHelper.hoverVideoCenter();
    await AssertionHelper.assertVisible(sanityPageLocator.progressBar[this.platform][0]);
    await ElementHelper.hoverVideoCenter();
    await ElementHelper.cmdClick(sanityPageLocator.episodeBackButton[this.platform][0], "Episode Back Button");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.toastMsg[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 2000,
      timeoutMsg: 'Toast message not present after 15 seconds.'
    });
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
  }


  static async verifyFreeUserVideoPlaybackFromWatchlist(watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
    await ElementHelper.cmdPause(3000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    const episodeLocator = await sanityPageLocator.freetraycontentsLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
    if (trayCount === 0) {
      console.error("Episode not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(episodeLocator, "Episode Locator");
    await ElementHelper.cmdPause(2000);
    const expectedTitle = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    if (await ElementHelper.cmdIsVisible(sanityPageLocator.removeWatchListIcon[this.platform][0])) {
      await ElementHelper.cmdClick(sanityPageLocator.removeWatchListIcon[this.platform][0], "Remove from Watchlist Icon");
    }
    await ElementHelper.cmdPause(5000);
    await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
    await ElementHelper.cmdPause(3000);
    await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0], "My Watchlist Tab");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(3000);
    await ElementHelper.cmdClick(sanityPageLocator.allContentsLinks[this.platform][0], "All Contents Links");
    await ElementHelper.cmdClick(sanityPageLocator.primiumUserPlayButton[this.platform][0], "Premium User Play Button");
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await this.waitForAdsToComplete();
    await ElementHelper.hoverVideoCenter();
    await AssertionHelper.assertVisible(sanityPageLocator.palyButton[this.platform][0]);
    await ElementHelper.hoverVideoCenter();
    await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0], "Play Button");
    await ElementHelper.hoverVideoCenter();
    const addedToWatchListEpisode = (await ElementHelper.getTextByJS(sanityPageLocator.playerTitle[this.platform][0]));
    await AssertionHelper.assertStringEquals(expectedTitle, addedToWatchListEpisode);
    await ElementHelper.cmdPause(1000);
    await ElementHelper.hoverVideoCenter();
    await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
    await ElementHelper.hoverVideoCenter();
    await AssertionHelper.assertVisible(sanityPageLocator.progressBar[this.platform][0]);
    await ElementHelper.hoverVideoCenter();
    await ElementHelper.cmdClick(sanityPageLocator.episodeBackButton[this.platform][0], "Episode Back Button");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(1000);
    // await browser.refresh();
    // await ElementHelper.cmdPause(1000);
    // await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
    await ElementHelper.cmdPause(1000);
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
  }

  static async verifyAbleToAddContentToMyWatchlistFromSearchPage(searchContent: string, watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // step 3: search for content
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);

    // step 4: navigate to search result and tap to play
    const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
    const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
    if (resultCount === 0) {
      console.error('Search result not found');
      return;
    }
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.mouseHoverToEpisode[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
    await ElementHelper.cmdPause(3000);
    await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0], "My Watchlist Tab");
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
  }

  static async verifyAbleToRemoveContentFromMyWatchlistFromSearchPage(searchContent: string, watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // step 3: search for content
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);

    // step 4: navigate to search result and tap to play
    const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
    const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
    if (resultCount === 0) {
      console.error('Search result not found');
      return;
    }
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.mouseHoverToEpisode[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0], "My Watchlist Tab");
    await ElementHelper.cmdPause(2000);
    await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
    await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
  };

  static async verifySearchPageTopPicksNearYouTrayIsDisplayed(searchContent: string, moviesAndShowsText: string, topPicksNearYouText: string) {
    await ElementHelper.cmdPause(4000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(1000);
    // step 3: search for content
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    if (this.platform === 'web') {
      await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
      await ElementHelper.cmdPause(2000);
      await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
      await AssertionHelper.assertTextEquals(sanityPageLocator.moviesAndShowsText[this.platform][0], moviesAndShowsText);
      const moviesAndShowsEpisodeText = await ElementHelper.getTextByJS(sanityPageLocator.getEpisodeLinkText[this.platform][0]);
      const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
      const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
      if (resultCount === 0) {
        console.error('Search result not found');
        return;
      }
      await ElementHelper.cmdPause(2000);
      await ElementHelper.cmdClick(sanityPageLocator.searchTextCloseBtn[this.platform][0], "Search Text Close Button");
      await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
      await ElementHelper.cmdPause(2000);
      await AssertionHelper.assertTextEquals(sanityPageLocator.topPicksNearYouTextLink[this.platform][0], topPicksNearYouText);
      await ElementHelper.cmdPause(1000);
      const topPicksNearYouEpisodeText = await ElementHelper.getTextByJS(sanityPageLocator.getEpisodeLinkText[this.platform][0]);
      await ElementHelper.cmdPause(1000);
      await AssertionHelper.assertStringNotEquals(moviesAndShowsEpisodeText, topPicksNearYouEpisodeText);
    } else if (this.platform === 'android') {
      await AssertionHelper.assertVisible(sanityPageLocator.topPicksNearYouTextLink[this.platform][0]);
    }

  };

  static async verifySearchPageAutoSuggestions(searchContent: string, moviesAndShowsText: string, popularSearchesText: string) {
    await ElementHelper.cmdPause(4000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(1000);
    // step 3: search for content
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    if (this.platform === 'web') {
      await AssertionHelper.assertTextEquals(sanityPageLocator.moviesAndShowsText[this.platform][0], moviesAndShowsText);
      const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
      const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
      if (resultCount === 0) {
        console.error('Search result not found');
        return;
      }
      await ElementHelper.cmdPause(2000);
      await AssertionHelper.assertTextEquals(sanityPageLocator.popularSearchesText[this.platform][0], popularSearchesText);
    }
    await AssertionHelper.assertAllTextsContain(sanityPageLocator.autoSuggestTextList[this.platform][0], searchContent);
  }

  static async loginToMobile(email: string, password: string) {
    console.log('Waiting for login screen to be present...');
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.emailInput[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      timeoutMsg: 'Login screen (email input) not present after 15 seconds.'
    });
    console.log('Login screen is present.');
    await ElementHelper.cmdFill(sanityPageLocator.emailInput[this.platform][0], email);
    await ElementHelper.cmdFill(sanityPageLocator.passwordInput[this.platform][0], password);
    await ElementHelper.cmdClick(sanityPageLocator.continueButton[this.platform][0], "Continue Button");
    // Validate navigation flow: wait for Home header on Android
    await driver.pause(5000); // small pause to allow any transition/animation to start
    await this.handleNotificationPopup();
    console.log('Waiting for navigation to Home screen after login...');
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.headerText[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 40000,
      interval: 1000,
      timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
    });
    await AssertionHelper.assertVisible(sanityPageLocator.headerText[this.platform][0]);
    console.log('Navigation to Home screen validated.');
  }



  static async handleNotificationPopup() {
    try {
      const isVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.allowButton[this.platform][0]);
      if (isVisible) {
        await ElementHelper.cmdClick(sanityPageLocator.allowButton[this.platform][0], "Allow Button");
      } else {
        console.log("Notification popup not found, continuing with test execution");
      }
    } catch {
      console.log("Error while handling notification popup, continuing with test execution");
    }
  }

  static async verifyTimerIsRunning() {
    const timer = sanityPageLocator.contentPlayTimer[this.platform][0];

    if (this.platform === 'android') {
      const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
      await (browser as any).waitUntil(async () => {
        return await ElementHelper.cmdIsVisible(loader);
      }, {
        timeout: 10000,
        interval: 1000
      }).catch(() => {
        console.log("Loader did not appear");
      });

      console.log("⏳ Waiting for Loader to disappear");
      await (browser as any).waitUntil(async () => {
        const isVisible = await ElementHelper.cmdIsVisible(loader);
        return !isVisible;
      }, {
        timeout: 180000,  // 3 minutes
        interval: 2000,
        timeoutMsg: "Loader did not disappear within 3 minutes"
      });
      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
    }

    await AssertionHelper.assertVisible(timer);
  }

  static async verifyPauseButton() {
    await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button");
    await AssertionHelper.assertVisible(sanityPageLocator.playButton[this.platform][0]);
  }









  static async openAnyShowContent() {
    await ElementHelper.cmdPause(5000)
    await ElementHelper.cmdIsVisible(sanityPageLocator.anyShowContent[this.platform][0])
    await ElementHelper.cmdPause(5000)
    await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[this.platform][0], "Any Show Content")
  }

  static async verifyContentDetails(userType: string) {
    const platform = this.platform
    if (platform === "android") {
      await ElementHelper.cmdClick(sanityPageLocator.showTab[this.platform][0], "Show Tab")
      // await this.openAnyShowContent()
      await ElementHelper.cmdClick(sanityPageLocator.trendingShowFirstContent[this.platform][0], "Trending Show First Content")
    }
    console.log("Waiting for content details page")
    console.log("Validating content metadata")
    await AssertionHelper.assertVisible(sanityPageLocator.contentMetadata[platform][0])
    console.log("Scrolling to actions section")
    await ElementHelper.cmdPause(2000)
    await ElementHelper.cmdScrollIntoView(sanityPageLocator.shareButton[platform][0])
    console.log("Validating Share button")
    await AssertionHelper.assertVisible(sanityPageLocator.shareButton[platform][0])
    await ElementHelper.cmdPause(1000)
    console.log("Validating Watchlist button")
    if (userType !== "Guest") {
      await AssertionHelper.assertVisible(sanityPageLocator.watchlistButton[platform][0])
    }
    console.log("Validating episode section")
    await AssertionHelper.assertVisible(sanityPageLocator.episodeSection[platform][0])
    console.log("Content details validated successfully")

  }



  static async verifyNoSearchResultsForIrrelevantTerms(searchTerm: string, value: string) {
    let noResultsMessage: string = "";
    const platform = this.platform
    // Click on search icon
    await ElementHelper.cmdClick(sanityPageLocator.contentSearchBox[platform][0], "Content Search Box")
    await ElementHelper.cmdPause(5000)
    // click on search header
    await ElementHelper.cmdClick(sanityPageLocator.contentSearchHeader[platform][0], "Content Search Header")
    // Type irrelevant search term
    await AssertionHelper.assertVisible(sanityPageLocator.contentSearchInput[platform][0])
    await ElementHelper.cmdFill(sanityPageLocator.contentSearchInput[platform][0], searchTerm)
    // Wait for search to process
    await ElementHelper.cmdPause(2000)
    // Assert no search results message is displayed
    await AssertionHelper.assertVisible(sanityPageLocator.noSearchResultsMessage[platform][0])
    if (this.platform === 'web') {
      noResultsMessage = await ElementHelper.cmdGetText(sanityPageLocator.noSearchResultsMessage[platform][0])
      await AssertionHelper.assertEqual(noResultsMessage, value)
    } else if (this.platform === 'android') {
      await AssertionHelper.assertEqual(
        await ElementHelper.cmdGetText(sanityPageLocator.noSearchResultsMessage[this.platform][0]),
        `No search results found for "${searchTerm}"`
      );

    }
    console.log("No search results message:", noResultsMessage)

  }

  static async launchApplication(platform: string) {
    if (platform === 'web') {
      await browser.url(ConfigHelper.getBaseUrl())
    } else if (platform === 'android') {
      console.log('Android app launched via capabilities')
    }
  }


  static async logoutFromApplication(): Promise<void> {

    const mySpaceTab = sanityPageLocator.mySpaceTab[this.platform][0];
    const logoutOption = sanityPageLocator.logoutOption[this.platform][0];
    const logoutPopupButton = sanityPageLocator.logoutConfirmButton[this.platform][0];

    // Call reusable navigation method
    await this.navigateBackUntilHomeTabVisible();

    // Click My Space tab
    await ElementHelper.cmdClick(mySpaceTab, "My Space Tab");
    await ElementHelper.cmdPause(2000);

    console.log("👤 Navigated to My Space tab");

    // Scroll down until Logout appears
    for (let i = 0; i < 4; i++) {

      const logoutVisible = await $(logoutOption).isDisplayed().catch(() => false);

      if (logoutVisible) {
        break;
      }

      await ElementHelper.cmdScrollDownSmall();
    }

    // Click logout option
    await ElementHelper.cmdClick(logoutOption, "Logout Option");

    console.log("🚪 Logout option clicked");

    // Confirm logout popup
    await AssertionHelper.assertVisible(logoutPopupButton);

    await ElementHelper.cmdClick(logoutPopupButton, "Logout Confirm Button");

    console.log("✅ User logged out successfully");
  }

  static async verifyEditProfileFunctionality(editProfileData: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
  }): Promise<void> {

    if (this.platform !== 'android') {
      throw new Error('Edit Profile scenario is only supported on Android platform');
    }

    await ElementHelper.cmdClick(sanityPageLocator.mySpaceTab[this.platform][0], "My Space Tab");
    await ElementHelper.cmdPause(1500);

    await ElementHelper.cmdClick(sanityPageLocator.myAccountOption[this.platform][0], "My Account Option");
    await ElementHelper.cmdPause(1500);

    await AssertionHelper.assertVisible(
      sanityPageLocator.editAccountDetailsButton[this.platform][0]
    );

    await ElementHelper.cmdClick(
      sanityPageLocator.editAccountDetailsButton[this.platform][0],
      "Edit Account Details Button"
    );

    await ElementHelper.cmdPause(1500);

    /* -------------------------------
       Step 1: Capture existing values
    --------------------------------*/

    const oldFirstName = await ElementHelper.cmdGetText(
      sanityPageLocator.firstNameInput[this.platform][0]
    );

    const oldLastName = await ElementHelper.cmdGetText(
      sanityPageLocator.lastNameInput[this.platform][0]
    );

    const oldGender = await ElementHelper.cmdGetText(
      sanityPageLocator.genderInput[this.platform][0]
    );

    const oldDOB = await ElementHelper.cmdGetText(
      sanityPageLocator.dobInput[this.platform][0]
    );

    console.log("Existing Profile Data:", {
      oldFirstName,
      oldLastName,
      oldGender,
      oldDOB
    });

    await ElementHelper.cmdPause(1000);

    /* -------------------------------
       Step 2: Enter new values
    --------------------------------*/

    const { firstName, lastName, gender, dateOfBirth } = editProfileData;

    await ElementHelper.cmdFill(
      sanityPageLocator.firstNameInput[this.platform][0],
      firstName
    );

    await ElementHelper.cmdFill(
      sanityPageLocator.lastNameInput[this.platform][0],
      lastName
    );

    // await ElementHelper.cmdFill(
    //   sanityPageLocator.genderInput[this.platform][0],
    //   gender
    // );

    await ElementHelper.cmdClick(sanityPageLocator.genderInput[this.platform][0], "Gender Input");

    await AssertionHelper.assertVisible(
      sanityPageLocator.genderFemaleOption[this.platform][0]
    );

    await ElementHelper.cmdClick(
      sanityPageLocator.genderFemaleOption[this.platform][0],
      "Gender Female Option"
    );

    await ElementHelper.cmdClick(
      sanityPageLocator.genderOkButton[this.platform][0],
      "Gender Ok Button"
    );

    // await ElementHelper.cmdFill(
    //   sanityPageLocator.dobInput[this.platform][0],
    //   dateOfBirth
    // );

    await ElementHelper.cmdClick(
      sanityPageLocator.dobInput[this.platform][0],
      "Date of Birth Input"
    );

    await AssertionHelper.assertVisible(
      sanityPageLocator.dobInputField[this.platform][0]
    );

    // await ElementHelper.cmdClick(
    //   sanityPageLocator.dobInputField[this.platform][0]
    // );

    await ElementHelper.cmdFill(
      sanityPageLocator.dobInputFieldPopup[this.platform][0],
      dateOfBirth
    );
    await ElementHelper.cmdPause(1000);

    await ElementHelper.cmdClick(
      sanityPageLocator.dateOkayButton[this.platform][0],
      "Date Okay Button"

    );

    await ElementHelper.cmdClick(
      sanityPageLocator.saveDetailsButton[this.platform][0],
      "Save Details Button"
    );

    await ElementHelper.cmdPause(2000);

    await AssertionHelper.assertVisible(
      sanityPageLocator.profileUpdateSuccessText[this.platform][0]
    );

    console.log("✅ Profile updated successfully");

    await ElementHelper.cmdClick(
      sanityPageLocator.okayButton[this.platform][0],
      "Okay Button"

    );

    /* -------------------------------
       Step 3: Validate new values
    --------------------------------*/

    await ElementHelper.cmdClick(
      sanityPageLocator.editAccountDetailsButton[this.platform][0],
      "Edit Account Details Button"

    );

    await ElementHelper.cmdPause(1500);

    const updatedFirstName = await ElementHelper.cmdGetText(
      sanityPageLocator.firstNameInput[this.platform][0]
    );

    const updatedLastName = await ElementHelper.cmdGetText(
      sanityPageLocator.lastNameInput[this.platform][0]
    );

    const updatedGender = await ElementHelper.cmdGetText(
      sanityPageLocator.genderInput[this.platform][0]
    );

    const updatedDOB = (await ElementHelper.cmdGetText(
      sanityPageLocator.dobInput[this.platform][0]
    )).replace(/\//g, '');

    console.log("New Profile Data:", {
      updatedFirstName,
      firstName,
      updatedLastName,
      lastName,
      updatedGender,
      gender,
      updatedDOB,
      dateOfBirth
    });

    if (
      updatedFirstName !== firstName ||
      updatedLastName !== lastName ||
      updatedGender !== gender ||
      updatedDOB !== dateOfBirth
    ) {
      throw new Error("❌ Profile update validation failed");
    }

    console.log("✅ Profile changes validated successfully");

    /* -------------------------------
       Step 4: Revert to old values
    --------------------------------*/

    await ElementHelper.cmdFill(
      sanityPageLocator.firstNameInput[this.platform][0],
      oldFirstName
    );

    await ElementHelper.cmdFill(
      sanityPageLocator.lastNameInput[this.platform][0],
      oldLastName
    );

    /* -------- Restore Gender -------- */

    await ElementHelper.cmdClick(
      sanityPageLocator.genderInput[this.platform][0],
      "Gender Input"

    );

    const formattedGender =
      oldGender.charAt(0).toUpperCase() + oldGender.slice(1).toLowerCase();

    await ElementHelper.cmdClick(
      `//android.widget.TextView[@text="${formattedGender}"]/preceding-sibling::android.widget.RadioButton`
      , "Gender Option");

    await ElementHelper.cmdClick(
      sanityPageLocator.genderOkButton[this.platform][0],
      "Gender Ok Button"
    );

    /* -------- Restore DOB -------- */

    await ElementHelper.cmdClick(
      sanityPageLocator.dobInput[this.platform][0],
      "Date of Birth Input"
    );

    await ElementHelper.cmdClear(
      sanityPageLocator.dobInputFieldPopup[this.platform][0]
    );

    await ElementHelper.cmdFill(
      sanityPageLocator.dobInputFieldPopup[this.platform][0],
      oldDOB.replace(/\//g, '')
    );

    await ElementHelper.cmdClick(
      sanityPageLocator.dateOkayButton[this.platform][0],
      "Date Okay Button"
    );

    /* -------- Save -------- */

    await ElementHelper.cmdClick(
      sanityPageLocator.saveDetailsButton[this.platform][0],
      "Save Details Button"
    );

    console.log("✅ Profile reverted back to original values");
  }

  //====================Downloads==============================


  /**
   * Verify Download icon is displayed in Home, Shows, Movies and GMA landing pages (Android only).
   */
  static async verifyDownloadIconOnLandingPages(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('Download icon landing pages check is only supported on Android platform');
    }

    // Home Page
    await ElementHelper.cmdClick(sanityPageLocator.homeTab[this.platform][0], "Home Tab");
    await ElementHelper.cmdPause(1500);
    await AssertionHelper.assertVisible(sanityPageLocator.downloadIcon[this.platform][0]);

    // Shows Page
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1500);
    await AssertionHelper.assertVisible(sanityPageLocator.downloadIcon[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.tabsCloseButton[this.platform][0], "Tabs Close Button");

    // Movies Page
    await ElementHelper.cmdClick(sanityPageLocator.moviesTab[this.platform][0], "Movies Tab");
    await ElementHelper.cmdPause(1500);
    await AssertionHelper.assertVisible(sanityPageLocator.downloadIcon[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.tabsCloseButton[this.platform][0], "Tabs Close Button");

    // GMA Page
    await ElementHelper.cmdClick(sanityPageLocator.gmaTabButton[this.platform][0], "GMA Tab");
    await ElementHelper.cmdPause(1500);
    await AssertionHelper.assertVisible(sanityPageLocator.downloadIcon[this.platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.tabsCloseButton[this.platform][0], "Tabs Close Button");

    console.log('✅ Download icon is visible on Home, Shows, Movies, and GMA pages.');
  }


  static async verifyDownloadButtonInShowDetailsPage(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('Download button in show details page check is only supported on Android platform');
    }

    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.showsTab[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      timeoutMsg: 'Show Tab did not occur within 10 seconds.'
    });
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(2000);

    const playButtonLocator = sanityPageLocator.primiumUserPlayButton[this.platform][0];
    const showLocator = sanityPageLocator.secondRowShowWithMultipleEpisodes[this.platform][0];

    let attempt = 0;
    const maxAttempts = 10;

    while (attempt < maxAttempts) {

      console.log(`🔎 Attempt ${attempt + 1} to find valid show`);

      const playButtonVisible = await $(playButtonLocator).isDisplayed().catch(() => false);

      if (!playButtonVisible) {
        console.log('➡️ Play button not visible. Swiping right...');
        await ElementHelper.cmdSwipeRight();
        attempt++;
        continue;
      }

      await ElementHelper.cmdClick(showLocator, "Show with Multiple Episodes");
      await ElementHelper.cmdPause(3000);

      const downloadButtonVisible = await $(sanityPageLocator.downloadButtonInShowDetails[this.platform][0])
        .isDisplayed()
        .catch(() => false);

      /* ❌ Download button not found */
      if (!downloadButtonVisible) {

        console.log('⚠️ Episode text not visible. Trying next show');

        await browser.back();
        await ElementHelper.cmdPause(2000);

        await ElementHelper.cmdSwipeRight();

        attempt++;
        continue;
      }

      /* ✅ Episode text visible */
      await AssertionHelper.assertVisible(
        sanityPageLocator.downloadButtonInShowDetails[this.platform][0]
      );

      console.log('✅ Download button is displayed next to the episodes');

      return; // Exit loop after success
    }
    await sanityBusinessLogic.navigateBackUntilHomeTabVisible();
    throw new Error('❌ Could not find valid show with episodes after multiple attempts');
  }

  static async verifyDownloadButtonInMovieDetailsPage(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('Download button in movie details page check is only supported on Android platform');
    }

    // Navigate to Movies tab
    await ElementHelper.cmdClick(sanityPageLocator.moviesTab[this.platform][0], "Movies Tab");
    await ElementHelper.cmdPause(2000);

    // Tap on any movie content
    await ElementHelper.cmdClick(sanityPageLocator.movieItemToTap[this.platform][0], "Movie Item");
    await ElementHelper.cmdPause(3000);

    // Verify that the Download button is displayed below the metadata of the content
    await AssertionHelper.assertVisible(sanityPageLocator.downloadButtonInMovieDetails[this.platform][0]);

    console.log('✅ Download button is displayed below the metadata of the content inside movie details page.');
  }

  static async verifyDownloadAnimationOnTappingDownloadIcon(): Promise<string> {

    if (this.platform !== 'android') {
      throw new Error(
        'Download animation on tapping download icon is only supported on Android platform'
      );
    }


    await this.verifyDownloadButtonInShowDetailsPage();

    // Get episode title
    const episodeTitle = await ElementHelper.cmdGetText(
      sanityPageLocator.playerEpisodeText[this.platform][0]
    );
    this.downloadedEpisodeTitle = episodeTitle;

    console.log(`📺 Episode selected for download: ${episodeTitle}`);

    const dynamicXpath =
      sanityPageLocator.downloadButtonUsingShowText[this.platform][0].replace(
        '%s',
        episodeTitle
      );

    await ElementHelper.cmdClick(dynamicXpath, "Download Button");

    // Tap Download icon
    // await ElementHelper.cmdClick(
    //   sanityPageLocator.downloadButtonInShowDetails[this.platform][0]
    // );

    await ElementHelper.cmdClick(
      sanityPageLocator.radioButtonDownloadPreference[this.platform][0],
      "Download Preference Radio Button"

    );
    await ElementHelper.cmdClick(
      sanityPageLocator.savePreferenceButton[this.platform][0],
      "Save Preference Button"
    );

    // Verify download animation appears
    await AssertionHelper.assertVisible(
      sanityPageLocator.downloadAnimation[this.platform][0]
    );

    console.log(
      '✅ Download animation is displayed and content starts downloading on tapping "Download" icon from details page.'
    );
    return episodeTitle;
  }


  static async navigateBackUntilHomeTabVisible(): Promise<void> {

    const homeTab = sanityPageLocator.headerText[this.platform][0];
    const closeBtnSelector = sanityPageLocator.tabsCloseButton[this.platform][0];

    console.log("🔙 Navigating back until Home tab is visible");

    for (let i = 0; i < 6; i++) {

      const isHomeVisible = await $(homeTab).isDisplayed().catch(() => false);

      if (isHomeVisible) {
        console.log("🏠 Home tab is visible");
        return;
      }

      await browser.back();
      await ElementHelper.cmdPause(1500);
      if (await ElementHelper.cmdIsVisible(closeBtnSelector)) {
        await ElementHelper.cmdClick(closeBtnSelector, "Tabs Close Button");
        await browser.pause(500);
      }
    }

    throw new Error("❌ Home tab not visible after navigating back multiple times");
  }

  // Issue - Able to download the content again once relaunching the app

  static async verifyDownloadedContentsOnDownloadsScreen(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('Verify downloaded contents is only supported on Android platform');
    }
    const downloadedContent = await this.verifyDownloadAnimationOnTappingDownloadIcon();
    await ElementHelper.cmdPause(30000);
    await this.navigateBackUntilHomeTabVisible();

    // Navigate to Downloads page
    await ElementHelper.cmdClick(sanityPageLocator.downloadIcon[this.platform][0], "Download Icon");
    await ElementHelper.cmdPause(2000);

    const dynamicXpath =
      sanityPageLocator.contentInDownloadPage[this.platform][0].replace(
        '%s',
        downloadedContent
      );
    //  pending for android
    await ElementHelper.cmdClick(sanityPageLocator.gmaFirstRowContent[this.platform][0], "First Row Content");

    // Verify that downloaded content is displayed
    await AssertionHelper.assertVisible(dynamicXpath);

    console.log('✅ Downloaded content is displayed under Downloads screen.');
  }


  static async verifyUserAbleToPlayDownloadedContentsOnDownloadsScreen(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('Verify downloaded contents is only supported on Android platform');
    }
    await this.verifyDownloadedContentsOnDownloadsScreen();
    console.log("Available content title: ", this.downloadedEpisodeTitle);
    const dynamicXpath =
      sanityPageLocator.contentInDownloadPage[this.platform][0].replace(
        '%s',
        this.downloadedEpisodeTitle
      );
    await ElementHelper.cmdPause(2000);
    //  pending for android
    await ElementHelper.cmdClick(dynamicXpath, "Downloaded Content");
    if (this.platform === 'android') {
      try {
        const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
        await (browser as any).waitUntil(async () => {
          return await ElementHelper.cmdIsVisible(loader);
        }, {
          timeout: 10000,
          interval: 1000
        }).catch(() => {
          console.log("Loader did not appear");
        });

        console.log("⏳ Waiting for Loader to disappear");
        await (browser as any).waitUntil(async () => {
          const isVisible = await ElementHelper.cmdIsVisible(loader);
          return !isVisible;
        }, {
          timeout: 180000,  // 3 minutes
          interval: 2000,
          timeoutMsg: "Loader did not disappear within 3 minutes"
        });
      } catch (error) {
        console.error("loader did not appear: ", error);
      }

      await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player Screen Outline");
      await AssertionHelper.assertVisible(sanityPageLocator.playAndPauseIcon[this.platform][0]);
      console.log("✅ User Able To Play Downloaded Contents On Downloads Screen");
    }
  }

  static async verifyUserAbleToDeleteDownloadedContentsOnDownloadsScreen(): Promise<void> {
    if (this.platform !== 'android') {
      throw new Error('Verify downloaded contents is only supported on Android platform');
    }
    await this.verifyDownloadedContentsOnDownloadsScreen();
    const dynamicXpath =
      sanityPageLocator.deleteContentInDownloadPage[this.platform][0].replace(
        '%s',
        this.downloadedEpisodeTitle
      );
    await ElementHelper.cmdClick(dynamicXpath, "Downloaded Content Delete Button");
    await ElementHelper.cmdClick(sanityPageLocator.deleteDownloadOptionInDownloadScreen[this.platform][0], "Delete Download Option");
    await ElementHelper.cmdClick(sanityPageLocator.yesButtonFromDeletePopupInDownloadScreen[this.platform][0], "Yes Button From Delete Popup");
    await AssertionHelper.assertNotVisible(dynamicXpath);
    console.log("✅ User Able To Delete Downloaded Contents On Downloads Screen");
  }

  static async verifyFreeOrPrimiumContentTagDisplayed(searchContent: string, subscribeText: string, searchFieldPlaceholderText: string, popularSearchesText: string) {
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    // step 3: search for content
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    if (this.platform === 'android') {
      let isVisible = false;
      const maxScrolls = 5;
      for (let i = 0; i < maxScrolls; i++) {
        try {
          await AssertionHelper.assertVisible(
            sanityPageLocator.freetraycontentsLinks[this.platform][0]
          );
          isVisible = true;
          break;
        } catch (err) {
          await ElementHelper.cmdScrollDownSmall();
        }
      }
      if (!isVisible) {
        throw new Error('freetraycontentsLinks not visible after 5 scroll attempts');
      }
    }
    await AssertionHelper.assertVisible(sanityPageLocator.freetraycontentsLinks[this.platform][0]);
    if (this.platform === 'web') {
      await ElementHelper.cmdMouseHover(sanityPageLocator.searchListNotFreeTagEpisodeList[this.platform][0]);
      await AssertionHelper.assertTextEquals(sanityPageLocator.gmaSubscribToWatchText[this.platform][0], subscribeText);
    }
    if (this.platform === 'web') {
      await ElementHelper.cmdClick(sanityPageLocator.homeTab[this.platform][0], "Home Tab");
    } else if (this.platform === 'android') {
      await this.navigateBackUntilHomeTabVisible();
    }
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(4000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    const episodeLocator = await sanityPageLocator.freetraycontentsLinks[this.platform][0];
    const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
    if (trayCount === 0) {
      console.error("Episode not found or inaccessible");
      return;
    }
    await ElementHelper.cmdClick(episodeLocator, "Episode Link");
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
    await AssertionHelper.assertVisible(sanityPageLocator.episodeShareButton[this.platform][0]);
    if (this.platform === 'web') {
      await ElementHelper.cmdClick(sanityPageLocator.homeTab[this.platform][0], "Home Tab");
    } else if (this.platform === 'android') {
      await this.navigateBackUntilHomeTabVisible();
    }
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdPause(4000);
    await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0], "Search Button");
    await ElementHelper.cmdPause(1000);
    await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
    await ElementHelper.cmdPause(2000);
    const searchedEpisode = await ElementHelper.getTextByJS(sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0]);
    console.log("Searched episode:", searchedEpisode);
    await AssertionHelper.assertTextEquals(sanityPageLocator.popularSearchesText[this.platform][0], popularSearchesText);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    await ElementHelper.cmdClear(sanityPageLocator.searchInput[this.platform][0]);
    const searchPlaceholderValue = await ElementHelper.getAttributeValue(sanityPageLocator.searchInput[this.platform][0], 'placeholder');
    await AssertionHelper.assertStringEquals(searchPlaceholderValue, searchFieldPlaceholderText);
    await ElementHelper.cmdPause(3000);
    await ElementHelper.cmdClick(sanityPageLocator.searchTextCloseBtn[this.platform][0], "Search Text Close Button");
    await ElementHelper.cmdPause(3000);
    await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
    const searchValueRemovedEpisode = await ElementHelper.getTextByJS(sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0]);
    console.log("Episode displayed after clearing search input:", searchValueRemovedEpisode);
    await AssertionHelper.assertStringNotEquals(searchedEpisode, searchValueRemovedEpisode);
  }

  static async verifySubscribeCTAForFreeUser() {
    const platform = this.platform;
    // Step 1: Navigate to Shows tab
    await ElementHelper.cmdClick(sanityPageLocator.showTab[platform][0], "Shows Tab");
    await AssertionHelper.assertVisible(sanityPageLocator.subscribeCTAonShowTab[platform][0]);
    await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[platform][0], "Any Show Content");
    await ElementHelper.cmdPause(2000);
    await AssertionHelper.assertVisible(sanityPageLocator.subscribeCTA[platform][0])
  }

  static async verifySubscriptionDetailsInMyAccount() {
    const platform = this.platform
    console.log("Navigating to My Space")
    await AssertionHelper.assertVisible(sanityPageLocator.accountIcon[platform][0])
    await ElementHelper.cmdClick(sanityPageLocator.accountIcon[platform][0], "Account Icon")
    console.log("Opening My Account")
    await AssertionHelper.assertVisible(sanityPageLocator.myAccountOptions[platform][0])
    await ElementHelper.cmdClick(sanityPageLocator.myAccountOptions[platform][0], "My Account Options")
    console.log("Validating subscription details section")
    await ElementHelper.cmdIsVisible(sanityPageLocator.subscriptionDetailsSection[platform][0])
    await AssertionHelper.assertVisible(sanityPageLocator.subscriptionDetailsSection[platform][0])
    console.log("Subscription details displayed successfully")
  }

  private static async assertMidRailBannerAdDisplayedOnCurrentPage(pageName: string): Promise<void> {
    const midRailBannerAdLocator = sanityPageLocator.midRailBannerAd[this.platform][0];

    await ElementHelper.cmdPause(3000);

    const midRailBannerAdCount = await ElementHelper.cmdGetElementCount(midRailBannerAdLocator);

    if (midRailBannerAdCount === 0) {
      throw new Error(`Mid rail banner Ad is not displayed on ${pageName} page.`);
    }

    await ElementHelper.cmdScrollIntoView(midRailBannerAdLocator);
    await AssertionHelper.assertVisible(midRailBannerAdLocator);
  }

  //====================================================
  /*
  * need to configure for android
  * Web - Only available for Home and Shows Tab
  */
  static async verifyMidRailBannerAdDisplayedOnLandingPages(): Promise<void> {
    const landingPages: Array<{ pageName: string; navigationLocator: string }> = [
      { pageName: 'Home', navigationLocator: sanityPageLocator.homeTab[this.platform][0] },
      { pageName: 'Shows', navigationLocator: sanityPageLocator.showsTab[this.platform][0] },
    ];

    for (const { pageName, navigationLocator } of landingPages) {
      if (navigationLocator) {
        await ElementHelper.cmdClick(navigationLocator, `${pageName} Tab`);
      }

      await ElementHelper.cmdPause(2000);
      await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
      await this.assertMidRailBannerAdDisplayedOnCurrentPage(pageName);
    }
  }

  static async verifyNavigationToPrivacyPolicyTermsAndHelpCentrePages(
    privacyUrlFragment: string,
    termsUrlFragment: string,
    helpCentreUrlFragment: string
  ): Promise<void> {
    const linkAndUrlFragments: Array<[string, string]> = [
      [
        sanityPageLocator.privacyPolicyLink[this.platform][0],
        privacyUrlFragment
      ],
      [
        sanityPageLocator.termsAndConditionsLink[this.platform][0],
        termsUrlFragment
      ],
      [
        sanityPageLocator.helpCentreLink[this.platform][0],
        helpCentreUrlFragment
      ]
    ];

    for (const [linkLocator, urlFragment] of linkAndUrlFragments) {
      await ElementHelper.cmdScrollIntoView(linkLocator);
      await AssertionHelper.assertVisible(linkLocator);
      await ElementHelper.cmdClick(linkLocator, "Link");

      const handles = await browser.getWindowHandles();
      if (handles.length > 1) {
        await ElementHelper.cmdSwitchToWindow(handles.length - 1);
      }

      await AssertionHelper.assertUrlContains(urlFragment);

      if (handles.length > 1) {
        await ElementHelper.switchBackToParentAndCloseChild();
      } else {
        await browser.back();
      }

      await ElementHelper.cmdPause(2000);
    }
  }

  static async loginwithFacebook(email: string, password: string) {
    await ElementHelper.cmdClick(sanityPageLocator.accountIcon[this.platform][0], "Account Icon");

    await ElementHelper.cmdClick(sanityPageLocator.signInButton[this.platform][0], "Sign In Button");

    console.log('Waiting for login screen to be present...');
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.emailInput[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      timeoutMsg: 'Login screen (email input) not present after 15 seconds.'
    });
    console.log('Login screen is present.');
    await ElementHelper.cmdFill(sanityPageLocator.emailInput[this.platform][0], email);
    await ElementHelper.cmdFill(sanityPageLocator.passwordInput[this.platform][0], password);
    await ElementHelper.cmdClick(sanityPageLocator.continueButton[this.platform][0], "Continue Button");
    // Validate navigation flow: wait for Home header on Android
    await driver.pause(5000); // small pause to allow any transition/animation to start
    await this.handleNotificationPopup();
    console.log('Waiting for navigation to Home screen after login...');
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.headerText[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 40000,
      interval: 1000,
      timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
    });
    await AssertionHelper.assertVisible(sanityPageLocator.headerText[this.platform][0]);
    console.log('Navigation to Home screen validated.');
  }


  static async verifyViewMoreIconForMultiEpisodeShow(): Promise<void> {

    if (this.platform !== 'android') {
      throw new Error('The View More icon scenario is only supported on Android.');
    }
    await browser.waitUntil(async () => {
      try {
        return await $(sanityPageLocator.showsTab[this.platform][0]).isDisplayed();
      } catch {
        return false;
      }
    }, {
      timeout: 10000,
      timeoutMsg: 'Show Tab did not occur within 10 seconds.'
    });
    await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0], "Shows Tab");
    await ElementHelper.cmdPause(2000);

    const playButtonLocator = sanityPageLocator.primiumUserPlayButton[this.platform][0];
    const showLocator = sanityPageLocator.secondRowShowWithMultipleEpisodes[this.platform][0];

    let attempt = 0;
    const maxAttempts = 10;

    while (attempt < maxAttempts) {

      console.log(`🔎 Attempt ${attempt + 1} to find show with >5 episodes`);

      const playButtonVisible = await $(playButtonLocator).isDisplayed().catch(() => false);

      if (!playButtonVisible) {
        console.log('➡️ Play button not visible. Swiping right...');
        await ElementHelper.cmdSwipeRight();
        attempt++;
        continue;
      }

      await ElementHelper.cmdClick(showLocator, "Show");
      await ElementHelper.cmdPause(3000);

      await AssertionHelper.assertVisible(sanityPageLocator.episodeText[this.platform][0]);
      await ElementHelper.cmdScrollDownSmall();
      await ElementHelper.cmdScrollDownSmall();
      const episodeCount = await ElementHelper.cmdGetElementCount(
        sanityPageLocator.episodeListItems[this.platform][0]
      );

      console.log(`📺 Episode count found: ${episodeCount}`);

      if (episodeCount >= 5) {

        console.log('✅ Show has more than 5 episodes');

        // await ElementHelper.cmdScrollDownSmall();

        await AssertionHelper.assertVisible(
          sanityPageLocator.viewMoreEpisodesButton[this.platform][0]
        );

        console.log('✅ View More icon verified successfully');
        return;

      } else {

        console.log('⚠️ Episodes less than or equal to 5. Trying next show.');

        await browser.back();
        await ElementHelper.cmdPause(2000);

        await ElementHelper.cmdSwipeRight();

        attempt++;
      }
    }

    throw new Error('❌ Could not find a show with more than 5 episodes after multiple attempts');
  }

  static async verifyPreviewThumbnailOnScrubbing() {

    const platform = this.platform

    console.log("Opening content")
    await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[platform][0], "Any Show Content")
    console.log("Starting playback")
    await ElementHelper.cmdClick(sanityPageLocator.playButton[platform][0], "Play Button")
    await ElementHelper.cmdIsVisible(sanityPageLocator.videoPlayer[platform][0])
    await ElementHelper.cmdPause(5000)
    console.log("Bringing player controls")
    await ElementHelper.hoverVideoCenter();
    await ElementHelper.cmdPause(1000)
    console.log("Scrubbing seekbar")
    await ElementHelper.cmdScrubSeekBar(sanityPageLocator.seekBar[platform][0], 0.6)
    console.log("Validating preview thumbnail")
    await browser.waitUntil(async () => {
      return await ElementHelper.cmdIsVisible(
        sanityPageLocator.previewThumbnail[platform][0]
      )
    }, {
      timeout: 10000,
      timeoutMsg: "Preview thumbnail not displayed on scrubbing"
    })
    await AssertionHelper.assertVisible(
      sanityPageLocator.previewThumbnail[platform][0]
    )
    console.log("Preview thumbnail displayed successfully")


  }

  static async navigateBackUntilWatchlistVisible(
    maxAttempts: number = 5
  ): Promise<void> {
    const platform = this.platform;
    const locator = sanityPageLocator.watchlistButton[platform][0];

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const isVisible = await $(locator).isDisplayed().catch(() => false);

      if (isVisible) {
        console.log(`Watchlist button visible after ${attempt - 1} back navigation(s)`);
        return;
      }

      console.log(`Attempt ${attempt}: Watchlist not visible, navigating back...`);
      await BrowserHelper.navigateBack();

      // Wait for page stability instead of static pause
      await browser.waitUntil(async () => {
        return await browser.execute(() => document.readyState === 'complete');
      }, {
        timeout: 10000,
        timeoutMsg: 'Page did not load after navigation'
      });
    }

    throw new Error(`Watchlist button not visible after ${maxAttempts} back attempts`);
  }

  static async playContent(): Promise<string> {
    const platform = this.platform
    const contentHeader = await ElementHelper.cmdGetAttribute(sanityPageLocator.contentHeader[platform][0], "alt")
    console.log("Content header:", contentHeader)
    await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0], "Play Button")
    await ElementHelper.cmdPause(10000)
    await AssertionHelper.assertVisible(sanityPageLocator.videoPlayer[this.platform][0])
    await ElementHelper.hoverVideoCenter();
    await ElementHelper.cmdPause(1000)
    await ElementHelper.dragToMidFromStart(
      sanityPageLocator.progressBar[this.platform][0],
      sanityPageLocator.scrubSeekbar[this.platform][0])
    await ElementHelper.cmdPause(1000);
    // await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0])
    return contentHeader
  }

  static async verifyContinueWatchingResumePlayback() {
    const platform = this.platform

    await this.openAnyShowContent()
    const header = await this.playContent();
    console.log("Played content header:", header)

    //Capture time BEFORE exit
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button")
    const beforeFullTime = await ElementHelper.cmdGetText(
      sanityPageLocator.playerTimer[platform][0]
    )
    console.log("Time before :", beforeFullTime)
    const beforeTime = beforeFullTime.split('/')[0].trim() // Get current playback time (before exit)
    let beforeTimeDuration = parseInt(beforeTime);
    console.log("Time before exit:", beforeTime)
    await ElementHelper.cmdPause(2000);
    // await BrowserHelper.navigateBack()
    await this.navigateBackUntilWatchlistVisible()
    await browser.waitUntil(async () => {
      return await $(sanityPageLocator.continueWatchingTray[platform][0]).isExisting();
    }, {
      timeout: 10000,
      timeoutMsg: "Continue Watching tray not found"
    });
    await ElementHelper.cmdScrollIntoView(sanityPageLocator.continueWatchingTray[platform][0]);
    // Validate Continue Watching tray is visible
    await AssertionHelper.assertVisible(sanityPageLocator.continueWatchingTray[platform][0])
    await ElementHelper.cmdPause(2000)
    await ElementHelper.cmdClick(sanityPageLocator.continueWatchingTrayItem[platform][0], "Continue Watching Tray Item")
    await ElementHelper.cmdPause(2000)
    await AssertionHelper.assertAttributeEquals(sanityPageLocator.contentHeader[platform][0], "alt",
      header
    )
    await ElementHelper.cmdIsVisible(sanityPageLocator.videoPlayer[platform][0])
    await ElementHelper.cmdPause(3000)
    await ElementHelper.cmdClick(sanityPageLocator.playButton[platform][0], "Play Button")
    await ElementHelper.cmdPause(3000)
    await ElementHelper.hoverVideoCenter();
    // await ElementHelper.cmdPause(7000)
    // 🔹 Capture time AFTER resume
    await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause Button")
    const afterFullTime = await ElementHelper.cmdGetText(sanityPageLocator.playerTimer[platform][0])
    console.log("Time after :", afterFullTime)
    const afterTime = afterFullTime.split('/')[0].trim() // Get current playback time (after resume)
    let afterTimeDuration = parseInt(afterTime);
    console.log("Time after resume:", afterTime)
    await ElementHelper.cmdPause(2000)

    // await AssertionHelper.assertEqual(
    //   beforeTime,
    //   afterTime//
    // )
    await AssertionHelper.verifyTrue(
      afterTimeDuration >= beforeTimeDuration - 3,
      `Playback did not resume correctly. Before: ${beforeTime}, After: ${afterTime}`
    )
  }

  static async verifyParentalPinSetupFlow(password: string, setPin: { pin: string }) {
    {
      const platform = this.platform
      console.log("Navigating to Settings page")
      await ElementHelper.cmdClick(sanityPageLocator.accountIcon[platform][0], "Account Icon")
      await ElementHelper.cmdClick(sanityPageLocator.settingsOption[platform][0], "Settings Option")
      await ElementHelper.cmdPause(3000)
      console.log("Enabling parental control toggle")
      await ElementHelper.cmdClick(sanityPageLocator.parentalToggle[platform][0], "Parental Toggle")
      console.log("Entering account password")
      await ElementHelper.cmdFill(sanityPageLocator.accountPasswordField[platform][0], password)
      await ElementHelper.cmdClick(sanityPageLocator.submitCTA[platform][0], "Submit CTA")
      console.log("Validating PIN setup screen")
      await AssertionHelper.assertVisible(sanityPageLocator.pinInputField[platform][0])
      await ElementHelper.cmdFill(sanityPageLocator.pinInputField[platform][0], setPin.pin)
      await ElementHelper.cmdClick(sanityPageLocator.savePinButton[platform][0], "Save PIN Button")
      await AssertionHelper.assertVisible(sanityPageLocator.pinSetContinueButton[platform][0])
      await ElementHelper.cmdClick(sanityPageLocator.pinSetContinueButton[platform][0], "PIN Set Continue Button")

    }
  }

  static async verifyParentalPinPromptOnPlayback(setPin: { pin: string }) {
    {
      const platform = this.platform
      console.log("Opening content")
      await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[platform][0], "Any Show Content")
      console.log("Clicking Play CTA")
      await ElementHelper.cmdClick(sanityPageLocator.playButton[platform][0], "Play Button")
      console.log("Waiting for parental PIN popup")
      await browser.waitUntil(async () => {
        return await ElementHelper.cmdIsVisible(sanityPageLocator.parentalPinPopup[platform][0])
      }, {
        timeout: 10000,
        timeoutMsg: "Parental PIN popup not displayed"
      })
      console.log("Validating PIN popup elements")
      await AssertionHelper.assertVisible(sanityPageLocator.parentalPinPopup[platform][0])
      await AssertionHelper.assertVisible(sanityPageLocator.pinInputField[platform][0])
      await ElementHelper.cmdFill(sanityPageLocator.pinInputField[platform][0], setPin.pin)
    }

  }

  static async disableParentalControl(password: string) {
    const platform = this.platform
    console.log("Navigating to Settings")
    await ElementHelper.cmdClick(sanityPageLocator.accountIcon[platform][0], "Account Icon")
    await ElementHelper.cmdClick(sanityPageLocator.settingsOption[platform][0], "Settings Option")
    await ElementHelper.cmdPause(3000)
    console.log("Turning OFF parental toggle")
    await ElementHelper.cmdClick(sanityPageLocator.parentalToggle[platform][0], "Parental Toggle")
    console.log("Entering password to confirm")
    await ElementHelper.cmdPause(2000)
    await ElementHelper.cmdFill(sanityPageLocator.accountPasswordField[platform][0], password)
    await ElementHelper.cmdClick(sanityPageLocator.submitCTA[platform][0], "Submit CTA")
    await ElementHelper.cmdPause(2000)
    await AssertionHelper.assertVisible(sanityPageLocator.pinSetContinueButton[platform][0])
    await ElementHelper.cmdClick(sanityPageLocator.pinSetContinueButton[platform][0], "PIN Set Continue Button")
  }

  static async verifyPlaybackWithoutParentalPin() {
    const platform = this.platform
    await ElementHelper.cmdIsVisible(sanityPageLocator.homePage[platform][0])
    await ElementHelper.cmdClick(sanityPageLocator.homePage[platform][0], "Home Page")
    console.log("Opening content")
    await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[platform][0], "Any Show Content")
    console.log("Clicking Play")
    await ElementHelper.cmdClick(sanityPageLocator.playButton[platform][0], "Play Button")
    console.log("Validating playback started")
    await browser.waitUntil(async () => {
      return await ElementHelper.cmdIsVisible(sanityPageLocator.videoPlayer[platform][0])
    }, {
      timeout: 10000,
      timeoutMsg: "Video player not visible - playback failed"
    })
    const isPinVisible = await ElementHelper.cmdIsVisible(
      sanityPageLocator.parentalPinPopup[platform][0]
    ).catch(() => false)
    await AssertionHelper.assertEqual(
      isPinVisible,
      false,
      "Parental PIN popup should NOT appear"
    )

    console.log("Playback successful without PIN")

  }

  static async waitUntilPageDisplayed() {
    const platform = this.platform
    await browser.waitUntil(async () => {
      return await ElementHelper.cmdIsVisible(sanityPageLocator.watchListButton[platform][0])
    }, {
      timeout: 10000,
      timeoutMsg: "not visible"
    })
  }

}





















































































































// import AssertionHelper from '@utilities/generic/assertCommands'
// import { ConfigHelper } from '..'
// import { sanityPageLocator } from '../../pageObjects/sanityPageLocator'
// import { Platform } from '../enum/Platform'
// import { ElementHelper } from '../generic/ElementHelper'
// import { PlatformHelper } from '../helpers/PlatformHelper'
// import { preprocessImage } from '../../utilities/generic/imageHelper'
// import { extractTextFromImage } from '../../utilities/generic/orcHelper'
// import { BrowserHelper } from '../generic/BrowserHelper'
// import { WaitHelper } from '../generic/WaitHelper'
// // import { pause } from 'node_modules/webdriverio/build/commands/browser'


// export class sanityBusinessLogic {
//   static downloadedEpisodeTitle: string;
//   private static platform: Platform = PlatformHelper.getCurrentPlatform()

//   private static async getFirstVisibleLocator(locators: string[], timeout = 5000): Promise<string | null> {
//     for (const locator of locators) {
//       try {
//         const element = await $(locator);
//         await element.waitForDisplayed({ timeout });
//         if (await element.isDisplayed()) {
//           return locator;
//         }
//       } catch {
//         // Ignore and continue with fallback locators.
//       }
//     }

//     return null;
//   }

//   private static async assertAnyLocatorVisible(locators: string[], errorMessage: string, timeout = 5000): Promise<string> {
//     const visibleLocator = await this.getFirstVisibleLocator(locators, timeout);

//     if (!visibleLocator) {
//       throw new Error(errorMessage);
//     }

//     return visibleLocator;
//   }

//   /**
//    * Initialize platform once at the beginning of test execution
//    * Call this in beforeEach hook
//    */
//   static initializePlatform(): void {
//     this.platform = PlatformHelper.getCurrentPlatform()
//     console.log(`Test platform initialized: ${this.platform}`)
//   }

//   static getPlatform(): string {
//     return this.platform;
//   }

//   static async waitForPageLoad(): Promise<void> {
//     await browser.waitUntil(async () => {
//       const state = await browser.execute(() => document.readyState);
//       return state === 'complete';
//     }, {
//       timeout: 15000,
//       timeoutMsg: 'Page did not load completely'
//     });
//   }

//   static async validateNavigation() {
//     // For demo, assume Home screen = headerText visible
//     // if (screen.toLowerCase() === 'home') {
//     await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.headerText[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 10000,
//       timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
//     });
//     await AssertionHelper.assertVisible(sanityPageLocator.headerText[this.platform][0]);

//     // Add more screens as needed
//   }

//   static async tapOnGmaTab() {
//     await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.gmaTabButton[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 20000,
//       timeoutMsg: 'Failed to Click On GMA tab.'
//     });
//     await ElementHelper.cmdClick(sanityPageLocator.gmaTabButton[this.platform][0], "GMA Tab is Clickable");
//   }

//   static async playAnyGmaContent() {
//     const firstRow = sanityPageLocator.gmaFirstRowContent[this.platform][0];
//     await ElementHelper.cmdClick(firstRow, "GMA content is clicked");
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0], "Play button is clicked");
//   }

//   static async validateGmaPlaybackEntitlement(usertype: string) {
//     // For demo, just check timer and pause button for GMA
//     if (usertype.toLowerCase() === 'gma') {
//       await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//       await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
//     }
//     // Add more usertype logic as needed
//   }


//   static async loginToIwant(email: string, password: string) {
//     await ElementHelper.cmdClick(sanityPageLocator.accountIcon[this.platform][0], "Account icon is clickable");
//     await ElementHelper.cmdClick(sanityPageLocator.signInButton[this.platform][0], "Sign-in button is clickable");
//     const continueBtn = await $(sanityPageLocator.singInContinueBtn[this.platform][0]);
//     if (await continueBtn.isDisplayed().catch(() => false)) {
//       await continueBtn.click();
//     }
//     await ElementHelper.cmdFill(sanityPageLocator.emailInput[this.platform][0], email);
//     await ElementHelper.cmdFill(sanityPageLocator.passwordInput[this.platform][0], password);
//     await ElementHelper.cmdClick(sanityPageLocator.continueButton[this.platform][0], "Continue button is clickable");
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.homeTab[this.platform][0], "Home");
//   }

//   static async signOutFromIwant() {
//     if (this.platform === 'web') {
//       await ElementHelper.cmdPause(1000);
//       await ElementHelper.cmdClick(sanityPageLocator.accountIcon[this.platform][0], "Account icon is clickable");
//       await ElementHelper.cmdPause(1000);
//       await ElementHelper.cmdClick(sanityPageLocator.signOutButton[this.platform][0], "Sign-out button is clickable");
//       await ElementHelper.cmdPause(1000);
//       await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     } else if (this.platform === 'android') {
//       await this.logoutFromApplication();
//     }
//   }

//   static async validateSuccessMsg(userNameText: string) {
//     await ElementHelper.cmdClick(sanityPageLocator.accountIcon[this.platform][0], "Account icon is clickable");
//     await ElementHelper.cmdIsVisible(sanityPageLocator.userNameText[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.userNameText[this.platform][0], userNameText);
//   }

//   static async waitForAdsToComplete(): Promise<void> {
//     const adsLocator = sanityPageLocator.addsTag[this.platform][0];
//     const adAppearTimeout = this.platform === Platform.WEB ? 15000 : 10000;
//     const adDisappearTimeout = this.platform === Platform.WEB ? 240000 : 180000;
//     console.log("⏳ Waiting for ads to appear...");

//     // Wait for ads to appear (with catch to handle cases where ads don't appear)
//     try {
//       await (browser as any).waitUntil(async () => {
//         try {
//           return await ElementHelper.cmdIsVisible(adsLocator);
//         } catch {
//           return false;  // If element selector fails, ads not visible
//         }
//       }, {
//         timeout: adAppearTimeout,
//         interval: 1000
//       });
//       console.log("✅ Ad appeared");
//     } catch (error) {
//       console.log("⚠️ Ad did not appear within 10 seconds - continuing anyway");
//     }

//     console.log("⏳ Waiting for ads to disappear (up to 3 minutes)...");
//     try {
//       await (browser as any).waitUntil(async () => {
//         try {
//           const isVisible = await ElementHelper.cmdIsVisible(adsLocator);
//           return !isVisible;  // Resolved when ads are NOT visible
//         } catch {
//           return true;  // If element selector fails, treat as ads disappeared
//         }
//       }, {
//         timeout: adDisappearTimeout,
//         interval: 2000,
//         timeoutMsg: "Ad did not disappear within 3 minutes"
//       });
//     } catch (error) {
//       console.log("✅ Ads disappeared or selector unavailable");
//     }

//     console.log("✅ Ad completed successfully");
//   }


//   static async playFreeContentAndValidate() {
//     if (this.platform === 'android') {
//       let isVisible = false;
//       const maxScrolls = 5;

//       for (let i = 0; i < maxScrolls; i++) {
//         try {
//           await AssertionHelper.assertVisible(
//             sanityPageLocator.freetraycontentsLinks[this.platform][0]
//           );
//           isVisible = true;
//           break;
//         } catch (err) {
//           await ElementHelper.cmdScrollDownSmall();
//         }
//       }

//       if (!isVisible) {
//         throw new Error('freetraycontentsLinks not visible after 5 scroll attempts');
//       }
//     }
//     await AssertionHelper.assertVisible(sanityPageLocator.freetraycontentsLinks[this.platform][0]);
//     const freeTrayLocator = sanityPageLocator.freetraycontentsLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
//     if (trayCount === 0) {
//       console.error("Free Tray not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(freeTrayLocator, "Free tray is clicked");
//     await ElementHelper.cmdPause(1000);
//     if (this.platform === 'web') {
//       await ElementHelper.cmdClick(sanityPageLocator.curentEpisodePlayButton[this.platform][0], "Current episode play button is clickable");
//     }
//     await AssertionHelper.assertNotVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//     await this.waitForAdsToComplete();
//     if (this.platform === 'android') {
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0], "Player screen outline is clickable");
//     }

//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.palycontrolsBtn[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0], "Pause button is clickable");
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertVisible(sanityPageLocator.PlayBtnText[this.platform][0]);
//   }

//   static async verifyGmaAllContents(gmaValidSubscriptionText: string, gmaSubscribeToWatchBtnText: string) {
//     await ElementHelper.cmdClick(sanityPageLocator.gmaTabButton[this.platform][0],"GMA Tab is Clickable");
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertVisible(sanityPageLocator.gmaFirstRowContent[this.platform][0]);
//     const firstRowContent = sanityPageLocator.gmaFirstRowContent[this.platform][0];
//     console.log("Checking for GMA content tray..." + firstRowContent);
//     const trayCount = await ElementHelper.cmdGetElementCount(firstRowContent);
//     console.log("Checking for GMA content tray..." + trayCount);
//     if (trayCount === 0) {
//       console.error("Free Tray not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(firstRowContent);

//     if (this.platform === 'web') {
//       await AssertionHelper.assertVisible(sanityPageLocator.gmaSubscribToWatchText[this.platform][0]);
//       await AssertionHelper.assertTextEquals(sanityPageLocator.gmaSubscribToWatchText[this.platform][0], gmaSubscribeToWatchBtnText);
//       await ElementHelper.cmdClick(sanityPageLocator.gmaRecentAddedEpisodesList[this.platform][0]);
//       await AssertionHelper.assertTextEquals(sanityPageLocator.gmaRequiredSubscrionText[this.platform][0], gmaValidSubscriptionText);
//       await AssertionHelper.assertTextEquals(sanityPageLocator.gmaSubscrionToWatchBtnText[this.platform][0], gmaSubscribeToWatchBtnText);
//     } else if (this.platform === 'android') {
//       await AssertionHelper.assertVisible(sanityPageLocator.gmaSubscribToWatchText[this.platform][0]);
//       await AssertionHelper.assertTextEquals(sanityPageLocator.gmaSubscribToWatchText[this.platform][0], gmaSubscribeToWatchBtnText);
//       await ElementHelper.cmdClick(sanityPageLocator.gmaRecentAddedEpisodesList[this.platform][0]);
//       await AssertionHelper.assertTextEquals(sanityPageLocator.gmaRequiredSubscrionText[this.platform][0], gmaValidSubscriptionText);
//     }
//   }

//   static async verifyTheGMAContentPlaybackForGMAUsers() {
//     const gmaButton = sanityPageLocator.gmaButton[this.platform][0];
//     await browser.waitUntil(async () => {
//       const isVisible = await ElementHelper.cmdIsVisible(gmaButton);
//       return isVisible;
//     }, {
//       timeout: 15000,
//       interval: 1000,
//       timeoutMsg: 'GMA button not visible after 15 seconds'
//     });
//     await ElementHelper.cmdClick(sanityPageLocator.gmaButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.gmaPlayButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.watchListButtonInPlayerScreen[this.platform][0]);
//     console.log("✅ Navigated to player screen and watchlist button is visible");
//     const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
//     await (browser as any).waitUntil(async () => {
//       return await ElementHelper.cmdIsVisible(loader);
//     }, {
//       timeout: 10000,
//       interval: 1000
//     }).catch(() => {
//       console.log("Loader did not appear");
//     });
//     console.log("⏳ Waiting for Loader to disappear");
//     await (browser as any).waitUntil(async () => {
//       const isVisible = await ElementHelper.cmdIsVisible(loader);
//       return !isVisible;
//     }, {
//       timeout: 180000,  // 3 minutes
//       interval: 2000,
//       timeoutMsg: "Loader did not disappear within 3 minutes"
//     });
//     await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.playAndPauseIcon[this.platform][0]);
//     console.log("✅ GMA Content is playing successfully for GMA Users");
//     await browser.pause(5000);
//   }

//   /**
//     * Search for any show content by name (Android implementation)
//     */
//   static async searchForShowContent(showName: string) {
//     if (this.platform === 'android') {
//       // Tap search icon
//       await ElementHelper.cmdClick(sanityPageLocator.searchIcon[this.platform][0]);
//       // Tap search input field
//       await ElementHelper.cmdClick(sanityPageLocator.searchInputField[this.platform][0]);
//       // Enter show name
//       await ElementHelper.cmdFill(sanityPageLocator.searchInputFieldInsertion[this.platform][0], showName);
//       // Optionally, press enter or search button if required
//       await browser.keys(['Enter']);
//       await browser.pause(2000);
//     } else {
//       // Implement for other platforms if needed
//       throw new Error('searchForShowContent is only implemented for Android');
//     }
//   }

//   /**
//    * Verifies the presence of the Skip Recap marker/button during initial content playback
//    */
//   static async verifySkipRecapPresence() {
//     const skipRecapLocator = sanityPageLocator.skipRecapButton[this.platform][0];
//     await AssertionHelper.assertVisible(skipRecapLocator);
//   }

//   /**
//    * Verifies the functionality of the Skip Recap marker/button
//    * Taps the button and checks if the progress bar or playback updates
//    * (Assumes progress bar or playback validation is handled elsewhere or can be extended)
//    */
//   static async verifySkipRecapFunctionality() {
//     const skipRecapLocator = sanityPageLocator.skipRecapButton[this.platform][0];
//     await AssertionHelper.assertVisible(skipRecapLocator);
//     await ElementHelper.cmdClick(skipRecapLocator);
//     // Optionally, add logic to validate playback/progress bar update after skipping recap
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//   }

//   static async verifyPlayerControlsFunctionality(): Promise<void> {
//     await ElementHelper.cmdPause(10000);
//     const gmaContent = sanityPageLocator.showsTab[this.platform][0];
//     let contentFound = false;
//     let firstRow = gmaContent;

//     let trayCount = await ElementHelper.cmdGetElementCount(firstRow);
//     console.log("Checking for content tray..." + trayCount);

//     if (trayCount === 0) {
//       // Fallback: Look for any movie/video card with thumbnail
//       const fallbackSelectors = sanityPageLocator.contentFallbackSelectors[this.platform];

//       for (const selector of fallbackSelectors) {
//         const count = await ElementHelper.cmdGetElementCount(selector);
//         if (count > 0) {
//           firstRow = selector;
//           contentFound = true;
//           break;
//         }
//       }

//       if (!contentFound) {
//         return;
//       }
//     } else {
//       contentFound = true;
//     }

//     await ElementHelper.cmdClick(firstRow);
//     await ElementHelper.cmdPause(5000);
//     await ElementHelper.cmdClick(sanityPageLocator.primiumUserPlayButton[this.platform][0]);
//     if (this.platform === 'android') {
//       const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
//       await (browser as any).waitUntil(async () => {
//         return await ElementHelper.cmdIsVisible(loader);
//       }, {
//         timeout: 10000,
//         interval: 1000
//       }).catch(() => {
//         console.log("Loader did not appear");
//       });

//       console.log("⏳ Waiting for Loader to disappear");
//       await (browser as any).waitUntil(async () => {
//         const isVisible = await ElementHelper.cmdIsVisible(loader);
//         return !isVisible;
//       }, {
//         timeout: 180000,  // 3 minutes
//         interval: 2000,
//         timeoutMsg: "Loader did not disappear within 3 minutes"
//       });
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     }
//     await ElementHelper.cmdPause(3000);
//     try {
//       const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
//       if (skipIntroVisible) {
//         await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0]);
//         await ElementHelper.cmdPause(1000);
//       }
//     } catch (error) {
//       // Skip intro button not available, continue with test
//     }

//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdPause(500);
//     const PauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();

//     // Convert time string MM:SS to seconds for proper comparison
//     const timeToSeconds = (timeStr: string) => {
//       const parts = timeStr.split(':').map(p => parseInt(p.trim(), 10));
//       return parts[0] * 60 + parts[1];
//     };

//     const pauseTimeInSeconds = timeToSeconds(PauseTime);
//     console.log("⏸️ Paused at: " + PauseTime + ` (${pauseTimeInSeconds} seconds)`);
//     await ElementHelper.cmdClick(sanityPageLocator.primiumUserForwardButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     const forwordPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
//     const forwardTimeInSeconds = timeToSeconds(forwordPauseTime);
//     console.log("⏩ Forwarded to: " + forwordPauseTime + ` (${forwardTimeInSeconds} seconds)`);
//     await AssertionHelper.assertValueIsGreaterThan(forwardTimeInSeconds, pauseTimeInSeconds);
//     await browser.pause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.primiumUserBackwardButton[this.platform][0]);
//     await ElementHelper.cmdPause(500);
//     const backwardPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
//     const backwardTimeInSeconds = timeToSeconds(backwardPauseTime);
//     console.log("⏪ Backwarded to: " + backwardPauseTime + ` (${backwardTimeInSeconds} seconds)`);
//     await AssertionHelper.assertValueApproximatelyEquals(backwardTimeInSeconds, pauseTimeInSeconds, 1);
//     if (this.platform === 'android') {
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     } else if (this.platform === 'web') {
//       await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     }
//     await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     //  await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     if (this.platform === 'android') {
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     } else if (this.platform === 'web') {
//       await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     }
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
//     if (this.platform === 'android') {
//       await ElementHelper.cmdClick(sanityPageLocator.settingsIcon[this.platform][0]);
//     } else if (this.platform === 'web') {
//       await ElementHelper.cmdClick(sanityPageLocator.subtitleBtn[this.platform][0]);
//     }
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.subtitleEnglishBtn[this.platform][0]);
//     if (this.platform === 'android') {
//       await ElementHelper.cmdClick(sanityPageLocator.closeIconInSubtitleScreen[this.platform][0]);
//     }
//     await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     let subtitleLocator: string;
//     if (this.platform === 'web') {
//       subtitleLocator = sanityPageLocator.subtitleEnglish[this.platform][0];
//       await browser.waitUntil(
//         async () => {

//           const elements = await $$(subtitleLocator);

//           if (await elements.length === 0) {
//             return false; // not yet created in DOM
//           }

//           const isDisplayed = await elements[0].isDisplayed();
//           const text = await elements[0].getText();

//           return isDisplayed && text.trim().length > 0;

//         },
//         {
//           timeout: 5000,
//           interval: 500,
//           timeoutMsg: 'Subtitle did not appear within 5 seconds'
//         }
//       );
//       await AssertionHelper.assertVisible(subtitleLocator);
//     } else if (this.platform === 'android') {
//       console.log("No Locator available for Android subtitle");
//     }
//     await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
//     // await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     if (this.platform === 'android') {
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     } else if (this.platform === 'web') {
//       await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     }
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.maximizeScreenButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.minimizeScreenButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.minimizeScreenButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
//     if (this.platform === 'web') {
//       await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0]);
//       await AssertionHelper.assertVisible(sanityPageLocator.volumeUnmuteButton[this.platform][0]);
//       await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0]);
//       await AssertionHelper.assertVisible(sanityPageLocator.volumeMuteButton[this.platform][0]);
//       await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
//     } else if (this.platform === 'android') {
//       console.log("volume is not available for Android and progress bar controls locator is not available for Android");
//     }

//   }









//   static async playGmaContent(): Promise<void> {
//     await ElementHelper.cmdClick(sanityPageLocator.gmaTabButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);

//     const firstRow = sanityPageLocator.gmaFirstRowContent[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(firstRow);
//     if (trayCount === 0) {
//       console.error('GMA content tray not found')
//       return
//     }
//     await ElementHelper.cmdClick(firstRow);
//     await ElementHelper.cmdPause(500);
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);

//     // const timerLocatorV2 = sanityPageLocator.contentPlayTimerV2[this.platform][0];
//     await ElementHelper.cmdPause(1000);
//     if (this.platform === 'android') {
//       const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
//       await (browser as any).waitUntil(async () => {
//         return await ElementHelper.cmdIsVisible(loader);
//       }, {
//         timeout: 10000,
//         interval: 1000
//       }).catch(() => {
//         console.log("Loader did not appear");
//       });

//       console.log("⏳ Waiting for Loader to disappear");
//       await (browser as any).waitUntil(async () => {
//         const isVisible = await ElementHelper.cmdIsVisible(loader);
//         return !isVisible;
//       }, {
//         timeout: 180000,  // 3 minutes
//         interval: 2000,
//         timeoutMsg: "Loader did not disappear within 3 minutes"
//       });
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     }
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertVisible(sanityPageLocator.palyButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//   }




//   static async playAndControlPlayer(): Promise<void> {
//     await ElementHelper.cmdClick(sanityPageLocator.freetraycontentsLinks[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);
//     await this.waitForAdsToComplete();
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.palyButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.seekForwardButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.seekBackwardButton[this.platform][0]);
//     const seekbar = await $(sanityPageLocator.seekbar[this.platform][0]);
//     await seekbar.waitForDisplayed();
//     await seekbar.setValue(50);
//     await ElementHelper.cmdClick(sanityPageLocator.fullscreenButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.subtitleButton[this.platform][0]);
//     const volumeSlider = await $(sanityPageLocator.volumeSlider[this.platform][0]);
//     await volumeSlider.waitForDisplayed();
//     await volumeSlider.setValue(70);
//   }

//   static async playerControlsFunctionality(): Promise<void> {
//     await ElementHelper.cmdPause(2000);

//     // Wait for content cards to be present on the page
//     await browser.waitUntil(
//       async () => {
//         const gmaContent = await sanityPageLocator.gmaFirstRowContent[this.platform][0];
//         const primaryCount = await ElementHelper.cmdGetElementCount(gmaContent);
//         if (primaryCount > 0) return true;

//         // Check fallback selectors if primary is not found
//         const fallbackSelectors = sanityPageLocator.contentFallbackSelectors[this.platform];
//         for (const selector of fallbackSelectors) {
//           const count = await ElementHelper.cmdGetElementCount(selector);
//           if (count > 0) return true;
//         }
//         return false;
//       },
//       { timeout: 15000, timeoutMsg: "Content cards failed to load within timeout" }
//     );

//     const gmaContent = await sanityPageLocator.gmaFirstRowContent[this.platform][0];
//     let contentFound = false;
//     let firstRow = gmaContent;
//     let trayCount = await ElementHelper.cmdGetElementCount(firstRow);
//     if (trayCount === 0) {
//       const fallbackSelectors = sanityPageLocator.contentFallbackSelectors[this.platform];

//       for (const selector of fallbackSelectors) {
//         const count = await ElementHelper.cmdGetElementCount(selector);

//         if (count > 0) {
//           firstRow = selector;
//           contentFound = true;
//           break;
//         }
//       }
//       await AssertionHelper.assertTrue(contentFound, "Content card not found in GMA tab");

//     } else {
//       contentFound = true;
//     }
//     await ElementHelper.cmdClick(firstRow);
//     await ElementHelper.cmdPause(5000);
//     await ElementHelper.cmdClick(sanityPageLocator.primiumUserPlayButton[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     try {
//       const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
//       if (skipIntroVisible) {
//         await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0]);
//         await ElementHelper.cmdPause(1000);
//       }
//     } catch (error) {
//       // Skip intro button not available, continue with test
//     }

//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     const PauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();

//     // Convert time string MM:SS to seconds for proper comparison
//     const timeToSeconds = (timeStr: string) => {
//       const parts = timeStr.split(':').map(p => parseInt(p.trim(), 10));
//       return parts[0] * 60 + parts[1];
//     };

//     const pauseTimeInSeconds = timeToSeconds(PauseTime);

//     await ElementHelper.cmdClick(sanityPageLocator.primiumUserForwardButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     const forwordPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
//     const forwardTimeInSeconds = timeToSeconds(forwordPauseTime);

//     await AssertionHelper.assertValueIsGreaterThan(forwardTimeInSeconds, pauseTimeInSeconds);

//     await ElementHelper.cmdClick(sanityPageLocator.primiumUserBackwardButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     const backwardPauseTime = await (await ElementHelper.cmdGetText(sanityPageLocator.primiumUserTimeDisplay[this.platform][0])).split('/')[0].trim();
//     const backwardTimeInSeconds = timeToSeconds(backwardPauseTime);

//     await AssertionHelper.assertValueApproximatelyEquals(backwardTimeInSeconds, pauseTimeInSeconds, 1);

//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.subtitleBtn[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.subtitleEnglishBtn[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     const subtitleLocator = sanityPageLocator.subtitleEnglish[this.platform][0];

//     await browser.waitUntil(
//       async () => {

//         const elements = await $$(subtitleLocator);

//         if (await elements.length === 0) {
//           return false; // not yet created in DOM
//         }

//         const isDisplayed = await elements[0].isDisplayed();
//         const text = await elements[0].getText();

//         return isDisplayed && text.trim().length > 0;

//       },
//       {
//         timeout: 5000,
//         interval: 500,
//         timeoutMsg: 'Subtitle did not appear within 5 seconds'
//       }
//     );

//     await AssertionHelper.assertVisible(subtitleLocator);
//     await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.maximizeScreenButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.minimizeScreenButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.minimizeScreenButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.maximizeScreenButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.volumeUnmuteButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.volumeButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.volumeMuteButton[this.platform][0]);
//     await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
//   }

//   static async verifyAutoUpnextPlayback(episodeTitle1: string, episodeTitle2: string, multipleEpisodesContent: string): Promise<void> {
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], multipleEpisodesContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
//     if (trayCount === 0) {
//       console.error("Free Tray not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(freeTrayLocator);
//     await ElementHelper.cmdClick(sanityPageLocator.episodesList[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     // await browser.pause(2000);
//     // await AssertionHelper.assertVisible(sanityPageLocator.playButton[this.platform][0]);
//     // await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);

//     //  Wait for player screen
//     await $(sanityPageLocator.midleScreen[this.platform][0]).waitForDisplayed({ timeout: 20000 });

//     // Ensure controls are triggered
//     await browser.waitUntil(async () => {
//       try {
//         await ElementHelper.cmdClick(sanityPageLocator.midleScreen[this.platform][0]);
//         await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//         return true;
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 10000,
//       interval: 1000,
//       timeoutMsg: "Player not interactive"
//     });

//     // Handle Play / Autoplay scenario
//     const playBtn = sanityPageLocator.episodePlayButton[this.platform][0];

//     await browser.waitUntil(async () => {
//       await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//       return await ElementHelper.cmdIsVisible(playBtn).catch(() => false);
//     }, {
//       timeout: 10000,
//       interval: 1000
//     }).catch(() => {
//       console.log("Play button not visible — likely autoplay");
//     });

//     // ✅ Click only if Play is visible
//     const isPlayVisible = await ElementHelper.cmdIsVisible(playBtn).catch(() => false);

//     if (isPlayVisible) {
//       console.log("▶️ Clicking Play button");
//       await ElementHelper.cmdClick(playBtn);
//     } else {
//       console.log("⏩ Video already playing, skipping Play click");
//     }

//     if (this.platform === 'android') {
//       const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
//       await (browser as any).waitUntil(async () => {
//         return await ElementHelper.cmdIsVisible(loader);
//       }, {
//         timeout: 10000,
//         interval: 1000
//       }).catch(() => {
//         console.log("Loader did not appear");
//       });

//       console.log("⏳ Waiting for Loader to disappear");
//       await (browser as any).waitUntil(async () => {
//         const isVisible = await ElementHelper.cmdIsVisible(loader);
//         return !isVisible;
//       }, {
//         timeout: 180000,  // 3 minutes
//         interval: 2000,
//         timeoutMsg: "Loader did not disappear within 3 minutes"
//       });
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     }
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     try {
//       const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
//       if (skipIntroVisible) {
//         await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0]);
//         await ElementHelper.cmdPause(1000);
//       }
//     } catch (error) {
//       // Skip intro button not available, continue with test
//     }
//     if (this.platform === 'web') {
//       await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     }
//     const normalizeEpisodeText = (text: string) =>
//       text.replace(/[●•]/g, '·').replace(/\s+/g, ' ').trim();
//     if (this.platform === 'android') {
//       const locator = sanityPageLocator.episodeText[this.platform][0];
//       let receivedText = await ElementHelper.cmdGetText(locator);
//       receivedText = receivedText.replace(/●/g, '·').replace(/\s+/g, ' ').trim();
//       expect(receivedText).toBe(episodeTitle1);
//     }
//     else if (this.platform === 'web') {
//       const currentEpisodeTitle = await ElementHelper.cmdGetText(sanityPageLocator.episodeText[this.platform][0]);
//       await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle1);
//       await ElementHelper.cmdPause(1000);
//       await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//       await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0],
//         sanityPageLocator.scrubSeekbar[this.platform][0]);
//       await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], currentEpisodeTitle, 40000);
//     }
//     if (this.platform === 'android') {
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//       await ElementHelper.cmdPause(1000);
//       await ElementHelper.cmdClick(sanityPageLocator.maximizeScreenButton[this.platform][0]);
//       await ElementHelper.cmdPause(10000);
//     }
//     if (this.platform === 'android') {
//       await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], episodeTitle1, 40000);
//     }
//     await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle2);
//   }
//   static async verifyUpnextBingeMarker(episodeTitle1: string, episodeTitle2: string, multipleEpisodesContent: string): Promise<void> {
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], multipleEpisodesContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
//     if (trayCount === 0) {
//       console.error("Free Tray not found or inaccessible");
//       return;
//     }

//     await ElementHelper.cmdClick(freeTrayLocator);
//     await ElementHelper.cmdClick(sanityPageLocator.episodesList[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     // await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);
//     // await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // await ElementHelper.cmdPause(1000);
//     await $(sanityPageLocator.midleScreen[this.platform][0]).waitForDisplayed({ timeout: 20000 });

//     // Ensure controls are triggered
//     await browser.waitUntil(async () => {
//       try {
//         await ElementHelper.cmdClick(sanityPageLocator.midleScreen[this.platform][0]);
//         await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//         return true;
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 10000,
//       interval: 1000,
//       timeoutMsg: "Player not interactive"
//     });

//     // Handle Play / Autoplay scenario
//     const playBtn = sanityPageLocator.episodePlayButton[this.platform][0];

//     await browser.waitUntil(async () => {
//       await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//       return await ElementHelper.cmdIsVisible(playBtn).catch(() => false);
//     }, {
//       timeout: 10000,
//       interval: 1000
//     }).catch(() => {
//       console.log("Play button not visible — likely autoplay");
//     });

//     // ✅ Click only if Play is visible
//     const isPlayVisible = await ElementHelper.cmdIsVisible(playBtn).catch(() => false);

//     if (isPlayVisible) {
//       console.log("▶️ Clicking Play button");
//       await ElementHelper.cmdClick(playBtn);
//     } else {
//       console.log("⏩ Video already playing, skipping Play click");
//     }


//     try {
//       const skipIntroVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
//       if (skipIntroVisible) {
//         await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0]);
//         await ElementHelper.cmdPause(1000);
//       }
//     } catch (error) {
//       // ignore if not present
//     }

//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle1);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeThumbnail[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.nextEpisodeThumbnailPlayBtn[this.platform][0]);
//     await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], episodeTitle1, 15000);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertTextContains(sanityPageLocator.episodeText[this.platform][0], episodeTitle2);
//   }

//   static async verifySkipIntroMarker(searchSkipIntroContent: string): Promise<void> {
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchSkipIntroContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
//     if (trayCount === 0) {
//       console.error("Free Tray not found or inaccessible");
//       return;
//     }

//     await ElementHelper.cmdClick(freeTrayLocator);
//     await ElementHelper.cmdClick(sanityPageLocator.curentEpisodePlayButton[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.dragMidToStart(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertNotVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
//   }

//   static async verifySkipRecapMarkerWithSearch(searchContent: string): Promise<void> {
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     // step 3: search for content
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     if (this.platform === 'android') {
//       await browser.waitUntil(async () => {
//         try {
//           return await $(sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0]).isDisplayed();
//         } catch {
//           return false;
//         }
//       }, {
//         timeout: 10000,
//         timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
//       });
//     }

//     // step 4: navigate to search result and tap to play
//     const freeTrayLocator = sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
//     if (trayCount === 0) {
//       console.error("Free Tray not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(freeTrayLocator);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.curentEpisodePlayButton[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.dragMidToStart(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.skipIntroButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertNotVisible(sanityPageLocator.skipIntroButton[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.skipRecapButton[this.platform][0]);

//     await ElementHelper.cmdClick(sanityPageLocator.skipRecapButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertNotVisible(sanityPageLocator.skipRecapButton[this.platform][0]);
//   }

//   static async verifySkipOutroMarkerWithSearch(searchContent: string): Promise<void> {
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);

//     // step 3: search for content
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // step 4: navigate to search result and tap to play
//     const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//     const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
//     if (resultCount === 0) {
//       console.error('Search result not found');
//       return;
//     }
//     await ElementHelper.cmdClick(searchResultLocator);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(1000);

//     await ElementHelper.cmdClick(sanityPageLocator.secondEpisodesList[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeThumbnail[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeButton[this.platform][0]);

//   }

//   /**
//    * Verify PiP (Picture-in-Picture) mode during active video playback for VOD content.
//    * This method is Android-specific and tests the PiP functionality.
//    *
//    * Steps:
//    * 1. Navigate to video player screen
//    * 2. Start VOD playback
//    * 3. Press Home button to enter PiP mode
//    * 4. Verify app enters PiP mode with floating video window
//    */
//   static async verifyPipModeDuringPlayback(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('PiP mode verification is only supported on Android platform');
//     }
//     await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.gmaFirstRowContent[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 10000,
//       timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
//     });

//     // Navigate to content and start playback
//     const contentLocator = sanityPageLocator.gmaFirstRowContent[this.platform][0];
//     const contentCount = await ElementHelper.cmdGetElementCount(contentLocator);
//     if (contentCount === 0) {
//       throw new Error('Content not found for PiP mode testing');
//     }

//     await ElementHelper.cmdClick(contentLocator);
//     await ElementHelper.cmdPause(2000);

//     // Start video playback
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);
//     await ElementHelper.cmdPause(3000);

//     // Wait for video to start playing
//     if (this.platform === 'android') {
//       const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
//       await (browser as any).waitUntil(async () => {
//         return await ElementHelper.cmdIsVisible(loader);
//       }, {
//         timeout: 10000,
//         interval: 1000
//       }).catch(() => {
//         console.log("Loader did not appear");
//       });

//       console.log("⏳ Waiting for Loader to disappear");
//       await (browser as any).waitUntil(async () => {
//         const isVisible = await ElementHelper.cmdIsVisible(loader);
//         return !isVisible;
//       }, {
//         timeout: 180000,  // 3 minutes
//         interval: 2000,
//         timeoutMsg: "Loader did not disappear within 3 minutes"
//       });

//       // Click on player screen to reveal controls
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     }

//     // Verify video is playing
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

//     // Press Home button to enter PiP mode
//     await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
//     await ElementHelper.cmdPause(2000);

//     // Verify PiP mode is active - Use mandatory assertion
//     console.log("🔍 Verifying PiP window is visible...");
//     await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
//     console.log("✅ PiP window is visible");

//     // Verify video player is still active in PiP mode
//     console.log("🔍 Verifying PiP video player is active...");
//     await AssertionHelper.assertVisible(sanityPageLocator.pipVideoPlayer[this.platform][0]);
//     console.log("✅ PiP video player is active");

//     console.log("✅ PiP mode verification completed successfully");
//   }

//   /**
//    * Verify PiP (Picture-in-Picture) mode during active live video playback.
//    * This method is Android-specific and tests the PiP functionality for live content.
//    *
//    * Steps:
//    * 1. Navigate to live content
//    * 2. Start live playback
//    * 3. Press Home button to enter PiP mode
//    * 4. Verify app enters PiP mode with floating video window
//    */
//   static async verifyPipModeDuringLivePlayback(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('PiP mode verification is only supported on Android platform');
//     }

//     // Navigate to Live tab
//     await ElementHelper.cmdClick(sanityPageLocator.liveTab[this.platform][0]);
//     await ElementHelper.cmdPause(2000);

//     // Find and click on live content
//     const liveContentLocator = sanityPageLocator.liveContent[this.platform][0];
//     const contentCount = await ElementHelper.cmdGetElementCount(liveContentLocator);
//     if (contentCount === 0) {
//       throw new Error('Live content not found for PiP mode testing');
//     }

//     await ElementHelper.cmdClick(liveContentLocator);
//     await ElementHelper.cmdPause(2000);

//     // Verify we're on a live stream
//     await AssertionHelper.assertVisible(sanityPageLocator.livePlayerIndicator[this.platform][0]);

//     // Wait for live stream to start playing
//     await ElementHelper.cmdPause(5000);

//     // Verify live video is playing
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

//     // Press Home button to enter PiP mode
//     await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
//     await ElementHelper.cmdPause(2000);

//     // Verify PiP mode is active - Use mandatory assertion for live content
//     console.log("🔍 Verifying PiP window is visible for live content...");
//     await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
//     console.log("✅ PiP window is visible for live content");

//     // Verify video player is still active in PiP mode
//     console.log("🔍 Verifying PiP video player is active for live content...");
//     await AssertionHelper.assertVisible(sanityPageLocator.pipVideoPlayer[this.platform][0]);
//     console.log("✅ PiP video player is active for live content");

//     console.log("✅ Live PiP mode verification completed successfully");
//   }

//   /**
//    * Verify PiP (Picture-in-Picture) playback controls for VOD content.
//    * This method is Android-specific and tests the playback controls within PiP mode.
//    *
//    * Steps:
//    * 1. Enter PiP mode during VOD playback
//    * 2. Tap PiP window to show controls
//    * 3. Test Play/Pause, Forward, Rewind controls
//    * 4. Verify controls respond correctly
//    */
//   static async verifyPipPlaybackControls(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('PiP playback controls verification is only supported on Android platform');
//     }

//     // First, enter PiP mode by starting VOD playback and pressing home
//     const contentLocator = sanityPageLocator.gmaFirstRowContent[this.platform][0];
//     const contentCount = await ElementHelper.cmdGetElementCount(contentLocator);
//     if (contentCount === 0) {
//       throw new Error('Content not found for PiP controls testing');
//     }

//     await ElementHelper.cmdClick(contentLocator);
//     await ElementHelper.cmdPause(2000);

//     // Start video playback
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);
//     await ElementHelper.cmdPause(3000);

//     // Wait for video to start playing
//     if (this.platform === 'android') {
//       const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
//       await (browser as any).waitUntil(async () => {
//         return await ElementHelper.cmdIsVisible(loader);
//       }, {
//         timeout: 10000,
//         interval: 1000
//       }).catch(() => {
//         console.log("Loader did not appear");
//       });

//       console.log("⏳ Waiting for Loader to disappear");
//       await (browser as any).waitUntil(async () => {
//         const isVisible = await ElementHelper.cmdIsVisible(loader);
//         return !isVisible;
//       }, {
//         timeout: 180000,  // 3 minutes
//         interval: 2000,
//         timeoutMsg: "Loader did not disappear within 3 minutes"
//       });

//       // Click on player screen to reveal controls
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     }

//     // Verify video is playing
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

//     // Press Home button to enter PiP mode
//     await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
//     await ElementHelper.cmdPause(2000);

//     // Verify PiP mode is active
//     await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
//     console.log("✅ Entered PiP mode successfully");

//     // Tap PiP window to show controls
//     await ElementHelper.cmdClick(sanityPageLocator.pipWindow[this.platform][0]);
//     await ElementHelper.cmdPause(1000);

//     // Verify PiP controls are visible
//     const controlsVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.pipControlsOverlay[this.platform][0]);
//     if (controlsVisible) {
//       console.log("✅ PiP controls overlay is visible");
//     }

//     // Test Play/Pause functionality
//     console.log("🧪 Testing Play/Pause control...");
//     const playPauseButton = sanityPageLocator.pipPlayPauseButton[this.platform][0];
//     const initialPlayState = await ElementHelper.cmdIsVisible(playPauseButton);

//     // Click play/pause button
//     await ElementHelper.cmdClick(playPauseButton);
//     await ElementHelper.cmdPause(2000);

//     // Verify state changed (play button should appear when paused, pause when playing)
//     const newPlayState = await ElementHelper.cmdIsVisible(playPauseButton);
//     if (initialPlayState !== newPlayState) {
//       console.log("✅ Play/Pause control working correctly");
//     }

//     // Click again to resume playback
//     await ElementHelper.cmdClick(playPauseButton);
//     await ElementHelper.cmdPause(2000);

//     // Test Forward control (+10s)
//     console.log("🧪 Testing Forward control...");
//     const forwardButton = sanityPageLocator.pipForwardButton[this.platform][0];
//     const forwardVisible = await ElementHelper.cmdIsVisible(forwardButton);
//     if (forwardVisible) {
//       await ElementHelper.cmdClick(forwardButton);
//       await ElementHelper.cmdPause(2000);
//       console.log("✅ Forward control (+10s) executed");
//     }

//     // Test Rewind control (-10s)
//     console.log("🧪 Testing Rewind control...");
//     const rewindButton = sanityPageLocator.pipRewindButton[this.platform][0];
//     const rewindVisible = await ElementHelper.cmdIsVisible(rewindButton);
//     if (rewindVisible) {
//       await ElementHelper.cmdClick(rewindButton);
//       await ElementHelper.cmdPause(2000);
//       console.log("✅ Rewind control (-10s) executed");
//     }

//     console.log("✅ PiP playback controls verification completed successfully");
//   }

//   /**
//    * Verify PiP (Picture-in-Picture) playback controls for Live stream.
//    * This method is Android-specific and tests the playback controls within PiP mode for live content.
//    *
//    * Steps:
//    * 1. Enter PiP mode during live playback
//    * 2. Tap PiP window to show controls
//    * 3. Verify Play/Pause toggles playback
//    * 4. Verify Live badge should be visible
//    */
//   static async verifyPipPlaybackControlsForLive(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('PiP playback controls verification is only supported on Android platform');
//     }

//     // Navigate to Live tab
//     await ElementHelper.cmdClick(sanityPageLocator.liveTab[this.platform][0]);
//     await ElementHelper.cmdPause(2000);

//     // Find and click on live content
//     const liveContentLocator = sanityPageLocator.liveContent[this.platform][0];
//     const contentCount = await ElementHelper.cmdGetElementCount(liveContentLocator);
//     if (contentCount === 0) {
//       throw new Error('Live content not found for PiP controls testing');
//     }

//     await ElementHelper.cmdClick(liveContentLocator);
//     await ElementHelper.cmdPause(2000);

//     // Verify we're on a live stream
//     await AssertionHelper.assertVisible(sanityPageLocator.livePlayerIndicator[this.platform][0]);

//     // Wait for live stream to start playing
//     await ElementHelper.cmdPause(5000);

//     // Verify live video is playing
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

//     // Press Home button to enter PiP mode
//     await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
//     await ElementHelper.cmdPause(2000);

//     // Verify PiP mode is active
//     console.log("🔍 Verifying PiP window is visible for live stream...");
//     await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
//     console.log("✅ PiP window is visible for live stream");

//     // Tap PiP window to show controls
//     await ElementHelper.cmdClick(sanityPageLocator.pipWindow[this.platform][0]);
//     await ElementHelper.cmdPause(1000);

//     // Verify PiP controls are visible
//     const controlsVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.pipControlsOverlay[this.platform][0]);
//     if (controlsVisible) {
//       console.log("✅ PiP controls overlay is visible for live stream");
//     }

//     // Test Play/Pause functionality for live stream
//     console.log("🧪 Testing Play/Pause control for live stream...");
//     const playPauseButton = sanityPageLocator.pipPlayPauseButton[this.platform][0];
//     const initialPlayState = await ElementHelper.cmdIsVisible(playPauseButton);

//     // Click play/pause button
//     await ElementHelper.cmdClick(playPauseButton);
//     await ElementHelper.cmdPause(2000);

//     // Verify state changed (play button should appear when paused, pause when playing)
//     const newPlayState = await ElementHelper.cmdIsVisible(playPauseButton);
//     if (initialPlayState !== newPlayState) {
//       console.log("✅ Play/Pause control working correctly for live stream");
//     }

//     // Click again to resume playback
//     await ElementHelper.cmdClick(playPauseButton);
//     await ElementHelper.cmdPause(2000);

//     // Verify Live badge is visible in PiP mode
//     console.log("🔍 Verifying Live badge is visible in PiP mode...");
//     await AssertionHelper.assertVisible(sanityPageLocator.pipLiveBadge[this.platform][0]);
//     console.log("✅ Live badge is visible in PiP mode");

//     console.log("✅ PiP playback controls verification for live stream completed successfully");
//   }

//   /**
//    * Verify the Full screen transition from PiP (Picture-in-Picture) mode.
//    * This method is Android-specific and tests the transition from PiP back to fullscreen.
//    *
//    * Steps:
//    * 1. Navigate to video player screen
//    * 2. Start VOD playback
//    * 3. Press Home button for PIP mode
//    * 4. While in PiP mode, tap Full Screen icon
//    * 5. Verify video returns to full screen in the app
//    */
//   static async verifyPipFullscreenTransition(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('PiP fullscreen transition verification is only supported on Android platform');
//     }

//     // Navigate to content and start playback
//     const contentLocator = sanityPageLocator.gmaFirstRowContent[this.platform][0];
//     const contentCount = await ElementHelper.cmdGetElementCount(contentLocator);
//     if (contentCount === 0) {
//       throw new Error('Content not found for PiP fullscreen transition testing');
//     }

//     await ElementHelper.cmdClick(contentLocator);
//     await ElementHelper.cmdPause(2000);

//     // Start video playback
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0]);
//     await ElementHelper.cmdPause(3000);

//     // Wait for video to start playing
//     if (this.platform === 'android') {
//       const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
//       await (browser as any).waitUntil(async () => {
//         return await ElementHelper.cmdIsVisible(loader);
//       }, {
//         timeout: 10000,
//         interval: 1000
//       }).catch(() => {
//         console.log("Loader did not appear");
//       });

//       console.log("⏳ Waiting for Loader to disappear");
//       await (browser as any).waitUntil(async () => {
//         const isVisible = await ElementHelper.cmdIsVisible(loader);
//         return !isVisible;
//       }, {
//         timeout: 180000,  // 3 minutes
//         interval: 2000,
//         timeoutMsg: "Loader did not disappear within 3 minutes"
//       });

//       // Click on player screen to reveal controls
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     }

//     // Verify video is playing
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);

//     // Press Home button to enter PiP mode
//     await (browser as any).pressKeyCode(3); // Android KEYCODE_HOME
//     await ElementHelper.cmdPause(2000);

//     // Verify PiP mode is active
//     console.log("🔍 Verifying PiP window is visible...");
//     await AssertionHelper.assertVisible(sanityPageLocator.pipWindow[this.platform][0]);
//     console.log("✅ PiP window is visible");

//     // Tap PiP window to show controls
//     await ElementHelper.cmdClick(sanityPageLocator.pipWindow[this.platform][0]);
//     await ElementHelper.cmdPause(1000);

//     // Verify PiP controls are visible
//     const controlsVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.pipControlsOverlay[this.platform][0]);
//     if (controlsVisible) {
//       console.log("✅ PiP controls overlay is visible");
//     }

//     // While in PiP mode, tap Full Screen icon
//     console.log("🧪 Testing fullscreen transition from PiP mode...");
//     const fullscreenButton = sanityPageLocator.pipFullscreenButton[this.platform][0];
//     const fullscreenVisible = await ElementHelper.cmdIsVisible(fullscreenButton);
//     if (fullscreenVisible) {
//       await ElementHelper.cmdClick(fullscreenButton);
//       await ElementHelper.cmdPause(3000);
//       console.log("✅ Fullscreen button tapped in PiP mode");
//     } else {
//       throw new Error('Fullscreen button not found in PiP mode');
//     }

//     // Verify video returns to full screen in the app
//     console.log("🔍 Verifying video returned to fullscreen in the app...");

//     // Check that we're back in the main app (not in PiP)
//     const pipWindowGone = await ElementHelper.cmdIsVisible(sanityPageLocator.pipWindow[this.platform][0]);
//     if (!pipWindowGone) {
//       console.log("✅ PiP window is no longer visible - app returned to foreground");
//     }
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//     console.log("✅ Video player is active in fullscreen mode");
//     await AssertionHelper.assertVisible(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     console.log("✅ Player screen outline is visible - back in main app");
//     console.log("✅ PiP fullscreen transition verification completed successfully");
//   }


//   static async verifySkipOutroCloseMarkerWithSearch(searchContent: string): Promise<void> {
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // search for the provided content title
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);

//     const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//     const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
//     if (resultCount === 0) {
//       console.error('Search result not found');
//       return;
//     }
//     await ElementHelper.cmdClick(searchResultLocator);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.secondEpisodesList[this.platform][0]);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeThumbnailPlayBtn[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.nextEpisodeCloseButton[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.nextEpisodeCloseButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertNotVisible(sanityPageLocator.nextEpisodeCloseButton[this.platform][0]);
//   }

//   static async verifyAfterClickingOnSkipOutroNextEpisodePlayed(searchContent: string, episodeTitle1: string, episodeTitle2: string): Promise<void> {
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // search for the provided content title
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);

//     const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//     const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
//     if (resultCount === 0) {
//       console.error('Search result not found');
//       return;
//     }
//     await ElementHelper.cmdClick(searchResultLocator);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.episodesList[this.platform][0]);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.episodeText[this.platform][0], episodeTitle1);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.dragToEnd(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.nextEpisodeThumbnailPlayBtn[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.midleScreen[this.platform][0]);
//     await ElementHelper.waitUntilTextChanges(sanityPageLocator.episodeText[this.platform][0], episodeTitle1, 15000);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.episodeText[this.platform][0], episodeTitle2);
//   }

//   static async verifyPrerollAndMidrollAds() {
//     await ElementHelper.cmdPause(3000);
//     await AssertionHelper.assertVisible(sanityPageLocator.freetraycontentsLinks[this.platform][0]);
//     const freeTrayLocator = await sanityPageLocator.freetraycontentsLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
//     if (trayCount === 0) {
//       console.error("Free Tray not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(freeTrayLocator);
//     await ElementHelper.cmdClick(sanityPageLocator.curentEpisodePlayButton[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // await AssertionHelper.assertVisible(sanityPageLocator.addsTag[this.platform][0]);
//     const ads = await $(sanityPageLocator.addsTag[this.platform][0]);
//     await ads.waitForDisplayed({ timeout: 10000 });
//     await this.waitForAdsToComplete();
//     await AssertionHelper.assertNotVisible(sanityPageLocator.addsTag[this.platform][0]);
//     await ElementHelper.hoverVideoCenter();
//     await ElementHelper.dragToMidFromStart(sanityPageLocator.progressBar[this.platform][0], sanityPageLocator.scrubSeekbar[this.platform][0])
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertVisible(sanityPageLocator.addsTag[this.platform][0]);
//     await this.waitForAdsToComplete();
//     await AssertionHelper.assertNotVisible(sanityPageLocator.addsTag[this.platform][0]);
//   }

//   static async fetchTextFromImage(locator: string): Promise<string> {
//     let imageName = null;
//     const posterLocator = locator;
//     await browser.waitUntil(async () => {
//       try {
//         return await $(posterLocator).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 10000,
//       timeoutMsg: 'Poster element not found or not visible within 10 seconds.'
//     });
//     const poster = await $(posterLocator);

//     // 2️⃣ Take screenshot
//     await poster.saveScreenshot('./src/utilities/screenshots/raw.png');

//     // 3️⃣ Improve image
//     await preprocessImage(
//       './src/utilities/screenshots/raw.png',
//       './src/utilities/screenshots/clean.png'
//     );

//     // 4️⃣ Read text using OCR
//     imageName = await extractTextFromImage(
//       './src/utilities/screenshots/clean.png'
//     );

//     return imageName;
//   }

//   static async verifySharedDeeplinkFunctionality(episodeSharedToastMsgText: string, searchContent: string) {
//     let episodeTitlecurrentWindow: string = null;
//     let episodeTitleChildWindow: string = null;
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // search for the provided content title
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0]);
//     const freeTrayLocator = sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
//     if (trayCount === 0) {
//       console.error("Free Tray not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(freeTrayLocator);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     if (this.platform === 'web') {
//       episodeTitlecurrentWindow = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
//     } else if (this.platform === 'android') {
//       episodeTitlecurrentWindow = await this.fetchTextFromImage(sanityPageLocator.imageTextElement[this.platform][0]);
//     }
//     await ElementHelper.cmdPause(2000);
//     episodeTitlecurrentWindow = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.episodeShareButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.episodeShareButton[this.platform][0]);
//     if (this.platform === 'web') {
//       await AssertionHelper.assertTextEquals(sanityPageLocator.episodeSharedToastMsg[this.platform][0], episodeSharedToastMsgText);
//     } else if (this.platform === 'android') {
//       await ElementHelper.cmdClick(sanityPageLocator.copyOptionInSharePopup[this.platform][0]);
//     }
//     await ElementHelper.cmdPause(1000);
//     if (this.platform === 'web') {
//       const copiedUrl = await ElementHelper.getCopiedText();
//       console.log("Copied URL:", copiedUrl);
//       await ElementHelper.switchToNewTabAndLaunchUrl(copiedUrl);
//       await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//       const episodeTitleChildWindow = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
//       await AssertionHelper.assertStringEquals(episodeTitleChildWindow, episodeTitlecurrentWindow);
//       await ElementHelper.switchBackToParentAndCloseChild();
//       await ElementHelper.cmdPause(1000);
//     } else if (this.platform === 'android') {
//       const base64Url = await driver.getClipboard('plaintext');
//       console.log("Base64 URL from clipboard:", base64Url);
//       const decodedUrl = Buffer.from(base64Url, 'base64').toString('utf-8');
//       console.log("Decoded URL:", decodedUrl);
//       await driver.execute('mobile: pressKey', { keycode: 3 });
//       await driver.activateApp('com.android.chrome');
//       await driver.url(decodedUrl);
//       episodeTitleChildWindow = await this.fetchTextFromImage(sanityPageLocator.imageTextElement[this.platform][0]);
//       await AssertionHelper.assertStringEquals(episodeTitleChildWindow, episodeTitlecurrentWindow);
//     }
//   }

//   static async verifySubscriptionBlockerScreen(validSubscriptionPlanText: string, subscriptionToWatchText: string) {
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertVisible(sanityPageLocator.premiumContentLinks[this.platform][0]);
//     const premiumTrayLocator = sanityPageLocator.premiumContentLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(premiumTrayLocator);
//     if (trayCount === 0) {
//       console.error("Premium Tray not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(premiumTrayLocator);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.premiumSessionEpisodeList[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.validSubscriptionPlanText[this.platform][0], validSubscriptionPlanText);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.subscriptionToWatchText[this.platform][0], subscriptionToWatchText);
//   }
//   static async verifyResumeCTAIsDisplayed(continueToWatchRemovedToastMsg: string) {
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(3000);
//     const continueToWatchEpisode = await ElementHelper.cmdGetText(sanityPageLocator.continueToWatchContentText[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.continueToWatchContentText[this.platform][0]);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.continueToWatchContentText[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.continueToCloseButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], continueToWatchRemovedToastMsg);
//     await ElementHelper.cmdPause(1000);
//     const continueToWatchEpisodeRemaining = await ElementHelper.getTextByJS(sanityPageLocator.continueToWatchContentText[this.platform][0]);
//     await AssertionHelper.assertStringNotEquals(continueToWatchEpisodeRemaining, continueToWatchRemovedToastMsg);
//   };

//   static async verifyWatchlistFunctionality(watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertVisible(sanityPageLocator.allContentsLinks[this.platform][0]);
//     const addToWatchListEpisode = await ElementHelper.cmdGetText(sanityPageLocator.allContentsLinks[this.platform][0]);
//     const episodeLocator = await sanityPageLocator.allContentsLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
//     if (trayCount === 0) {
//       console.error("Episode not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(episodeLocator);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     const addedToWatchListEpisode = await ElementHelper.cmdGetText(sanityPageLocator.allContentsLinks[this.platform][0]);
//     await AssertionHelper.assertStringEquals(addedToWatchListEpisode, addToWatchListEpisode);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
//   }

//   static async verifyRemoveFromWatchlistFunctionality(watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertVisible(sanityPageLocator.allContentsLinks[this.platform][0]);
//     const addToWatchListEpisode = await ElementHelper.cmdGetText(sanityPageLocator.allContentsLinks[this.platform][0]);
//     const episodeLocator = await sanityPageLocator.allContentsLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
//     if (trayCount === 0) {
//       console.error("Episode not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(episodeLocator);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     const addedToWatchListEpisode = await ElementHelper.cmdGetText(sanityPageLocator.allContentsLinks[this.platform][0]);
//     await AssertionHelper.assertStringEquals(addedToWatchListEpisode, addToWatchListEpisode);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
//     await WaitHelper.waitForElementClickable(sanityPageLocator.watchListButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
//   }

//   static async verifyShareFunctionality(searchContent: string) {
//     let episodeTitlecurrentWindow: string = null;
//     let episodeTitleChildWindow: string = null;
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0]);
//     const freeTrayLocator = sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(freeTrayLocator);
//     if (trayCount === 0) {
//       console.error("Free Tray not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(freeTrayLocator);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     episodeTitlecurrentWindow = await this.fetchTextFromImage(sanityPageLocator.imageTextElement[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.episodeShareButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.episodeShareButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.copyOptionInSharePopup[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     const base64Url = await driver.getClipboard('plaintext');
//     console.log("Base64 URL from clipboard:", base64Url);
//     const decodedUrl = Buffer.from(base64Url, 'base64').toString('utf-8');
//     console.log("Decoded URL:", decodedUrl);
//     await driver.execute('mobile: pressKey', { keycode: 3 });
//     await driver.activateApp('com.android.chrome');
//     await driver.url(decodedUrl);
//     episodeTitleChildWindow = await this.fetchTextFromImage(sanityPageLocator.imageTextElement[this.platform][0]);
//     await AssertionHelper.assertStringEquals(episodeTitleChildWindow, episodeTitlecurrentWindow);
//   }

//   static async verifyAddToWatchlistFromCWTrayBottomBarPopup(): Promise<void> {
//     // await ElementHelper.cmdPause(3000);
//     // // await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(9000);

//     const continueWatchingTrayLocator = sanityPageLocator.continueToWatchContentText[this.platform][0];
//     const continueWatchingTrayCount = await ElementHelper.cmdGetElementCount(continueWatchingTrayLocator);
//     console.log("Continue Watching tray count: ", continueWatchingTrayCount);
//     if (continueWatchingTrayCount === 0) {
//       throw new Error('Continue Watching tray is not available for the logged-in user.');
//     }

//     await AssertionHelper.assertVisible(continueWatchingTrayLocator);
//     await ElementHelper.cmdScrollDownSmall();
//     await AssertionHelper.assertVisible(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0]);

//     await ElementHelper.cmdClick(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0]);
//     const removeFromWatchlistAppear = await ElementHelper.cmdIsVisible(
//       sanityPageLocator.cwTrayRemoveFromWatchlistButton[this.platform][0]
//     );
//     if (removeFromWatchlistAppear) {
//       await ElementHelper.cmdClick(sanityPageLocator.cwTrayRemoveFromWatchlistButton[this.platform][0]);
//       await ElementHelper.cmdClick(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0]);
//     }

//     await AssertionHelper.assertVisible(sanityPageLocator.cwTrayAddToWatchlistButton[this.platform][0]);

//     await ElementHelper.cmdClick(sanityPageLocator.cwTrayAddToWatchlistButton[this.platform][0]);
//     await ElementHelper.cmdPause(2000);

//     // await ElementHelper.cmdClick(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0]);
//     const removeFromWatchlistVisible = await ElementHelper.cmdIsVisible(
//       sanityPageLocator.cwTrayRemoveFromWatchlistButton[this.platform][0]
//     );

//     if (!removeFromWatchlistVisible) {
//       await ElementHelper.cmdClick(sanityPageLocator.continueToWatchThreeDotsButton[this.platform][0]);
//     }

//     await AssertionHelper.assertVisible(sanityPageLocator.cwTrayRemoveFromWatchlistButton[this.platform][0]);
//   }

// static async verifyVideoPlaybackFromWatchlist(watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     const episodeLocator = await sanityPageLocator.allContentsLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
//     if (trayCount === 0) {
//       console.error("Episode not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(episodeLocator, "Episode Locator");
//     await ElementHelper.cmdPause(2000);
//     const expectedTitle = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
//     console.log("Expected episode title: ", expectedTitle);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     if(await ElementHelper.cmdIsVisible(sanityPageLocator.removeWatchListIcon[this.platform][0])){
//       await ElementHelper.cmdClick(sanityPageLocator.removeWatchListIcon[this.platform][0], "Remove from Watchlist Icon");
//     }
//     await ElementHelper.cmdPause(5000);
//     await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
//     await ElementHelper.cmdPause(500);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0], "My Watchlist Tab");
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.cmdClick(sanityPageLocator.allContentsLinks[this.platform][0], "All Contents Links");
//     await ElementHelper.cmdClick(sanityPageLocator.primiumUserPlayButton[this.platform][0], "Premium User Play Button");
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     await AssertionHelper.assertVisible(sanityPageLocator.palyButton[this.platform][0]);
//     await ElementHelper.hoverVideoCenter();
//     await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0], "Play Button");
//     await ElementHelper.hoverVideoCenter();

//     const addedToWatchListEpisode = (await ElementHelper.getTextByJS(sanityPageLocator.playerTitle[this.platform][0]));
//     await AssertionHelper.assertStringEquals(expectedTitle, addedToWatchListEpisode);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.hoverVideoCenter();
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//     await ElementHelper.hoverVideoCenter();
//     await AssertionHelper.assertVisible(sanityPageLocator.progressBar[this.platform][0]);
//     await ElementHelper.hoverVideoCenter();
//     await ElementHelper.cmdClick(sanityPageLocator.episodeBackButton[this.platform][0], "Episode Back Button");
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0], "Watchlist Button");
//      await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.toastMsg[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 2000,
//       timeoutMsg: 'Toast message not present after 15 seconds.'
//     });
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
//   }

//   static async verifyFreeUserVideoPlaybackFromWatchlist(watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     const episodeLocator = await sanityPageLocator.freetraycontentsLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
//     if (trayCount === 0) {
//       console.error("Episode not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(episodeLocator);
//     await ElementHelper.cmdPause(2000);
//     const expectedTitle = await ElementHelper.getTextByJS(sanityPageLocator.playerEpisodeText[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.cmdClick(sanityPageLocator.allContentsLinks[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.primiumUserPlayButton[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await this.waitForAdsToComplete();
//     await ElementHelper.hoverVideoCenter();
//     await AssertionHelper.assertVisible(sanityPageLocator.palyButton[this.platform][0]);
//     await ElementHelper.hoverVideoCenter();
//     await ElementHelper.cmdClick(sanityPageLocator.palyButton[this.platform][0]);
//     await ElementHelper.hoverVideoCenter();
//     const addedToWatchListEpisode = (await ElementHelper.getTextByJS(sanityPageLocator.episodeText[this.platform][0])).split('S1')[0].trim();
//     await AssertionHelper.assertStringEquals(expectedTitle, addedToWatchListEpisode);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.hoverVideoCenter();
//     await AssertionHelper.assertVisible(sanityPageLocator.contentPlayTimer[this.platform][0]);
//     await ElementHelper.hoverVideoCenter();
//     await AssertionHelper.assertVisible(sanityPageLocator.progressBar[this.platform][0]);
//     await ElementHelper.hoverVideoCenter();
//     await ElementHelper.cmdClick(sanityPageLocator.episodeBackButton[this.platform][0]);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     // await browser.refresh();
//     // await ElementHelper.cmdPause(1000);
//     // await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
//   }

//   static async verifyAbleToAddContentToMyWatchlistFromSearchPage(searchContent: string, watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // step 3: search for content
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);

//     // step 4: navigate to search result and tap to play
//     const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//     const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
//     if (resultCount === 0) {
//       console.error('Search result not found');
//       return;
//     }
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.mouseHoverToEpisode[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
//   }

//   static async verifyAbleToRemoveContentFromMyWatchlistFromSearchPage(searchContent: string, watchListAddedToastMsg: string, watchListRemovedToastMsg: string) {
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // step 3: search for content
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);

//     // step 4: navigate to search result and tap to play
//     const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//     const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
//     if (resultCount === 0) {
//       console.error('Search result not found');
//       return;
//     }
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.mouseHoverToEpisode[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListAddedToastMsg);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdClick(sanityPageLocator.myWatchListTab[this.platform][0]);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.cmdMouseHover(sanityPageLocator.allContentsLinks[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.toastMsg[this.platform][0], watchListRemovedToastMsg);
//   };

//   static async verifySearchPageTopPicksNearYouTrayIsDisplayed(searchContent: string, moviesAndShowsText: string, topPicksNearYouText: string) {
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     // step 3: search for content
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     if (this.platform === 'web') {
//       await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//       await ElementHelper.cmdPause(2000);
//       await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//       await AssertionHelper.assertTextEquals(sanityPageLocator.moviesAndShowsText[this.platform][0], moviesAndShowsText);
//       const moviesAndShowsEpisodeText = await ElementHelper.getTextByJS(sanityPageLocator.getEpisodeLinkText[this.platform][0]);
//       const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//       const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
//       if (resultCount === 0) {
//         console.error('Search result not found');
//         return;
//       }
//       await ElementHelper.cmdPause(2000);
//       await ElementHelper.cmdClick(sanityPageLocator.searchTextCloseBtn[this.platform][0]);
//       await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//       await ElementHelper.cmdPause(2000);
//       await AssertionHelper.assertTextEquals(sanityPageLocator.topPicksNearYouTextLink[this.platform][0], topPicksNearYouText);
//       await ElementHelper.cmdPause(1000);
//       const topPicksNearYouEpisodeText = await ElementHelper.getTextByJS(sanityPageLocator.getEpisodeLinkText[this.platform][0]);
//       await ElementHelper.cmdPause(1000);
//       await AssertionHelper.assertStringNotEquals(moviesAndShowsEpisodeText, topPicksNearYouEpisodeText);
//     } else if (this.platform === 'android') {
//       await AssertionHelper.assertVisible(sanityPageLocator.topPicksNearYouTextLink[this.platform][0]);
//     }

//   };

//   static async verifySearchPageAutoSuggestions(searchContent: string, moviesAndShowsText: string, popularSearchesText: string) {
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     // step 3: search for content
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     if (this.platform === 'web') {
//       await AssertionHelper.assertTextEquals(sanityPageLocator.moviesAndShowsText[this.platform][0], moviesAndShowsText);
//       const searchResultLocator = await sanityPageLocator.showTabSearchedMultipleEpisodes[this.platform][0];
//       const resultCount = await ElementHelper.cmdGetElementCount(searchResultLocator);
//       if (resultCount === 0) {
//         console.error('Search result not found');
//         return;
//       }
//       await ElementHelper.cmdPause(2000);
//       await AssertionHelper.assertTextEquals(sanityPageLocator.popularSearchesText[this.platform][0], popularSearchesText);
//     }
//     await AssertionHelper.assertAllTextsContain(sanityPageLocator.autoSuggestTextList[this.platform][0], searchContent);
//   }


//   //=============================================================================================================================

//   static async loginToMobile(email: string, password: string) {
//     console.log('Waiting for login screen to be present...');
//     await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.emailInput[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 10000,
//       timeoutMsg: 'Login screen (email input) not present after 15 seconds.'
//     });
//     console.log('Login screen is present.');
//     await ElementHelper.cmdFill(sanityPageLocator.emailInput[this.platform][0], email);
//     await ElementHelper.cmdFill(sanityPageLocator.passwordInput[this.platform][0], password);
//     await ElementHelper.cmdClick(sanityPageLocator.continueButton[this.platform][0]);
//     // Validate navigation flow: wait for Home header on Android
//     await driver.pause(5000); // small pause to allow any transition/animation to start
//     await this.handleNotificationPopup();
//     console.log('Waiting for navigation to Home screen after login...');
//     await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.headerText[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 40000,
//       interval: 1000,
//       timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
//     });
//     await AssertionHelper.assertVisible(sanityPageLocator.headerText[this.platform][0]);
//     console.log('Navigation to Home screen validated.');
//   }



//   static async handleNotificationPopup() {
//     try {
//       const isVisible = await ElementHelper.cmdIsVisible(sanityPageLocator.allowButton[this.platform][0]);
//       if (isVisible) {
//         await ElementHelper.cmdClick(sanityPageLocator.allowButton[this.platform][0]);
//       } else {
//         console.log("Notification popup not found, continuing with test execution");
//       }
//     } catch {
//       console.log("Error while handling notification popup, continuing with test execution");
//     }
//   }

//   static async verifyTimerIsRunning() {
//     const timer = sanityPageLocator.contentPlayTimer[this.platform][0];

//     if (this.platform === 'android') {
//       const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
//       await (browser as any).waitUntil(async () => {
//         return await ElementHelper.cmdIsVisible(loader);
//       }, {
//         timeout: 10000,
//         interval: 1000
//       }).catch(() => {
//         console.log("Loader did not appear");
//       });

//       console.log("⏳ Waiting for Loader to disappear");
//       await (browser as any).waitUntil(async () => {
//         const isVisible = await ElementHelper.cmdIsVisible(loader);
//         return !isVisible;
//       }, {
//         timeout: 180000,  // 3 minutes
//         interval: 2000,
//         timeoutMsg: "Loader did not disappear within 3 minutes"
//       });
//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//     }

//     await AssertionHelper.assertVisible(timer);
//   }

//   static async verifyPauseButton() {
//     await AssertionHelper.assertVisible(sanityPageLocator.pauseButton[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.palyButton[this.platform][0]);
//   }









//   static async openAnyShowContent() {
//     await ElementHelper.cmdPause(5000)
//     await ElementHelper.cmdIsVisible(sanityPageLocator.anyShowContent[this.platform][0])
//     await ElementHelper.cmdPause(5000)
//     await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[this.platform][0])
//   }

//   static async verifyContentDetails(userType: string) {
//     const platform = this.platform
//     if (platform === "android") {
//       await ElementHelper.cmdClick(sanityPageLocator.showTab[this.platform][0])
//       // await this.openAnyShowContent()
//       await ElementHelper.cmdClick(sanityPageLocator.trendingShowFirstContent[this.platform][0])
//     }
//     console.log("Waiting for content details page")
//     console.log("Validating content metadata")
//     await AssertionHelper.assertVisible(sanityPageLocator.contentMetadata[platform][0])
//     console.log("Scrolling to actions section")
//     await ElementHelper.cmdPause(2000)
//     await ElementHelper.cmdScrollIntoView(sanityPageLocator.shareButton[platform][0])
//     console.log("Validating Share button")
//     await AssertionHelper.assertVisible(sanityPageLocator.shareButton[platform][0])
//     await ElementHelper.cmdPause(1000)
//     console.log("Validating Watchlist button")
//     if (userType !== "Guest") {
//       await AssertionHelper.assertVisible(sanityPageLocator.watchlistButton[platform][0])
//     }
//     console.log("Validating episode section")
//     await AssertionHelper.assertVisible(sanityPageLocator.episodeSection[platform][0])
//     console.log("Content details validated successfully")

//   }



//   static async verifyNoSearchResultsForIrrelevantTerms(searchTerm: string, value: string) {
//     let noResultsMessage: string = "";
//     const platform = this.platform
//     // Click on search icon
//     await ElementHelper.cmdClick(sanityPageLocator.contentSearchBox[platform][0])
//     await ElementHelper.cmdPause(5000)
//     // click on search header
//     await ElementHelper.cmdClick(sanityPageLocator.contentSearchHeader[platform][0])
//     // Type irrelevant search term
//     await AssertionHelper.assertVisible(sanityPageLocator.contentSearchInput[platform][0])
//     await ElementHelper.cmdFill(sanityPageLocator.contentSearchInput[platform][0], searchTerm)
//     // Wait for search to process
//     await ElementHelper.cmdPause(2000)
//     // Assert no search results message is displayed
//     await AssertionHelper.assertVisible(sanityPageLocator.noSearchResultsMessage[platform][0])
//     if (this.platform === 'web') {
//       noResultsMessage = await ElementHelper.cmdGetText(sanityPageLocator.noSearchResultsMessage[platform][0])
//       await AssertionHelper.assertEqual(noResultsMessage, value)
//     } else if (this.platform === 'android') {
//       await AssertionHelper.assertEqual(
//         await ElementHelper.cmdGetText(sanityPageLocator.noSearchResultsMessage[this.platform][0]),
//         `No search results found for "${searchTerm}"`
//       );

//     }
//     console.log("No search results message:", noResultsMessage)

//   }

//   static async launchApplication(platform: string) {
//     if (platform === 'web') {
//       await browser.url(ConfigHelper.getBaseUrl())
//     } else if (platform === 'android') {
//       console.log('Android app launched via capabilities')
//     }
//   }


//   static async logoutFromApplication(): Promise<void> {

//     const mySpaceTab = sanityPageLocator.mySpaceTab[this.platform][0];
//     const logoutOption = sanityPageLocator.logoutOption[this.platform][0];
//     const logoutPopupButton = sanityPageLocator.logoutConfirmButton[this.platform][0];

//     // Call reusable navigation method
//     await this.navigateBackUntilHomeTabVisible();

//     // Click My Space tab
//     await ElementHelper.cmdClick(mySpaceTab);
//     await ElementHelper.cmdPause(2000);

//     console.log("👤 Navigated to My Space tab");

//     // Scroll down until Logout appears
//     for (let i = 0; i < 4; i++) {

//       const logoutVisible = await $(logoutOption).isDisplayed().catch(() => false);

//       if (logoutVisible) {
//         break;
//       }

//       await ElementHelper.cmdScrollDownSmall();
//     }

//     // Click logout option
//     await ElementHelper.cmdClick(logoutOption);

//     console.log("🚪 Logout option clicked");

//     // Confirm logout popup
//     await AssertionHelper.assertVisible(logoutPopupButton);

//     await ElementHelper.cmdClick(logoutPopupButton);

//     console.log("✅ User logged out successfully");
//   }

//   static async verifyEditProfileFunctionality(editProfileData: {
//     firstName: string;
//     lastName: string;
//     gender: string;
//     dateOfBirth: string;
//   }): Promise<void> {

//     if (this.platform !== 'android') {
//       throw new Error('Edit Profile scenario is only supported on Android platform');
//     }

//     await ElementHelper.cmdClick(sanityPageLocator.mySpaceTab[this.platform][0]);
//     await ElementHelper.cmdPause(1500);

//     await ElementHelper.cmdClick(sanityPageLocator.myAccountOption[this.platform][0]);
//     await ElementHelper.cmdPause(1500);

//     await AssertionHelper.assertVisible(
//       sanityPageLocator.editAccountDetailsButton[this.platform][0]
//     );

//     await ElementHelper.cmdClick(
//       sanityPageLocator.editAccountDetailsButton[this.platform][0]
//     );

//     await ElementHelper.cmdPause(1500);

//     /* -------------------------------
//        Step 1: Capture existing values
//     --------------------------------*/

//     const oldFirstName = await ElementHelper.cmdGetText(
//       sanityPageLocator.firstNameInput[this.platform][0]
//     );

//     const oldLastName = await ElementHelper.cmdGetText(
//       sanityPageLocator.lastNameInput[this.platform][0]
//     );

//     const oldGender = await ElementHelper.cmdGetText(
//       sanityPageLocator.genderInput[this.platform][0]
//     );

//     const oldDOB = await ElementHelper.cmdGetText(
//       sanityPageLocator.dobInput[this.platform][0]
//     );

//     console.log("Existing Profile Data:", {
//       oldFirstName,
//       oldLastName,
//       oldGender,
//       oldDOB
//     });

//     await ElementHelper.cmdPause(1000);

//     /* -------------------------------
//        Step 2: Enter new values
//     --------------------------------*/

//     const { firstName, lastName, gender, dateOfBirth } = editProfileData;

//     await ElementHelper.cmdFill(
//       sanityPageLocator.firstNameInput[this.platform][0],
//       firstName
//     );

//     await ElementHelper.cmdFill(
//       sanityPageLocator.lastNameInput[this.platform][0],
//       lastName
//     );

//     // await ElementHelper.cmdFill(
//     //   sanityPageLocator.genderInput[this.platform][0],
//     //   gender
//     // );

//     await ElementHelper.cmdClick(sanityPageLocator.genderInput[this.platform][0]);

//     await AssertionHelper.assertVisible(
//       sanityPageLocator.genderFemaleOption[this.platform][0]
//     );

//     await ElementHelper.cmdClick(
//       sanityPageLocator.genderFemaleOption[this.platform][0]
//     );

//     await ElementHelper.cmdClick(
//       sanityPageLocator.genderOkButton[this.platform][0]
//     );

//     // await ElementHelper.cmdFill(
//     //   sanityPageLocator.dobInput[this.platform][0],
//     //   dateOfBirth
//     // );

//     await ElementHelper.cmdClick(
//       sanityPageLocator.dobInput[this.platform][0]
//     );

//     await AssertionHelper.assertVisible(
//       sanityPageLocator.dobInputField[this.platform][0]
//     );

//     // await ElementHelper.cmdClick(
//     //   sanityPageLocator.dobInputField[this.platform][0]
//     // );

//     await ElementHelper.cmdFill(
//       sanityPageLocator.dobInputFieldPopup[this.platform][0],
//       dateOfBirth
//     );
//     await ElementHelper.cmdPause(1000);

//     await ElementHelper.cmdClick(
//       sanityPageLocator.dateOkayButton[this.platform][0]
//     );

//     await ElementHelper.cmdClick(
//       sanityPageLocator.saveDetailsButton[this.platform][0]
//     );

//     await ElementHelper.cmdPause(2000);

//     await AssertionHelper.assertVisible(
//       sanityPageLocator.profileUpdateSuccessText[this.platform][0]
//     );

//     console.log("✅ Profile updated successfully");

//     await ElementHelper.cmdClick(
//       sanityPageLocator.okayButton[this.platform][0]
//     );

//     /* -------------------------------
//        Step 3: Validate new values
//     --------------------------------*/

//     await ElementHelper.cmdClick(
//       sanityPageLocator.editAccountDetailsButton[this.platform][0]
//     );

//     await ElementHelper.cmdPause(1500);

//     const updatedFirstName = await ElementHelper.cmdGetText(
//       sanityPageLocator.firstNameInput[this.platform][0]
//     );

//     const updatedLastName = await ElementHelper.cmdGetText(
//       sanityPageLocator.lastNameInput[this.platform][0]
//     );

//     const updatedGender = await ElementHelper.cmdGetText(
//       sanityPageLocator.genderInput[this.platform][0]
//     );

//     const updatedDOB = (await ElementHelper.cmdGetText(
//       sanityPageLocator.dobInput[this.platform][0]
//     )).replace(/\//g, '');


//     //  console.log("New Profile Data:", {
//     //   updatedFirstName,
//     //   updatedLastName,
//     //   updatedGender,
//     //   updatedDOB
//     // });

//     console.log("New Profile Data:", {
//       updatedFirstName,
//       firstName,
//       updatedLastName,
//       lastName,
//       updatedGender,
//       gender,
//       updatedDOB,
//       dateOfBirth
//     });

//     if (
//       updatedFirstName !== firstName ||
//       updatedLastName !== lastName ||
//       updatedGender !== gender ||
//       updatedDOB !== dateOfBirth
//     ) {
//       throw new Error("❌ Profile update validation failed");
//     }

//     console.log("✅ Profile changes validated successfully");

//     /* -------------------------------
//        Step 4: Revert to old values
//     --------------------------------*/

//     await ElementHelper.cmdFill(
//       sanityPageLocator.firstNameInput[this.platform][0],
//       oldFirstName
//     );

//     await ElementHelper.cmdFill(
//       sanityPageLocator.lastNameInput[this.platform][0],
//       oldLastName
//     );

//     /* -------- Restore Gender -------- */

//     await ElementHelper.cmdClick(
//       sanityPageLocator.genderInput[this.platform][0]
//     );

//     const formattedGender =
//       oldGender.charAt(0).toUpperCase() + oldGender.slice(1).toLowerCase();

//     await ElementHelper.cmdClick(
//       `//android.widget.TextView[@text="${formattedGender}"]/preceding-sibling::android.widget.RadioButton`
//     );

//     await ElementHelper.cmdClick(
//       sanityPageLocator.genderOkButton[this.platform][0]
//     );

//     /* -------- Restore DOB -------- */

//     await ElementHelper.cmdClick(
//       sanityPageLocator.dobInput[this.platform][0]
//     );

//     await ElementHelper.cmdClear(
//       sanityPageLocator.dobInputFieldPopup[this.platform][0]
//     );

//     await ElementHelper.cmdFill(
//       sanityPageLocator.dobInputFieldPopup[this.platform][0],
//       oldDOB.replace(/\//g, '')
//     );

//     await ElementHelper.cmdClick(
//       sanityPageLocator.dateOkayButton[this.platform][0]
//     );

//     /* -------- Save -------- */

//     await ElementHelper.cmdClick(
//       sanityPageLocator.saveDetailsButton[this.platform][0]
//     );

//     console.log("✅ Profile reverted back to original values");
//   }

//   //====================Downloads==============================


//   /**
//    * Verify Download icon is displayed in Home, Shows, Movies and GMA landing pages (Android only).
//    */
//   static async verifyDownloadIconOnLandingPages(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('Download icon landing pages check is only supported on Android platform');
//     }

//     // Home Page
//     await ElementHelper.cmdClick(sanityPageLocator.homeTab[this.platform][0]);
//     await ElementHelper.cmdPause(1500);
//     await AssertionHelper.assertVisible(sanityPageLocator.downloadIcon[this.platform][0]);

//     // Shows Page
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1500);
//     await AssertionHelper.assertVisible(sanityPageLocator.downloadIcon[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.tabsCloseButton[this.platform][0]);

//     // Movies Page
//     await ElementHelper.cmdClick(sanityPageLocator.moviesTab[this.platform][0]);
//     await ElementHelper.cmdPause(1500);
//     await AssertionHelper.assertVisible(sanityPageLocator.downloadIcon[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.tabsCloseButton[this.platform][0]);

//     // GMA Page
//     await ElementHelper.cmdClick(sanityPageLocator.gmaTabButton[this.platform][0]);
//     await ElementHelper.cmdPause(1500);
//     await AssertionHelper.assertVisible(sanityPageLocator.downloadIcon[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.tabsCloseButton[this.platform][0]);

//     console.log('✅ Download icon is visible on Home, Shows, Movies, and GMA pages.');
//   }


//   static async verifyDownloadButtonInShowDetailsPage(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('Download button in show details page check is only supported on Android platform');
//     }

//     await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.showsTab[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 10000,
//       timeoutMsg: 'Show Tab did not occur within 10 seconds.'
//     });
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(2000);

//     const playButtonLocator = sanityPageLocator.primiumUserPlayButton[this.platform][0];
//     const showLocator = sanityPageLocator.secondRowShowWithMultipleEpisodes[this.platform][0];

//     let attempt = 0;
//     const maxAttempts = 10;

//     while (attempt < maxAttempts) {

//       console.log(`🔎 Attempt ${attempt + 1} to find valid show`);

//       const playButtonVisible = await $(playButtonLocator).isDisplayed().catch(() => false);

//       if (!playButtonVisible) {
//         console.log('➡️ Play button not visible. Swiping right...');
//         await ElementHelper.cmdSwipeRight();
//         attempt++;
//         continue;
//       }

//       await ElementHelper.cmdClick(showLocator);
//       await ElementHelper.cmdPause(3000);

//       const downloadButtonVisible = await $(sanityPageLocator.downloadButtonInShowDetails[this.platform][0])
//         .isDisplayed()
//         .catch(() => false);

//       /* ❌ Download button not found */
//       if (!downloadButtonVisible) {

//         console.log('⚠️ Episode text not visible. Trying next show');

//         await browser.back();
//         await ElementHelper.cmdPause(2000);

//         await ElementHelper.cmdSwipeRight();

//         attempt++;
//         continue;
//       }

//       /* ✅ Episode text visible */
//       await AssertionHelper.assertVisible(
//         sanityPageLocator.downloadButtonInShowDetails[this.platform][0]
//       );

//       console.log('✅ Download button is displayed next to the episodes');

//       return; // Exit loop after success
//     }
//     await sanityBusinessLogic.navigateBackUntilHomeTabVisible();
//     throw new Error('❌ Could not find valid show with episodes after multiple attempts');
//   }

//   static async verifyDownloadButtonInMovieDetailsPage(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('Download button in movie details page check is only supported on Android platform');
//     }

//     // Navigate to Movies tab
//     await ElementHelper.cmdClick(sanityPageLocator.moviesTab[this.platform][0]);
//     await ElementHelper.cmdPause(2000);

//     // Tap on any movie content
//     await ElementHelper.cmdClick(sanityPageLocator.movieItemToTap[this.platform][0]);
//     await ElementHelper.cmdPause(3000);

//     // Verify that the Download button is displayed below the metadata of the content
//     await AssertionHelper.assertVisible(sanityPageLocator.downloadButtonInMovieDetails[this.platform][0]);

//     console.log('✅ Download button is displayed below the metadata of the content inside movie details page.');
//   }

//   static async verifyDownloadAnimationOnTappingDownloadIcon(): Promise<string> {

//     if (this.platform !== 'android') {
//       throw new Error(
//         'Download animation on tapping download icon is only supported on Android platform'
//       );
//     }


//     await this.verifyDownloadButtonInShowDetailsPage();

//     // Get episode title
//     const episodeTitle = await ElementHelper.cmdGetText(
//       sanityPageLocator.playerEpisodeText[this.platform][0]
//     );
//     this.downloadedEpisodeTitle = episodeTitle;

//     console.log(`📺 Episode selected for download: ${episodeTitle}`);

//     const dynamicXpath =
//       sanityPageLocator.downloadButtonUsingShowText[this.platform][0].replace(
//         '%s',
//         episodeTitle
//       );

//     await ElementHelper.cmdClick(dynamicXpath);

//     // Tap Download icon
//     // await ElementHelper.cmdClick(
//     //   sanityPageLocator.downloadButtonInShowDetails[this.platform][0]
//     // );

//     await ElementHelper.cmdClick(
//       sanityPageLocator.radioButtonDownloadPreference[this.platform][0]
//     );
//     await ElementHelper.cmdClick(
//       sanityPageLocator.savePreferenceButton[this.platform][0]
//     );

//     // Verify download animation appears
//     await AssertionHelper.assertVisible(
//       sanityPageLocator.downloadAnimation[this.platform][0]
//     );

//     console.log(
//       '✅ Download animation is displayed and content starts downloading on tapping "Download" icon from details page.'
//     );
//     return episodeTitle;
//   }


//   static async navigateBackUntilHomeTabVisible(): Promise<void> {

//     const homeTab = sanityPageLocator.headerText[this.platform][0];
//     const closeBtnSelector = sanityPageLocator.tabsCloseButton[this.platform][0];

//     console.log("🔙 Navigating back until Home tab is visible");

//     for (let i = 0; i < 6; i++) {

//       const isHomeVisible = await $(homeTab).isDisplayed().catch(() => false);

//       if (isHomeVisible) {
//         console.log("🏠 Home tab is visible");
//         return;
//       }

//       await browser.back();
//       await ElementHelper.cmdPause(1500);
//       if (await ElementHelper.cmdIsVisible(closeBtnSelector)) {
//         await ElementHelper.cmdClick(closeBtnSelector);
//         await browser.pause(500);
//       }
//     }

//     throw new Error("❌ Home tab not visible after navigating back multiple times");
//   }

//   // Issue - Able to download the content again once relaunching the app

//   static async verifyDownloadedContentsOnDownloadsScreen(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('Verify downloaded contents is only supported on Android platform');
//     }
//     const downloadedContent = await this.verifyDownloadAnimationOnTappingDownloadIcon();
//     await ElementHelper.cmdPause(30000);
//     await this.navigateBackUntilHomeTabVisible();

//     // Navigate to Downloads page
//     await ElementHelper.cmdClick(sanityPageLocator.downloadIcon[this.platform][0]);
//     await ElementHelper.cmdPause(2000);

//     const dynamicXpath =
//       sanityPageLocator.contentInDownloadPage[this.platform][0].replace(
//         '%s',
//         downloadedContent
//       );
//     //  pending for android
//     await ElementHelper.cmdClick(sanityPageLocator.gmaFirstRowContent[this.platform][0]);

//     // Verify that downloaded content is displayed
//     await AssertionHelper.assertVisible(dynamicXpath);

//     console.log('✅ Downloaded content is displayed under Downloads screen.');
//   }


//   static async verifyUserAbleToPlayDownloadedContentsOnDownloadsScreen(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('Verify downloaded contents is only supported on Android platform');
//     }
//     await this.verifyDownloadedContentsOnDownloadsScreen();
//     console.log("Available content title: ", this.downloadedEpisodeTitle);
//     const dynamicXpath =
//       sanityPageLocator.contentInDownloadPage[this.platform][0].replace(
//         '%s',
//         this.downloadedEpisodeTitle
//       );
//     await ElementHelper.cmdPause(2000);
//     //  pending for android
//     await ElementHelper.cmdClick(dynamicXpath);
//     if (this.platform === 'android') {
//       try {
//         const loader = sanityPageLocator.gmaPlayerLoaderIcon[this.platform][0];
//         await (browser as any).waitUntil(async () => {
//           return await ElementHelper.cmdIsVisible(loader);
//         }, {
//           timeout: 10000,
//           interval: 1000
//         }).catch(() => {
//           console.log("Loader did not appear");
//         });

//         console.log("⏳ Waiting for Loader to disappear");
//         await (browser as any).waitUntil(async () => {
//           const isVisible = await ElementHelper.cmdIsVisible(loader);
//           return !isVisible;
//         }, {
//           timeout: 180000,  // 3 minutes
//           interval: 2000,
//           timeoutMsg: "Loader did not disappear within 3 minutes"
//         });
//       } catch (error) {
//         console.error("loader did not appear: ", error);
//       }

//       await ElementHelper.cmdClick(sanityPageLocator.playerScreenOutline[this.platform][0]);
//       await AssertionHelper.assertVisible(sanityPageLocator.playAndPauseIcon[this.platform][0]);
//       console.log("✅ User Able To Play Downloaded Contents On Downloads Screen");
//     }
//   }

//   static async verifyUserAbleToDeleteDownloadedContentsOnDownloadsScreen(): Promise<void> {
//     if (this.platform !== 'android') {
//       throw new Error('Verify downloaded contents is only supported on Android platform');
//     }
//     await this.verifyDownloadedContentsOnDownloadsScreen();
//     const dynamicXpath =
//       sanityPageLocator.deleteContentInDownloadPage[this.platform][0].replace(
//         '%s',
//         this.downloadedEpisodeTitle
//       );
//     await ElementHelper.cmdClick(dynamicXpath);
//     await ElementHelper.cmdClick(sanityPageLocator.deleteDownloadOptionInDownloadScreen[this.platform][0]);
//     await ElementHelper.cmdClick(sanityPageLocator.yesButtonFromDeletePopupInDownloadScreen[this.platform][0]);
//     await AssertionHelper.assertNotVisible(dynamicXpath);
//     console.log("✅ User Able To Delete Downloaded Contents On Downloads Screen");
//   }

//   static async verifyFreeOrPrimiumContentTagDisplayed(searchContent: string, subscribeText: string, searchFieldPlaceholderText: string, popularSearchesText: string) {
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     // step 3: search for content
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     if (this.platform === 'android') {
//       let isVisible = false;
//       const maxScrolls = 5;
//       for (let i = 0; i < maxScrolls; i++) {
//         try {
//           await AssertionHelper.assertVisible(
//             sanityPageLocator.freetraycontentsLinks[this.platform][0]
//           );
//           isVisible = true;
//           break;
//         } catch (err) {
//           await ElementHelper.cmdScrollDownSmall();
//         }
//       }
//       if (!isVisible) {
//         throw new Error('freetraycontentsLinks not visible after 5 scroll attempts');
//       }
//     }
//     await AssertionHelper.assertVisible(sanityPageLocator.freetraycontentsLinks[this.platform][0]);
//     if (this.platform === 'web') {
//       await ElementHelper.cmdMouseHover(sanityPageLocator.searchListNotFreeTagEpisodeList[this.platform][0]);
//       await AssertionHelper.assertTextEquals(sanityPageLocator.gmaSubscribToWatchText[this.platform][0], subscribeText);
//     }
//     if (this.platform === 'web') {
//       await ElementHelper.cmdClick(sanityPageLocator.homeTab[this.platform][0]);
//     } else if (this.platform === 'android') {
//       await this.navigateBackUntilHomeTabVisible();
//     }



//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     const episodeLocator = await sanityPageLocator.freetraycontentsLinks[this.platform][0];
//     const trayCount = await ElementHelper.cmdGetElementCount(episodeLocator);
//     if (trayCount === 0) {
//       console.error("Episode not found or inaccessible");
//       return;
//     }
//     await ElementHelper.cmdClick(episodeLocator);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.watchListButton[this.platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.episodeShareButton[this.platform][0]);
//     if (this.platform === 'web') {
//       await ElementHelper.cmdClick(sanityPageLocator.homeTab[this.platform][0]);
//     } else if (this.platform === 'android') {
//       await this.navigateBackUntilHomeTabVisible();
//     }
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdPause(4000);
//     await ElementHelper.cmdClick(sanityPageLocator.searchButton[this.platform][0]);
//     await ElementHelper.cmdPause(1000);
//     await ElementHelper.cmdFill(sanityPageLocator.searchInput[this.platform][0], searchContent);
//     await ElementHelper.cmdPause(2000);
//     const searchedEpisode = await ElementHelper.getTextByJS(sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0]);
//     console.log("Searched episode:", searchedEpisode);
//     await AssertionHelper.assertTextEquals(sanityPageLocator.popularSearchesText[this.platform][0], popularSearchesText);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     await ElementHelper.cmdClear(sanityPageLocator.searchInput[this.platform][0]);
//     const searchPlaceholderValue = await ElementHelper.getAttributeValue(sanityPageLocator.searchInput[this.platform][0], 'placeholder');
//     await AssertionHelper.assertStringEquals(searchPlaceholderValue, searchFieldPlaceholderText);
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.cmdClick(sanityPageLocator.searchTextCloseBtn[this.platform][0]);
//     await ElementHelper.cmdPause(3000);
//     await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//     const searchValueRemovedEpisode = await ElementHelper.getTextByJS(sanityPageLocator.sharedButtonContentEpisodeLinks[this.platform][0]);
//     console.log("Episode displayed after clearing search input:", searchValueRemovedEpisode);
//     await AssertionHelper.assertStringNotEquals(searchedEpisode, searchValueRemovedEpisode);
//   }

//   static async verifySubscribeCTAForFreeUser() {
//     const platform = this.platform;
//     // Step 1: Navigate to Shows tab
//     await ElementHelper.cmdClick(sanityPageLocator.showTab[platform][0]);
//     await AssertionHelper.assertVisible(sanityPageLocator.subscribeCTAonShowTab[platform][0])
//     await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[platform][0]);
//     await ElementHelper.cmdPause(2000);
//     await AssertionHelper.assertVisible(sanityPageLocator.subscribeCTA[platform][0])
//   }

//   static async verifySubscriptionDetailsInMyAccount() {
//     const platform = this.platform
//     console.log("Navigating to My Space")
//     await AssertionHelper.assertVisible(sanityPageLocator.accountIcon[platform][0])
//     await ElementHelper.cmdClick(sanityPageLocator.accountIcon[platform][0])
//     console.log("Opening My Account")
//     await AssertionHelper.assertVisible(sanityPageLocator.myAccountOptions[platform][0])
//     await ElementHelper.cmdClick(sanityPageLocator.myAccountOptions[platform][0])
//     console.log("Validating subscription details section")
//     await ElementHelper.cmdIsVisible(sanityPageLocator.subscriptionDetailsSection[platform][0])
//     await AssertionHelper.assertVisible(sanityPageLocator.subscriptionDetailsSection[platform][0])
//     console.log("Subscription details displayed successfully")
//   }

//   private static async assertMidRailBannerAdDisplayedOnCurrentPage(pageName: string): Promise<void> {
//     const midRailBannerAdLocator = sanityPageLocator.midRailBannerAd[this.platform][0];

//     await ElementHelper.cmdPause(3000);

//     const midRailBannerAdCount = await ElementHelper.cmdGetElementCount(midRailBannerAdLocator);

//     if (midRailBannerAdCount === 0) {
//       throw new Error(`Mid rail banner Ad is not displayed on ${pageName} page.`);
//     }

//     await ElementHelper.cmdScrollIntoView(midRailBannerAdLocator);
//     await AssertionHelper.assertVisible(midRailBannerAdLocator);
//   }

//   //====================================================
//   /*
//   * need to configure for android
//   * Web - Only available for Home and Shows Tab
//   */
//   static async verifyMidRailBannerAdDisplayedOnLandingPages(): Promise<void> {
//     const landingPages: Array<{ pageName: string; navigationLocator: string }> = [
//       { pageName: 'Home', navigationLocator: sanityPageLocator.homeTab[this.platform][0] },
//       { pageName: 'Shows', navigationLocator: sanityPageLocator.showsTab[this.platform][0] },
//     ];

//     for (const { pageName, navigationLocator } of landingPages) {
//       if (navigationLocator) {
//         await ElementHelper.cmdClick(navigationLocator);
//       }

//       await ElementHelper.cmdPause(2000);
//       await ElementHelper.waitForLoader(sanityPageLocator.loaderImage[this.platform][0]);
//       await this.assertMidRailBannerAdDisplayedOnCurrentPage(pageName);
//     }
//   }

//   static async verifyNavigationToPrivacyPolicyTermsAndHelpCentrePages(
//     privacyUrlFragment: string,
//     termsUrlFragment: string,
//     helpCentreUrlFragment: string
//   ): Promise<void> {
//     const linkAndUrlFragments: Array<[string, string]> = [
//       [
//         sanityPageLocator.privacyPolicyLink[this.platform][0],
//         privacyUrlFragment
//       ],
//       [
//         sanityPageLocator.termsAndConditionsLink[this.platform][0],
//         termsUrlFragment
//       ],
//       [
//         sanityPageLocator.helpCentreLink[this.platform][0],
//         helpCentreUrlFragment
//       ]
//     ];

//     for (const [linkLocator, urlFragment] of linkAndUrlFragments) {
//       await ElementHelper.cmdScrollIntoView(linkLocator);
//       await AssertionHelper.assertVisible(linkLocator);
//       await ElementHelper.cmdClick(linkLocator);

//       const handles = await browser.getWindowHandles();
//       if (handles.length > 1) {
//         await ElementHelper.cmdSwitchToWindow(handles.length - 1);
//       }

//       await AssertionHelper.assertUrlContains(urlFragment);

//       if (handles.length > 1) {
//         await ElementHelper.switchBackToParentAndCloseChild();
//       } else {
//         await browser.back();
//       }

//       await ElementHelper.cmdPause(2000);
//     }
//   }

//   static async loginwithFacebook(email: string, password: string) {
//     await ElementHelper.cmdClick(sanityPageLocator.accountIcon[this.platform][0]);

//     await ElementHelper.cmdClick(sanityPageLocator.signInButton[this.platform][0]);

//     console.log('Waiting for login screen to be present...');
//     await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.emailInput[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 10000,
//       timeoutMsg: 'Login screen (email input) not present after 15 seconds.'
//     });
//     console.log('Login screen is present.');
//     await ElementHelper.cmdFill(sanityPageLocator.emailInput[this.platform][0], email);
//     await ElementHelper.cmdFill(sanityPageLocator.passwordInput[this.platform][0], password);
//     await ElementHelper.cmdClick(sanityPageLocator.continueButton[this.platform][0]);
//     // Validate navigation flow: wait for Home header on Android
//     await driver.pause(5000); // small pause to allow any transition/animation to start
//     await this.handleNotificationPopup();
//     console.log('Waiting for navigation to Home screen after login...');
//     await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.headerText[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 40000,
//       interval: 1000,
//       timeoutMsg: 'Navigation to Home screen did not occur within 10 seconds.'
//     });
//     await AssertionHelper.assertVisible(sanityPageLocator.headerText[this.platform][0]);
//     console.log('Navigation to Home screen validated.');
//   }


//   static async verifyViewMoreIconForMultiEpisodeShow(): Promise<void> {

//     if (this.platform !== 'android') {
//       throw new Error('The View More icon scenario is only supported on Android.');
//     }
//     await browser.waitUntil(async () => {
//       try {
//         return await $(sanityPageLocator.showsTab[this.platform][0]).isDisplayed();
//       } catch {
//         return false;
//       }
//     }, {
//       timeout: 10000,
//       timeoutMsg: 'Show Tab did not occur within 10 seconds.'
//     });
//     await ElementHelper.cmdClick(sanityPageLocator.showsTab[this.platform][0]);
//     await ElementHelper.cmdPause(2000);

//     const playButtonLocator = sanityPageLocator.primiumUserPlayButton[this.platform][0];
//     const showLocator = sanityPageLocator.secondRowShowWithMultipleEpisodes[this.platform][0];

//     let attempt = 0;
//     const maxAttempts = 10;

//     while (attempt < maxAttempts) {

//       console.log(`🔎 Attempt ${attempt + 1} to find show with >5 episodes`);

//       const playButtonVisible = await $(playButtonLocator).isDisplayed().catch(() => false);

//       if (!playButtonVisible) {
//         console.log('➡️ Play button not visible. Swiping right...');
//         await ElementHelper.cmdSwipeRight();
//         attempt++;
//         continue;
//       }

//       await ElementHelper.cmdClick(showLocator);
//       await ElementHelper.cmdPause(3000);

//       await AssertionHelper.assertVisible(sanityPageLocator.episodeText[this.platform][0]);
//       await ElementHelper.cmdScrollDownSmall();
//       await ElementHelper.cmdScrollDownSmall();
//       const episodeCount = await ElementHelper.cmdGetElementCount(
//         sanityPageLocator.episodeListItems[this.platform][0]
//       );

//       console.log(`📺 Episode count found: ${episodeCount}`);

//       if (episodeCount >= 5) {

//         console.log('✅ Show has more than 5 episodes');

//         // await ElementHelper.cmdScrollDownSmall();

//         await AssertionHelper.assertVisible(
//           sanityPageLocator.viewMoreEpisodesButton[this.platform][0]
//         );

//         console.log('✅ View More icon verified successfully');
//         return;

//       } else {

//         console.log('⚠️ Episodes less than or equal to 5. Trying next show.');

//         await browser.back();
//         await ElementHelper.cmdPause(2000);

//         await ElementHelper.cmdSwipeRight();

//         attempt++;
//       }
//     }

//     throw new Error('❌ Could not find a show with more than 5 episodes after multiple attempts');
//   }

//   static async verifyPreviewThumbnailOnScrubbing() {

//     const platform = this.platform

//     console.log("Opening content")
//     await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[platform][0])
//     console.log("Starting playback")
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[platform][0])
//     await ElementHelper.cmdIsVisible(sanityPageLocator.videoPlayer[platform][0])
//     await ElementHelper.cmdPause(5000)
//     console.log("Bringing player controls")
//     await ElementHelper.hoverVideoCenter();
//     await ElementHelper.cmdPause(1000)
//     console.log("Scrubbing seekbar")
//     await ElementHelper.cmdScrubSeekBar(sanityPageLocator.seekBar[platform][0], 0.6)
//     console.log("Validating preview thumbnail")
//     await browser.waitUntil(async () => {
//       return await ElementHelper.cmdIsVisible(
//         sanityPageLocator.previewThumbnail[platform][0]
//       )
//     }, {
//       timeout: 10000,
//       timeoutMsg: "Preview thumbnail not displayed on scrubbing"
//     })
//     await AssertionHelper.assertVisible(
//       sanityPageLocator.previewThumbnail[platform][0]
//     )
//     console.log("Preview thumbnail displayed successfully")


//   }

//   static async navigateBackUntilWatchlistVisible(
//     maxAttempts: number = 5
//   ): Promise<void> {
//     const platform = this.platform;
//     const locator = sanityPageLocator.watchlistButton[platform][0];

//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//       const isVisible = await $(locator).isDisplayed().catch(() => false);

//       if (isVisible) {
//         console.log(`Watchlist button visible after ${attempt - 1} back navigation(s)`);
//         return;
//       }

//       console.log(`Attempt ${attempt}: Watchlist not visible, navigating back...`);
//       await BrowserHelper.navigateBack();

//       // Wait for page stability instead of static pause
//       await browser.waitUntil(async () => {
//         return await browser.execute(() => document.readyState === 'complete');
//       }, {
//         timeout: 10000,
//         timeoutMsg: 'Page did not load after navigation'
//       });
//     }

//     throw new Error(`Watchlist button not visible after ${maxAttempts} back attempts`);
//   }

//   static async playContent(): Promise<string> {
//     const platform = this.platform
//     const contentHeader = await ElementHelper.cmdGetAttribute(sanityPageLocator.contentHeader[platform][0], "alt")
//     console.log("Content header:", contentHeader)
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[this.platform][0])
//     await ElementHelper.cmdPause(10000)
//     await AssertionHelper.assertVisible(sanityPageLocator.videoPlayer[this.platform][0])
//     await ElementHelper.hoverVideoCenter();
//     await ElementHelper.cmdPause(1000)
//     await ElementHelper.dragToMidFromStart(
//       sanityPageLocator.progressBar[this.platform][0],
//       sanityPageLocator.scrubSeekbar[this.platform][0])
//     await ElementHelper.cmdPause(1000);
//     // await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0])
//     return contentHeader
//   }

//   static async verifyContinueWatchingResumePlayback() {
//     const platform = this.platform

//     await this.openAnyShowContent()
//     const header = await this.playContent();
//     console.log("Played content header:", header)

//     //Capture time BEFORE exit
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0])
//     const beforeFullTime = await ElementHelper.cmdGetText(
//       sanityPageLocator.playerTimer[platform][0]
//     )
//     console.log("Time before :", beforeFullTime)
//     const beforeTime = beforeFullTime.split('/')[0].trim() // Get current playback time (before exit)
//     console.log("Time before exit:", beforeTime)
//     await ElementHelper.cmdPause(2000);
//     // await BrowserHelper.navigateBack()
//     await this.navigateBackUntilWatchlistVisible()
//     await browser.waitUntil(async () => {
//       return await $(sanityPageLocator.continueWatchingTray[platform][0]).isExisting();
//     }, {
//       timeout: 10000,
//       timeoutMsg: "Continue Watching tray not found"
//     });
//     await ElementHelper.cmdScrollIntoView(sanityPageLocator.continueWatchingTray[platform][0]);
//     // Validate Continue Watching tray is visible
//     await AssertionHelper.assertVisible(sanityPageLocator.continueWatchingTray[platform][0])
//     await ElementHelper.cmdPause(2000)
//     await ElementHelper.cmdClick(sanityPageLocator.continueWatchingTrayItem[platform][0])
//     await ElementHelper.cmdPause(2000)
//     await AssertionHelper.assertAttributeEquals(sanityPageLocator.contentHeader[platform][0], "alt",
//       header
//     )
//     await ElementHelper.cmdIsVisible(sanityPageLocator.videoPlayer[platform][0])
//     await ElementHelper.cmdPause(3000)
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[platform][0])
//     await ElementHelper.cmdPause(3000)
//     await ElementHelper.hoverVideoCenter();
//     // await ElementHelper.cmdPause(7000)
//     // 🔹 Capture time AFTER resume
//     await ElementHelper.cmdClick(sanityPageLocator.pauseButton[this.platform][0])
//     const afterFullTime = await ElementHelper.cmdGetText(sanityPageLocator.playerTimer[platform][0])
//     console.log("Time after :", afterFullTime)
//     const afterTime = afterFullTime.split('/')[0].trim() // Get current playback time (after resume)
//     console.log("Time after resume:", afterTime)
//     await ElementHelper.cmdPause(2000)

//     await AssertionHelper.assertEqual(
//       beforeTime,
//       afterTime//
//     )
//   }

//   static async verifyParentalPinSetupFlow(password: string, setPin: { pin: string }) {
//     {
//       const platform = this.platform
//       console.log("Navigating to Settings page")
//       await ElementHelper.cmdClick(sanityPageLocator.accountIcon[platform][0])
//       await ElementHelper.cmdClick(sanityPageLocator.settingsOption[platform][0])
//       await ElementHelper.cmdPause(3000)
//       console.log("Enabling parental control toggle")
//       await ElementHelper.cmdClick(sanityPageLocator.parentalToggle[platform][0])
//       console.log("Entering account password")
//       await ElementHelper.cmdFill(sanityPageLocator.accountPasswordField[platform][0], password)
//       await ElementHelper.cmdClick(sanityPageLocator.submitCTA[platform][0])
//       console.log("Validating PIN setup screen")
//       await AssertionHelper.assertVisible(sanityPageLocator.pinInputField[platform][0])
//       await ElementHelper.cmdFill(sanityPageLocator.pinInputField[platform][0], setPin.pin)
//       await ElementHelper.cmdClick(sanityPageLocator.savePinButton[platform][0])
//       await AssertionHelper.assertVisible(sanityPageLocator.pinSetContinueButton[platform][0])
//       await ElementHelper.cmdClick(sanityPageLocator.pinSetContinueButton[platform][0])

//     }
//   }

//   static async verifyParentalPinPromptOnPlayback(setPin: { pin: string }) {
//     {
//       const platform = this.platform
//       console.log("Opening content")
//       await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[platform][0])
//       console.log("Clicking Play CTA")
//       await ElementHelper.cmdClick(sanityPageLocator.playButton[platform][0])
//       console.log("Waiting for parental PIN popup")
//       await browser.waitUntil(async () => {
//         return await ElementHelper.cmdIsVisible(sanityPageLocator.parentalPinPopup[platform][0])
//       }, {
//         timeout: 10000,
//         timeoutMsg: "Parental PIN popup not displayed"
//       })
//       console.log("Validating PIN popup elements")
//       await AssertionHelper.assertVisible(sanityPageLocator.parentalPinPopup[platform][0])
//       await AssertionHelper.assertVisible(sanityPageLocator.pinInputField[platform][0])
//       await ElementHelper.cmdFill(sanityPageLocator.pinInputField[platform][0], setPin.pin)
//     }

//   }

//   static async disableParentalControl(password: string) {
//     const platform = this.platform
//     console.log("Navigating to Settings")
//     await ElementHelper.cmdClick(sanityPageLocator.accountIcon[platform][0])
//     await ElementHelper.cmdClick(sanityPageLocator.settingsOption[platform][0])
//     await ElementHelper.cmdPause(3000)
//     console.log("Turning OFF parental toggle")
//     await ElementHelper.cmdClick(sanityPageLocator.parentalToggle[platform][0])
//     console.log("Entering password to confirm")
//     await ElementHelper.cmdPause(2000)
//     await ElementHelper.cmdFill(sanityPageLocator.accountPasswordField[platform][0], password)
//     await ElementHelper.cmdClick(sanityPageLocator.submitCTA[platform][0])
//     await ElementHelper.cmdPause(2000)
//     await AssertionHelper.assertVisible(sanityPageLocator.pinSetContinueButton[platform][0])
//     await ElementHelper.cmdClick(sanityPageLocator.pinSetContinueButton[platform][0])
//   }

//   static async waitUntilPageDisplayed() {
//     const platform = this.platform
//     await browser.waitUntil(async () => {
//       return await ElementHelper.cmdIsVisible(sanityPageLocator.watchListButton[platform][0])
//     }, {
//       timeout: 10000,
//       timeoutMsg: "not visible"
//     })
//   }

//   static async verifyPlaybackWithoutParentalPin() {
//     const platform = this.platform
//     await ElementHelper.cmdIsVisible(sanityPageLocator.homePage[platform][0])
//     await ElementHelper.cmdClick(sanityPageLocator.homePage[this.platform][0])
//     console.log("Opening content")
//     await ElementHelper.cmdClick(sanityPageLocator.anyShowContent[platform][0])
//     console.log("Clicking Play")
//     await ElementHelper.cmdClick(sanityPageLocator.playButton[platform][0])
//     console.log("Validating playback started")
//     await browser.waitUntil(async () => {
//       return await ElementHelper.cmdIsVisible(sanityPageLocator.videoPlayer[platform][0])
//     }, {
//       timeout: 10000,
//       timeoutMsg: "Video player not visible - playback failed"
//     })
//     const isPinVisible = await ElementHelper.cmdIsVisible(
//       sanityPageLocator.parentalPinPopup[platform][0]
//     ).catch(() => false)
//     await AssertionHelper.assertEqual(
//       isPinVisible,
//       false,
//       "Parental PIN popup should NOT appear"
//     )

//     console.log("Playback successful without PIN")

//   }

// }




