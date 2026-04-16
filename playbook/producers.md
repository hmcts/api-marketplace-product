# Producer Guide

How to publish, manage, and govern APIs through the API Marketplace.

## What is a producer?

A producer is any team that owns and publishes an API product through the Marketplace. Producers retain full end-to-end ownership — the Marketplace provides standards, tooling, and visibility, not central operation.

## Publishing an API

1. **Design the contract** — Define your API contract first (contract-first design). Use OpenAPI or an equivalent machine-readable format.
2. **Meet the standards** — Ensure your API aligns with [AMp product principles](../product/principles.md) and [HMCTS API standards](https://hmcts.github.io/standards/practices/apis.html).
3. **Document** — Provide clear documentation covering authentication, error handling, versioning, rate limits, and operational expectations.
4. **Define onboarding** — Publish onboarding instructions so consumers can self-serve where possible.
5. **Register in the catalogue** — Add your API to the Marketplace catalogue with the required metadata.

## Ongoing responsibilities

- **Own the lifecycle** — Manage versioning, deprecation, and decommissioning transparently.
- **Maintain documentation** — Keep documentation current as the API evolves.
- **Support consumers** — Provide a named support channel and respond to integration issues.
- **Monitor and observe** — Publish usage metrics, availability, and performance data.
- **Manage access** — Control consumer onboarding and enforce access policies.

## Governance

Governance is embedded in Marketplace standards and tooling rather than manual approval gates:

- Contracts are reviewed as part of the normal development process.
- Automated checks validate contract compliance where tooling is available.
- Lifecycle events (deprecation, breaking changes) are communicated proactively.

## Data sharing

If your API operates at an organisational or partner boundary, you may need to define data-sharing obligations for consumers. The Marketplace provides guidance and templates to support this.

## Recipes

Recipes capture reusable patterns for common API types. Before designing from scratch, check the [recipes](../recipes/README.md) to see if a proven pattern exists for your use case.

## Need help?

Contact the AMp team for guidance on publishing, standards, or tooling.
