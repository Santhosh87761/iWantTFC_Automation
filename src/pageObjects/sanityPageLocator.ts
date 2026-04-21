import { Platform } from '../utilities/enum/Platform'

export const sanityPageLocator: Record<string, Record<Platform, string[]>> = {
  seekForwardButton: {
    [Platform.WEB]: ["//button[contains(@aria-label, 'Seek forward') or contains(@class, 'seek-forward')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  seekBackwardButton: {
    [Platform.WEB]: ["//button[contains(@aria-label, 'Seek backward') or contains(@class, 'seek-backward')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  fullscreenButton: {
    [Platform.WEB]: ["//button[contains(@aria-label, 'Full screen') or contains(@class, 'fullscreen')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  subtitleButton: {
    [Platform.WEB]: ["//button[contains(@aria-label, 'Subtitles') or contains(@class, 'subtitle')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  volumeSlider: {
    [Platform.WEB]: ["//input[@type='range' and contains(@aria-label, 'volume')]", "//div[contains(@class, 'volume-slider')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  muteButton: {
    [Platform.WEB]: ["//button[contains(@aria-label, 'Mute') or contains(@class, 'mute')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  unmuteButton: {
    [Platform.WEB]: ["//button[contains(@aria-label, 'Unmute') or contains(@class, 'unmute')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  seekbar: {
    [Platform.WEB]: ["//input[@type='range' and contains(@aria-label, 'seek')]", "//div[contains(@class, 'seekbar') or contains(@class, 'progress-bar')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  accountIcon: {
    [Platform.WEB]: ['[alt="account"]', '[aria-label*="account" i]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  signInButton: {
    [Platform.WEB]: [
      '//img[@alt="Sign In"]',
      '//button[contains(text(), "Sign In")]',
      '//a[contains(text(), "Sign in")]',
      '//a[contains(text(), "Sign In")]',
    ],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  singInContinueBtn: {
    [Platform.WEB]: [
      '//button[text()="Confirm"]',
      '//button[contains(text(), "Continue")]',
      '//a[contains(text(), "Continue")]',
      '//a[contains(text(), "Continue")]',
    ],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  passwordInput: {
    [Platform.WEB]: ['//input[@name="userPassword"]', '[name="password"]', '#password', 'input[placeholder*="password"]', 'input[placeholder*="Password"]'],

    [Platform.ANDROID]: ['//android.widget.EditText[@resource-id="passwordInputField"]'],


    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  successMessage: {
    [Platform.WEB]: ['//div[contains(@class, "toast")]', '//div[contains(@class, "notification")]', '//div[@role="alert"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  palycontrolsBtn: {
    [Platform.WEB]: ["//div[@class='player-special-menu']", '//div[contains(@class, "notification")]', '//div[@role="alert"]'],

    [Platform.ANDROID]: ['(//android.widget.ImageView[@content-desc="App-Icon"])[4]'],
    // 👉 Add Android locators here

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  pauseButtonText: {
    [Platform.WEB]: ["//button[@id='player-container-main-playPauseButton']//span[text()='Pause']", '//div[contains(@class, "notification")]', '//div[@role="alert"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  PlayBtnText: {
    [Platform.WEB]: [//"//p[contains(text(),'Resume') or contains(text(),'Play') ]",
      "//img[@alt='Play']", '//button[@id="player-container-main-playPauseButton"]', '//div[@role="alert"]'],

    [Platform.ANDROID]: ['(//android.widget.ImageView[@content-desc="App-Icon"])[4]'],
    // 👉 Add Android locators here

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  userNameText: {
    [Platform.WEB]: ['//span[@class="font-semibold"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  freetraycontentsLinks: {
    [Platform.WEB]: ['//img[@alt="https://pql-static.iwanttfc.com/static/prod/common/images/monetisation/free.png"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['((//android.widget.ImageView[@content-desc="Start Icon"])/preceding-sibling::android.view.View[@content-desc="App-Image"])[2] | (//android.view.View[@content-desc="App-Image"])[6]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },


  curentEpisodePlayButton: {
    [Platform.WEB]: ["//p[contains(text(),'Resume') or contains(text(),'Play') ]",'//div[@id="Play"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  playButton: {
    [Platform.WEB]: [
    // '//button[@title="Play"]',
    "//p[contains(text(),'Resume') or contains(text(),'Play')]", 
    "//img[@alt='Play']", 
    '//button[@id="player-container-main-playPauseButton"]', '//div[@role="alert"]'],

    [Platform.ANDROID]: ['//android.widget.ScrollView/android.view.View[1]/android.widget.Button'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  nextEpisodeButton: {
    [Platform.WEB]: ['//button[@id="player-container-main-nextButton"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="Next Episode"]'
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  addsTag: {
    [Platform.WEB]: ['//div[@id="ad-ui-overlay"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[contains(@text,"Ad") or contains(@text,"Learn More") or contains(@text,"Download")]'],
    // 👉 Add Android locators here

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  gmaFirstRowContent: {
    [Platform.WEB]: ["//div[@class='rail-container pointer-events-none relative']//child::div[@class='thumbnail relative cursor-pointer outline-none']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.view.View[@content-desc="App-Image"]'],


    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  gmaSubscrionToWatchBtnText: {
    [Platform.WEB]: ["//div[@id='subscribe-to-watch']//p", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  subtitleBtn: {
    [Platform.WEB]: ["//button[@id='player-container-main-subtitleButton']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here  //div[@class='player-track-modal-option player-track-modal-option-active']
    ],
    [Platform.TV]: []
  },

  subtitleEnglishBtn: {
    [Platform.WEB]: ["//span[text()='English (Philippines)']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="English (Philippines)"]'],


    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  subtitleEnglish: {
    [Platform.WEB]: ["//div[@class='shaka-text-container']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here  //button[@class='player-fullscreen-button player-button']
    ],
    [Platform.TV]: []
  },

  maximizeScreenButton: {
    [Platform.WEB]: [
    "//button[contains(@class, 'fullscreen')]", "//button[contains(@aria-label, 'Maximize')]", "//button[contains(@class, 'player-fullscreen-button')]", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['(//android.widget.ImageView[@content-desc="App-Icon"])[3]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  minimizeScreenButton: {
    [Platform.WEB]: [
    "//button[contains(@class, 'fullscreen')]", "//button[contains(@aria-label, 'Minimize')]", "//button[contains(@class, 'player-fullscreen-button')]", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here //button[@id='player-container-main-volumeButton']
    ],
    [Platform.TV]: []
  },

  volumeButton: {
    [Platform.WEB]: ["//button[@id='player-container-main-volumeButton']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  volumeUnmuteButton: {
    [Platform.WEB]: ["//button[contains(@id, 'volumeButton')]", "//button[contains(@aria-label, 'Unmute')]", "//button[@id='player-container-main-volumeButton']", "//button[contains(@class, 'volume')]", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  volumeMuteButton: {
    [Platform.WEB]: ["//button[contains(@id, 'volumeButton')]", "//button[contains(@aria-label, 'Mute')]", "//button[@id='player-container-main-volumeButton']", "//button[contains(@class, 'volume')]", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 //div[@class='player-video-controls player-controls-hidden']
    ],
    [Platform.TV]: []
  },

  midleScreen: {
    [Platform.WEB]: ["//*[@class='player-special-menu']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.FrameLayout[@resource-id="com.absi.tfctv:id/exo_subtitles"]/android.view.View'],


    [Platform.IOS]: [
      // 👉
    ],
    [Platform.TV]: []
  },

  contentFallbackSelectors: {
    [Platform.WEB]: ["//div[contains(@class, 'thumbnail')]", "//div[contains(@class, 'movie-card')]", "//div[contains(@class, 'content-card')]", "//article[contains(@class, 'item')]"],

    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  anyShowWithMultipleEpisodes: {
    [Platform.WEB]: ["//div[contains(@class,'scrollbar-hidden absolute bottom')]//div[@class='thumbnail relative cursor-pointer outline-none']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  episodesList: {
    [Platform.WEB]: ["//div[@class='episodes-list']//child::div[@class='relative']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  secondEpisodesList: {
    [Platform.WEB]: ["(//div[@class='episodes-list']//child::div[@class='relative'])[2]", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  nextEpisodeThumbnail: {
    [Platform.WEB]: ["//img[@class='player-upNextWidget-thumbnail']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  nextEpisodeThumbnailPlayBtn: {
    [Platform.WEB]: ["//img[@class='player-upNextWidget-icon']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here //img[@class='player-upNextWidget-icon']
    ],
    [Platform.TV]: []
  },
  episodeList: {
    [Platform.WEB]: ["//div[@class='episodes-list']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  episode1: {
    [Platform.WEB]: ["//div[@class='episodes-list']//div[@class='relative overflow-hidden'][1]", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  currentEpisodeTitle: {
    [Platform.WEB]: ["//div[@class='episode-title']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  episodeTimeDisplay: {
    [Platform.WEB]: ["//div[@class='time-display']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  searchInput: {
    [Platform.WEB]: ["//input[@placeholder='Search by title, actor, genre...']", "//input[contains(@class, 'search')]", "//input[@type='text']"],
    [Platform.ANDROID]: ['//android.widget.EditText'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  skipOutroButton: {
    [Platform.WEB]: ["//button[@id='player-container-main-skipOutroButton']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  loaderImage: {
    [Platform.WEB]: ["//img[@alt='loader']", "//div[contains(@class, 'loader')]", "//span[contains(@class, 'loader')]"],
    [Platform.ANDROID]: ['//android.view.View[@resource-id="loading"]'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here //button[@class='player-upNextWidget-close-button']
    ],
    [Platform.TV]: []
  },
  nextEpisodeCloseButton: {
    [Platform.WEB]: ["//button[@class='player-upNextWidget-close-button']", "//div[contains(@class, 'loader')]", "//span[contains(@class, 'loader')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  nextEpisodePlayPriviewThumbnail: {
    [Platform.WEB]: ["//div[@class='player-upNextWidget player-upNextWidget-button visible']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here //div[@class='relative w-auto']//img
    ],
    [Platform.TV]: []
  },
  episodeMoreInfoButton: {
    [Platform.WEB]: ["//div[@id='more_info']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here //div[@id='share']
    ],
    [Platform.TV]: []
  },
  toastMsg: {
    [Platform.WEB]: ["//img[@alt='toast-icon']//following-sibling::p", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  signOutButton: {
    [Platform.WEB]: ["//img[@alt='Sign Out']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  premiumContentLinks: {
    [Platform.WEB]: ["(//p[text()='Tatak iWant']/../..//div[@class='thumbnail relative cursor-pointer outline-none'][not(.//img[contains(@src,'free.png') or contains(@alt,'free.png')])])", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  topShowsEpisodes: {
    [Platform.WEB]: ["//p[contains(text(),'Top 10 Shows Outside the Philippines')] /ancestor::div[contains(@class,'rail')] /descendant::div[contains(@class,'thumbnail')]", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  continueToWatchContentText: {
    [Platform.WEB]: ["//p[text()='Continue Watching']/../..//div[@class='thumbnail relative cursor-pointer outline-none']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Continue Watching"]/preceding-sibling::android.view.View/following-sibling::android.view.View[1]/child::android.view.View'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  continueToCloseButton: {
    [Platform.WEB]: ["//img[@alt='remove-from-cw']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  premiumSessionEpisodeList: {
    [Platform.WEB]: ["//div[@class='episodes-list']//div[@class='relative'][not(.//img[contains(@src,'free.png') or contains(@alt,'free.png')])]", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  validSubscriptionPlanText: {
    [Platform.WEB]: ["//main[@class='main-content']//h2", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="A valid subscription is required to view this content. Please subscribe or renew your plan."]'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  subscriptionToWatchText: {
    [Platform.WEB]: ["//div[@id='subscribe-to-watch']//p", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Subscribe"]'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  allContentsLinks: {
    [Platform.WEB]: ["//div[@class='thumbnail relative cursor-pointer outline-none']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  watchListButton: {
    [Platform.WEB]: ["//div[@id='watchlist']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Watchlist"]/preceding-sibling::android.view.View[3]'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  myWatchListTab: {
    [Platform.WEB]: ["//div[@id='my-watchlist']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  episodeBackButton: {
    [Platform.WEB]: ["//button[@id='player-container-main-backButton']//img[@alt='back']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  mouseHoverToEpisode: {
    [Platform.WEB]: ["//div[@class='thumbnail relative cursor-pointer outline-none']//img", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  searchTextCloseBtn: {
    [Platform.WEB]: ["//img[@alt='clear']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  moviesAndShowsText: {
    [Platform.WEB]: ["//main//p[following-sibling::div[contains(@class,'search-suggestions-list')]]", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  topPicksNearYouTextLink: {
    [Platform.WEB]: ["//main[@class='main-content']/div/p[contains(@class,'leading')]", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Top Picks Near You"]'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },


  getEpisodeLinkText: {
    [Platform.WEB]: ["//div[@class='thumbnail relative cursor-pointer outline-none']//p", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  autoSuggestTextList: {
    [Platform.WEB]: ["//div[contains(@class,'pointer-events-auto')]//p", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View[1]/child::android.widget.TextView'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  popularSearchesText: {
    [Platform.WEB]: ["(//div[contains(@class,'search-suggestions-list')]//p)[1]", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  homeTab: {
    [Platform.WEB]: ["//div[@id='home']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Home"]', '//android.widget.Button[@content-desc="Home"]'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  removeWatchListIcon: {
    [Platform.WEB]: ["//img[contains(@alt,'remove')]", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Watchlist"]/preceding-sibling::android.view.View[3]'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  allowButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]'],
    // 👉 Add Android locators her
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  emailInput: {
    [Platform.WEB]: ['//input[@name="userEmail"]', 'input[id="username"]', '//input[@type="email"]', 'input[placeholder*="email"]'],

    [Platform.ANDROID]: ['//android.widget.EditText[@resource-id="userNameInputField"]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  continueButton: {
    [Platform.WEB]: ['//button[@type="submit"]', '//span[contains(text(),"Continue")]', 'button[type="submit"]', '//button[contains(text(),"Sign in")]', '//button[contains(text(), "Login")]'],

    [Platform.ANDROID]: ['//android.view.View[@resource-id="loginButton"]/android.widget.Button'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  palyButton: {
    [Platform.WEB]: [
    // "//p[contains(text(),'Resume') or contains(text(),'Play') ]",
    "//button[@id='player-container-main-playPauseButton']", 
    '//div[contains(@class, "notification")]', 
    '//div[@role="alert"]'],

    [Platform.ANDROID]: ['(//android.widget.ImageView[@content-desc="App-Icon"])[4]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  pauseButton: {
    [Platform.WEB]: ["//img[@alt='Pause']", '//button[@id="player-container-main-playPauseButton"]', '//div[@role="alert"]'],

    [Platform.ANDROID]: ['(//android.widget.ImageView[@content-desc="App-Icon"])[4]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },


  contentPlayTimer: {
    [Platform.WEB]: ['//span[@class="player-time-display"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="/"]/preceding-sibling::android.widget.TextView[3]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },


  showsTab: {
    [Platform.WEB]: ['//div[@id="shows"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Shows"]/following-sibling::android.widget.Button'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  moviesTab: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Movies"]', '//android.widget.Button[@content-desc="Movies"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  gmaTabButton: {
    [Platform.WEB]: ['//div[@id="gma"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="GMA"]/following-sibling::android.widget.Button'],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  downloadIcon: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.ImageView[@content-desc="Downloads"]', '//android.widget.ImageView[@resource-id="download_icon"]', '//android.widget.TextView[@text="Download"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },


  gmaSubscribToWatchText: {
    [Platform.WEB]: ["//div[@id='play']//p", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="Subscribe"]'],


    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  gmaRecentAddedEpisodesList: {
    [Platform.WEB]: ["//div[@class='episodes-list']//div[@class='relative overflow-hidden']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['(//android.view.View[@content-desc="App-Image"])[1]'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  gmaRequiredSubscrionText: {
    [Platform.WEB]: ["//div[@class='flex h-screen flex-col items-center justify-center']//h2", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="A valid GMA Pinoy subscription is required to view this content. Please subscribe or renew your plan."]'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  headerText: {
    [Platform.WEB]: ['//h1', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="Home"]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },


  searchIcon: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['//android.widget.ImageView[@content-desc="Search"]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  searchInputField: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['//android.view.View[@content-desc="Search"]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  searchInputFieldInsertion: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['//android.widget.EditText'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  // Locators used by skip-recap search scenario
  searchButton: {
    [Platform.WEB]: ["//img[@alt='search-icon']", "//button[contains(@aria-label,'Search')]", "//div[contains(@class,'search')]"],
    [Platform.ANDROID]: ['//android.widget.ImageView[@content-desc="Search"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  firstThumbnail: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['(//android.view.View[@content-desc="App-Image"])[1]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  imageTextElement: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['(//android.widget.ImageView[@content-desc="App-Image"])[2]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  watchListButtonInPlayerScreen: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="Watchlist"]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },



  downloadButtonInPlayerScreen: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="Download"]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  playerScreenOutline: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['//android.widget.FrameLayout[@resource-id="com.absi.tfctv:id/exo_subtitles"]/android.view.View'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  questionMarkIconOnAdScreen: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['//android.widget.Button[@text="help_outline_white_24dp_with_3px_trbl_padding"]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  playerScreenView: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['//android.widget.FrameLayout[@resource-id="com.absi.tfctv:id/playerView"]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  playAndPauseIcon: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['(//android.widget.ImageView[@content-desc="App-Icon"])[4]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  gmaButton: {
    [Platform.WEB]: [],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="GMA"]/following-sibling::android.widget.Button'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  gmaPlayButton: {
    [Platform.WEB]: ['//img[@alt="/assets/button_icons/focused/play.svg"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="Play"]/following-sibling::android.widget.Button'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  gmaPlayerLoaderIcon: {
    [Platform.WEB]: ['//img[@alt="/assets/button_icons/focused/play.svg"]', '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.ProgressBar'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  resumeButton: {
    [Platform.WEB]: [''],

    [Platform.ANDROID]: ['//android.widget.TextView[contains(@text,"Resume")]/following-sibling::android.widget.Button'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  skipRecapButton: {
    [Platform.WEB]: ["//button[@id='player-container-main-skipRecapButton']", "//button[contains(text(), 'Skip Recap')]", "//span[text()='Skip Recap']//parent::button", "//button[contains(@aria-label, 'Skip Recap')]"],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="Skip Recap"]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },


  //****************************** */

  primiumUserPlayButton: {
    [Platform.WEB]: ["//div[@id='play']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[contains(@text,"Play") or contains(@text,"Resume")]/following-sibling::android.widget.Button'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  primiumUserTimeDisplay: {
    [Platform.WEB]: ["//div[@class='player-progress-and-time-container']//span[@class='player-time-display']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="/"]/preceding-sibling::android.widget.TextView[3]'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  primiumUserForwardButton: {
    [Platform.WEB]: ["//button[@id='player-container-main-forwardButton']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="/"]/preceding-sibling::android.view.View[2]'],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  primiumUserBackwardButton: {
    [Platform.WEB]: ["//button[@id='player-container-main-rewindButton']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: ['//android.widget.TextView[@text="/"]/preceding-sibling::android.view.View[1]'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉 Add iOS locators here  //div[@class='player-progress-indicator']
    ],
    [Platform.TV]: []
  },

  scrubSeekbar: {
    [Platform.WEB]: ["//div[@class='player-progress-indicator']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      '//android.widget.SeekBar[@resource-id="com.absi.tfctv:id/player_seekbar"]'
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  progressBar: {
    [Platform.WEB]: ["//div[@class='player-progress-container']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],

    [Platform.ANDROID]: [
      '//android.widget.ProgressBar[@resource-id="com.absi.tfctv:id/player_progress"]'
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  settingsIcon: {
    [Platform.WEB]: [''],

    [Platform.ANDROID]: ['(//android.widget.ImageView[@content-desc="App-Icon"])[2]'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉
    ],
    [Platform.TV]: []
  },
  closeIconInSubtitleScreen: {
    [Platform.WEB]: [''],

    [Platform.ANDROID]: ['(//android.widget.ImageView[@content-desc="App-Icon"])[1]'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉
    ],
    [Platform.TV]: []
  },

  showTabSearchedMultipleEpisodes: {
    [Platform.WEB]: ["//*[contains(@class,'main-content')]//div[@class='thumbnail relative cursor-pointer outline-none']", '//h2', '.page-header', '//div[@type="error"]', '[class*="header"]'],
    [Platform.ANDROID]: ['//android.view.View[@content-desc="App-Image"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  // skipIntroButton: {
  //   [Platform.WEB]: ["//button[contains(text(), 'Skip Intro') or contains(@aria-label, 'Skip Intro')]", "//button[@id='skip-intro-button']"],
  //   [Platform.ANDROID]: [
  //     '//android.widget.Button[@text="Skip Intro"]',
  //     '//android.widget.TextView[@text="Skip Intro"]/following-sibling::android.widget.Button'
  //   ],
  //   [Platform.IOS]: [
  //     // 👉 Add iOS locators here
  //   ],
  //   [Platform.TV]: []
  // },

  episodeText: {
    [Platform.WEB]: ["//div[@class='player-title']//span", '//div[contains(@class, "notification")]', '//div[@role="alert"]'],

    [Platform.ANDROID]: [
      '(//android.widget.ScrollView/child::android.widget.TextView)[2]'
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  skipIntroButton: {
    [Platform.WEB]: ["//button[@id='player-container-main-skipIntroButton']", "//button[contains(@class, 'skip')]", "//span[text()='Skip Intro']//parent::button", "//button[contains(@aria-label, 'Skip')]"],

    [Platform.ANDROID]: [
      '//android.widget.Button[@text="Skip Intro"]',
      '//android.widget.TextView[@text="Skip Intro"]/following-sibling::android.widget.Button'
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  secondRowShowWithMultipleEpisodes: {
    [Platform.WEB]: ["(//div[contains(@class,'rail-container pointer-events-none relative')])[1]//child::div[@class='thumbnail relative cursor-pointer outline-none']", '//h2', '.page-header', '//div[@type=\"error\"]', '[class*=\"header\"]'],
    [Platform.ANDROID]: [
      '(//android.view.View[@content-desc="App-Image"])[2]'
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  episodeListItems: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.view.View[@content-desc="App-Image"]/parent::android.view.View/parent::android.view.View'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  viewMoreEpisodesButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="View More"]',
      '//android.widget.Button[@text="View More"]',
      '//android.widget.TextView[contains(@text,"View More")]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  // PiP Mode locators for Android
  pipWindow: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]',
      '//android.widget.FrameLayout[@resource-id="android:id/pip"]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  pipVideoPlayer: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]/android.widget.VideoView',
      '//android.widget.FrameLayout[@resource-id="android:id/pip"]//android.widget.VideoView'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  pipCloseButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton',
      '//android.widget.FrameLayout[@resource-id="android:id/pip"]//android.widget.ImageButton[@content-desc="Close"]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  // Live content locators for Android
  liveTab: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="Live"]',
      '//android.widget.TextView[contains(@text, "Live")]/following-sibling::android.widget.Button'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  liveContent: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '(//android.view.View[@content-desc="App-Image"])[1]',
      '//android.widget.TextView[contains(@text, "LIVE")]/following-sibling::*'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  livePlayerIndicator: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="LIVE"]',
      '//android.widget.TextView[contains(@text, "LIVE")]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  // PiP control locators for Android
  pipPlayPauseButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton[@content-desc="Play"]',
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton[@content-desc="Pause"]',
      '//android.widget.FrameLayout[@resource-id="android:id/pip"]//android.widget.ImageButton'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  pipForwardButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton[@content-desc="Forward"]',
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton[@content-desc="Skip forward"]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  pipRewindButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton[@content-desc="Rewind"]',
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton[@content-desc="Skip backward"]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  pipControlsOverlay: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.LinearLayout',
      '//android.widget.FrameLayout[@resource-id="android:id/pip"]//android.widget.LinearLayout'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  // Live badge in PiP mode
  pipLiveBadge: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.TextView[@text="LIVE"]',
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.TextView[contains(@text, "LIVE")]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  // Fullscreen button in PiP mode
  pipFullscreenButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton[@content-desc="Fullscreen"]',
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton[@content-desc="Expand"]',
      '//android.widget.FrameLayout[contains(@resource-id, "pip")]//android.widget.ImageButton[@content-desc="Maximize"]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  // skipRecapButton: {
  //   [Platform.WEB]: ["//button[@id='player-container-main-skipRecapButton']", "//button[contains(text(), 'Skip Recap')]", "//span[text()='Skip Recap']//parent::button", "//button[contains(@aria-label, 'Skip Recap')]"],
  //   [Platform.ANDROID]: [
  //     // 👉 Add Android locators here
  //   ],
  //   [Platform.IOS]: [
  //     // 👉 Add iOS locators here //input[contains(@placeholder,'Search by title')]
  //   ],
  //   [Platform.TV]: []
  // }

  mySpaceTab: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="My Space"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  myAccountOption: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="My Account"]', '//android.widget.TextView[contains(@text, "Account")]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  editAccountDetailsButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Edit Account Details"]', '//android.widget.Button[@text="Edit Account Details"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  firstNameInput: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['(//android.widget.TextView[@text="Edit Account Details"]/parent::android.widget.ScrollView/child::android.widget.EditText)[1]', '//android.widget.EditText[@content-desc="firstName"]', '//android.widget.EditText[@resource-id="firstName"]', '//android.widget.EditText[contains(@text, "First Name")]', '//android.widget.EditText[contains(@content-desc, "First Name")]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  lastNameInput: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['(//android.widget.TextView[@text="Edit Account Details"]/parent::android.widget.ScrollView/child::android.widget.EditText)[2]', '//android.widget.EditText[@content-desc="lastName"]', '//android.widget.EditText[@resource-id="lastName"]', '//android.widget.EditText[contains(@text, "Last Name")]', '//android.widget.EditText[contains(@content-desc, "Last Name")]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  genderInput: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['(//android.widget.TextView[@text="Edit Account Details"]/parent::android.widget.ScrollView/child::android.widget.EditText)[3]', '//android.widget.EditText[@content-desc="gender"]', '//android.widget.EditText[contains(@text, "Gender")]', '//android.widget.TextView[@text="Gender"]/following-sibling::android.widget.*'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  dobInput: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['(//android.widget.TextView[@text="Edit Account Details"]/parent::android.widget.ScrollView/child::android.widget.EditText)[4]', '//android.widget.EditText[@content-desc="dateOfBirth"]', '//android.widget.EditText[contains(@text, "Date of birth")]', '//android.widget.EditText[contains(@content-desc, "DOB")]', '//android.widget.EditText[contains(@text, "DOB")]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  saveDetailsButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Save Details"]', '//android.widget.Button[@text="Save Details"]', '//android.widget.TextView[contains(@text, "Save") and contains(@text, "Details")]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  profileUpdateSuccessText: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Profile details updated."]', '//android.widget.TextView[contains(@text, "Profile updated")]', '//android.widget.Toast[1]', '//android.widget.TextView[contains(@text, "Details updated")]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  logoutOption: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Log Out"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  logoutConfirmButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['(//android.widget.TextView[@text="Log Out"])[2]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  genderFemaleOption: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Female"]/preceding-sibling::android.widget.RadioButton'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  genderOkButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="OK"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  dobInputField: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.EditText/child::android.widget.TextView'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  dobInputFieldPopup: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.EditText'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  dateOkayButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Okay"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  okayButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Okay"]/following-sibling::android.widget.Button', '//android.widget.TextView[@text="Okay"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  tabsCloseButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: ['//android.view.View[@content-desc="Dismiss Button"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  playerEpisodeText: {
    [Platform.WEB]: ["//div[@class='relative w-auto']//p", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['(//android.view.View[@content-desc="App-Image"])[1]/parent::android.view.View/following-sibling::android.widget.TextView[1]'],
    // 👉 Add Android locators here

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  episodeShareButton: {
    [Platform.WEB]: ["//div[@id='share']//img", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="Share"]/preceding-sibling::android.view.View[position()=5 or position()=4]'
    ],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉 Add iOS locators here //img[@alt='toast-icon']//following-sibling::p
    ],
    [Platform.TV]: []
  },
  episodeSharedToastMsg: {
    [Platform.WEB]: ["//img[@alt='toast-icon']//following-sibling::p", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: [
      // 👉 Add Android locators here
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  sharedButtonContentEpisodeLinks: {
    [Platform.WEB]: ["//div[@class='thumbnail relative cursor-pointer outline-none']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['(//android.view.View[@content-desc="App-Image"])'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  downloadButtonInShowDetails: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '(//android.widget.TextView)[12]/ancestor::android.view.View[1]//android.view.View[@content-desc="App-Icon-Button"]',
      '//android.widget.TextView[@text="Download"]',
      '//android.widget.Button[@text="Download"]',
      '//android.widget.ImageView[@content-desc="Download"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  downloadButtonUsingShowText: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="%s"]/ancestor::android.view.View[1]//android.view.View[@content-desc="App-Icon-Button"]',
      '//android.widget.TextView[@text="%s"]/following-sibling::android.widget.TextView[@text="Download"]',
      '//android.widget.TextView[@text="%s"]/ancestor::android.view.View[1]//*[@content-desc="Download"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  contentInDownloadPage: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="%s"]/ancestor::android.view.View[1]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  movieItemToTap: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.view.View[@content-desc="App-Image"]/parent::android.view.View/parent::android.view.View'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  downloadButtonInMovieDetails: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '(//android.view.View[@content-desc="App-Icon-Button"])[3]',
      '//android.widget.ImageView[@content-desc="Download"]',
      '//android.widget.TextView[@text="Download"]',
      '//android.widget.Button[@text="Download"]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  downloadAnimation: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="Starting download..."]',
      '//android.widget.ProgressBar[@content-desc="Downloading"]',
      '//android.view.View[@content-desc="Download Progress"]',
      '//android.widget.TextView[@text="Downloading..."]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  radioButtonDownloadPreference: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="Good"]/preceding-sibling::android.widget.RadioButton',
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  savePreferenceButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="Save Preference"]',
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  threeDotsInDownloadScreen: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '(//android.widget.ImageView[@content-desc="App-Icon"])[2]',
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  deleteDownloadOptionInDownloadScreen: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="Delete download"]',
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  yesButtonFromDeletePopupInDownloadScreen: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="Yes, Delete"]',
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  deleteContentInDownloadPage: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="%s"]/following-sibling::android.widget.ImageView[@content-desc="App-Icon"][2]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  retryButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//android.widget.TextView[@text="Retry"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  continueToWatchThreeDotsButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '(//android.widget.TextView[@text="Continue Watching"]/preceding-sibling::android.view.View/following-sibling::android.view.View[1]/child::android.view.View/child::android.view.View[2]/following-sibling::android.widget.ImageView[@content-desc="End Icon"])[1]',
      '(//android.widget.TextView[@text="Continue Watching"]/preceding-sibling::android.view.View/following-sibling::android.view.View//android.view.View[@content-desc="App-Icon-Button"])[1]',
      '(//android.widget.TextView[@text="Continue Watching"]/preceding-sibling::android.view.View/following-sibling::android.view.View//android.widget.ImageView[@content-desc="App-Icon"])[1]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  cwTrayAddToWatchlistButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//*[contains(translate(@text,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"),"add to watchlist")]',
      '//*[contains(translate(@content-desc,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"),"add to watchlist")]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  cwTrayRemoveFromWatchlistButton: {
    [Platform.WEB]: [],
    [Platform.ANDROID]: [
      '//*[contains(translate(@text,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"),"remove from watchlist")]',
      '//*[contains(translate(@content-desc,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"),"remove from watchlist")]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  myWatchlistFirstTrayInSettingsPage: {
    [Platform.WEB]: ["//button[@id='player-container-main-backButton']//img[@alt='back']", "//button[contains(text(), 'Skip Outro')]", "//span[text()='Skip Outro']//parent::button", "//button[contains(@aria-label, 'Skip Outro')]"],
    [Platform.ANDROID]: ['(//android.widget.TextView[@text="My Watchlist"]/following-sibling::android.view.View/child::android.view.View)[1]'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  copyOptionInSharePopup: {
    [Platform.WEB]: [""],
    [Platform.ANDROID]: ['//android.widget.Button[@resource-id="android:id/chooser_copy_button"]'],
    // 👉 Add Android locators here
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  anyShowContent: {
    [Platform.WEB]: [
      // '//div[contains(@class,"relative") and contains(@class,"overflow-hidden")]//img[contains(@class,"absolute") and contains(@class,"h-full")]',
      '(//div[contains(@class,"thumbnail")]//img)[1]'],
    [Platform.ANDROID]: [
      '(//android.view.View[@content-desc="App-Image"])[1]',
      '//android.view.View[@content-desc="App-Image"]',
      '(//android.view.View[contains(@resource-id,"thumbnail") or contains(@resource-id,"content")])[1]',
      '(//android.widget.ImageView)[1]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []


  },
  showTab: {
    [Platform.WEB]: [
      "//div[@id='shows']"
    ],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Shows"]'],

    [Platform.IOS]: [],
    [Platform.TV]: []

  },
  trendingShowFirstContent: {
    [Platform.WEB]: [
      "//button[contains(text(),'Submit')]"
    ],
    [Platform.ANDROID]: ['(//android.view.View[@content-desc="App-Image"])[5]'],
    [Platform.IOS]: [],
    [Platform.TV]: []

  },
  shareButton: {
    [Platform.WEB]: [
      '//img[@src="/assets/button_icons/share.svg"]',
      "//button//*[name()='svg']",
      "//span[contains(text(),'Share')]"
    ],

    [Platform.ANDROID]: [
      "//android.widget.ScrollView/android.view.View[5]",
      "//android.widget.Button[contains(@text,'Share')]"
    ],//android.widget.ScrollView/android.view.View[5]/android.widget.Button


    [Platform.IOS]: [],
    [Platform.TV]: []

  },
  watchlistButton: {
    [Platform.WEB]: ['//div[@id="watchlist"]',
      "//button[@aria-label*='Watchlist' i]",

    ],
    [Platform.ANDROID]: [
      "//android.widget.ScrollView/android.view.View[3]/android.widget.Button"
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []

  },

  contentMetadata: {
    [Platform.WEB]: ["//div[contains(@class,'player') or contains(@class,'details')]//div[contains(@class,'desc')]"
    ],
    [Platform.ANDROID]: [
      "(//android.widget.ScrollView/android.widget.ImageView[2]/preceding-sibling::android.view.View/child::android.widget.TextView)[2]"
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  episodeSection: {
    [Platform.WEB]: ["//div[contains(@class,'episodes')]"

    ],
    [Platform.ANDROID]: ["//android.widget.ScrollView/android.view.View[6]/android.view.View"

    ],
    [Platform.IOS]: [],
    [Platform.TV]: []


  },
  contentSearchBox: {
    [Platform.WEB]: [
      '//img[@alt="search-icon"]',
      '//input[@placeholder="Search by title, actor, genre..."]',
      '//input[@type="search"]',
      '//input[contains(@class, "search")]',
      '//input[@aria-label*="search" i]',
    ],

    [Platform.ANDROID]: [
      '//android.widget.ImageView[@content-desc="Search"]',

    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  // Content Search/Navigation
  contentSearchInput: {
    [Platform.WEB]: [
      // '//img[@alt="search-icon"]',
      '//input[@placeholder="Search by title, actor, genre..."]',
      '//input[@type="search"]',
      '//input[contains(@class, "search")]',
      '//input[@aria-label*="search" i]',
    ],

    [Platform.ANDROID]: [
      '//android.widget.EditText',

    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },

  // No Search Results Message
  noSearchResultsMessage: {
    [Platform.WEB]: [
      '//div[contains(text(), "No results found")]',
      '//p[contains(text(), "No search results found")]',
      '//span[contains(text(), "No search results found")]',
      '//div[contains(@class, "no-results")]',
    ],

    [Platform.ANDROID]: [
      '//android.widget.TextView[contains(@text, "No search results found ")]',
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },


  // Content Title/Name in Search Results
  contentTitleInResults: {
    [Platform.WEB]: [
      '//div[contains(@class, "search-results")]//div[@class="thumbnail"]',
      '//div[contains(text(), "Lavender Fields")]',
      '//h2[contains(text(), "Lavender Fields")]',
      '//div[contains(@class, "result")]//img[@alt*="Lavender Fields"]',
    ],

    [Platform.ANDROID]: [
      '(//android.widget.ImageView[@content-desc="App-Image"])[2]'
    ],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  contentSearchHeader: {
    [Platform.WEB]: [
      '//input[@placeholder="Search by title, actor, genre..."]',
      '//h1[contains(text(), "Search")]',
      '//div[contains(@class, "search-header")]//h1',
      '//h1[@class="search-header"]',
    ],
    [Platform.ANDROID]: [
      '//android.view.View[@content-desc="Search"]',
      '//android.widget.TextView[@text="Search by actor, title.."]'
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators her
    ],
    [Platform.TV]: []
  },
  searchListNotFreeTagEpisodeList: {
    [Platform.WEB]: [
      "(//div[@class='thumbnail relative cursor-pointer outline-none'][not(.//img[contains(@src,'free.png') or contains(@alt,'free.png')])])",
      '//h1[contains(text(), "Search")]',
      '//div[contains(@class, "search-header")]//h1',
      '//h1[@class="search-header"]',
    ],
    [Platform.ANDROID]: [
      '//android.view.View[@content-desc="Search"]',
      '//android.widget.TextView[@text="Search by actor, title.."]'
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators her
    ],
    [Platform.TV]: []
  },
  privacyPolicyLink: {
    [Platform.WEB]: ["//a[normalize-space()='Privacy Policy']"],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  termsAndConditionsLink: {
    [Platform.WEB]: ["//a[normalize-space()='Terms and Conditions']"],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  helpCentreLink: {
    [Platform.WEB]: ["//a[normalize-space()='Help and Support' or normalize-space()='Help and Support']"],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  privacyPolicyPageTitle: {
    [Platform.WEB]: ["//h1[normalize-space()='Privacy Policy']", "//h2[normalize-space()='Privacy Policy']"],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  termsAndConditionsPageTitle: {
    [Platform.WEB]: ["//h1[normalize-space()='Terms and Conditions']", "//h2[normalize-space()='Terms and Conditions']"],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  helpCentrePageTitle: {
    [Platform.WEB]: ["//h1[normalize-space()='Help Centre' or normalize-space()='Help Center']", "//h2[normalize-space()='Help Centre' or normalize-space()='Help Center']"],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  loginWithFacebook: {
    [Platform.WEB]: ["//span[text()='Login with Facebook']"],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  loginWithFacebookEmailInput: {
    [Platform.WEB]: ['//input[@type="text"]'],

    [Platform.ANDROID]: [''],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  loginWithFacebookPasswordInput: {
    [Platform.WEB]: ['//input[@type="password"]'],

    [Platform.ANDROID]: [''],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  loginWithFacebookLogInButton: {
    [Platform.WEB]: ["//span[text()='Log in']"],

    [Platform.ANDROID]: [''],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  checkBoxForRecaptcha: {
    [Platform.WEB]: ['//div[@class="recaptcha-checkbox-checkmark"]'],

    [Platform.ANDROID]: [''],

    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  subscribeCTAonShowTab: {
    [Platform.WEB]: ['//p[text()="Subscribe to watch"]'],
    [Platform.ANDROID]: [
      '//android.view.View[@resource-id="home:contentBrowser"]/android.view.View[1]/android.view.View[1]/android.view.View[3]/android.widget.Button',
      '//*[contains(@text,"Subscribe")]'
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  subscribeCTA: {
    [Platform.WEB]: [
      '//p[text()="Subscribe to watch"]',
      '//button[contains(text(),"Subscribe")]',
      '//p[contains(text(),"Subscribe")]'
    ],

    [Platform.ANDROID]: [
      '//*[@text="Subscribe"]',
      '//*[@text="Subscribe to watch"]',
      '//*[contains(@text,"Subscribe")]',
      '//*[@content-desc="Subscribe"]'
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  myAccountOptions: {
    [Platform.WEB]: [
      "//p[text()='Account & Settings']"
    ],
    [Platform.ANDROID]: [
      "//android.widget.ScrollView/android.view.View[1]"
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  subscriptionDetailsSection: {
    [Platform.WEB]: [
      "//h3[contains(text(),'Subscription')]",
      "//h2[contains(text(),'Subscription')]"
    ],
    [Platform.ANDROID]: [
      "//android.widget.TextView[@text='Subscription & Billing']"
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  profileIcon: {
    [Platform.WEB]: [
      "//img[contains(@alt,'profile')]"
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  settingsOption: {
    [Platform.WEB]: [
      '//img[@alt="Account & Settings"]',
      "//a[contains(text(),'Account & Settings')]"
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  parentalToggle: {
    [Platform.WEB]: [
      '//button[contains(@class,"rounded-full")]//span[contains(@class,"transform")]',
      '//div[@id="parentalControls"]',
      "//input[@type='checkbox' or contains(@class,'toggle')]"
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  accountPasswordField: {
    [Platform.WEB]: [
      "//input[@id='login-password-input']",
      "//input[@type='password']"
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  pinInputField: {
    [Platform.WEB]: [
      "//input[@inputmode='numeric' and @maxlength='1']",
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  savePinButton: {
    [Platform.WEB]: [
      '//button[text()="Save"]'
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  pinSetContinueButton: {
    [Platform.WEB]: [
      "//button[@id='continue-button']"
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  homePage: {
    [Platform.WEB]: [
      '//img[@alt="iWant Icon"]'
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  parentalPinPopup: {
    [Platform.WEB]: [
      "//input[@inputmode='numeric' and @maxlength='1']"
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  pinSubmitCTA: {
    [Platform.WEB]: [
      "//button[contains(text(),'Submit') or contains(text(),'Continue')]"
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  submitCTA: {
    [Platform.WEB]: [
      "//button[contains(text(),'Submit')]"
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  midRailBannerAd: {
    [Platform.WEB]: ["(//*[@data-google-query-id or contains(@id,'div-gpt-ad') or contains(@id,'google_ads_iframe') or contains(@class,'ad-slot') or contains(@class,'banner-ad') or contains(@data-testid,'mid-rail') or contains(@data-testid,'ad')] | //iframe[contains(@id,'google_ads_iframe') or contains(@src,'doubleclick') or contains(@title,'ad')])[1]"],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  // Content Video Player
  videoPlayer: {
    [Platform.WEB]: [
      '//div[@id="player-container-main"]',
    ],
    [Platform.ANDROID]: [
      '//android.widget.FrameLayout[@resource-id="com.absi.tfctv:id/exo_subtitles"]/android.view.View', // Placeholder, update as needed
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  seekBar: {
    [Platform.WEB]: [
      '//div[@class="player-progress-and-time-container"]',
      '//input[@type="range"]',
      '//div[contains(@class,"seek")]'
    ],
    [Platform.ANDROID]: [
      '//android.widget.SeekBar[@resource-id="seekBar"]', // Placeholder, update as needed
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },


  previewThumbnail: {
    [Platform.WEB]: [
      '//div[@class="player-thumbnail-container"]',
      '//canvas'
    ],
    [Platform.ANDROID]: [
      '//android.widget.ImageView[@resource-id="previewThumbnail"]', // Placeholder, update as needed
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },

  playerTimer: {
    [Platform.WEB]: ["//span[contains(@class,'player-time-display')]",
      '//span[@class="player-time-display"]',
    ],
    [Platform.ANDROID]: [
      "//android.widget.TextView[contains(@content-desc,'time')]",
      "//android.widget.TextView[contains(@text,':')]"
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  continueWatchingTray: {
    [Platform.WEB]: [
      "//p[text()='Continue Watching']/parent::div/following-sibling::div[1]",
      "//div[contains(text(),'Continue Watching')]"
    ],
    [Platform.ANDROID]: [
      '//android.view.View[@resource-id="home:contentBrowser"]/android.view.View[2]'
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  continueWatchingTrayItem: {
    [Platform.WEB]: [
      '//p[text()="Continue Watching"]/parent::div/following-sibling::div/child::div/div[1]',
      // "//div[contains(@class,'continue-watching')]//div[contains(@class,'thumbnail')][1]",
      "//h2[contains(text(),'Continue Watching')]/following::div[contains(@class,'thumbnail')][1]"
    ],
    [Platform.ANDROID]: [
      '(//android.view.View[@content-desc="App-Image"])[5]',
      "(//android.view.View[contains(@content-desc,'Continue watching')])[1]"
    ],
    [Platform.IOS]: [
      // 👉 Add iOS locators here
    ],
    [Platform.TV]: []
  },
  contentHeader: {
    [Platform.WEB]: [
      "//img[contains(@class,'title')]",
      "//div[@class='details-page']//h1"
    ],
    [Platform.ANDROID]: [
      "//android.widget.TextView[contains(@resource-id,'title')]",
      "//android.widget.TextView[contains(@content-desc,'title')]"
    ],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  episodePlayButton:{
    [Platform.WEB]: ["//button[contains(@title,'Play') or contains(@aria-label,'Play')]",
      "//button[contains(@aria-label,'Play')]", 
      "//button[contains(text(),'Play')]"],
    [Platform.ANDROID]: ['//android.widget.TextView[@text="Play"]', '//android.widget.Button[@text="Play"]', '//android.widget.ImageButton[@content-desc="Play"]'],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  playerTitle: {
    [Platform.WEB]: [
      "//div[@class='player-title']/text()[1]",
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },
  skipAd: {
    [Platform.WEB]: [
      "//span[text()='Skip Ad']",
    ],
    [Platform.ANDROID]: [],
    [Platform.IOS]: [],
    [Platform.TV]: []
  },















}


