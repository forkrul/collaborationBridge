Feature: Health Check
  As a system administrator
  I want to check the health of the application
  So that I can monitor its status

  Background:
    Given the application is running

  Scenario: Check application health
    When I request the health endpoint
    Then the response should indicate the application is healthy
    And the response should include version information

  Scenario: Check root endpoint
    When I request the root endpoint
    Then the response should include a welcome message
    And the response should include API documentation links
