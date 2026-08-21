# Playwright E-Commerce UI Automation

> Production-grade UI test automation framework for e-commerce applications, featuring **82 automated test cases**, **AI-powered self-healing selectors**, and **cross-browser support**.

| Stack | Details |
|-------|---------|
| Framework | Playwright + TypeScript |
| Runtime | Node.js 18+ |
| Browsers | Chromium, Firefox, WebKit |
| Viewports | Desktop (1920×1080) · Tablet (1024×768) · Mobile (390×844) |
| Tests | 82 automated cases across 5 suites |
| License | [MIT](./LICENSE) |

---

## What This Project Demonstrates

This framework was built to showcase production-level QA automation engineering. It goes beyond basic test scripts and demonstrates real-world patterns used in enterprise test automation teams:

- **Test Architecture** — Scalable Page Object Model with BasePage inheritance, custom Playwright fixtures, and dependency injection. Every page interaction goes through a centralized base class that handles logging, waiting, and error recovery automatically.

- **AI Integration** — Self-healing selectors powered by LLM APIs. When a test breaks due to a changed UI element, the framework sends the current page HTML to an AI provider, receives 5 alternative selector suggestions, validates each against the live DOM, and continues the test with the working selector — all without human intervention.

- **Data-Driven Testing** — Builder, Factory, Singleton, and Template patterns for test data management. Test data is completely separated from test logic, making it easy to add new scenarios without modifying existing code.

- **Cross-Browser CI/CD** — Automated pipelines for Azure DevOps and GitLab that run smoke tests on every push, responsive tests on main branch merges, and full regression suites on schedule.

- **Professional Documentation** — Complete test design documents with risk assessments, traceability matrices, boundary value analysis tables, and per-suite specifications — the kind of documentation expected in regulated industries.

---

## Test Suites

| Suite | Cases | Tags | What It Covers |
|-------|------:|------|----------------|
| Smoke | 10 | `@smoke` | Critical user journeys — homepage load, add to cart, search, navigation |
| Regression | 24 | `@regression` | Full feature coverage across all three viewports |
| Negative | 18 | `@negative` | Invalid inputs, error messages, boundary conditions, form validation |
| Edge | 12 | `@edge` | Unusual scenarios — empty cart, max quantity, state transitions |
| Security | 10 | `@security` | XSS attempts, cookie security, HTTP headers, injection checks |

**Naming convention:** `TC-{SUITE}-{###} — {Description} [{viewport}]`

Example: `TC-SMOKE-001 — Homepage loads [desktop]`

---

## AI-Powered Self-Healing

One of the core features of this framework is intelligent selector healing. In real-world projects, UI tests break frequently because developers change CSS classes, IDs, or DOM structure. This system automatically recovers from those changes:

```
Test fails (broken selector)
        │
        ▼
┌───────────────────┐
│   AI Healer       │──▶ Captures cleaned page HTML (scripts/styles removed)
│   (LLM API call)  │──▶ Sends context + broken selector + element description
│                   │──▶ Receives 5 alternative selector suggestions
│                   │──▶ Validates each against the live DOM
└───────────────────┘
        │
        ▼
Test continues with healed selector (confidence: 100%)
```

**Supported providers** (tried in priority order):

| Priority | Provider | Model | Why |
|:--------:|----------|-------|-----|
| 1 | DeepSeek | deepseek-chat | Cheapest, fastest, great for selector tasks |
| 2 | OpenAI | gpt-4o-mini | Reliable fallback, widely available |
| 3 | Anthropic | claude-3-haiku | High quality, good at code analysis |
| 4 | Custom/Local | Any model | Ollama, LM Studio, vLLM — runs offline, free |

**Smart features:**
- **Provider fallback chain** — if DeepSeek is down, automatically tries OpenAI, then Anthropic
- **Selector caching** — healed selectors are cached for 30 minutes to avoid repeat API calls
- **Context-aware** — sends cleaned HTML + page URL + title to the LLM for better suggestions
- **Priority-based** — AI is instructed to prefer `data-testid` > `aria-label` > `role` > stable CSS selectors
- **Validation** — every suggestion is tested against the live DOM before being used

---

## Architecture

```
├── config/                    # Environment & base URL management
│   └── env.ts                 # getBaseUrl(), resolveUrl(), dotenv loading
├── data/
│   ├── builders/              # ProductBuilder, CartBuilder, UserBuilder
│   ├── entities/              # Product, Cart, User, Order interfaces
│   ├── factories/             # productFactory, cartFactory, userFactory
│   ├── registry/              # DataRegistry singleton (cleared each test)
│   ├── scenarios/             # Smoke, regression, negative, edge scenarios
│   └── templates/             # iMac, 3-products, UK-London reusable data
├── Docs/                      # Full test design documentation
├── fixtures/
│   ├── fixtures.ts            # Custom Playwright fixtures & viewport presets
│   └── viewport.ts            # Desktop, tablet, mobile configurations
├── pages/                     # Page Object Model classes
│   ├── BasePage.ts            # Core class with healable actions
│   ├── HomePage.ts            # Homepage interactions
│   ├── CategoryPage.ts        # Category browsing & filtering
│   ├── ProductDetailPage.ts   # Product detail page
│   ├── CartPage.ts            # Cart operations
│   ├── LoginPage.ts           # Login form
│   └── RegisterPage.ts        # Registration form
├── pipelines/
│   ├── azure-pipeline.yml     # Azure DevOps CI/CD
│   ├── gitlab-pipeline.yml    # GitLab CI/CD
│   └── steps/                 # Reusable pipeline templates
├── services/
│   └── ai-healer.ts           # Multi-provider AI selector healing
├── tests/
│   ├── shared/                # Cart waits, navigation helpers, annotations
│   └── ui/
│       ├── smoke.spec.ts      # 10 smoke tests
│       ├── regression.spec.ts # 24 regression tests
│       ├── negative.spec.ts   # 18 negative tests
│       ├── edge.spec.ts       # 12 edge case tests
│       └── security.spec.ts   # 10 security tests
├── utils/
│   ├── logger.ts              # Winston logger configuration
│   ├── logger-helpers.ts      # Per-test log file setup/teardown
│   └── navigation-logger.ts   # Navigation event logging
├── playwright.config.ts       # Multi-browser, multi-viewport config
├── global-setup.ts            # BASE_URL logging at run start
└── .env.example               # Environment variable template
```

---

## Design Patterns

| Pattern | Purpose | Implementation |
|---------|---------|----------------|
| **Page Object Model** | Encapsulate page interactions, separate test logic from UI details | `BasePage` → 6 page classes, each with domain-specific methods |
| **Builder** | Construct complex test data step by step | `ProductBuilder`, `CartBuilder`, `UserBuilder` with fluent API |
| **Factory** | Create pre-configured test objects | `productFactory`, `cartFactory`, `userFactory` with registry |
| **Singleton** | Share state across test steps without global variables | `DataRegistry` — cleared automatically `afterEach` test |
| **Template** | Reusable test data scenarios | `ProductTemplates.iMac()`, `CartTemplates.threeProducts()` |
| **Fixture Injection** | Manage test dependencies declaratively | Custom Playwright fixtures for page objects, viewport, cart clearing |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/parsa83besharati/playwright-ecommerce-ui-automation.git
cd playwright-ecommerce-ui-automation

# Install dependencies
npm install
npx playwright install --with-deps

# Configure environment
cp .env.example .env
# Edit .env — set BASE_URL (required), API keys (optional for AI healing)

# Run all tests
npm test

# Run specific suites
npm run test:smoke
npm run test:regression
npm run test:negative
npm run test:edge
npm run test:security

# Run on a specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Interactive mode (Playwright UI)
npx playwright test --ui

# Debug mode (step through tests)
npx playwright test --debug
```

---

## Configuration

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `BASE_URL` | Yes | — | Store origin for all navigation |
| `HEADLESS` | No | `true` | Set `false` for headed local runs |
| `SELF_HEALING_ENABLED` | No | `false` | Enable AI selector healing |
| `HEALING_MODE` | No | `runtime` | `runtime` (heal during test) or `post-mortem` |
| `DEEPSEEK_API_KEY` | No | — | DeepSeek API key |
| `OPENAI_API_KEY` | No | — | OpenAI API key (fallback) |
| `ANTHROPIC_API_KEY` | No | — | Anthropic API key (fallback) |

---

## CI/CD Pipelines

| Pipeline | Triggers | Stages |
|----------|----------|--------|
| **Azure DevOps** | Push to main/develop, PRs, daily 6AM | Quality Gate (lint) → Smoke → Responsive → Regression |
| **GitLab CI** | Push, merge requests, schedule | Lint → Smoke → Responsive → Regression |

Pipeline features:
- Parallel browser execution (Chromium, Firefox, WebKit)
- Artifact collection (HTML reports, screenshots, videos)
- Failure notifications via Slack/Teams webhooks
- Caching for npm dependencies and Playwright browsers

---

## Reporting

| Report | Location | Description |
|--------|----------|-------------|
| HTML Report | `playwright-report/` | Playwright's native HTML report |
| Enhanced Report | `enhanced-report/` | Rich visual report with charts and analytics |
| Winston Logs | `logs/` | Detailed execution logs per test |
| Test Results | `test-results/` | Screenshots and videos on failure |

```bash
npx playwright show-report
```

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Core** | Playwright, TypeScript, Node.js |
| **AI/LLM** | DeepSeek, OpenAI, Anthropic (multi-provider with fallback) |
| **Utilities** | Winston (logging), Faker (test data), dotenv (config), uuid |
| **Code Quality** | ESLint, Prettier, Husky, lint-staged |
| **Reporting** | Playwright HTML, playwright-enhanced-reporter, Winston logs |
| **CI/CD** | Azure DevOps Pipelines, GitLab CI |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Test Design Document](Docs/Test%20Design%20Document.md) | Scope, risks, scenarios, traceability matrix |
| [Comprehensive Checklist](Docs/Comprehensive%20Test%20Suite%20Checklist.md) | 82-case master checklist |
| [Smoke Suite](Docs/Smoke%20Test%20Suite.md) | Smoke test design & step-by-step instructions |
| [Regression Suite](Docs/Regression%20Test%20Suite.md) | Regression test design & step-by-step instructions |
| [Negative Suite](Docs/Negative%20Test%20Suite.md) | Negative test design & step-by-step instructions |
| [Edge Cases Suite](Docs/Edge%20Cases%20Test%20Suite.md) | Edge case design & step-by-step instructions |
| [Security Suite](Docs/Security%20Test%20Suite.md) | Security test design & step-by-step instructions |
| [Sanity Suite](Docs/Sanity%20Test%20Suite.md) | Manual deep-dive reference scenarios |

---

## Author

**Parsa Besharati** — [GitHub](https://github.com/parsa83besharati)

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
