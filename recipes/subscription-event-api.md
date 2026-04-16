# Recipe: Subscription Event API

## Intent

Provide a reusable pattern for delivering event-based subscriptions where consumers need reliable updates when case-related changes occur.

## When to Use

- Consumers need near-real-time case event updates.
- Multiple consumers need the same event stream with managed onboarding.
- Legacy polling or email-based notification paths need replacement.

## When Not to Use

- Consumers need ad-hoc historical query access rather than event updates.
- Event ordering or consistency requirements cannot be satisfied by the selected transport.

## Core Pattern

- Publish versioned event contracts.
- Enforce explicit subscription and access controls per consumer.
- Implement retry and dead-letter/failure handling.
- Provide replay/recovery guidance where feasible.

## Required Decisions

- Event schema ownership and versioning rules
- Delivery guarantees and retry policy
- Consumer authentication/authorisation model
- Operational monitoring and alert thresholds

## Delivery Checklist

- [ ] Event schema is versioned and published
- [ ] Consumer onboarding flow is documented and tested
- [ ] Reliability/failure handling is implemented and validated
- [ ] Legacy notification migration plan is published

## Evidence Expectations

- Contract and schema references
- Integration test results with at least one consumer
- Reliability test or failure-injection evidence
- Runbook and support model
