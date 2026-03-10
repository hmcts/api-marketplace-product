# API Marketplace Roadmap

The roadmap below outlines the key milestones and deliverables for the API Marketplace product over Financial Year 26/27.
It includes the development of new APIs, onboarding of new jurisdictions, and migration of existing APIs to the marketplace.
The timeline is subject to change based on priorities.

```mermaid
gantt
title API Marketplace (AMp) Roadmap
dateFormat  YYYY-MM-DD

section Quarterly milestones
Q4 FY25/26 :milestone, quarter-fy25-q4, 2026-01-01, 0d
Q1 FY26/27 :milestone, quarter-fy26-q1, 2026-04-01, 0d
Q2 FY26/27 :milestone, quarter-fy26-q2, 2026-07-01, 0d
Q3 FY26/27 :milestone, quarter-fy26-q3, 2026-10-01, 0d
Q4 FY26/27 :milestone, quarter-fy26-q4, 2027-01-01, 0d

section Court case result subscription & notification APIs
Court case result subscription API implemented and available :doc-api-dcpi, 2026-01-01, 90d
HMPPS connected to subscription API :doc-api-connectivity, 2026-02-01, 59d
PCN & NOWs notifications delivered via API :doc-api-notifications, 2026-03-01, 90d
Notifications API extended with additional case result data items :doc-api-notifications-extensions, 2026-07-15, 90d
PCN & NOW email notifications decommissioned :doc-api-data-decomm-emails, 2027-02-20, 40d

section Court data APIs
Court data requirements agreed with HMPPS :court-api-hmpps-requirements-agreed, 2026-03-03, 20d
Court APIs contract designed and published :court-api-contract-design-publish, 2026-05-01, 30d
Court APIs implementation and release :court-api-implementation, 2026-06-01, 45d
HMPPS onboarding to Court APIs :court-api-hmpps-onboarding, after court-api-implementation, 5d

section Data sharing self‑service enablement
Data sharing obligations and guidance defined for API producers and consumers :amp-data-sharing-guidance, 2026-02-15, 45d
Self‑service data sharing process documented and available via the API Marketplace :amp-doc-self-service-process, 2026-04-01, 15d

section AMp Foundations
AMp product principles defined and adopted :amp-principles, 2026-01-25, 15d
Identity federation approach validated (EntraID and multiple IDPs) :amp-entra-spike, 2026-04-01, 30d
Core AMp infrastructure established with PlatOps :amp-infra-foundations, 2026-04-01, 90d
Crime Pathfinder APIs operating from CNP via the API Marketplace :amp-migration, 2026-06-15, 90d
Tooling options evaluated for API Marketplace enablement :amp-tooling, 2026-04-01, 15d
API Marketplace tooling and onboarding capability available : after amp-tooling, 30d

section Onboard New Jurisdiction
CFT and DWP discovery completed for case history subscription events :jurisdiction-cft-dwp-discovery, 2026-06-01, 30d
CFT case history subscription events API implemented and available :jurisdiction-cft-subscription-api, 2026-07-01, 90d
DWP onboarded and integrated with CFT case history subscription API :jurisdiction-dwp-onboarding, after jurisdiction-cft-subscription-api, 30d

section Case Court Hearing API
VP additional data items available via Court Hearing API :court-api-vp-additions, 2026-04-01, 30d
Court Hearing API ownership transferred to Hearing Domain :amp-court-api-hearing, 2026-09-01, 15d

section Pathfinder assets transferred to owning teams
SpringBoot templates owned and maintained by Platform Engineering :amp-springboot-pe, 2026-05-01, 30d
Scheduling API ownership transferred to Scheduling & Listing Domain :amp-scheduling-api-snl, 2026-09-08, 15d

section API adoption through the Marketplace
API producers enabled to migrate APIs to the Marketplace through published guidance and migration roadmap :amp-api-migration-guidance, 2026-10-01, 90d
```
