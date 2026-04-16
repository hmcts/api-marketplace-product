# AMP-001: Subscription API — Case Results

## Problem

Consumers need a stable subscription API for case result events. Legacy email-based notification paths need replacing with a reliable, event-driven delivery mechanism.

## Scope

- Define event contract and publication semantics.
- Define onboarding and access controls for consumers.
- Define decommission path for legacy email notifications.

## Out of Scope

- Consumer-side business process redesign.

## Acceptance Criteria

- Contract is versioned and published.
- At least one consumer onboarding path is validated end to end.
- Notification and reliability behaviours are documented and tested.
- Legacy email path decommission plan is agreed and scheduled.

## Tasks

- [ ] Finalise event schema and field ownership.
- [ ] Implement and test subscription endpoint/event pipeline.
- [ ] Validate connectivity with HMPPS.
- [ ] Produce operational runbook and support model.

## Evidence

_Add links to:_

- API contract diffs
- Test results
- Demo notes
- Deployment records
