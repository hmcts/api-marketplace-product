# ADR-0001: Spec-Driven Repository Structure

## Status

Accepted

## Context

This repository needs a structure that keeps product intent, feature specs, acceptance criteria, delivery tasks, and evidence linked in one place.

## Decision

Adopt a `specs/` root with subfolders for product, domains, features, recipes, and ADRs. Keep OpenSpec CLI artifacts under `openspec/` and OpenSpec-related configuration under `tools/openspec`. Keep API catalogue references external until the owning catalogue location is confirmed.

## Consequences

- Clear traceability from roadmap to delivery evidence.
- Lower ambiguity in planning and handover.
- Reusable AMp design patterns can be captured as "recipes".
- Requires teams to maintain spec artifacts alongside implementation.
