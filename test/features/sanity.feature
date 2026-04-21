 Scenario: Sign in with valid email and password
  Given I navigate to the site
  When I click Icon
  And I click Sign In
  And I enter gmail id "testuser@example.com"
  And I click Continue
  And I enter password "TestPassword123!"
  And I click Continue
  Then I should see header text containing "Invalid username or password"

 Scenario: Verify that "Continue as Guest" is displayed on the login screen on launching the application as guest user.
  Given User should be connected to a PH region.
  When  Launch the app as a guest user.
  Then "Continue as Guest" should be displayed on the login screen.

 Scenario: Verify premium users are allowed to play all the contents except GMA contents.
  Given  Launch the application and login as premium user.
  When  Tap on any content except GMA content and start playback.
  Then Premium users should be able to play all available content except GMA contents

  Scenario: Verify the GMA content playback for GMA users.
  Given I navigate to the site
  When login as GMA user.
  And Tap on GMA tab.
  And Play any GMA content.
  Then GMA contents should be played for GMA users (Verify timer and pause button).


 Scenario: Verify the player controls (Pause, play, Seek forward, backward, Full screen, subtitle, Volume)
  Given Launch the application and login.
  When Tap on any content and start playback.
  And Tap on pause icon.
  And Resume the playback.
  And Click on forward icon.
  And Click on backward icon.
  And Scrub the seekbar.
  And Click on Full screen icon.
  And Enable the subtitle.
  And Increase or decrease the volume.
  Then Pause/Play should stop and resume playback accurately.
  And Seek forward/backward should navigate the video correctly.
  And Full-screen toggle should switch modes seamlessly.
  And Subtitles should appear/disappear correctly.
  And Volume adjustments and mute/unmute should work without affecting playback.


Scenario: Verify the auto upnext playback at the end of the current episode playback.
Given  Launch the application and login.
When  Click on Shows Tab.
And  Tap on any show content that has multiple episodes
And  Play the episode 1 till the end.
Then  Observe the next episode auto playback.

Scenario: Verify the Upnext binge marker appers at the end of the current epissode playback.
 Given  Launch the application and login.
 When  Click on Shows Tab.
 When  Tap on any show content that has multiple episodes
 When  Play the episode 1 till the end.
When  Observe the next episode upnext binge marker displayed at the end of the current episode playback.
Then 6 Upnext binge marker should be displayed at the end of the current episode playback.


Scenario: Verify presence of “Skip Intro” marker during intial content Playback
Given  Launch the App
When  Navigate to any show content
When  Tap and play the content.
When  Observe the "Skip Intro" marker.
Then Skip Intro button should be displayed during intial content Playback

Scenario: Verify presence of “Skip Recap” marker during intial content Playback
 Given  Launch the App
 When  Navigate to any show content.
 When  Search content (ex - "FPJ's Batang Quiapo").
 When  Navigate to any show content.
 When  Tap and play the content.
 When  Observe the "Skip Recap" marker.
 Then Skip Recap button should be displayed during intial content Playback

Scenario: Verify presence of “Skip Outro” marker at end of the content playback
 Given  Launch the App
 When  Navigate to any show content.
 When  Search content (ex - "Walang Hanggan").
 When  Navigate to any show content.
 When  Play any Episode apart from last episode.
 When  Play the content till the end.
 When  Observe the "Skip Outro" botton.
 Then Skip Outro button should appear during the end section of the episode.

Scenario: Verify that "X" button is displayed on the "Skip Outro"(Up next binge marker) marker to close the "Outro"
Given  Launch the App
 When  Search content (ex - "Walang Hanggan").
 When  Navigate to show content.
 When  Play any Episode apart from last episode.
 When  Play the content till the end.
 When  Observe the "Skip Outro" botton.
 When  Tap on "Skip Outro" marker.
Then Outro marker should get closed and the remaining content should be
continued to play.

Scenario: Verify clicking "Skip Outro" moves to next episode when user click on "Skip Outro"
 Given  Launch the App
 When  Search content (ex - "Walang Hanggan").
 When  Navigate to show content.
 When  Play any Episode apart from last episode.
 When  Play the content till the end.
 When  Observe the "Skip Outro" botton.
 When  Tap on "Skip Outro" marker.
 Then Playback should play next episode when user Click on "skip Outro" button

Scenario: Verify the Ads playback for free user.
 Given  Launch the application.
 When  Continue as guest or login as free user.
 When  Tap on any free content and start playback.
Then Preroll, midroll ads should be played for guest and free users.

Scenario: Verify user navigates to coorect screen on tapping the shared deeplink.
 Given  Launch the application and login.
 When  Tap on any content.
 When  Tap on the share icon and share the deeplink to any social media.
 When  Navigate to social media and tap on the shared deeplink.
 Then User should be navigated to correct page on tapping the deeplink.

Scenario: Verify the Subscription blocker screen on tapping Subscribe CTA.
 Given  Launch the application and login as free user.
  When  Search content (ex - "Walang Hanggan").
  When  Navigate to show content.
  When  Play episode.
  When  Tap on any content premium contnet.
  When  Tap on "Subscribe" CTA.
  Then Free user should be navigated to "Subscription" blocker screen on tapping "Subscribe" CTA.

 Scenario: Verify that "Resume" CTA is displayed inside the details screen for the partially watched contents and content starts playing from the last watched postion on tapping "Resume" CTA.
  Given User should have watched a content partially(Ex: MMK)
  When  Launch the app and login.
  When  Navigate to the tray where MMK is displayed.
  When  Tap on the content.
  Then "Resume" CTA should be displayed for the partially watched content inside content details screen and content should starts playing from the last watched postion on tapping "Resume" CTA.

 Scenario: Verify the functionality of "Watchlist" icon displayed on the content details screen.
  Given  Launch the app.
  When  Navigate to content.
  When  Tap on "Add to Watchlist" icon.
  Then Content should get added to watchlist on tapping "Add to watchlist" icon.

 Scenario: Verify the functionality of "Remove from watchlist" icon displayed below the player screen in portrait screen.
  Given  Launch the app.
  When  Navigate to content.
  When  Tap on play button.
  When  Tap on "Add to Watchlist" icon.
  When  Now tap on "Remove from watchlist".
  Then Watchlisted content should be removed.

 Scenario: Verify that the user is able to initiate video playback directly from the 'My Watchlist' page by selecting any listed content.
 Given  Launch the app.
  When  Navigate to the My Watchlist page.
  When  Tap on any content.
  When  Tap on play or resume from the show detail page.
  When  Observe the player.
  Then User is successfully redirected to the player screen, and the selected content starts playing.

 Scenario: [Web] Verify user is able to add content to My Watchlist via hover from search page
  Given  Launch the app
  When  Login wit valid credentials
  When  Tap on serach icon
  When  Type any Movie/Show content name
  When  Hover on Movie/Show content
  When  Tap on add to watchlist icon
  Then Content should be added to my watchlist and "Added to Watchlist" toast message should be displayed

 Scenario: [Web] Verify user is able to remove content from my watchlist via hover from search page
Given  Launch the app
  When  Login wit valid credentials
  When  Tap on serach icon
  When  Type any Movie/Show content name
  When  Hover on Movie/Show content
  When  Tap on add to watchlist icon
  When  Hover on same content
  When  Click on remove from my watchlist icon
  Then Content should be removed from my watchlist and "Removed from watchlist" toast message should be displayed

Scenario: Verify that "Top picks near you" tray is displayed on navigating to search tab
 Given Launch the App
  When  Tap on Search icon
  When  Observe the 'Top Picks Near You' results
  Then Top picks near you tray should be displayed on navigating to search screen.

 Scenario: Verify the auto-suggestions while typing in the search field
 Given Launch the App
  When  Tap on 'Search' icon
  When  Type anything and Observe
  Then Auto-suggestions should appear based on partial input

 Scenario: Verify if free and premium content are labeled accordingly on the Search page
 Given Launch the App
  When  Tap on 'Search' icon
  When  Search a title containing free or premium content
  When  Observe the thumbnails
  Then Thumbnails should show correct “Free” or “Premium” tags on search page
