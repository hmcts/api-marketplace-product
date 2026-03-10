# AMP-001 Subscription API Case Results

## Purpose

Define the contract and operational behaviour for publishing case result events so consumers can integrate through a stable, versioned API product.

## Requirements

### Requirement: Publish case result events
The platform SHALL publish case result events using a versioned contract for subscribed consumers.

#### Scenario: Event published for a subscribed consumer
- **WHEN** a case result is finalised and a consumer has an active subscription
- **THEN** the platform publishes an event that conforms to the current versioned contract

### Requirement: Support reliable notification behaviour
The platform MUST provide documented reliability behaviour for event delivery and failure handling.

#### Scenario: Delivery failure occurs
- **WHEN** an event cannot be delivered on first attempt
- **THEN** the platform applies the documented retry and failure handling process

### Requirement: Provide migration path from legacy notifications
The platform SHALL define and communicate a migration path from legacy case-result email notifications to the subscription API.

#### Scenario: Consumer migrates from email notifications
- **WHEN** a consumer agrees a migration window to the subscription API
- **THEN** the migration plan and decommission timeline for legacy emails are recorded and shared
