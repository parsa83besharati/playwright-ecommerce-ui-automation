# Smoke Test Suite
## Playwright E-Commerce UI Automation Framework

**Automation:** `tests/ui/smoke.spec.ts` · **Tags:** `@smoke` `@responsive`  
**BASE_URL:** `.env` → `config/env.ts`  
**Platform:** OpenCart (LambdaTest E-Commerce Playground)  
**Purpose:** Validate critical paths after every build. Shallow but broad — a rapid go/no-go before deeper testing.  
**Author:** Parsa Besharati  
**Date:** 2026-05-19  
**Version:** 2.0  

---

## What is a Smoke Test?

Smoke tests are a subset of automated tests that verify the most crucial features of an application. They are designed to run quickly and provide a rapid "go/no-go" decision on the health of a new build. If any smoke test fails, the build is rejected immediately, and deeper testing is halted until the issue is fixed.

**Selection Criteria for Smoke Tests:**
1. **Core User Journeys** – The primary paths a user takes to achieve their goal (e.g., browse, add to cart, search).
2. **High Business Impact** – Features whose failure would directly affect sales or user trust.
3. **Frequently Used Functionality** – Features used by nearly every user (e.g., product page load, cart calculation).
4. **Critical Integrations** – Points where multiple components interact (e.g., category filters affecting product list).
5. **No Complex Setup** – Quick to execute; minimal data preparation.

The following 10 smoke tests ensure that the e-commerce playground is fundamentally functional.

---

## Smoke Test Cases

| ID | Test Case Description | Technique | Priority | Key Precondition |
|----|-----------------------|-----------|----------|------------------|
| TC-SMOKE-001 | Homepage loads | Use Case | P0 | None |
| TC-SMOKE-002 | Search for a product | Use Case | P0 | None |
| TC-SMOKE-003 | Browse category and filter | Use Case | P0 | None |
| TC-SMOKE-004 | Product detail page | Use Case | P0 | None |
| TC-SMOKE-005 | Add to cart from homepage | Use Case | P0 | Empty cart |
| TC-SMOKE-006 | Add to cart from product detail | Use Case | P0 | Empty cart |
| TC-SMOKE-007 | Add to cart from category page | Use Case | P0 | Empty cart |
| TC-SMOKE-008 | Increase quantity and verify totals | Use Case + Decision Table | P0 | Cart with 1 product |
| TC-SMOKE-009 | Remove product from cart | Use Case | P0 | Cart with 2+ products |
| TC-SMOKE-010 | Cart persists across navigation | State Transition | P0 | Cart with items |

---

### TC-SMOKE-01 — Homepage Loads with Key Elements
**Scenario Reference:** *New*  
**Priority:** P0  
**Technique:** Use Case Testing  
**Precondition:** None  

**Test Steps:**
1. Open browser and navigate to `https://ecommerce-playground.lambdatest.io/`

**Expected Results:**
- Page title contains "Your Store"
- The following elements are visible and not broken:
  - Header: store logo (`<img>` with alt text), search input field, cart icon with badge "0", "My account" dropdown
  - Main content: promotional banner (carousel with at least 3 slides), section "Top Products" with product cards
  - Footer: copyright text "© LambdaTest - Powered by OpenCart"
- No JavaScript errors in browser console (e.g., `window.onerror` or Console errors)
- Network requests return status 200 for main resources (HTML, CSS, JS)

**Automation Notes:**
- Use `waitForLoadState('networkidle')` or equivalent to ensure lazy-loaded images are visible.
- Verify the cart badge text is "0".

---

### TC-SMOKE-02 — Search for a Product Returns Results
**Scenario Reference:** S3.4  
**Priority:** P0  
**Technique:** Use Case Testing  
**Precondition:** None  

**Test Steps:**
1. On the homepage, locate the search bar (top center).
2. Type `palm` in the search input.
3. Press Enter or click the "Search" button.

**Expected Results:**
- URL changes to `/index.php?route=product/search&search=palm`
- Page title shows "Search - palm"
- At least one product is displayed (Palm Treo Pro appears)
- Search criteria section shows keyword "palm" in the input and "All Categories" selected

**Automation Notes:**
- Use `page.fill('[name="search"]', 'palm')` then `page.press('Enter')`.
- Verify result count > 0.

---

### TC-SMOKE-03 — Browse a Category and Apply Basic Filter
**Scenario Reference:** S3.1  
**Priority:** P0  
**Technique:** Use Case Testing  
**Precondition:** None  

**Test Steps:**
1. Open the category menu (e.g., click "Shop by Category" or the hamburger menu on mobile).
2. Select "Components" (path=25).
3. On the Components page, in the filter sidebar, check the "Apple" manufacturer checkbox.
4. Wait for the product grid to update.

**Expected Results:**
- After step 2, URL becomes `/index.php?route=product/category&path=25`
- Page title shows "Components"
- Product grid displays a list of products (initially up to 15).
- After step 4, the grid updates via AJAX: only Apple products are shown.
- The filter badge next to "Apple" shows a count (e.g., 42).
- "Clear all" reset link becomes visible.

**Automation Notes:**
- Use `page.check('input[id="mz-fm-0-8"]')` (Apple manufacturer checkbox) and wait for a network response or grid change.

---

### TC-SMOKE-04 — Product Detail Page Displays Correctly
**Scenario Reference:** S3.6  
**Priority:** P0  
**Technique:** Use Case Testing  
**Precondition:** None  

**Test Steps:**
1. From any product listing, click on a product (e.g., "iPod Touch").
2. Verify the product detail page loads.

**Expected Results:**
- URL contains `/index.php?route=product/product&product_id=`
- Product name is displayed as an `<h1>`.
- Product price is visible (e.g., "$194.00").
- "Add to Cart" button is present (may be disabled if out of stock).
- Image gallery with at least one image.
- Tabs (Description, Reviews) are present.

**Automation Notes:**
- Click a product link using a stable selector like `a[href*="product_id=32"]`.
- Verify the price element contains a "$".

---

### TC-SMOKE-05 — Add a Single Product to Cart from Homepage
**Scenario Reference:** S1.1 (subset)  
**Priority:** P0  
**Technique:** Use Case Testing  
**Precondition:** Guest user, empty cart  

**Test Steps:**
1. On the homepage, locate a product card for "iMac" (product ID 41, price $170.00).
2. Click the "Add to Cart" button on that card.

**Expected Results:**
- Cart badge in the header changes from "0" to "1".
- A toast notification appears with text "Success: You have added iMac to your shopping cart!".
- The cart icon's total text updates to show "1 item(s) - $170.00".

**Automation Notes:**
- Use a selector for the Add to Cart button: `button.cart-41` or `button[onclick="cart.add('41');"]`.
- Verify the badge with `.cart-item-total` text equals "1".

---

### TC-SMOKE-06 — Add Product to Cart from Product Detail Page
**Scenario Reference:** S1.1 (variant)  
**Priority:** P0  
**Technique:** Use Case Testing  
**Precondition:** Guest user, empty cart; product must be in stock (e.g., iMac, ID 41)

**Test Steps:**
1. Navigate to a product detail page (e.g., iMac, product ID 41).
2. Verify the "Add to Cart" button is enabled.
3. Click "Add to Cart".

**Expected Results:**
- Cart badge increments to "1".
- The same success toast as SMOKE-05 appears.
- If the page has a quantity input, it defaults to 1 and can be changed.

**Automation Notes:**
- Navigate directly to `product/product&product_id=41`.
- Click `button.cart-41` (or the button with text "Add to Cart").

---

### TC-SMOKE-07 — Add Product to Cart from Category Page
**Scenario Reference:** S1.1 (variant)  
**Priority:** P0  
**Technique:** Use Case Testing  
**Precondition:** Guest user, empty cart  

**Test Steps:**
1. Navigate to a category page (e.g., Components, path=25).
2. Find a product card with an "Add to Cart" button (e.g., HTC Touch HD, product ID 28).
3. Click "Add to Cart".

**Expected Results:**
- Cart badge updates from "0" to "1".
- Toast notification appears.
- Cart drawer shows the added product.

**Automation Notes:**
- Use `page.click('button.cart-28')`.
- Verify badge update.

---

### TC-SMOKE-08 — Increase Quantity in Cart and Verify Totals
**Scenario Reference:** S1.2, S5.1  
**Priority:** P0  
**Technique:** Use Case Testing + Decision Table Testing  
**Precondition:** Cart contains one product (e.g., iMac, qty 1, $170.00)

**Test Steps:**
1. Go to Cart page (`checkout/cart`).
2. In the iMac row, change the quantity input from "1" to "3".
3. Click the "Update" button (refresh icon) for that row.

**Expected Results:**
- iMac line total becomes $510.00.
- Sub-Total: $510.00
- Eco Tax: $6.00 (3 × $2.00)
- VAT (20%): $102.00
- Total: $618.00

**Automation Notes:**
- Use `page.fill('input[name="quantity[211399]"]', '3')` and then click the update button for that row.
- Verify the table cell containing the total for that row (e.g., `td:nth-child(6)` of that `<tr>`).

---

### TC-SMOKE-09 — Remove Product from Cart
**Scenario Reference:** S1.3  
**Priority:** P0  
**Technique:** Use Case Testing  
**Precondition:** Cart has at least two products (e.g., add iMac and Canon EOS 5D)

**Test Steps:**
1. Go to Cart page.
2. Click the "Remove" button (× icon) for Canon EOS 5D.

**Expected Results:**
- Canon EOS 5D row disappears.
- Cart badge decreases by 1.
- Sub-Total and Total recalculated excluding the removed item.

**Automation Notes:**
- Use `page.click('button[onclick*="cart.remove"]')` or the specific button for the product.
- Verify the number of rows in the cart table decreases.

---

### TC-SMOKE-10 — Verify Cart Persists Across Page Navigation
**Scenario Reference:** S2.2  
**Priority:** P0  
**Technique:** State Transition Testing  
**Precondition:** Cart contains 2 iMacs (product IDs 41 and 104)

**Test Steps:**
1. From Cart page, navigate to Homepage via logo or link.
2. Check cart badge – it should still show "2".
3. Navigate to a Category page (e.g., Components).
4. Check cart drawer – both iMacs should be listed.
5. Navigate back to Cart page – items should still be there.

**Expected Results:**
- Cart badge consistently shows "2" on every page.
- Cart drawer content matches across all pages.
- No items lost or duplicated.

**Automation Notes:**
- After each navigation, check `.cart-item-total` text.
- On Cart page, verify the table contains two rows with product names "iMac".

---

## Execution Order & Dependencies

1. TC-SMOKE-01 (Homepage loads) must be run first to ensure the site is reachable.
2. TC-SMOKE-05, TC-SMOKE-06, TC-SMOKE-07 (Add to cart) can be run in parallel if independent cart states are used (e.g., separate test users or clearing cart between tests).
3. TC-SMOKE-08 (Increase quantity) requires a cart with one product (e.g., after SMOKE-05).
4. TC-SMOKE-09 (Remove) requires a cart with at least two products (run after SMOKE-05 + SMOKE-06).
5. TC-SMOKE-10 (Cart persistence) requires a cart with items (run after SMOKE-05).

To maintain isolation, each test should set up its own cart state (e.g., by clearing cart via API or starting fresh) or run in a specific sequence.

---

## Success Criteria

- All 10 smoke tests must pass for the build to be considered stable.
- If any test fails, the build is rejected, and the team is notified immediately.
- Smoke tests should complete within 5-8 minutes in an automated pipeline.

---

## Automation implementation

| Item | Detail |
|------|--------|
| Framework | Playwright + TypeScript, Page Object Model |
| Spec | `tests/ui/smoke.spec.ts` |
| Viewports | Desktop, tablet, mobile via `setViewport` fixture |
| Cart reset | `clearCart` fixture (clears cookies); `homePage.goto()` loads `BASE_URL` |
| Add-to-cart sync | `waitForAddToCartToast()` in `tests/shared/cart-waits.ts` |
| Data | `ProductTemplates`, `CartTemplates` — no hardcoded product IDs in specs |
| Navigation logs | `[navigation] Navigating to:` in terminal when using list reporter |