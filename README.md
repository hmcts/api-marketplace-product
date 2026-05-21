# API Marketplace — The Product

The API Marketplace (AMp) is a self-serve marketplace for publishing, discovering, and consuming HMCTS APIs.

## Repository structure

```
product/             — vision, principles, roadmap
product/discovery/   — discovery reports synthesising Miro thinking, reference portals, and open questions
playbook/            — how to consume and produce APIs through the Marketplace
apis/                — API initiative specs (one file per API)
recipes/             — reusable delivery patterns
decisions/           — architecture decision records
```

## Quick links

| What | Where |
|------|-------|
| **Discovery report (start here)** | [`product/discovery/2026-05-20-marketplace-discovery.md`](product/discovery/2026-05-20-marketplace-discovery.md) ([HTML view](product/discovery/2026-05-20-marketplace-discovery.html)) |
| Product vision | [`product/vision.md`](product/vision.md) |
| Product principles | [`product/principles.md`](product/principles.md) |
| Roadmap | [`product/roadmap.md`](product/roadmap.md) |
| Playbook | [`playbook/README.md`](playbook/README.md) |
| Consumer guide | [`playbook/consumers.md`](playbook/consumers.md) |
| Producer guide | [`playbook/producers.md`](playbook/producers.md) |
| Glossary | [`playbook/glossary.md`](playbook/glossary.md) |
| Recipes | [`recipes/README.md`](recipes/README.md) |
| Decision records | [`decisions/`](decisions/) |

## Working on the discovery report

The discovery report in [`product/discovery/`](product/discovery/) has two surfaces:

- The **Markdown source** is the review surface — edit it, diff it, comment on PRs.
- The **HTML view** is the reading surface — sticky TOC, cross-reference links, mobile/print-friendly. Generated from the Markdown.

To regenerate the HTML after editing the Markdown:

```bash
cd product/discovery
npm install     # one-time
npm run build   # or: node build.mjs
```

Requires Node 20 or newer. Both the Markdown and the generated HTML are checked in.

## API standards

API design and implementation should align with HMCTS engineering guidance:

- [The HMCTS way](https://hmcts.github.io)
- [Standards :: Practices :: APIs](https://hmcts.github.io/standards/practices/apis.html)

## License

This project is licensed under the [MIT License](LICENSE).
