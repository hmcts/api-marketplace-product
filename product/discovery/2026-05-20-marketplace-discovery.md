# HMCTS API Marketplace — Discovery Report

| | |
|---|---|
| **Status** | Discovery — pre-design, pre-implementation |
| **Date** | 2026-05-20 (last updated 2026-05-21) |
| **Owner** | Duncan Crawford (acting) |
| **Audience** | AMp product, design, engineering, governance |
| **Location** | `api-amp/api-marketplace-product/product/discovery/` — co-located with the product corpus |
| **Supersedes** | Sibling drafts in this repo (`product/vision.md`, `product/principles.md`, `playbook/`, etc.) where they disagree with the Miro canonical artefacts. Those earlier drafts remain useful for tone/wording but are no longer the authoritative source. |
| **Source of truth for content corpus** | Miro board `uXjVJW-oswM=` |
| **Next phase** | Resolve open questions (§11), then move to design |

---

## 1. Executive summary

The HMCTS API Marketplace ("AMp") is a curated catalogue and access layer for HMCTS APIs — a single place where Consumers discover APIs, request access through a governed process, and integrate with confidence; and where Providers list their APIs, manage access decisions, and stay accountable for support, versioning, and deprecation.

This document is the **discovery output** for the marketplace's customer-facing product (the "amp-site"). It synthesises:

- The Miro board (Introduction, the full swimlane journey, five detailed flows, a capability catalogue) — treated as the **canonical product thinking**.
- A pre-existing HTML prototype and the `api-marketplace-product` docs repo — treated as **earlier thinking, not authoritative**.
- Three independent UK-government developer portals — **NHS Digital**, **HMRC Developer Hub**, **GOV.UK One Login** — analysed front-end and (for NHS) back-end.
- The **GDS Tech Docs Template** ecosystem.

### What's locked in

- **Positioning**: a *catalogue and access layer*, not an API builder or operator.
- **Seven user journeys** (§4): two onboarding journeys (Consumer onboarding §4.6, Producer/Organisation onboarding §4.7 — both *derived*, not in current Miro) + five canonical Miro journeys (two consumer, two producer, one reviewer).
- **Four roles**: Consumer, Producer (a.k.a. Provider — naming TBD §11.1), Reviewer, Admin.
- **GOV.UK Design System** as the visual baseline.
- **Anonymous browse of the catalogue** is in scope; sign-in only at access-request time.
- **Producer owns the API end-to-end** — the marketplace never builds, hosts, or operates listed APIs.
- **Two distinct approval gates**: (a) publication review (Reviewer gates the catalogue) and (b) access approval (Producer gates per-API access).
- **Audit trail required** for all decisions.

### What's still TBD

Twelve open questions are surfaced in §11. The biggest is the **architectural fork** (§8): is AMp a *gateway* (proxies API traffic, enforces rate limits centrally, issues credentials) or a *broker* (catalogue + request paperwork only, producers run their own gateways)?

### What this document is not

- **Not a design.** No IA proposal for amp-site, no page-level mockups, no schema, no API surface.
- **Not a build plan.** No tech stack lock-in beyond GOV.UK Design System; no sequencing.
- **Not an MVP scope.** Capabilities are catalogued and MVP markers preserved where the source artefacts marked them; final MVP scope is a design-phase output.

---

## 2. Positioning

The Miro Introduction frame is the **canonical positioning artefact**. Reproduced verbatim:

> ### We don't build APIs — we connect you to them.
>
> *"Like a library — we don't write the books, we organise them so you can find and borrow what you need."*

### What it is

> A single place to discover, access and use APIs.
>
> An API Marketplace is a curated catalogue of APIs from across the organisation and beyond. Think of it as an App Store for APIs — one centralised hub where teams can browse what's available, understand what each API does, and request access to use it. The marketplace doesn't create the APIs; it makes them discoverable, documented, and accessible.

### What we do, and don't

| ✓ We do | ✗ We don't |
|---|---|
| Curate and catalogue available APIs | Build or develop the APIs |
| Provide documentation and usage guides | Own or maintain the underlying services |
| Manage access requests and onboarding | Host your data or run your systems |
| Enforce API standards and governance | Fix bugs in the APIs themselves |
| Act as the single source of truth for APIs | Replace your development team |

### Who it's for

| Audience | Description |
|---|---|
| **API Consumers** | Developers, product teams and analysts looking for APIs to integrate into their work — without reinventing the wheel. |
| **API Providers** | Teams who have built an API and want it discovered, used, and governed consistently across the organisation. |

### How it works (4 steps)

1. **Browse** — Explore the catalogue of available APIs
2. **Discover** — Read docs, understand capabilities and owners
3. **Request** — Apply for access through a governed process
4. **Use** — Integrate and build with confidence

### Key benefits

- **Reduce duplication** — Stop teams building the same APIs twice; find what already exists.
- **Faster integration** — Documentation and access in one place speeds up delivery.
- **Governance & standards** — APIs are vetted, versioned, and consistent before they're listed.
- **Single source of truth** — One place to see every API available; no more hunting around.

### Common misconceptions (preserve in product copy)

- *"The marketplace team will build the API we need."* → **We list and govern APIs; the building stays with your development team. We can help you get it marketplace-ready.**
- *"It's only useful for developers."* → **Product owners, architects, and analysts all benefit from knowing what capabilities already exist in the organisation.**
- *"If my API is in the catalogue, the marketplace team supports it."* → **The API owner remains responsible for support and maintenance. We manage the listing, access, and documentation standards.**

---

## 3. Personas, roles, and entity model

### 3.1 Personas / roles

Five roles emerge consistently across the Miro artefacts and the Capabilities CSV.

| Role | Description | Lives where in journeys |
|---|---|---|
| **Anonymous visitor** | Anyone who lands on the public catalogue. Browses without auth. | DISCOVERY stage only |
| **Consumer** | Developer / product team / analyst integrating with existing APIs. Has an account; submits access requests. | All consumer journeys |
| **Producer** *(a.k.a. Provider — naming TBD §11.1)* | Team that owns and publishes an API. Has an account tied to an Organisation. Reviews access requests for their APIs. | All producer journeys |
| **Reviewer** | Marketplace governance role. Gates publications into the catalogue. **Who owns this role is TBD §11.2.** | Publication Review, Access Compliance (per Miro full swimlane) |
| **Admin** | Marketplace operations. Handles escalations (e.g. SLA breaches on access requests). | Access Request (escalation path) |

### 3.2 Candidate first-class entities

Three entities are *implied* but not currently modelled in the Miro artefacts. Both HMRC and GOV.UK One Login treat these as first-class. Adopting them is a major design decision; see §11.

| Entity | What it is | Why it matters | Adopt? |
|---|---|---|---|
| **Organisation** | A team, department, or supplier organisation. A User belongs to one or more Organisations. Producers register an Organisation (not just themselves). | Solves credential ownership when individuals leave. Solves "who's authorised to publish on behalf of X". The Capabilities CSV explicitly mentions "organisation onboarding". | **Proposed default: yes** |
| **Application / Client** | A registered piece of consumer software that consumes APIs. Holds the credentials, redirect URIs, environment binding. Owned by an Organisation. | Without it, "credentials" and "rate limits" have no clean home. HMRC and One Login both model this. | **Proposed default: yes** |
| **Subscription** | A binding of an Application to a specific API at a specific version. | Solves multi-version cleanly: a v1-subscribed app keeps working when v2 ships; producer can deprecate v1 without breaking v2 consumers. | **Proposed default: yes** |

**Reference model from HMRC** (battle-tested over ~10 years, MIT-licensed domain models in [`hmrc/api-platform-application-domain`](https://github.com/hmrc/api-platform-application-domain)):

```
User ──belongs to──> Organisation ──owns──> Application ──subscribes to──> API @ Version
```

GOV.UK One Login's Service entity is the same shape, called something different. Both **separate user identity from software identity** — adopting that separation is the single biggest lever for credential management hygiene.

---

## 4. The marketplace journeys

Seven journeys in total. The **five canonical journeys (§§4.1–4.5)** are taken verbatim from the Miro board. The **two onboarding journeys (§§4.6, 4.7)** are *derived* — they are not in the current Miro board, but they are implied by registration steps in §4.1 and §4.4 and explicitly required by the Capabilities CSV ("Self-service consumer registration", "Producer registration and organisation onboarding"). Drafted from convergence across NHS, HMRC, and GOV.UK One Login.

Each journey has the same structure: trigger, happy path, alternate paths, decisions, statuses, SLAs, notifications, audit events, and a comparison row showing what NHS / HMRC / One Login do at the equivalent stage.

### 4.1 Consumer — wants existing data ("the happy path")

**Trigger**: Consumer has a business or technical need for data that is, or might be, available via an HMCTS API.

**Happy path**:
1. Consumer wants data — has a business or technical need
2. *(Decision)* Already registered? → if **no**, *Register for marketplace* (create account and profile); if **yes**, continue
3. *Log into marketplace* — authenticate securely
4. *Search for data* — by keyword, domain, or category
5. *(Decision)* API found? → if **yes**, continue; if **no**, branch to **§4.2 New API Request**
6. *API details displayed* — name, owner, docs, status
7. *Request API access* — submit use case and details (enters **§4.3 Access Request flow**)
8. *Sent to approval flow*
9. *Consumer notified* — approved or rejected
10. **Journey complete**

**Open in this flow** (yellow stickies preserved):
- *"Search public data without logging"* — confirms anonymous browse is by design
- *"Public and private data?"* / *"API which retrieves combination of public and private data?"* / *"Do we have a flag for public and private data?"* — **see §11.6**
- *"Request form"* — exact field set is design-phase work

**Reference comparison**:

| Stage | NHS Digital | HMRC | One Login |
|---|---|---|---|
| Discover | `/developer/api-catalogue` — 186 APIs, 5 facet groups | `/api-documentation` — 120 APIs, by tax category | n/a (One Login is itself a single product) |
| Register | Keycloak (`identity.prod.api.platform.nhs.uk`) | Gov Gateway / Developer Hub IdP | Gov email + mobile 2FA, ~5 minutes, no approval |
| Request access | 10-step assurance + per-API config | Subscribe Application to API → request prod credentials | Self-serve via admin tool |

### 4.2 Consumer — wants data that doesn't exist (New API Request — demand signalling)

**Trigger**: Consumer search returns nothing.

**Happy path**:
1. *No matching API found*
2. *Submit new API request* — data need, use case, urgency
3. *Automated acknowledgement* — **reference number issued**
4. *Logged in request backlog* — Reviewer notified *(reviewer ownership TBD §11.2)*
5. *Reviewer assesses request* — feasibility, value, complexity
6. *(Decision)* Similar API already exists? → if **yes**, *Redirect to existing API* (consumer notified with link), journey complete
7. *(Decision)* Feasible and valuable? → if **no**, *Request declined* (reason and alternatives), journey complete
8. *Prioritised in roadmap* — scored by value and urgency
9. *Consumer notified* — accepted with expected timeline
10. *API designed and built* — producer team develops (this kicks off **§4.4 Publish flow** when ready)
11. *Published to marketplace*
12. *Consumer notified* — API is live; prompted to request access (kicks off **§4.1**)
13. **Journey complete**

**This is a major journey not present anywhere except Miro.** The marketplace doubles as a **demand-signalling and roadmap-input system** — consumers can request APIs that don't exist, those get triaged, prioritised, fed into producer roadmaps, and looped back when delivered. No reference portal (NHS, HMRC, One Login) has this; it is an HMCTS-specific innovation.

**Key implication**: AMp is not just a *catalogue product*. It is also a *demand register* for new APIs across HMCTS. The team running it needs a triage capability.

### 4.3 API Access Request (the consumer-side approval lifecycle)

**Trigger**: Consumer submits an access request from an API detail page (§4.1 step 7).

**Happy path**:
1. *Access request received* — submitted by consumer
2. *Automated pre-screening* — fields complete, account valid, API status live
   - **Fail** → *Returned to consumer* with clear reason
   - **Pass** → continue
3. *API owner notified* — full request details sent (channel: email + in-app alert)
4. *Owner reviews request* — checks criteria and compliance
5. *Initial decision* — three branches:
   - **Approve** → straight to credential issuance (step 9)
   - **Reject** → *Rejection sent* (reason + next steps)
   - **More info** → step 6
6. *Request more info* — **consumer given 5 business days to respond**
7. *(Decision)* Consumer responds?
   - **No (and 3 days inactive)** → *SLA breached* → *Escalate to admin*; if still no response, *Request closed*
   - **Yes** → re-review → step 8
8. *Approve or reject?* — final decision made
   - **Reject** → *Rejection sent*
   - **Approve** → continue
9. *Credentials issued* — secure delivery to consumer ← **mechanism TBD §11.7; recommendation: JWKS-first model adopted from One Login**
10. *Approval notification sent* — credentials + docs + rate limits
11. *Decision logged and audited*

**Concrete SLAs (from Miro flow)**:
- Consumer "more info" response window: **5 business days**
- Inactivity escalation: **3 days** of silence within the window
- Producer review of access request: **TBD** (proposed default: 5 business days, see §11.9)

**Open in this flow**:
- *"Requests to owner?"* — implies some access requests may not route to the producer directly. Possible scenarios: highly-sensitive APIs that route to AMp Admin first; cross-cutting requests touching multiple APIs. **See §11.4**.

**Reference comparison**:

| Aspect | NHS | HMRC | One Login |
|---|---|---|---|
| Access gating | Per-API, 10-step assurance | Production application review, **≤10 working days** | Self-serve registration; no approval at registration; production-gating handled separately |
| Credential delivery | Per-API; CIS2/JWKS hybrid | OAuth 2.0 client credentials issued via admin tool | JWKS-first; service team publishes public key, platform never issues secrets |
| SLAs | None published | 10 working days | Not stated; immediate self-serve for non-prod |
| Audit | Required | Yes (events platform) | Yes |

### 4.4 Producer — publish a new API

**Trigger**: Producer has an API ready to list.

**Happy path**:
1. Producer wants to publish — has an API ready to list
2. *(Decision)* Already registered? → if **no**, *Register as producer* (organisation and team details) ← *Organisation onboarding* (capabilities CSV)
3. *Log into marketplace* — authenticate securely
4. *Create API listing* — name, description, docs, version
5. *Set access policy* — **Open / Request-based / Restricted** ← *note: Capabilities CSV uses Open / Restricted / Partner-only — §11.5 deltas*
6. *Submit for approval* — sent to marketplace reviewer; enters **§4.5 Publication Review**
7. *Under review* — Reviewer assesses
8. *(Decision)* Approved? → see §4.5 for the three outcomes
9. *Producer notified* — approval confirmation sent
10. *API published and live* — visible and discoverable
11. **Journey complete**

**Plus the ONGOING band (Miro full swimlane)**:

> Producer maintains the API · Updates documentation · Manages versions · Monitors usage · Handles deprecations · Manages consumer access.
>
> Producer is accountable for keeping the API live, current and fit for purpose across all consumers.

This is a *standing responsibility*, not a journey end-state. The marketplace surfaces this responsibility but does not take it on.

**Plus the API Transfer auxiliary flow** (referenced in the swimlane via the sticky "Existing API transfer?"): a parallel route for migrating a pre-existing HMCTS API into the marketplace. Vertical sequence (from Miro PDF): Producer identifies existing API → compiles transfer brief → submits transfer request → automated validation → reviewer assesses → approve/reject → transfer agreement → API listed → producer manages → journey complete. **The detail of this flow is thinner than the build-new flow and warrants a dedicated working session.**

### 4.5 Reviewer — gate publications into the catalogue

**Trigger**: Producer submits a listing for approval (§4.4 step 6).

**Happy path**:
1. *Create API listing* — name, docs, version, policy *(producer)*
2. *Submit for review* — status: **pending**
3. *Validate submission* — system: check required fields
4. *(Decision)* Validation passed?
   - **Fail** — errors returned to producer
   - **Pass** → step 5
5. *Assign reviewer* — route to approver queue
6. *Reviewer notified* — email and in-app alert
7. *Review listing* — docs, policy, compliance
8. *Make decision* — **three outcomes** (Capabilities CSV adds a possible fourth, "conditionally approve" — §11.8):
   - **Approve** → status: **live** → API published to catalogue → approval notification → API live and visible
   - **Query** → request more info → status: **queried** → producer notified → producer responds → loops back to reviewer
   - **Reject** → mandatory rejection reason → status: **rejected** → producer notified with reason and guidance → *Rework listing* → resubmit → new review cycle

**Listing statuses (canonical from this flow)**:
- `pending` — submitted, awaiting reviewer
- `queried` — reviewer requested clarification
- `rejected` — reviewer rejected with reason
- `live` — approved and published

**Plus (Miro full swimlane) a parallel reviewer gate at access stage**: *"Checks Compliance — GDPR, data policy and security"* and *"Flags to Owner — passes with notes or escalates"*. This implies the Reviewer role doesn't only gate publication; they also have a compliance check role during access approval for sensitive cases. **§11.4 covers the routing question.**

**Reviewer criteria (from HTML prototype, treated as reasonable starter set)**:
- SwaggerHub spec exists and has at least one endpoint
- Plain-English description is clear and accurate
- Data classification is correctly applied
- API name follows naming conventions
- Owning team is contactable

**Open questions**:
- **Who owns the Reviewer role?** §11.2
- **DPIAs in publication review?** §11.10

### 4.6 Consumer onboarding *(derived — not in current Miro)*

**This journey is not in the Miro board.** It is implied by the "Register for marketplace" step in §4.1 and required by the Capabilities CSV items "Self-service consumer registration", "Email verification and account activation", and "Account recovery and password reset". Drafted here from convergence across One Login (5-minute self-serve), HMRC (account + email activation), and the HTML prototype's auth overlay.

**Trigger**: An anonymous visitor wants to become a registered Consumer. Two entry points:
- Click *Register* / *Create account* from the catalogue or any signed-out page.
- Hit *Request access* on an API detail page while signed out → auth prompt → register option.

**Happy path** (proposed, conformant with One Login's 5-minute pattern and the Capabilities CSV requirements):

1. *Start registration* — anonymous visitor clicks Register
2. *Enter email address* — domain validation runs (§11.15): if domain is on the approved-partner list, continue to step 3; if not, branch to the *Partner Organisation route* below
3. *Email verification* — security code sent; user enters code; code expires after 24h
4. *Set password* — minimum 8 characters; GDS passphrase guidance recommended
5. *Set up MFA* — TOTP authenticator app or mobile-SMS (§11.16). Backup codes generated and shown once
6. *Profile details* — first name, last name, organisation (pick from existing OR request to add new), job role
7. *Role declaration* — "I am registering as…" → **Consumer** (default), Producer, or Reviewer. *Note: producer + reviewer self-registration UX is in the HTML prototype but warrants review against §11.2 (Reviewer ownership).*
8. *Communications preferences (optional)* — opt in: API update notifications, new API announcements, AMp newsletter
9. *Accept terms of use* — once-only, version-tracked
10. *Account active* — welcome screen + first-time guidance
11. *(Optional)* First-time welcome flow — guided tour of the catalogue, "browse 3 APIs to learn the system" nudge, link to docs (§11.17)
12. **Journey complete** — Consumer is ready to use §4.1 (wants data) and §4.2 (wants new API)

**Organisation handling at signup**:
- If the email domain matches an existing Organisation (e.g. `*@hmcts.gov.uk` → "HMCTS"), the user is added to that Organisation as a Consumer member by default.
- If no Organisation matches, user is prompted: (a) join an existing Organisation by requesting access from its Org Admin, or (b) submit a request to register a new Organisation (kicks off **§4.7**).

**Alternate path — Partner Organisation route** (external partners not yet known to AMp):
1. Email domain not on the approved-partner list at step 2
2. User shown a Partner Organisation application form: organisation legal name, contact details, intended use case, sponsoring HMCTS contact (if any)
3. Submitted to AMp Admin for review (SLA: 10 working days — §11.9)
4. On approval: user receives invite link to complete registration; user becomes Org Admin for the new Organisation
5. On rejection: user notified with reason; reapply allowed after 30 days

**SLAs**:
- Email verification code expiry: **24 hours**
- Partner Organisation approval: **10 working days** (§11.9)
- Account lockout: **5 failed login attempts** → forced password reset

**Notifications**:
- Email: registration started, verification code, MFA backup codes, terms accepted, partner approval decision
- In-app: welcome banner persists 7 days

**Audit events**: `account.created` · `email.verified` · `mfa.enrolled` · `organisation.joined` *or* `organisation.requested` · `terms.accepted` · `consumer.role.declared`

**Reference comparison**:

| Aspect | NHS Digital | HMRC | One Login |
|---|---|---|---|
| Registration time | Multi-step (Keycloak) | "Register, activate by email, sign in" | **~5 minutes** (email + email code + mobile + SMS) |
| Approval at registration | None | None | None |
| Verification | Email + smartcard for CIS2 routes | Email | Email + mobile |
| MFA | Varies by route | Yes | Mandatory |
| Organisation handling | Implicit (ODS codes) | Single Application per Organisation | One service per Organisation |

**In-flow open questions** *(load-bearing ones promoted to §11)*:
- Email domain validation policy — §11.15
- MFA — mobile-required vs TOTP-optional — §11.16
- First-time UX after signup — guided tour vs straight to catalogue — §11.17

### 4.7 Producer / Organisation onboarding *(derived — not in current Miro)*

**This journey is not in the Miro board.** It is implied by the "Register as producer — organisation and team details" step in §4.4, by the Capabilities CSV item "Producer registration and organisation onboarding", and by the Organisation choice during Consumer signup (§4.6 step 6). Drafted here.

This journey establishes an **Organisation** as a first-class entity in AMp and grants it Producer status — the precondition for §4.4 (publishing APIs) and §4.4 onwards (reviewing access requests).

**Trigger**: A team needs to publish or transfer one or more APIs into AMp. Two entry points:
- A user (already a registered Consumer) requests to upgrade their Organisation to Producer status.
- A new organisation lands on the marketplace and clicks *Become a Producer* (kicks off Consumer onboarding §4.6 first, then re-enters here).

**Happy path**:

1. *Initiator registers* — if not already registered, completes §4.6 first
2. *Request Producer status for the Organisation* — initiator (Org Admin) submits the producer-readiness form:
   - Organisation legal name + display name
   - **Sector identifier** (immutable once set — One Login pattern, used for cross-Organisation correlation)
   - ODS code if applicable
   - Primary contact (name, email, role)
   - **Operational contact for incident response** (24/7 availability if applicable)
   - Initial list of APIs the Organisation intends to publish (optional)
   - Confirmation of accountability ("we are responsible for support, versioning, deprecation, and incident response for all APIs we publish")
3. *Automated pre-screening* — system checks email domain matches, no duplicate Organisation, all required fields complete
   - **Fail** → returned with clear reasons
   - **Pass** → continue
4. *Reviewer assesses* — AMp Reviewer (§11.2) validates Organisation legitimacy: producer team confirmed, sponsoring HMCTS contact verified if external, governance contacts in place, incident response model appropriate to intended data classification
5. *Initial decision* — same four-outcome pattern as publication review (§11.8):
   - **Approve** → step 6
   - **Conditionally approve** → step 6 with stipulations (e.g. *"DPIA framework must be in place before first Restricted-class listing"*)
   - **Query** → request more info → Org Admin responds → re-review
   - **Reject** → reason given; reapply allowed after 30 days
6. *Organisation upgraded to Producer status* — internal flag flipped; the Organisation can now both consume AND publish
7. *Welcome pack delivered* (email + in-app):
   - Link to the producer guide (in amp-site-docs — §9)
   - Link to the API publish wizard (kicks off §4.4)
   - Producer onboarding checklist (API design standards, classification mapping, DPIA expectations, etc.)
   - AMp contact for producer support
8. *Add team members* — Org Admin invites colleagues:
   - Email invitation with join link (30-day expiry)
   - Per-invite role assignment: **Org Admin** · **Producer** (can publish + review access requests) · **Producer-Reviewer** (can only review access requests, not publish) · **Read-only**
   - Recipient registers via §4.6 (Consumer onboarding) but joins this Organisation directly, skipping the org-selection step
9. *(Optional) First API listing* — Org Admin or any Producer can now begin §4.4 (publish flow)
10. **Journey complete** — Organisation operates as a Producer

**SLAs**:
- Producer status approval (Reviewer review): **10 working days** (HMRC pattern — §11.9)
- Team member invitation: **30 days** before expiry
- Removed team member's permissions: **revoked immediately**, including in-flight access requests

**Ownership transfer** (One Login self-stated gap — §7.3):
- Org Admin can nominate another active team member as new Org Admin
- Original Org Admin retains read-only access until transfer is confirmed via email link
- AMp Admin can force-transfer ownership on request, with audit, when the original Admin has left and not nominated a successor — **§11.18**

**Notifications**:
- Email: submission acknowledged, decision (approve/conditional/query/reject), team invitation sent + accepted + expired, ownership-transfer initiated + completed
- In-app: dashboard welcome pack, pending team-invite reminders, ownership-transfer prompts

**Audit events**: `organisation.created` · `organisation.producer-status.requested` · `organisation.producer-status.{approved|conditionally-approved|queried|rejected}` · `organisation.member.{invited|joined|removed|role-changed}` · `organisation.ownership.transferred` · `organisation.api.first-published`

**Reference comparison**:

| Aspect | NHS Digital | HMRC | One Login |
|---|---|---|---|
| Organisation as first-class entity | Implicit (ODS codes) | **Explicit** ([`api-platform-organisation-domain`](https://github.com/hmrc/api-platform-organisation-domain)) | Implicit (one Service per Organisation) |
| Producer / supplier approval | 10-step assurance | Implicit; producer registers Application | Self-serve service registration |
| Team management | Not publicly surfaced | Multi-user per Application | Yes, via admin tool |
| Ownership transfer | Not stated | Yes (Org-level admin) | **Self-stated gap** — not possible |

**In-flow open questions** *(load-bearing ones promoted to §11)*:
- Who can initiate Producer onboarding — anyone, or only nominated HMCTS contacts? — §11.18
- Ownership-transfer mechanism — §11.18
- Per-API ownership within an Organisation — is an API tied to the Organisation or to a sub-team? — §11.19

---

## 5. The consumer technical integration journey (post-grant)

The five Miro journeys cover the **marketplace transactional lifecycle** (find → request → approve → granted). They stop short of *"now what does the consumer technically do?"*.

All three reference portals — NHS Digital, HMRC, GOV.UK One Login — independently converge on the same **6-stage technical integration lifecycle**. AMp should adopt it; it's a known-good pattern that gives consumers a clear ramp.

| Stage | NHS Digital | HMRC | GOV.UK One Login | **Proposed for AMp** |
|---|---|---|---|---|
| **1. Understand** | "Understand the NHS landscape" | "Before you start" | "How GOV.UK One Login Works" | "What the API does, in plain English" |
| **2. Quick start** | (implicit — try sandbox) | (implicit — register + sandbox) | "Quick Start (Docker)" | "Try the mock server — no credentials required" *(prototype already supports this via SwaggerHub virtserver)* |
| **3. Before you integrate** | "Prepare your integration" | "Apply for a developer account" | "Before You Integrate" (auth method, keys, scopes) | Auth method · environments · data classification implications · rate limits · data-sharing obligations |
| **4. Integrate (sandbox)** | "Build your API integration" | "Subscribe Application in sandbox" | "Integration Environment" | Sandbox / staging access request → integrate against producer's test endpoint |
| **5. Test** | "Test your integration" | "Test in sandbox" | "Test your integration (simulator + e2e)" | Producer-defined test cases + load/perf expectations |
| **6. Go live** | "Go live with your integration" | "Apply for production credentials" (≤10 working days) | "Configure for Production" | Production access request → producer approves → credentials issued → audit logged |

**Important consequence**: AMp's docs surface needs to be **6-stage structured by default**, not random pages. The information architecture of the docs follows the customer's mental model of where they are in their integration.

This is also where **§9 docs surface decision** matters: a 6-stage tech doc structure is exactly what the GDS `tech-docs-template` is built for.

---

## 6. Capabilities catalogue (verbatim, organised)

Source: Miro "Capabilities" sticky board (CSV export, WIP). Stickies preserved verbatim. Two stand-alone "MVP" markers in the CSV are unattached — likely intended as MVP for "Browse APIs by domain, category and keyword" and "View API listings with plain language descriptions" but **§11.12** flags this as ambiguous.

### 6.1 API Catalogue & Discovery

- Browse APIs by domain, category and keyword *(MVP candidate)*
- View API listings with plain language descriptions *(MVP candidate)*
- Filter APIs by access type, status, classification and domain
- Display data classification labels e.g. public / private? *(open question — §11.6)*
- Show API ownership, version and lifecycle status
- Surface related APIs and suggested alternatives *(recommender feature)*
- Support unauthenticated browsing for open/public APIs
- Support **semantic / tag-based search** (business terms, not only API names — e.g. *Warrants*, *PrisonRegister*, *HearingResults*)

### 6.2 API Publication & Onboarding

- Create and submit API listings with documentation
- Define API metadata (name, description, version, domain, classification)
- Set access policy *(Open / Restricted / Partner-only)* *— values differ from journey flow's Open / Request-based / Restricted — §11.5*
- Upload or link to technical documentation and data dictionaries
- **Define rate limits, SLAs and usage policies** *(at publication time — implies producer sets defaults that may be overridden at access-grant time)*
- **Manage multiple API versions simultaneously**
- Submit APIs for review and approval before publication
- Show maturity levels *(Beta / Stable / Deprecated)* *— differs from prototype's longer taxonomy — §11.7*
- Display onboarding complexity and estimated approval time
- Recommend related APIs based on use case
- Track most popular / most used APIs
- Surface change logs and release notes
- *Meta (out of scope for the site, in scope for the product):* capture operating model — Platform Admin, Governance/Security ownership, Support/Ops responsibilities (incident, SLA monitoring, compliance)

### 6.3 User Registration & Identity Management

- Producer registration and **organisation onboarding** *(supports Organisation as a first-class entity — §3.2)*
- Role-based access control: **Consumer / Producer / Reviewer / Admin**
- SSO integration with existing identity providers
- Email verification and account activation
- Profile management and preference settings
- Self-service consumer registration
- Account recovery and password reset

### 6.4 API Publication Review & Approval

- Notify producers of review decisions
- **Audit trail of all review decisions**
- Automated validation of required submission fields
- Assignment of submissions to a review queue
- Ability to request further information from the producer *(= "Query" in §4.5)*
- **Approve, conditionally approve, or reject submissions with reasons** *(adds "conditionally approve" as a fourth outcome — §11.8)*
- Manual review of documentation, standards and policy compliance
- **Support for sandbox / staging environment access requests** *(non-prod environments managed through the same workflow)*

### 6.5 Access Request Management

- View history of all past access requests
- Submit structured access requests with business justification
- **Capture legal basis for data processing (where applicable)** *(GDPR-aligned field)*
- **Capture compliance and governance confirmations** *(declarations / checkboxes)*
- Resubmit requests following rejection with updated information
- Track request status in real time through the portal

---

## 7. Reference portal observations

We treat NHS Digital, HMRC, and GOV.UK One Login as **the three most relevant reference points** for AMp. All three are operational UK-gov developer portals at scale; their convergences are where AMp should default; their divergences are where AMp gets to choose deliberately.

### 7.1 NHS Digital — `digital.nhs.uk/developer`

**Front-end IA** — 7 top-level sections on `/developer`:
1. Getting started with our APIs (`/developer/getting-started`)
2. API and integration catalogue (`/developer/api-catalogue`) — **186 APIs**
3. Documentation, guides and tutorials (`/developer/guides-and-documentation`)
4. Developer community (`developer.community.nhs.uk` — separate Discourse subdomain)
5. Help and support (`/developer/help-and-support`)
6. Our architecture (`/developer/architecture`)
7. Onboarding to APIs and services — the **10-step Assurance process** (`/developer/assurance/process-for-apis-and-services`)

**Catalogue facets**: Business function (17) · Care setting (17) · Integration type (7) · Technology (16) · Status APIs (7) · Status standards (4) · Owner. Plus A–Z alphabetical jump.

Each listing carries **multiple status badges** (e.g. *"In production" + "Under review for deprecation"* concurrently). Listings show: name, description, status badges, care-setting tags, business function, technology tags.

**Identity model**: Keycloak (`identity.prod.api.platform.nhs.uk/realms/developer-identity/...`); separate **Digital Onboarding Service** app at `onboarding.prod.api.platform.nhs.uk`. Two-app split between docs and onboarding.

**Architecture layers** (from the layered diagram supplied by the team):

```
Infrastructure:  Google Apigee Edge (GCP)  +  AWS ECS (custom)  +  Azure Pipelines (CI/CD)
API platform:    API proxy (OAS/FHIR, Proxygen-deployed)
                 Rate limiting (SpikeArrest policy, Retry-After headers)
                 Audit & logging (central auth events, monitoring)
                 GitHub (open-source proxy code)
Auth services:   NHS CIS2 (workforce, smartcard/OIDC)
                 NHS login (public, OAuth 2.0)
                 App-restricted (system-to-system, signed JWTs)
Catalogue:       REST · FHIR R4 · UK Core · MESH messaging · HL7 V3 (legacy)
                 Key APIs: PDS · NRL · GP Connect · MESH · ODS · +50 others
Environments:    Sandbox → Integration → UAT/DEP → Production  (SIT / pen test required)
Onboarding:      Dev account → Sandbox dev → INT testing → Single assessment → Go live
```

**Key NHS lessons for AMp**:
- **"Single assessment"** for production access — once a supplier passes assurance, they're approved across multiple APIs, not per-API.
- **Multi-cloud is acceptable** in UK gov (GCP + AWS + Azure). HMCTS-standard Azure is still the right default for AMp, but mixing is not heretical.
- **Producer tooling matters**: NHS's `Proxygen` automates "OAS spec → deployed proxy". If AMp goes gateway-mode (§8), we need a producer experience like this.
- **Multiple status badges per listing** is more honest than a single-value status field.
- **A separate Discourse forum** (`developer.community.nhs.uk`) for community support. Worth considering for AMp's support model.

### 7.2 HMRC Developer Hub — `developer.service.hmrc.gov.uk`

**Five-entity domain model** (HMRC's most important contribution):

```
User ──belongs to──> Organisation ──owns──> Application ──subscribes to──> API @ Version
```

This separation is the cleanest answer to AMp's open questions about credential ownership, multi-version subscriptions, and per-grant rate limits.

**Two-environment model**: Sandbox (free, no approval) → Production (Application review, **≤10 working days**). Same API code, different base URLs.

**Three auth tiers**:
- **Open access** — no token required
- **Application-restricted** — OAuth 2.0 client credentials grant
- **User-restricted** — OAuth 2.0 authorisation code grant

**Catalogue organised by user-language tax domain** — Self Assessment, VAT, PAYE, Corporation Tax, Customs, Charities, Trusts, Pensions, Construction Industry Scheme, Lifetime ISA, Making Tax Digital, etc. — *not by HMRC's internal team structure*.

**API detail page tabs**: Overview / Errors / Testing / Fraud Prevention / Versioning / Endpoints. Right-rail metadata: API Type, Latest Version, Last Updated, Sandbox Base URL, Production Base URL, Fraud Prevention Headers.

**Development practices**:
- **6 months breaking-change notice** required
- "Single application per organisation" recommended
- No CORS — server-to-server only
- Sandbox-first development → automated weekly tests recommended
- "Gov-Test-Scenario" header lets sandbox simulate error states

**Open source** — [`hmrc/`](https://github.com/hmrc) has 24+ active `api-platform-*` repos in Scala. Most relevant for our **domain modelling**:

| Repo | What it models |
|---|---|
| `api-platform-application-domain` | Application entity |
| `api-platform-organisation-domain` | Organisation entity |
| `api-platform-api-domain` | API entity |
| `api-platform-events` + `api-platform-application-events` | Event-sourced state model |
| `api-platform-api-catalogue-publish` | Publishing pipeline |
| `api-platform-deskpro` | Support integration (DeskPro ticketing) |
| `api-platform-organisation-frontend` | Manage Applications UI |

**We won't fork** (Scala vs. our likely Next.js; opinionated micro-service stack). But the **MIT-licensed domain models are worth reading** when we design our schema.

**Key HMRC lessons for AMp**:
- **Adopt the User → Organisation → Application → Subscription → API model** (§3.2).
- **Sandbox-first onboarding** — anyone with an account can integrate against sandbox immediately; production gating is the *only* approval gate.
- **Catalogue should be organised by the user's mental model**, not the org chart.
- **6-month breaking-change notice** is a sensible default for AMp's deprecation policy.

### 7.3 GOV.UK One Login

**3-app architecture**:

| App | Domain | Purpose |
|---|---|---|
| Main service | `www.sign-in.service.gov.uk` | End-user sign-in (anonymous consumers of the service) |
| Admin tool | `admin.sign-in.service.gov.uk` | Service-team self-serve (separate app, separate auth) |
| Tech docs | `docs.sign-in.service.gov.uk` | Developer technical documentation (separate static site, built on GDS tech-docs-template) |

**Self-serve registration in 5 minutes** with no approval gate at registration. Gov email + mobile 2FA → fill client config form → Client ID issued immediately. Same model HMRC uses. The approval gate sits at the *integration → production* boundary, not at *signup*.

**The Service entity** (One Login's equivalent of HMRC's Application) carries:
- Client ID (system-assigned, unique, immutable)
- Client Name (shown to end users)
- Contacts (email addresses for ops)
- Redirect URLs (multiple)
- Post-logout URLs (multiple)
- Back channel logout URI
- **Sector identifier (immutable once set)**
- Scopes (`openid` mandatory; `email`, `phone` optional)
- Claims (identity attributes: coreIdentityJWT, returnCode, passport, drivingPermit, address)
- Token auth method (`private_key_jwt` recommended, `client_secret_post` fallback)
- Public key (JWKS endpoint URL **or** static PEM)
- ID token signing algorithm (RS256 or ES256)

**Per-environment Client IDs**: "If you have staging, user acceptance testing, integration and production you should configure 4 client IDs". A different choice from HMRC (one Application, multiple environments) — both work.

**JWKS-first key model**: the platform **doesn't issue secrets**. Service team generates RSA 2048 keypair locally (`openssl genpkey`), exposes the public key via JWKS endpoint, the platform caches up to 24 hours. Rotation = "publish new `kid` → wait for cache → retire old `kid`" with zero downtime. Emergency revocation via "Live Service Hub" (separate operational channel).

**Self-stated gap**: *"It is currently not possible to reassign ownership if someone leaves."* — One Login admits this. **AMp should design ownership-reassignment from day one.**

**6-stage tech doc lifecycle** (sidebar nav structure):
1. How GOV.UK One Login Works
2. Quick Start
3. Before You Integrate
4. Integrate with Integration Environment
5. Test Your Integration
6. Configure Your Service for Production

This is the third independent confirmation of the 6-stage integration lifecycle (§5).

**Open source** — [`govuk-one-login/`](https://github.com/govuk-one-login) has 30+ TypeScript/Java repos. The tech-docs repo at [`govuk-one-login/tech-docs`](https://github.com/govuk-one-login/tech-docs) is itself published using the GDS Tech Docs Template (§7.4).

**Key One Login lessons for AMp**:
- **Adopt the JWKS-first key model** — the platform should not issue secrets. Consumer organisations publish public keys; the platform validates signatures. Rotation responsibility lives with the consumer.
- **Self-serve registration in 5 minutes with no approval gate** — approval lives at production, not at signup.
- **Plan for ownership reassignment** from day one. Don't tie a Service or Organisation immutably to a single user's email.
- **Sector identifier-style immutable fields** are a useful pattern for fields where late changes break the system.
- **Three-app pattern** (main / admin / docs) is a possible architecture — see §9.

### 7.4 GDS Tech Docs Template — the de facto pattern

The standard GDS pattern for technical documentation across UK government.

- [`alphagov/tech-docs-template`](https://github.com/alphagov/tech-docs-template) — canonical Middleman-based template. 81★, 35 forks, MIT, actively maintained.
- [`alphagov/tech-docs-gem`](https://github.com/alphagov/tech-docs-gem) — distributed as a Ruby gem.
- [`alphagov/tech-docs-linter`](https://github.com/alphagov/tech-docs-linter) — Vale ruleset enforcing GDS content standards.

**Production services using it** (all actively maintained):
- GOV.UK One Login → [`govuk-one-login/tech-docs`](https://github.com/govuk-one-login/tech-docs)
- GOV.UK Pay → [`alphagov/pay-tech-docs`](https://github.com/alphagov/pay-tech-docs)
- GOV.UK Notify → [`alphagov/notifications-tech-docs`](https://github.com/alphagov/notifications-tech-docs)
- data.gov.uk → [`alphagov/datagovuk-tech-docs`](https://github.com/alphagov/datagovuk-tech-docs)
- GOV.UK Developer Docs → [`alphagov/govuk-developer-docs`](https://github.com/alphagov/govuk-developer-docs)

**What the template ships**: Middleman generator · built-in GOV.UK styling · Mermaid (`.mmd` → SVG) + draw.io (`.drawio` → SVG) diagram pipelines · Vale linter with `tech-docs-linter` ruleset · AWS CloudFormation deploy template · Docker preview script · MIT code + Open Government Licence 3.0 content.

**Five+ flagship gov services use this** — that's a de facto standard. See §9 for the architectural choice this implies.

---

## 8. The architectural fork — **Gateway** vs **Broker**

This is the single biggest decision in the spec. The Miro artefacts implicitly disagree with each other on this, and the answer determines roughly half of the build cost.

### 8.1 The two options

| Aspect | **Gateway-mode AMp** | **Broker-mode AMp** |
|---|---|---|
| Runtime traffic | Consumer → AMp gateway → Producer service | Consumer → directly to Producer service |
| Rate limit enforcement | **Central** (AMp gateway, SpikeArrest-style) | Producer-enforced (each producer runs their own) |
| Auth | AMp issues / validates tokens | Producer's own auth |
| Audit / observability | Central; AMp sees every call | Distributed; only producer sees calls |
| Credential management | AMp issues + rotates | Producer issues; or JWKS-first (One Login pattern) |
| Producer tooling needed | Spec-to-proxy automation (NHS Proxygen-style) | None beyond catalogue listing |
| Day-1 build cost | **High** — stand up Azure APIM (or equivalent), proxy automation, OAuth server, key management, monitoring | **Low** — catalogue + request paperwork only |
| Day-N migration cost | — | **High** — retrofitting a gateway later is painful, especially across many APIs |
| Strategic value | Strong — AMp becomes the platform itself | Weaker — AMp is a directory and process tool |
| Fits Miro Access Request flow? | Tension — Miro shows producer "issues credentials" at OUTCOME ✓ | Yes |
| Fits Capabilities CSV? | Yes — "define rate limits, SLAs" implies central enforcement | Tension — central rate limits hard without gateway |
| What NHS does | Gateway (Apigee Edge) | — |
| What HMRC does | Gateway | — |
| What One Login does | Gateway (itself an OAuth/OIDC provider) | — |

### 8.2 The Miro artefacts disagree with each other

| Artefact | Implies | Why |
|---|---|---|
| Miro Access Request flow | Broker | Producer "Approves — issues credentials and sets limits" at OUTCOME ✓ |
| Miro Full swimlane | Broker | Same — credentials issued by producer |
| Capabilities CSV "Define rate limits, SLAs and usage policies" | Gateway | Rate limit enforcement implies a central point |
| Capabilities CSV "Audit trail of all review decisions" | Either | Decision audit doesn't require traffic gateway |
| Capabilities CSV "Track most popular / most used APIs" | Gateway-leaning | Usage analytics require seeing traffic |

### 8.3 Proposed default: **Broker v1, gateway adapter from day one**

**Proposed default**: Build AMp in **broker mode** for v1, with a clean adapter boundary so a gateway can be layered on later when (a) HMCTS stands up an APIM, or (b) a specific producer wants to outsource their gateway concerns to AMp.

**Reasoning**:
- Broker-mode v1 ships faster and serves both the catalogue and the demand-signalling journey (§4.2) immediately.
- The five Miro journeys are all *transactional* — none require runtime traffic interception. The marketplace can fulfil all five journeys as a broker.
- Federated ownership (AMp principle 5 — "product teams own end-to-end") aligns more naturally with broker-mode.
- Adopting the **One Login JWKS-first model** for credentials (§7.3) removes the strongest argument for gateway-mode (centralised secret issuance) without needing a gateway.
- Rate limits in broker mode can be **declarative metadata on the listing** (producer states "I rate-limit at 1000 rpm") rather than centrally enforced. Capabilities CSV remains satisfied.
- The adapter pattern keeps the door open: if/when HMCTS deploys Azure APIM, the AMp listing's "access policy" payload can be machine-readable enough to provision an APIM subscription automatically.

**This is a recommendation, not a decision.** The team may decide that being a gateway from day one is the right strategic bet — in which case the spec changes shape substantially. See §11.3.

---

## 9. Docs surface decision — single-app vs two-app

A separate but related architectural question. Three options, each viable.

### Option 1 — Single Next.js app, content in MDX/Markdown

- One stack, one repo, one CI/CD pipeline.
- Content authors contribute MDX files directly into the repo.
- We re-implement (or skip) what the GDS tech-docs-template solves: Vale linter, Mermaid+drawio diagram pipeline, gov-conformant content styling.
- **Pro**: stack simplicity.
- **Con**: reinvents gov-standard tooling.

### Option 2 — Two-app pattern: Next.js + GDS tech-docs-template (**Recommended**)

- Catalogue + dashboards + wizards live in **Next.js** at `amp-site` (or similar).
- Vision, principles, playbook, glossary, recipes, decisions, integration guides live in a **separate `amp-site-docs` repo** using the GDS Tech Docs Template.
- Tech writers contribute Markdown with Vale linting on every PR.
- Mirrors what GOV.UK Pay, Notify, One Login, data.gov.uk all do.
- **Pro**: industry-conformant; tech writers across UK gov feel at home; content quality enforced automatically; tooling already solved.
- **Con**: Ruby/Middleman runtime added to the team's surface area; two repos to keep in sync.

### Option 3 — Three-app pattern: catalogue + admin + docs

- As Option 2 but with **admin** split from the catalogue/public site too.
- Matches One Login's actual architecture.
- **Pro**: clean separation of public read-only catalogue from authenticated admin.
- **Con**: heaviest split; only worth it if admin self-serve will evolve very differently from the consumer-facing catalogue. AMp v1 probably doesn't need this.

### Proposed default: **Option 2**

Reasons: (a) the docs ARE the integration journey, and the integration journey is a known-good 6-stage shape (§5) that maps cleanly to a static site; (b) Vale + GDS content tooling save us reimplementing content quality; (c) tech writers in HMCTS and across gov already know the pattern; (d) docs can ship independently of app releases.

**Implication**: the amp-site working directory likely needs two siblings — a `web` (Next.js) and a `docs` (Middleman) sub-tree, or two separate repos. Layout TBD in design phase.

---

## 10. Reconciliation deltas across artefacts

Where the source artefacts disagree. Resolving each is part of the §11 open questions; this table is a single index so nobody has to remember which artefact said what.

| Topic | Miro Intro | Miro Producer flow | Miro Full swimlane | Miro Five Flows | Capabilities CSV | HTML prototype | `api-marketplace-product` repo | Resolution path |
|---|---|---|---|---|---|---|---|---|
| Role name | "API **Provider**" | "Producer" | "Producer / API Owner" | "Producer" | "Producer" | "Producer" | "producer" | §11.1 — pick one |
| Reviewer role owner | — | "Approver TBD" | sticky: *"Who is the review?"* | "Reviewer notified — TBD" | "Reviewer" (no owner) | self-registers via auth screen | not mentioned | §11.2 — assign |
| Approval gates | — | publication only | both publication and access | both | both | only publication explicit | producer + governance | already aligned — both |
| Publication outcomes | — | Approve / Reject | Approve / Reject | **Approve / Query / Reject** | "Approve, **conditionally approve**, or reject" | Approve / Reject | not specified | §11.8 |
| Access policy values | — | not stated | not stated | **Open / Request-based / Restricted** | **Open / Restricted / Partner-only** | not specified | not specified | §11.5 |
| Credential model | — | "Issues credentials" | "Issues credentials and sets limits" | "Credentials issued, rate limits" | "Define rate limits at publication" | not specified | federated | §11.7 — JWKS-first proposed |
| Anonymous browse | — | — | yes (Discovery before Registration) | yes (Consumer flow) | "Support unauthenticated browsing" | yes (home page public) | implicit | aligned — yes |
| API transfer flow | — | — | yes (auxiliary) | not shown | not mentioned | not in prototype | not in docs | new requirement; thin detail; needs working session |
| SLA targets | — | — | "SLA timer starts" (×2) | **5 days / 3 days** for "more info" | not stated | not implemented | not specified | §11.9 |
| Maturity / status taxonomy | — | pending/queried/rejected/live | — | same | **Beta / Stable / Deprecated** | In dev / Beta / In production / Deprecated / Retired | not stated | §11.7 — two-axis model proposed |
| Multi-version | — | "version" field | — | — | "**Manage multiple versions simultaneously**" | single-version per listing | not specified | proposed: adopt HMRC version-as-subscription pattern |
| Rate limits | — | not stated | not stated | "Sets limits" at access grant | "Define at publication time" + per-grant | "Volumes" field on request | not specified | proposed: both — producer sets defaults, access grant can override |
| Role list | Consumer / Provider | Consumer / Producer / Reviewer | same + Admin (implicit at escalation) | + Admin (explicit at SLA breach) | Consumer / Producer / Reviewer / **Admin** | Consumer / Producer / Reviewer | producer / consumer | resolved — 4 roles |
| Recommender / analytics / change logs | — | — | — | — | yes | partial | not stated | §11.11 — MVP? |
| Organisation entity | — | "Organisation and team details" at registration | — | — | "organisation onboarding" | "Organisation" field on profile | not modelled | §11.x — proposed yes |
| Application entity | — | — | — | — | — | — | — | not in any AMp artefact; HMRC/One-Login imported — §11.x proposed |
| DPIAs | — | — | — | sticky: *"DPIA's?"* | — | — | not mentioned | §11.10 |
| Public/private data flag | — | — | — | sticky: open | "Display data classification labels e.g. public private?" | data classification field (Official/Sensitive/Restricted) | not stated | §11.6 |

---

## 11. Open questions (with proposed defaults)

All open questions are stated as questions, **followed by a proposed default**. The reader is invited to push back where they disagree; defaults are starting positions, not decisions.

### 11.1 Producer or Provider?

Miro Introduction frame uses **Provider**. Every other artefact uses **Producer**. The terms are semantically interchangeable.

**Proposed default**: **Producer**.

*Reasons*: (a) consistent with the existing HMCTS `api-marketplace-product` repo, the HTML prototype, and the four detailed Miro flows; (b) "Producer" is a more active term — implies ownership and operation, not just authorship; (c) only the static Introduction frame uses "Provider" and updating one frame is cheaper than updating six places.

### 11.2 Who is the Reviewer?

The Reviewer role exists in every artefact, but the owning team is unnamed. Candidates: AMp product team, HMCTS API Governance Board, HMCTS Common Platform Architecture, or some hybrid.

**Proposed default**: **AMp product team are the Reviewers for v1**, with explicit escalation paths to (a) Architecture for technical concerns and (b) Information Governance for data-classification concerns.

*Reasons*: keeps the workflow moving without convening a board for every listing; AMp team has the day-to-day relationship with both producers and consumers; escalation paths preserve governance for the cases that need it.

### 11.3 Gateway or broker?

The architectural fork (§8).

**Proposed default**: **Broker v1, gateway adapter from day one**, with the JWKS-first key model adopted from One Login.

*See §8.3 for reasoning.*

### 11.4 How are access requests routed?

Always to the producer? Or do some go to AMp Admin (e.g. cross-cutting, highly sensitive, or where the producer team is unresponsive)? The Miro sticky *"Requests to owner?"* flags this as open.

**Proposed default**: **Default route is to the producer**, with two override paths:
- Listings flagged at *Official-Sensitive* or *Restricted* classification → additional Reviewer compliance check (Miro full swimlane has this as the *"Checks Compliance"* node)
- Requests escalated due to producer non-response (SLA breach) → route to Admin

### 11.5 Access policy values

Two competing taxonomies:
- Miro Producer flow: **Open / Request-based / Restricted**
- Capabilities CSV: **Open / Restricted / Partner-only**

**Proposed default**: **Open / Request-based / Restricted / Partner-only** (union of both, four values).

*Definitions*:
- **Open** — listed in catalogue, anyone can integrate; no access request needed.
- **Request-based** — listed in catalogue, integration requires an approved access request (the default for most APIs).
- **Restricted** — listed in catalogue with masked detail; integration requires approval + heightened scrutiny (Reviewer compliance check).
- **Partner-only** — listed only to logged-in users from a pre-approved partner Organisation (visibility-gated, not just access-gated).

### 11.6 Public / private data flag — what does anonymous browse reveal?

Miro stickies repeatedly flag this: *"Display data classification labels e.g. public / private?"* and *"Search public data without logging."*

**Proposed default**: **The catalogue's listing visibility is governed by the access policy (11.5), not by data classification.**

- Open, Request-based, Restricted listings → visible to anonymous visitors with full metadata, including data classification badge.
- Partner-only listings → visible only to logged-in users whose Organisation is on the approved-partner list.
- Data classification (Official / Official-Sensitive / Restricted) is **always shown as a badge** on the listing, regardless of access policy. The classification itself is metadata, not a hiding rule.

### 11.7 Status taxonomy

The artefacts use three different status models:
- Prototype: *In development / Beta / In production / Deprecated / Retired*
- Capabilities CSV: *Beta / Stable / Deprecated*
- Miro Publication Review flow: *pending / queried / rejected / live*

These are actually **two different axes** that have been conflated.

**Proposed default — two-axis status model**:

**Axis 1 — Lifecycle status** (the API's maturity, surfaced to consumers):
- `in-development` — being designed/built; not yet in catalogue
- `beta` — published, available for integration, breaking changes possible
- `stable` — published, breaking changes only with 6 months notice (HMRC pattern)
- `deprecated` — still works but a successor exists; new integrations discouraged
- `retired` — no longer accessible

**Axis 2 — Listing workflow status** (the AMp record's state, internal):
- `draft` — producer is editing, not yet submitted
- `pending` — submitted to Reviewer
- `queried` — Reviewer requested clarification
- `rejected` — Reviewer rejected with reason; producer needs to rework
- `live` — approved and visible
- `withdrawn` — producer withdrew from catalogue

A listing can be *(beta, live)* or *(deprecated, live)* or *(in-development, draft)* etc. Multiple status badges on a listing (NHS pattern) reflect both axes.

### 11.8 Publication review outcomes — 2, 3, or 4?

- Producer flow (Miro): 2 — Approve / Reject
- Publication Review flow (Miro): 3 — Approve / Query / Reject
- Capabilities CSV: implied 4 — Approve / Conditionally approve / Query / Reject

**Proposed default**: **4 outcomes** as the Capabilities CSV suggests. Definitions:

- **Approve** — listing goes live as submitted.
- **Conditionally approve** — listing goes live with reviewer-issued conditions (e.g. "must add OAuth flow documentation within 30 days"). Status: live, but flagged with an outstanding condition visible to the producer.
- **Query** — reviewer needs information before deciding. Status: queried. Producer responds; review re-enters the queue.
- **Reject** — listing does not go live. Mandatory reason. Producer reworks and resubmits.

### 11.9 SLA targets

Concrete numbers needed for SLAs the artefacts flag as having timers.

**Proposed defaults** (cribbed from HMRC and the Miro Access Request flow):

| SLA | Proposed default | Source |
|---|---|---|
| Publication review SLA — Reviewer responds | **5 business days** | proposed |
| Access request — Producer initial response | **5 business days** | proposed |
| Consumer response to "more info" request | **5 business days** | Miro flow (explicit) |
| Inactivity → admin escalation | **3 days within the 5-day window** | Miro flow (explicit) |
| Production go-live assessment (if AMp adds one) | **10 working days** | HMRC pattern |
| Breaking change notice | **6 months minimum** | HMRC pattern |
| Deprecation-to-retirement notice | **12 months minimum** | proposed |

### 11.10 DPIAs in publication review?

Miro sticky: *"DPIA's?"* — open question whether Data Protection Impact Assessments are required as part of publication review.

**Proposed default**: **Conditional on data classification.**

- Official → no DPIA required at publication.
- Official-Sensitive → DPIA URL must be linked in the listing; reviewed.
- Restricted → DPIA must be linked and reviewed; AMp Information Governance escalation route activated.

### 11.11 Are recommender / analytics / change logs MVP?

Capabilities CSV calls for: surface related APIs, popularity ranking, change logs, release notes. None of these appear in the Miro journeys.

**Proposed default**: **Not MVP. Phase 2 features.**

- Change logs — yes if cheap (auto-extracted from version metadata) — borderline MVP.
- Release notes — producer-authored; defer to Phase 2.
- Related APIs / "you might also like" — defer to Phase 2; needs catalogue density before useful.
- Popularity ranking — defer to Phase 2; requires usage analytics, which is broker-mode infeasible (§8).

### 11.12 What do the two stand-alone "MVP" markers in the Capabilities CSV refer to?

The CSV has two unattached "MVP" markers under §6.1 (API Catalogue & Discovery), positioned after "Support semantic / tag-based search". They could plausibly mark: (a) the first two capabilities in §6.1; (b) some specific capabilities in adjacent rows; or (c) be aspirational placeholders.

**Proposed default**: **MVP scope is "Browse + View + Filter" — the first three capabilities in §6.1 plus "Show API ownership, version and lifecycle status" and "Support unauthenticated browsing for open/public APIs".** Treat semantic/tag search, recommenders, and data-classification-aware visibility as Phase 2.

This is a flag to confirm with whoever placed the MVP markers in Miro. **The CSV is WIP per the team.**

### 11.13 Docs surface architecture

Single Next.js app with MDX content, or two-app pattern with the GDS Tech Docs Template for docs? (§9)

**Proposed default**: **Two-app pattern (Option 2 in §9)** — Next.js for amp-site, GDS Tech Docs Template for amp-site-docs.

### 11.14 Adopt Organisation + Application + Subscription as first-class entities?

(§3.2)

**Proposed default**: **Yes.** HMRC and One Login both do; the model is battle-tested; it solves rate-limit, credential, and multi-version ownership cleanly.

### 11.15 Consumer email domain validation policy

From §4.6. Should AMp pre-validate the email domain at registration (block disposable/personal addresses, gate at the partner-list boundary), allow any address subject to manual review, or run a hybrid model?

**Proposed default**: **Hybrid**.

- Allow-list for HMCTS and approved gov domains (`*.gov.uk`, `*.justice.gov.uk`, `*.hmcts.gov.uk`, etc.) → immediate self-serve registration.
- Anything else → routed via the *Partner Organisation* alternate path in §4.6, requiring AMp Admin review.
- Block-list disposable email providers (Mailinator etc.) outright with a clear message.

### 11.16 MFA policy at registration

From §4.6. Mobile-only (One Login pattern), TOTP-only (more inclusive for external partners without UK mobile numbers), or both available?

**Proposed default**: **Both available; TOTP recommended.**

- TOTP authenticator app is the default offered (works for external partners; no SMS cost).
- Mobile SMS available as an alternative for users without authenticator apps.
- WebAuthn / passkeys as a Phase 2 enhancement.
- Backup codes generated and shown once at MFA setup (lost-device recovery).

### 11.17 First-time consumer UX after signup

From §4.6. Guided tour, "browse 3 APIs" nudge, or straight to the catalogue?

**Proposed default**: **Straight to the catalogue, with a persistent welcome banner for 7 days** offering a 2-minute video / quick-tour link. Don't block the consumer; do offer help on tap.

### 11.18 Producer onboarding initiation and ownership transfer

From §4.7. Two related sub-questions:

(a) **Who can initiate Producer onboarding?** Anyone with an account, or only nominated HMCTS contacts?

**Proposed default**: **Anyone whose Organisation is on the approved-partner list.** Non-partner Organisations must complete the §4.6 Partner Organisation alternate path first.

(b) **Ownership-transfer mechanism** (One Login self-stated gap from §7.3)?

**Proposed default**: **Three transfer modes**:
1. **Voluntary nomination** — current Org Admin nominates a successor; transfer confirmed via email link.
2. **Peer takeover** — another existing Org Admin in the same Organisation can claim, no further approval needed.
3. **AMp Admin force-transfer** — for cases where the original Org Admin has left and not nominated a successor. Requires a written request, AMp Admin review, and is fully audited.

### 11.19 Per-API ownership within an Organisation

From §4.7. When an Organisation has multiple teams, can an API be tied to a sub-team within the Organisation, or is the Organisation the only ownership unit?

**Proposed default**: **Organisation is the ownership unit; sub-teams represented as labels/tags on the listing, not as separate owners.** Reasons: (a) keeps the data model flat; (b) Organisation Admin always retains the override; (c) sub-team UX can be layered on later via tags + filtering without re-modelling. Re-visit if HMCTS-scale producers (e.g. the entire CPP Programme) need true sub-team isolation.

---

## 12. Non-goals for this document

This document deliberately does **not**:

- **Propose an information architecture** for amp-site (which pages, what hierarchy, what URL structure). That's design-phase.
- **Lock a tech stack** beyond GOV.UK Design System adherence. Next.js + GDS Tech Docs Template is recommended but not bound.
- **Design any screens.** No wireframes, no mockups, no copy beyond the verbatim Miro Introduction frame.
- **Define the database schema** or API surface. Entity *candidates* are surfaced (§3.2) but not modelled.
- **Sequence the build.** No phasing, no milestones, no MVP cut beyond surfacing the source artefact's MVP markers.
- **Replace the source artefacts.** The Miro board remains canonical. This document is a synthesis aid, not a substitute.

When this document is read and decisions on §11 captured, the next phase is **design** (Phase 3 in the working plan), where the brainstorming and writing-plans skills produce the actual spec.

---

## Appendix A — Artefact inventory

Sources used in this discovery, in order of authority for product/journey decisions.

| Artefact | Path / URL | Status |
|---|---|---|
| Miro board | `https://miro.com/app/board/uXjVJW-oswM=/` | **Canonical** — primary source of product thinking |
| Miro Introduction frame (image) | shared in session 2026-05-20 | **Canonical positioning copy** |
| Miro Full Journey Map (PDF) | `~/Downloads/HMCTS API Marketplace.pdf` (page 1) | **Canonical journeys** |
| Miro Five Flows (PDF) | `~/Downloads/HMCTS API Marketplace (1).pdf` (page 1) | **Canonical journeys, detailed** |
| Miro Capabilities (CSV) | `~/Downloads/HMCTS API Marketplace.csv` | **Canonical capabilities (WIP per team)** |
| NHS Architecture diagram (image) | shared in session 2026-05-20 | reference — NHS layers |
| HTML prototype | `~/Downloads/api-catalogue-v7 1.html` | **Stale** — earlier UX thinking, useful sandbox |
| `api-amp/api-marketplace-product` repo | `~/development/workspace/hmcts/api-amp/api-marketplace-product/` | **Stale** — earlier documentation thinking; some elements (vision, principles) likely still valid; the team has noted not to treat as authoritative |
| NHS Digital developer portal | `https://digital.nhs.uk/developer` (front-end), architecture layers (image) | reference |
| HMRC Developer Hub | `https://developer.service.hmrc.gov.uk/api-documentation` | reference |
| GOV.UK One Login | `https://docs.sign-in.service.gov.uk/` + admin tool + main service | reference |
| GDS Tech Docs Template | `https://github.com/alphagov/tech-docs-template` | reference |
| HMRC open-source domain models | `https://github.com/hmrc/api-platform-*` (24+ Scala repos) | reference — useful when designing schema |

## Appendix B — Glossary

Terms used in this document and their canonical definitions. Aligned with the existing AMp glossary in `api-amp/api-marketplace-product/playbook/glossary.md` where they overlap; extended where new entities are proposed.

| Term | Definition |
|---|---|
| API Product / Listing | A managed, documented API offering with clear ownership, lifecycle controls, and published onboarding instructions. |
| API Version | A specific contract revision of an API. Producers may maintain multiple versions simultaneously. |
| Application (proposed entity) | A registered piece of consumer software that consumes APIs. Owned by an Organisation. Holds credentials, redirect URIs, environment binding. |
| Catalogue | The central registry of all API products available through the Marketplace. |
| Consumer | A team or service that integrates with an API product listed in the Marketplace. |
| Contract | The machine-readable and human-readable API definition (e.g. OpenAPI spec). |
| Data classification | Official / Official-Sensitive / Restricted. Always visible on listings regardless of access policy. |
| Decision audit | An auditable record of every Reviewer or Producer decision (approval, rejection, query, conditional approval, escalation). |
| JWKS endpoint | A consumer-published HTTPS URL returning JSON Web Key Set. Public keys used to validate signed JWTs. Adopted from One Login pattern. |
| Lifecycle status | The maturity of an API: in-development / beta / stable / deprecated / retired. |
| Listing workflow status | The state of a listing record in AMp: draft / pending / queried / rejected / live / withdrawn. |
| Organisation (proposed entity) | A team, department, or supplier. Users belong to Organisations. Applications and listings are owned by Organisations, not users. |
| Producer | A team that owns and publishes an API product through the Marketplace. (See §11.1 — naming TBD.) |
| Recipe | A reusable delivery pattern for a common API type, with documented trade-offs and a delivery checklist. |
| Reviewer | Marketplace governance role. Gates publications. Also compliance-checks sensitive access requests. (See §11.2 — owner TBD.) |
| Subscription (proposed entity) | A binding of an Application to a specific API at a specific version. Holds rate limits, credentials, environment, and access status. |
