Feature: Log Interaction and Track Techniques

  Scenario: User logs a 1-on-1 meeting using specific rapport techniques
    Given I am an authenticated user
    And I have a contact named "Alex Chen" (Direct Manager)
    And the tactics "Active Listening" and "Finding Common Ground" exist
    When I log an "In-person" interaction with "Alex Chen"
    And I assign a rapport score of 8
    And I log the use of "Active Listening" with effectiveness 5
    And I log the use of "Finding Common Ground" with effectiveness 4
    Then the interaction should be recorded successfully
    And the interaction should have 2 tactic logs associated