# API Marketplace Roadmap

The roadmap below outlines the key milestones and deliverables for the API Marketplace product over Financial Year 26/27.
It includes the development of new APIs, onboarding of new jurisdictions, and migration of existing APIs to the marketplace.
The timeline is subject to change based on priorities.

```mermaid
gantt
title API Marketplace (AMp) Roadmap
dateFormat  YYYY-MM-DD

section
Q4 FY25/26 :milestone, quarter-fy25-q4, 2026-01-01, 0d
Q1 FY26/27 :milestone, quarter-fy26-q1, 2026-04-01, 0d
Q2 FY26/27 :milestone, quarter-fy26-q2, 2026-07-01, 0d
Q3 FY26/27 :milestone, quarter-fy26-q3, 2026-10-01, 0d
Q4 FY26/27 :milestone, quarter-fy26-q4, 2027-01-01, 0d

section Subscription API: Case Results
Subscription API (design, collaborate, prove, integrate) :doc-api-dcpi, 2026-01-01, 90d
Consumer (HMPPS) Connectivity :doc-api-connectivity, 2026-02-01, 59d
Notification (For PCN & NOWs) :doc-api-notifications, 2026-03-01, 90d
Iteration of API contents (to be define) :doc-api-iteration, 2026-07-15, 90d
Decommission HMPPS PCN & NOWs emails:doc-api-data-decomm-emails, 2027-02-20, 40d

section Case Court Hearing API
VP additional data items :court-api-vp-additions, 2026-04-01, 30d
Onboard HMPPS to Court API :court-api-onboarding-hmpps, 2026-07-01, 30d

section Data Sharing
Define existing and recommendations: amp-data-sharing, 2026-02-15, 45d
Document new self service process: amp-doc-self-service, 2026-04-01, 15d

section AMp Foundations
AMp Principles : amp-principles, 2026-01-25, 15d
Spike EntraID and multiple IDPs :amp-entra-spike, 2026-04-01, 30d
Infra Foundations (PlatOps collaboration) :amp-infra-foundations, 2026-04-01, 90d
Move Crime Pathfinder APIs from CP to CNP :amp-migration, 2026-06-15, 90d
Tooling analysis and spikes : amp-tooling, 2026-04-01, 15d
Tooling delivery and onboarding processes : after amp-tooling, 30d

section Onboard New Jurisdiction
Subscription API CFT Case History events (design, collaborate, prove, integrate) :hmcts-new-jurisdiction, 2026-07-01, 90d

section Handover Pathfinder APIs
SpringBoot templates to Plat. Eng. :amp-springboot-pe, 2026-05-01, 30d
Case Court API to Hearing Domain :amp-court-api-hearing, 2026-09-01, 15d
Scheduling API to S&L Domain :amp-scheduling-api-snl, 2026-09-08, 15d

section Migration to API Marketplace
Design, Publish Guidance with timelines and API migration roadmap :hmcts-new-jurisdiction, 2026-10-01, 90d
```
