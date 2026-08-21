# Playwright E-Commerce UI Automation — Test Documentation

Design and execution documents for the **Playwright E-Commerce UI Automation** framework (`playwright-ecommerce-ui-automation`).

| Document | Purpose |
|----------|---------|
| [Test Design Document.md](./Test%20Design%20Document.md) | Scope, risks, scenarios, traceability |
| [Comprehensive Test Suite Checklist.md](./Comprehensive%20Test%20Suite%20Checklist.md) | Master checklist (82 automated cases) |
| [Smoke Test Suite.md](./Smoke%20Test%20Suite.md) | Smoke design & steps |
| [Regression Test Suite.md](./Regression%20Test%20Suite.md) | Regression design & steps |
| [Negative Test Suite.md](./Negative%20Test%20Suite.md) | Negative design & steps |
| [Edge Cases Test Suite.md](./Edge%20Cases%20Test%20Suite.md) | Edge design & steps |
| [Security Test Suite.md](./Security%20Test%20Suite.md) | Security design & steps |
| [Sanity Test Suite.md](./Sanity%20Test%20Suite.md) | Manual sanity scenarios (maps to automation) |

## Automation mapping

| Suite | Spec file | Cases | Tags |
|-------|-----------|------:|------|
| Smoke | `tests/ui/smoke.spec.ts` | 10 | `@smoke` `@responsive` |
| Regression | `tests/ui/regression.spec.ts` | 24 | `@regression` `@responsive` |
| Negative | `tests/ui/negative.spec.ts` | 18 | `@negative` |
| Edge | `tests/ui/edge.spec.ts` | 12 | `@edge` `@responsive` |
| Security | `tests/ui/security.spec.ts` | 10 | `@security` `@responsive` |
| Config | `tests/ui/base-url.spec.ts` | 1 | `@config` |

**Total automated test cases:** 82 (+ 1 BASE_URL config check).

## Conventions

- **IDs:** `TC-{SUITE}-{###}` (e.g. `TC-SMOKE-001`)
- **Titles:** `TC-{ID} — {Description} [{viewport}]` when viewport applies
- **BASE_URL:** Set in project root `.env`; all navigation uses `config/env.ts`
- **Target:** OpenCart demo at `BASE_URL` (default: LambdaTest E-Commerce Playground)

## Version

| Field | Value |
|-------|-------|
| Project | Playwright E-Commerce UI Automation Framework |
| Document version | 2.0 |
| Last updated | 2026-05-19 |
| Author | Parsa Besharati |
