# Comprehensive Test Suite Checklist
## Playwright E-Commerce UI Automation Framework

**Application:** LambdaTest E-Commerce Playground (OpenCart)  
**BASE_URL:** From `.env` (`config/env.ts`)  
**Automation:** Playwright + TypeScript  
**Author:** Parsa Besharati 
**Version:** 2.0  
**Date:** 2026-05-19  

---

## Test suite summary

| Suite | Spec file | Cases | Tags |
|-------|-----------|------:|------|
| Smoke | `tests/ui/smoke.spec.ts` | 10 | `@smoke` `@responsive` |
| Regression | `tests/ui/regression.spec.ts` | 24 | `@regression` `@responsive` |
| Negative | `tests/ui/negative.spec.ts` | 18 | `@negative` |
| Edge | `tests/ui/edge.spec.ts` | 12 | `@edge` `@responsive` |
| Security | `tests/ui/security.spec.ts` | 10 | `@security` `@responsive` |
| **Total** | | **82** | |

*Smoke, regression, edge, and security viewport tests run on desktop, tablet, and mobile — many more executions per browser project.*

---

## Smoke (`tests/ui/smoke.spec.ts`)

- [ ] **TC-SMOKE-001** — Homepage loads
- [ ] **TC-SMOKE-002** — Search for a product
- [ ] **TC-SMOKE-003** — Browse category and filter
- [ ] **TC-SMOKE-004** — Product detail page
- [ ] **TC-SMOKE-005** — Add to cart from homepage
- [ ] **TC-SMOKE-006** — Add to cart from product detail
- [ ] **TC-SMOKE-007** — Add to cart from category page
- [ ] **TC-SMOKE-008** — Increase quantity and verify totals
- [ ] **TC-SMOKE-009** — Remove product from cart
- [ ] **TC-SMOKE-010** — Cart persists across navigation

---

## Regression (`tests/ui/regression.spec.ts`)

- [ ] **TC-REG-001** — Homepage loads with key elements
- [ ] **TC-REG-002** — Search returns results
- [ ] **TC-REG-003** — Search with description filter
- [ ] **TC-REG-004** — Search with no matches
- [ ] **TC-REG-005** — Category browse and pagination
- [ ] **TC-REG-006** — Manufacturer filter
- [ ] **TC-REG-007** — Availability filter
- [ ] **TC-REG-008** — Grid view toggle
- [ ] **TC-REG-009** — List view toggle
- [ ] **TC-REG-010** — Combined filters
- [ ] **TC-REG-011** — Sort by price low to high
- [ ] **TC-REG-012** — Show 25 items per page
- [ ] **TC-REG-013** — Product detail required fields
- [ ] **TC-REG-014** — Add to cart from homepage
- [ ] **TC-REG-015** — Add to cart from category
- [ ] **TC-REG-016** — Add to cart from product detail
- [ ] **TC-REG-017** — Out-of-stock product blocked
- [ ] **TC-REG-018** — Increase quantity in cart
- [ ] **TC-REG-019** — Decrease quantity in cart
- [ ] **TC-REG-020** — Remove product from cart
- [ ] **TC-REG-021** — Cart persists across navigation
- [ ] **TC-REG-022** — Cart pricing decision table
- [ ] **TC-REG-023** — Apply invalid coupon code
- [ ] **TC-REG-024** — Estimate shipping with valid address

---

## Negative (`tests/ui/negative.spec.ts`)

- [ ] **TC-NEG-001** — Out-of-stock add button disabled on PDP
- [ ] **TC-NEG-002** — Out-of-stock blocked via cart.add
- [ ] **TC-NEG-003** — Negative quantity rejected in cart
- [ ] **TC-NEG-004** — Zero quantity rejected in cart
- [ ] **TC-NEG-005** — Non-numeric quantity rejected in cart
- [ ] **TC-NEG-006** — Extreme quantity does not break cart
- [ ] **TC-NEG-007** — Empty search handling
- [ ] **TC-NEG-008** — XSS payload in search is escaped
- [ ] **TC-NEG-009** — Empty registration form shows field errors
- [ ] **TC-NEG-010** — Duplicate email registration rejected
- [ ] **TC-NEG-011** — Invalid login credentials show error
- [ ] **TC-NEG-012** — Empty login fields show validation
- [ ] **TC-NEG-013** — Empty coupon code shows warning
- [ ] **TC-NEG-014** — Empty gift certificate shows warning
- [ ] **TC-NEG-015** — Invalid shipping postcode rejected
- [ ] **TC-NEG-016** — Checkout without items redirects to cart
- [ ] **TC-NEG-017** — Invalid product URL returns 404
- [ ] **TC-NEG-018** — Rapid add-to-cart clicks yield single item

---

## Edge (`tests/ui/edge.spec.ts`)

- [ ] **TC-EDGE-001** — Cart with ten different products
- [ ] **TC-EDGE-002** — Maximum quantity on one product
- [ ] **TC-EDGE-003** — Register with max-length name
- [ ] **TC-EDGE-004** — Search with 500-character string
- [ ] **TC-EDGE-005** — Search with single character
- [ ] **TC-EDGE-006** — Price filter at exact boundary
- [ ] **TC-EDGE-007** — Pagination last page with 25 per page
- [ ] **TC-EDGE-008** — Remove last item shows empty cart
- [ ] **TC-EDGE-009** — Rapid update and remove on different lines
- [ ] **TC-EDGE-010** — Product with missing metadata *(skipped — not on demo)*
- [ ] **TC-EDGE-011** — Back and forward after quantity change
- [ ] **TC-EDGE-012** — Cart cleared after session cookies removed

---

## Security (`tests/ui/security.spec.ts`)

- [ ] **TC-SEC-001** — Reflected XSS via search
- [ ] **TC-SEC-002** — Reflected XSS via registration
- [ ] **TC-SEC-003** — SQL injection via search
- [ ] **TC-SEC-004** — SQL injection via login
- [ ] **TC-SEC-005** — CSRF token field on cart form
- [ ] **TC-SEC-006** — Account pages redirect to login
- [ ] **TC-SEC-007** — Password fields are masked
- [ ] **TC-SEC-008** — Reused session cookie does not restore cart
- [ ] **TC-SEC-009** — No hardcoded secrets in page source
- [ ] **TC-SEC-010** — HTTPS is enforced

---

## How to use this checklist

1. Run automation: `npm test` or per suite (`npm run test:smoke`, etc.).
2. Check off cases after a passing run or manual confirmation.
3. Link failures to Playwright HTML report (`playwright-report/`) and logs (`logs/`).
4. Navigation audit: look for `[navigation] Navigating to:` lines in the terminal (list reporter).
