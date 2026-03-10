# API Marketplace - The Product

The API Marketplace (AMp) is a self-serve marketplace for publishing, discovering, and consuming HMCTS APIs.

## Roadmap

The detailed roadmap is maintained in [`specs/product/roadmap.md`](specs/product/roadmap.md).

## Spec-Driven Structure

The repository is organised to keep product intent, feature specs, acceptance criteria, delivery tasks, and implementation evidence connected:

```text
specs/
  product/      # vision, principles, roadmap
  domains/      # domain context and glossary
  features/     # feature-level specs (spec, acceptance, tasks, evidence)
  recipes/      # reusable AMp design patterns ("recipes")
  adr/          # architecture decision records
openspec/       # OpenSpec CLI artifacts (validated specs + change proposals)
tools/openspec/ # OpenSpec config and templates
docs/           # supplementary documentation
```

## OpenSpec CLI

If this repository is managed with OpenSpec, keep capability specs in `openspec/specs` and validate them as part of changes.

Install [OpenSpec](https://openspec.dev/) CLI:

```bash
npm install -g @fission-ai/openspec
```

Validate specifications:

```bash
openspec validate --specs --no-interactive
```

Validate specs and active change proposals:

```bash
openspec validate --all --no-interactive
```

## API Standards

API design and implementation should align with HMCTS engineering guidance:

- HMCTS engineering: [The HMCTS way](https://hmcts.github.io)
- HMCTS API practices: [Standards::Practices::APIs](https://hmcts.github.io/standards/practices/apis.html)

Useful external reference (not AMp-specific):

- HMCTS Spring Boot demo service: [https://github.com/hmcts/service-hmcts-springboot-demo](https://github.com/hmcts/service-hmcts-springboot-demo)

## Key Links

- Product roadmap: [`specs/product/roadmap.md`](specs/product/roadmap.md)
- Product vision: [`specs/product/vision.md`](specs/product/vision.md)
- Product principles: [`specs/product/principles.md`](specs/product/principles.md)
- AMp recipes: [`specs/recipes/README.md`](specs/recipes/README.md)
- Repo structure ADR: [`specs/adr/ADR-0001-repo-structure.md`](specs/adr/ADR-0001-repo-structure.md)
- OpenSpec workspace: [`openspec/README.md`](openspec/README.md)
- OpenSpec config: [`tools/openspec/config.yaml`](tools/openspec/config.yaml)

## License

This project is licensed under the [MIT License](LICENSE).
