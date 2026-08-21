# Security Test Suite
## Playwright E-Commerce UI Automation Framework

**Automation:** `tests/ui/security.spec.ts` · **Tags:** `@security` `@responsive`  
**BASE_URL:** `.env` → `config/env.ts`  
**Platform:** OpenCart (LambdaTest E-Commerce Playground)  
**Purpose:** Basic web security checks (XSS, SQLi, CSRF presence, auth redirect, session, HTTPS). Front-end scope only — not a full penetration test.  
**Author:** Parsa Besharati  
**Date:** 2026-05-19  
**Version:** 2.0  

---

## What is Security Testing?

Security testing aims to identify vulnerabilities in the application that could be exploited by malicious actors. For a front‑end e‑commerce site, the focus is on:
1. **Input Validation** – Ensuring that user input is properly sanitised and does not execute harmful scripts or queries.
2. **Authentication & Authorisation** – Preventing unauthorised access to account features or sensitive data.
3. **Session Management** – Protecting user sessions from hijacking or fixation.
4. **Data Protection** – Ensuring sensitive data is not exposed in the URL, client‑side code, or network requests.

**Scope of This Suite:**  
Since this is a dummy site with no real checkout or payment processing, our security tests are limited to **basic web security** checks that can be performed through the browser and automated scripts. Full penetration testing and server‑side vulnerability assessment are out of scope.

---

## Security Test Cases

| ID | Test Case Description | Focus Area | Priority | Precondition |
|----|-----------------------|------------|----------|--------------|
| TC-SEC-001 | Reflected XSS via search | Input sanitisation | P0 | None |
| TC-SEC-002 | Reflected XSS via registration | Input sanitisation | P0 | None |
| TC-SEC-003 | SQL injection via search | Injection | P1 | None |
| TC-SEC-004 | SQL injection via login | Authentication | P1 | Guest user |
| TC-SEC-005 | CSRF token field on cart form | Anti-forgery | P1 | Cart with items |
| TC-SEC-006 | Account pages redirect to login | Authorisation | P0 | Guest user |
| TC-SEC-007 | Password fields are masked | Data privacy | P1 | None |
| TC-SEC-008 | Reused session cookie does not restore cart | Session | P2 | Guest cart |
| TC-SEC-009 | No hardcoded secrets in page source | Data exposure | P1 | None |
| TC-SEC-010 | HTTPS is enforced | Transport | P0 | None |

---

### TC-SEC-01 — Reflected XSS via Search Input
**Priority:** P0  
**Precondition:** None  

**Test Steps:**
1. In the search bar, enter: `<script>alert('XSS')</script>`
2. Submit the search
3. Observe the page

**Expected Results:**
- The script **is not executed** (no alert box appears)
- The search term is displayed as plain text, HTML‑encoded (e.g., `&lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;`)
- The page does not break or throw JavaScript errors

---

### TC-SEC-02 — Reflected XSS via Registration Fields
**Priority:** P0  
**Precondition:** Guest user on Register page  

**Test Steps:**
1. In the First Name field, enter: `<img src=x onerror=alert('XSS')>`
2. Fill the remaining required fields with valid data
3. Click "Continue"

**Expected Results:**
- If registration succeeds, the payload is **not executed** on the subsequent page (e.g., Account Dashboard or success message)
- If registration fails due to validation, the payload is displayed as plain text in the form field, not executed

---

### TC-SEC-03 — SQL Injection Attempt via Search
**Priority:** P1  
**Precondition:** None  

**Test Steps:**
1. Search for: `' OR '1'='1`
2. Observe the results page

**Expected Results:**
- The search does not return all products (which would indicate a successful SQL injection)
- Either "No results" or a filtered set of results matching the literal search term
- No database error is displayed to the user

---

### TC-SEC-04 — SQL Injection Attempt via Login
**Priority:** P1  
**Precondition:** Guest user on Login page  

**Test Steps:**
1. Enter email: `' OR '1'='1' --`
2. Enter password: `anything`
3. Click "Login"

**Expected Results:**
- Login fails: "Warning: No match for E‑Mail Address and/or Password."
- The injection attempt does **not** bypass authentication
- No database error is displayed

---

### TC-SEC-05 — CSRF Protection on State‑Changing Requests
**Priority:** P1  
**Precondition:** Cart with items; user is logged in (or guest)  

**Test Steps:**
1. Capture a request that modifies the cart (e.g., updating quantity or removing an item)
2. Replay the request from an external tool (e.g., curl or Postman) without the original session cookies and without any CSRF token
3. Observe if the cart is modified

**Expected Results:**
- The request is rejected (HTTP 403 or redirect) because no valid CSRF token is present
- The cart remains unchanged

**Automation Notes:**
- Inspect the form on the Cart page for a hidden `csrf` token field
- Attempt to submit a modified request without that token; verify failure

---

### TC-SEC-06 — Direct Access to Account Pages Without Login
**Priority:** P0  
**Precondition:** Guest user (not logged in)  

**Test Steps:**
1. Try to access the following URLs directly without logging in:
   - `/index.php?route=account/account`
   - `/index.php?route=account/order`
   - `/index.php?route=account/address`
   - `/index.php?route=account/wishlist`
2. Observe the response for each

**Expected Results:**
- Each URL redirects to the Login page (`account/login`) with a message such as "Please log in to access this page."
- No account data is displayed without authentication

---

### TC-SEC-07 — Password Field Masking and Autocomplete
**Priority:** P1  
**Precondition:** None  

**Test Steps:**
1. Navigate to the Login page
2. Inspect the password field
3. Navigate to the Register page
4. Inspect the password and confirm password fields

**Expected Results:**
- Password fields have `type="password"` (characters are masked)
- Autocomplete is set to `off` or `new-password` (prevents browser from storing/autofilling sensitive credentials inappropriately)

---

### TC-SEC-08 — Session Fixation Attempt (Cookie Reuse)
**Priority:** P2  
**Precondition:** Logged‑in user (optional; can test with guest session)  

**Test Steps:**
1. As a guest, add items to cart and note the session cookie value
2. Log in (or remain as guest)
3. Clear all cookies and manually set the old session cookie value
4. Refresh the page

**Expected Results:**
- The old session is invalid; the user is either treated as a new guest or redirected to log in again
- Cart contents are not inherited from the old session (prevents session fixation)

---

### TC-SEC-09 — Sensitive Data Exposure in Page Source
**Priority:** P1  
**Precondition:** None  

**Test Steps:**
1. View the page source of the homepage, a product page, and the cart page
2. Search for any hardcoded credentials, API keys, or internal configuration details (e.g., `password`, `api_key`, `secret`)

**Expected Results:**
- No sensitive information is present in the client‑side HTML, JavaScript, or inline styles
- Comments do not contain internal secrets

---

### TC-SEC-10 — HTTPS Enforcement
**Priority:** P0  
**Precondition:** None  

**Test Steps:**
1. Navigate to the site using `http://` (if possible)
2. Observe the URL

**Expected Results:**
- The connection is automatically redirected to `https://` (or the site already uses HTTPS by default)
- The browser shows a secure connection indicator (padlock icon)

---

## Execution Notes

- Security tests should be run after functional suites (Smoke, Regression) pass.
- Many of these tests are lightweight and can be integrated into a CI/CD pipeline as basic security smoke tests.
- Full penetration testing would require manual exploration and specialised tools; this suite covers only the most common web vulnerabilities.