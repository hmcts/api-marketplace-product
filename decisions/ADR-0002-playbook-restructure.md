# ADR-0002: Playbook-Oriented Repository Structure

## Status

Accepted

## Context

The original spec-driven structure (ADR-0001) organised content around an OpenSpec toolchain with deeply nested feature directories. In practice:

- The multi-file feature layout (spec, acceptance, tasks, evidence per feature) added overhead without proportional value at this stage of the product.
- The OpenSpec CLI tooling was not actively used and added configuration weight.
- New team members found it hard to navigate the repo and understand what goes where.
- There was no clear home for operational guidance aimed at API consumers and producers.

The repository needs a structure that is easy to navigate, scales with the product, and gives practical guidance to the teams using the Marketplace.

## Decision

Replace the `specs/`-based layout with a playbook-oriented structure:

```
product/     — vision, principles, roadmap
playbook/    — operational guides (consumers, producers, glossary)
apis/        — one file per API initiative (consolidated from multi-file features)
recipes/     — reusable delivery patterns
decisions/   — architecture decision records (formerly specs/adr)
```

Key changes:

1. **Remove** `openspec/`, `tools/`, and `specs/` directories.
2. **Consolidate** multi-file feature specs (spec, acceptance, tasks, evidence) into single files under `apis/`.
3. **Add** a `playbook/` section with consumer, producer, and glossary guides.
4. **Move** product artifacts (vision, principles, roadmap) to a top-level `product/` directory.
5. **Rename** `specs/adr/` to `decisions/`.

## Consequences

- Flatter structure — easier to navigate and onboard new team members.
- Playbook gives consumers and producers a clear starting point.
- Single-file API specs reduce overhead while keeping all relevant information together.
- Recipes and decision records remain as before.
- OpenSpec tooling references are removed; can be re-introduced if needed later.
- Existing content is preserved and reorganised, not deleted.
