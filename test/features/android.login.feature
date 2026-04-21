Feature: Login functionality for AEC Android App
  As a user of the AEC app
  I want to verify positive and negative login scenarios
  So that only valid users can access the app

  Background:
    Given the AEC app is launched and on the login screen

  Scenario: Login with valid username and valid password
    When I enter valid username
    And I enter valid password
    And I tap the login button
    Then I should see the dashboard screen

  Scenario Outline: Negative login scenarios
    When I enter <username>
    And I enter <password>
    And I tap the login button
    Then I should see the error message <errorMessage>

    Examples:
      | username        | password         | errorMessage                          |
      | invalidUser     | validPassword123 | Invalid username or password          |
      | validUser       | wrongPassword    | Invalid username or password          |
      |                 | validPassword123 | Please enter your username            |
      | validUser       |                  | Please enter your password            |
      |                 |                  | Please enter your username and password |
