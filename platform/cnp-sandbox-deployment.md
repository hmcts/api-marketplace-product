# Deploying an application to the CNP sandbox

What it actually takes to get a service running in CNP **sandbox**, in the order the steps depend
on each other, with the traps attached to the step that springs them.

Sandbox only. AAT, demo and production differ in ways that matter — most of all because
`withPipeline` does not run Terraform in sandbox, which reorders everything below.

> **Provenance.** Items marked **✔ verified** were checked directly against the live platform
> repositories while onboarding `apim`/`try-slc` in October 2026. Items marked **▸ recorded** come
> from the onboarding notes written by whoever hit them first, chiefly
> [`service-api-marketplace/CNP-ONBOARDING-PLAN.md`](https://github.com/hmcts/service-api-marketplace/blob/master/CNP-ONBOARDING-PLAN.md).
> Both are trustworthy; only the first was re-checked.

---

## First, work out which half of this page applies to you

The amount of work differs enormously depending on whether your **product** already exists on CNP.

| Once per **product** | Once per **component** |
|---|---|
| `team-config.yml` entry in `cnp-jenkins-config` | `deployment-controls.yml` entry |
| `apps/{product}/` namespace kustomizations in `cnp-flux-config` | `terraform-infra-approvals/{repo}.json` |
| `apps/{product}/sbox/base/kustomization.yaml` | `apps/{product}/{release}/` HelmRelease, image policy, image repo |
| `apps/{product}/serviceaccount/sbox.yaml` with the managed identity client id | `apps/{product}/{release}/sbox.yaml` patch |
| Key Vault and managed identity, created by the first component's Terraform | Your own Terraform, if you need a database |

Three AMP services sit on both sides of that line. `service-api-marketplace` was the **first**
component for the `apim` product: it created the resource group, vault, managed identity and the
namespace wiring. `web-api-marketplace` and `try-cp-crime-schedulingandlisting-courtschedule` were
**second and third**, and reused all of it — which is why their onboarding was narrow and fast.

If your product already exists, you can skip the left column entirely. **✔ verified**

---

## The order, and why it is this order

In AAT the pipeline applies your Terraform for you. **In sandbox it does not**, so the vault
secrets your pods need do not exist until someone applies Terraform by hand. Flux will happily
deploy a pod that then crash-loops looking for a secret, so the sequence matters.

```
repo + topic
   └─> cnp-jenkins-config  (deployment-controls + terraform-infra-approvals)
          └─> terraform apply, MANUALLY            <-- the step nobody expects
                 └─> vault secrets now exist
                        └─> cnp-flux-config  (HelmRelease, image policy, sbox patch)
                               └─> first Jenkins build
                                      └─> chart published to hmcts-charts
                                             └─> Flux reconciles, pod runs
```

Raising the Flux PR early does not help: the HelmRelease points at `./stable/{chart}` in
`hmcts-charts`, which only appears once a build has published it. **✔ verified**

---

## 1. Repository

| | Step | Notes |
|---|---|---|
| 1.1 | Create the repo under `hmcts` | |
| 1.2 | Add the GitHub **topic** that matches your Jenkins folder | `jenkins-cft-j-z` for CFT repos starting j–z. Without it the org scan never picks the repo up and no job appears |
| 1.3 | `Jenkinsfile_CNP` with `withPipeline(type, product, component)` | `type` is `java` or `nodejs`; it selects the build chain, base image and Helm dependency chart |
| 1.4 | `Jenkinsfile_parameterized` | See §4 — this is how sandbox Terraform runs from Jenkins rather than a laptop |
| 1.5 | `.terraform-version` at the repo root | Sandbox agents use tfenv and fail without it. **▸ recorded** |
| 1.6 | Helm chart under `charts/{product}-{component}/` | Dependency `java` or `nodejs` from `oci://hmctsprod.azurecr.io/helm` |
| 1.7 | `catalog-info.yaml` | Backstage. Needs the Jenkins job path and the GitHub slug |
| 1.8 | Branch protection on the default branch | See the trap about branches cut before workflows exist |

---

## 2. `cnp-jenkins-config` — a PR, reviewed by PlatOps

| | File | Purpose |
|---|---|---|
| 2.1 | `deployment-controls.yml` | `- repo: <url>` + `deployment-enabled: true`. Without it the pipeline will not deploy |
| 2.2 | `terraform-infra-approvals/{repo}.json` | Whitelists the resource types and modules your Terraform may create. **A plan is refused outright if the file is missing** |
| 2.3 | `team-config.yml` | First component for a product only |

**CODEOWNERS splits the review.** `deployment-controls.yml` goes to `@hmcts/platform-operations`;
`terraform-infra-approvals/*.json` goes to `@hmcts/production-apps-approvals`. One PR touching both
needs sign-off from two groups — split it if that is slowing you down. **✔ verified**

The approvals file lists only what you actually create. If your vault belongs to another component
and you consume it as a `data` source, do **not** list `cnp-module-key-vault`.

---

## 3. Terraform

Only if you need infrastructure of your own — a database, Redis, a storage account. If you need
none, delete the `infrastructure/` folder; it speeds the build up.

| | Step | Notes |
|---|---|---|
| 3.1 | `infrastructure/` with the modules you need | `terraform-module-postgresql-flexible`, `cnp-module-redis`, `cnp-module-key-vault` |
| 3.2 | `sandbox.tfvars` — **named exactly that** | See the traps table. Not `sbox.tfvars` |
| 3.3 | `depends_on = [module.vault]` on every `azurerm_key_vault_secret` | Access policies propagate asynchronously; without this the first apply races and fails. **▸ recorded** |
| 3.4 | No `import.tf` on the first run | An import block for a resource that does not exist yet fails the plan. **▸ recorded** |

---

## 4. Apply it — by hand, the first time

`withPipeline` does not trigger Terraform for sandbox. Either run it locally, or get a
parameterized Jenkins job wired through `#platops-help`.

Take the backend config values from an existing AAT build log — look for the `-backend-config`
flags in its terraform init step — then:

```bash
cd infrastructure

terraform init \
  -backend-config="resource_group_name=<rg>" \
  -backend-config="storage_account_name=<sa>" \
  -backend-config="container_name=<container>" \
  -backend-config="key={product}/{component}/sandbox/terraform.tfstate"

terraform plan -var-file=sandbox.tfvars -out=tfplan
terraform apply tfplan
```

Then retrieve the managed identity client id, which the Flux service account needs:

```bash
az identity show \
  --name {product}-sandbox-mi \
  --resource-group managed-identities-sandbox-rg \
  --subscription bf308a5c-0624-4334-8ff8-8dca9fd43783 \
  --query clientId -o tsv
```

For the Jenkins route, use **`withParameterizedPipeline`** — not `withParameterizedInfraPipeline`.
The infra variant runs Terraform from the repo root; the app variant runs it from
`infrastructure/`, which is where yours lives. **▸ recorded**

---

## 5. `cnp-flux-config` — a second PR

| | File | Purpose |
|---|---|---|
| 5.1 | `apps/{product}/{release}/{release}.yaml` | The HelmRelease, carrying the `$imagepolicy` marker Flux rewrites each build |
| 5.2 | `apps/{product}/{release}/image-repo.yaml` | Points at `hmctsprod.azurecr.io/{product}/{component}` |
| 5.3 | `apps/{product}/{release}/image-policy.yaml` | Filters `^prod-[a-f0-9]+-(?P<ts>[0-9]+)`, newest timestamp wins |
| 5.4 | `apps/{product}/{release}/sbox.yaml` | The sandbox patch — ingress host, `enableKeyVaults`, `workloadClientID`, vault mounts |
| 5.5 | `apps/{product}/base/kustomization.yaml` | Add the HelmRelease under **`resources`** |
| 5.6 | `apps/{product}/sbox/base/kustomization.yaml` | Add the patch under **`patches`** |
| 5.7 | `apps/{product}/serviceaccount/sbox.yaml` | First component only. Carries the MI client id from §4 |

5.5 and 5.6 are different keys in different files. Adding to the wrong one silently does nothing.
**✔ verified**

Image policies are normally generated rather than hand-written:

```bash
./add-image-policies.sh {product} {product} {component} hmctsprod
```

The trailing `hmctsprod` is required — see the traps table.

---

## 6. First build, and what to check

| | Check |
|---|---|
| 6.1 | The Jenkins org scan has picked the repo up — sandbox builds run on a **separate Jenkins**, `sandbox-build.hmcts.net`, under `HMCTS_j_to_z_Sandbox`. **▸ recorded** |
| 6.2 | The build pushed an image tagged `prod-{sha}-{timestamp}` to `hmctsprod.azurecr.io` |
| 6.3 | The chart appears in `hmcts-charts` under `stable/{chart}` — it is published on a `Chart.yaml` **version bump**, so a forgotten bump means the image moves and the chart does not |
| 6.4 | `kubectl get helmrelease -n {namespace}` on the sbox cluster reconciles |
| 6.5 | The pod is running, not crash-looping — check the Postgres firewall trap first if it is |
| 6.6 | `/health` answers 200 |

---

## The traps

Every one of these cost someone real time.

| Trap | What happens | Fix |
|---|---|---|
| **tfvars naming** | Resources get named wrongly | The sbox cluster sets `ENVIRONMENT=sbox` for Flux paths but `KEYVAULT_ENVIRONMENT=sandbox` for resource names. The file **must** be `sandbox.tfvars`. **▸ recorded** |
| **Vault name already taken** | Terraform fails on a globally unique name | Vault names are global. `apim-sandbox` was taken by another team, so `apim` uses `apim-sbox` via a `vault_name` override, plus `excludeEnvironmentSuffix: true` in the Flux patch so the mount path matches. **✔ verified in the live `sbox.yaml`** |
| **No `postgresql` subnet in the sbox VNet** | The subnet data source fails | `public_access = true` and `pgsql_delegated_subnet_id = "bypass"`. **▸ recorded** |
| **Postgres firewall is empty by default** | Pods crash-loop at Flyway with `SocketTimeoutException` | In the portal: the server → Networking → tick **"Allow public access from any Azure service within Azure to this server"** → Save. Manual, every time the server is recreated. **▸ recorded** |
| **`terraform-infra-approvals` missing** | The plan is refused by the pipeline | Raise the file before the first Jenkins apply. `web-api-marketplace`'s Redis exists in sandbox *only* because it was applied outside the pipeline — it still has no approvals file, so an AAT apply would be refused. **✔ verified** |
| **Wrong ACR** | The image policy never matches a tag | `hmctsprod.azurecr.io`, not `hmctspublic`. `add-image-policies.sh` still defaults to `hmctspublic`, so pass the registry explicitly. **▸ recorded** |
| **Startup probe fails** | CrashLoopBackOff with no useful log | The chart probes `applicationPort`. A Java service must listen on 8080 and set `management.endpoints.web.base-path: /`, because the chart probes `/health` at the root. If an auth filter is in front, exempt `/health`, `/info` and `/prometheus` explicitly — a prefix rule cannot match them when the base path is `/`. **✔ verified** |
| **Access policy race** | The first apply fails writing secrets | `depends_on = [module.vault]` on every `azurerm_key_vault_secret`. **▸ recorded** |
| **Branch cut before CI existed** | Required status checks never report, so the PR can never merge | Workflows run from the *head branch's* copy of `.github/workflows`. A branch created before they landed has none. Update the branch onto the default branch. **✔ verified — hit on a Renovate PR** |
| **WAF blocks a JSON cookie** | Users get 403 on every request after accepting cookies, and nothing appears in the pod logs | Only relevant once you are behind Front Door. Add `global_exclusions` naming each cookie. **▸ recorded** |

---

## Worked examples

Three services in this product, onboarded in order, each with its own plan recording what it hit:

| Repo | What it shows |
|---|---|
| [`service-api-marketplace`](https://github.com/hmcts/service-api-marketplace/blob/master/CNP-ONBOARDING-PLAN.md) | **First component for a product.** Resource group, vault, managed identity, namespace wiring, Postgres. The longest of the three |
| [`web-api-marketplace`](https://github.com/hmcts/web-api-marketplace/blob/master/CNP-ONBOARDING-PLAN.md) | A Node front end reusing all of it, plus public exposure through Front Door and the WAF |
| [`try-cp-crime-schedulingandlisting-courtschedule`](https://github.com/hmcts/try-cp-crime-schedulingandlisting-courtschedule/blob/master/CNP-ONBOARDING-PLAN.md) | A second Java component, with the platform PRs prepared in `platform-prs/` for review before raising |

Where to ask: **`#platops-help`** for anything PlatOps own — a parameterized sandbox job, a managed
identity role grant, a Front Door entry.
