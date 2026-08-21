# Negative Test Suite
## Playwright E-Commerce UI Automation Framework

**Automation:** `tests/ui/negative.spec.ts` · **Tag:** `@negative`  
**BASE_URL:** `.env` → `config/env.ts`  
**Platform:** OpenCart (LambdaTest E-Commerce Playground)  
**Purpose:** Invalid inputs, error conditions, and misuse — system must fail gracefully without corruption.  
**Author:** Parsa Besharati  
**Date:** 2026-05-19  
**Version:** 2.0  

---

## What is Negative Testing?

Negative testing evaluates the system's behavior when faced with invalid, unexpected, or malicious inputs. The goal is to ensure that the application:
1. **Does not crash** – remains stable under all conditions.
2. **Provides clear error messages** – helps users correct their mistakes.
3. **Maintains data integrity** – no corruption or loss of valid data when invalid data is submitted.
4. **Prevents misuse** – blocks actions that violate business rules (e.g., ordering out-of-stock items).

**Selection Criteria for Negative Tests:**
- Every input field tested with invalid types, formats, and boundaries.
- Every user action that can be attempted in an invalid state.
- Every business rule that can be violated.
- Error message text is verified for clarity and correctness.

---

## Negative Test Cases

| ID | Test Case Description | Focus Area | Priority | Precondition |
|----|-----------------------|------------|----------|--------------|
| TC-NEG-001 | Out-of-stock add button disabled on PDP | Inventory | P0 | iPod Touch (id 32) |
| TC-NEG-002 | Out-of-stock blocked via cart.add | Inventory | P0 | Product id 32 |
| TC-NEG-003 | Negative quantity rejected in cart | Cart Input | P1 | Cart with items |
| TC-NEG-004 | Zero quantity rejected in cart | Cart Input | P1 | Cart with items |
| TC-NEG-005 | Non-numeric quantity rejected in cart | Cart Input | P1 | Cart with items |
| TC-NEG-006 | Extreme quantity does not break cart | Cart Input | P2 | Cart with items |
| TC-NEG-007 | Empty search handling | Search | P2 | None |
| TC-NEG-008 | XSS payload in search is escaped | Search / Security | P1 | None |
| TC-NEG-009 | Empty registration form shows field errors | Registration | P1 | Guest user |
| TC-NEG-010 | Duplicate email registration rejected | Registration | P1 | john.doe@example.com |
| TC-NEG-011 | Invalid login credentials show error | Login | P1 | Guest user |
| TC-NEG-012 | Empty login fields show validation | Login | P1 | Guest user |
| TC-NEG-013 | Empty coupon code shows warning | Coupon | P2 | Cart with items |
| TC-NEG-014 | Empty gift certificate shows warning | Gift Cert | P2 | Cart with items |
| TC-NEG-015 | Invalid shipping postcode rejected | Shipping | P2 | Cart with items |
| TC-NEG-016 | Checkout without items redirects to cart | Navigation | P1 | Empty cart |
| TC-NEG-017 | Invalid product URL returns 404 | Navigation | P2 | None |
| TC-NEG-018 | Rapid add-to-cart clicks yield single item | Cart / Race | P2 | Empty cart |

---

### TC-NEG-01 — Attempt to Add Out-of-Stock Product to Cart via UI
**Priority:** P0  
**Precondition:** iPod Touch (product ID 32) is out of stock  

**Test Steps:**
1. Navigate to the iPod Touch product detail page (`product/product&product_id=32`)
2. Observe the "Add to Cart" button state
3. Click the "Add to Cart" button (if clickable)

**Expected Results:**
- The "Add to Cart" button is disabled (has `disabled` attribute or class)
- Clicking it does not add the product to cart
- Cart badge remains unchanged
- No error in console

---

### TC-NEG-02 — Attempt to Add Out-of-Stock Product via Direct JS Call
**Priority:** P0  
**Precondition:** iPod Touch is out of stock; user is on any page  

**Test Steps:**
1. Open browser console
2. Execute: `cart.add('32')` (the product ID for iPod Touch)
3. Check cart badge and drawer

**Expected Results:**
- Cart does not update (badge stays at previous count or 0)
- Either no response, or an error toast/alert appears
- No unhandled exceptions in console

---

### TC-NEG-03 — Enter Invalid Quantity (TC-NEGative) in Cart
**Priority:** P1  
**Precondition:** Cart has at least one product (e.g., iMac, qty 2)

**Test Steps:**
1. Navigate to Cart page (`checkout/cart`)
2. Change the quantity input for iMac to `-1`
3. Click "Update"

**Expected Results:**
- An error message appears (e.g., "Quantity must be at least 1" or similar)
- Quantity reverts to the previous valid value (or at least, cart is not corrupted)
- Cart totals unchanged

---

### TC-NEG-04 — Enter Invalid Quantity (Zero) in Cart
**Priority:** P1  
**Precondition:** Cart has at least one product (e.g., iMac, qty 2)

**Test Steps:**
1. Change quantity to `0`, click "Update"

**Expected Results:**
- Either the item is removed from cart, OR an error is shown
- If removed, cart badge decrements and totals update
- If error, cart remains unchanged

---

### TC-NEG-05 — Enter Invalid Quantity (Text) in Cart
**Priority:** P1  
**Precondition:** Cart has at least one product

**Test Steps:**
1. Enter `abc` in the quantity input, click "Update"

**Expected Results:**
- Error message or value rejected
- Cart unchanged; no NaN or unexpected behavior in totals

---

### TC-NEG-06 — Enter Extremely Large Quantity in Cart
**Priority:** P2  
**Precondition:** Cart has at least one product

**Test Steps:**
1. Enter `999999` in the quantity input, click "Update"

**Expected Results:**
- Either a stock warning appears: *"Products marked with *** are not available in the desired quantity…"*
- Or the quantity is accepted and totals update accordingly
- System remains responsive (no timeout or crash)

---

### TC-NEG-07 — Submit Empty Search
**Priority:** P2  
**Precondition:** None  

**Test Steps:**
1. Leave the search bar empty and click Search (or press Enter)

**Expected Results:**
- Either the same page reloads, or a message "Please enter a search keyword" appears
- No error page or blank results page

---

### TC-NEG-08 — Search with Special Characters (XSS Attempt)
**Priority:** P1  
**Precondition:** None  

**Test Steps:**
1. Search for: `<script>alert('XSS')</script>`
2. Observe the page

**Expected Results:**
- The script is not executed
- The search term is displayed as plain text (HTML-encoded) in the results heading or input
- No JavaScript alert appears
- The page does not break

---

### TC-NEG-09 — Submit Empty Registration Form
**Priority:** P1  
**Precondition:** Guest user on Register page  

**Test Steps:**
1. Navigate to Register page (`account/register`)
2. Leave all fields empty
3. Uncheck Privacy Policy
4. Click "Continue"

**Expected Results:**
- Multiple error messages appear, one per required field:
  - "First Name must be between 1 and 32 characters!"
  - "Last Name must be between 1 and 32 characters!"
  - "E-Mail Address does not appear to be valid!"
  - "Telephone must be between 3 and 32 characters!"
  - "Password must be between 4 and 20 characters!"
- Privacy Policy error: "Warning: You must agree to the Privacy Policy!"
- Form is not submitted

---

### TC-NEG-10 — Register with Already-Used Email
**Priority:** P1  
**Precondition:** An account already exists with `existing@example.com` (or use any known email)

**Test Steps:**
1. Fill registration form with valid data but use an email that already has an account
2. Click "Continue"

**Expected Results:**
- Error: "Warning: E-Mail Address is already registered!"
- Form retains other field values

---

### TC-NEG-11 — Login with Invalid Credentials
**Priority:** P1  
**Precondition:** Guest user on Login page  

**Test Steps:**
1. Navigate to Login page (`account/login`)
2. Enter email: `fakeuser@example.com`
3. Enter password: `wrongpassword`
4. Click "Login"

**Expected Results:**
- Error: "Warning: No match for E-Mail Address and/or Password."
- User remains on Login page
- Password field is cleared

---

### TC-NEG-12 — Login with Empty Fields
**Priority:** P1  
**Precondition:** Guest user on Login page  

**Test Steps:**
1. Leave email and password fields empty
2. Click "Login"

**Expected Results:**
- Error: "Warning: No match for E-Mail Address and/or Password."
- Same error as invalid credentials (no field-level validation for empty on this site)

---

### TC-NEG-13 — Apply Empty Coupon Code
**Priority:** P2  
**Precondition:** Cart has items  

**Test Steps:**
1. On Cart page, expand "Use Coupon Code"
2. Leave input empty, click "Apply Coupon"

**Expected Results:**
- Error: "Please enter a coupon code." (or similar)
- Cart totals unchanged

---

### TC-NEG-14 — Apply Empty Gift Certificate
**Priority:** P2  
**Precondition:** Cart has items  

**Test Steps:**
1. Expand "Use Gift Certificate", leave empty, click Apply

**Expected Results:**
- Error: "Please enter a gift certificate code."
- Cart totals unchanged

---

### TC-NEG-15 — Estimate Shipping with Invalid Postcode
**Priority:** P2  
**Precondition:** Cart has items  

**Test Steps:**
1. Expand "Estimate Shipping & Taxes"
2. Select United Kingdom, Greater London
3. Enter invalid postcode: `!@#$%^`
4. Click "Get Quotes"

**Expected Results:**
- Error message about invalid postcode format
- No shipping methods shown
- Form retains selections

---

### TC-NEG-16 — Direct URL Access to Checkout Page
**Priority:** P1  
**Precondition:** None  

**Test Steps:**
1. Navigate directly to `https://ecommerce-playground.lambdatest.io/index.php?route=checkout/checkout`
2. Observe

**Expected Results:**
- Either redirected to cart or homepage, OR
- A message "You must have items in your cart" or "Page not found"
- No server error (500) or blank page

---

### TC-NEG-17 — Direct URL Access to Non-Existent Page
**Priority:** P2  
**Precondition:** None  

**Test Steps:**
1. Navigate to `https://ecommerce-playground.lambdatest.io/index.php?route=some/nonexistent/page`

**Expected Results:**
- Either a 404 page or redirect to homepage
- No server error dump or stack trace visible to user

---

### TC-NEG-18 — Rapid Multiple Add-to-Cart Clicks
**Priority:** P2  
**Precondition:** Empty cart  

**Test Steps:**
1. On homepage, rapidly click "Add to Cart" on the same product 5 times in quick succession (as fast as possible)
2. Check cart quantity

**Expected Results:**
- Cart badge shows either 1 or 5 (depends on debounce/server handling)
- If 5, cart page shows 5× the product or quantity=5
- No duplicate line items (ideally, one line item with quantity=5)
- No error or crash

---

## Execution Notes

- Negative tests should be run after Smoke and Regression pass.
- Tests can be run independently; each sets up its own preconditions.
- Expected execution time: ~10–12 minutes.