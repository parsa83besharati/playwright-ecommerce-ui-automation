# Regression Test Suite
## Playwright E-Commerce UI Automation Framework

**Automation:** `tests/ui/regression.spec.ts` · **Tags:** `@regression` `@responsive`  
**BASE_URL:** `.env` → `config/env.ts`  
**Platform:** OpenCart (LambdaTest E-Commerce Playground)  
**Purpose:** Broad functional verification after changes — positive flows, filters, cart, pricing, coupon, and shipping.  
**Author:** Parsa Besharati  
**Date:** 2026-05-19  
**Version:** 2.0  

> **Automated cases:** 24 (`TC-REG-001` … `TC-REG-024`). Registration and gift-certificate flows are covered in **Negative** / **Edge** suites or reserved for manual extension.

---

## What is a Regression Test?

Regression testing is a type of software testing that ensures that previously developed and tested functionality still works correctly after changes (e.g., new features, bug fixes, configuration updates). Unlike smoke tests (shallow and fast) and sanity tests (narrow but deep), regression tests are **broad and deep** — they exercise the entire application's key features with a focus on ensuring nothing has regressed.

**Selection Criteria for Regression Tests:**
1. **Complete Functional Coverage** – Covers all major features and their critical paths.
2. **Variant Flows** – Includes alternative ways to achieve the same goal (e.g., adding to cart from different pages).
3. **Calculations & Business Rules** – Validates complex logic like pricing, tax, and stock handling.
4. **Integration Points** – Features that interact (e.g., filters affecting product lists, cart persistence across pages).
5. **All Positive and Negative Paths** – Covers valid and invalid scenarios to ensure error handling hasn't regressed.

---

## Regression test cases (automated)

| ID | Test case | Feature area | Priority |
|----|-----------|--------------|----------|
| TC-REG-001 | Homepage loads with key elements | Homepage | P0 |
| TC-REG-002 | Search returns results | Search | P0 |
| TC-REG-003 | Search with description filter | Search | P1 |
| TC-REG-004 | Search with no matches | Search | P1 |
| TC-REG-005 | Category browse and pagination | Category | P0 |
| TC-REG-006 | Manufacturer filter | Filtering | P1 |
| TC-REG-007 | Availability filter | Filtering | P1 |
| TC-REG-008 | Grid view toggle | UI | P2 |
| TC-REG-009 | List view toggle | UI | P2 |
| TC-REG-010 | Combined filters | Filtering | P1 |
| TC-REG-011 | Sort by price low to high | Sorting | P1 |
| TC-REG-012 | Show 25 items per page | Pagination | P2 |
| TC-REG-013 | Product detail required fields | PDP | P0 |
| TC-REG-014 | Add to cart from homepage | Cart | P0 |
| TC-REG-015 | Add to cart from category | Cart | P0 |
| TC-REG-016 | Add to cart from product detail | Cart | P0 |
| TC-REG-017 | Out-of-stock product blocked | Inventory | P0 |
| TC-REG-018 | Increase quantity in cart | Cart / pricing | P0 |
| TC-REG-019 | Decrease quantity in cart | Cart | P1 |
| TC-REG-020 | Remove product from cart | Cart | P0 |
| TC-REG-021 | Cart persists across navigation | Cart | P0 |
| TC-REG-022 | Cart pricing decision table | Pricing | P0 |
| TC-REG-023 | Apply invalid coupon code | Coupon | P1 |
| TC-REG-024 | Estimate shipping with valid address | Shipping | P1 |

---

## Detailed scenarios (reference)

The sections below expand selected cases with manual steps. IDs use legacy two-digit form where noted; they map to the automated `TC-REG-00x` cases above.

---

### TC-REG-01 — Homepage Loads with All Key Elements
**Priority:** P0  
**Precondition:** None  

**Test Steps:**
1. Navigate to `https://ecommerce-playground.lambdatest.io/`

**Expected Results:**
- Page title is "Your Store"
- Header: logo, search bar, cart icon (badge "0"), My account dropdown
- Main content: banner carousel with 3 slides, "Top Products" section with product cards
- Footer: "© LambdaTest - Powered by OpenCart"
- No JavaScript errors in console

---

### TC-REG-02 — Search for a Product Returns Correct Results
**Priority:** P0  
**Precondition:** None  

**Test Steps:**
1. Enter "palm" in the search bar and submit
2. Observe the search results page

**Expected Results:**
- URL: `.../search&search=palm`
- Page heading: "Search - palm"
- At least 2 products (Palm Treo Pro) are displayed
- Filter sidebar shows relevant filters (Manufacturer: Palm, etc.)

---

### TC-REG-03 — Search with Description Filter Returns Broader Results
**Priority:** P1  
**Precondition:** None  

**Test Steps:**
1. Search for "palm" as in TC-REG-02
2. Check "Search in product descriptions" checkbox
3. Click Search again

**Expected Results:**
- The number of results is at least the same as TC-REG-02 (possibly more if description contains "palm")
- No error shown

---

### TC-REG-04 — Search for Non-Existent Product Shows Proper Message
**Priority:** P1  
**Precondition:** None  

**Test Steps:**
1. Search for "ipad"
2. Observe results

**Expected Results:**
- Message: "There is no product that matches the search criteria."
- "Continue" button appears to reset search
- Filter sidebar shows zero counts and disabled inputs

---

### TC-REG-05 — Browse Category with Default View and Pagination
**Priority:** P0  
**Precondition:** None  

**Test Steps:**
1. Navigate to Components category (path=25)
2. Verify product grid is displayed
3. Check pagination shows "Showing 1 to 15 of 75 (5 Pages)"
4. Navigate to page 2 and verify products change

**Expected Results:**
- Grid shows 15 products per page (default)
- Page navigation works (next, last, first, prev)
- Product count consistent with pagination text

---

### TC-REG-06 — Apply Manufacturer Filter and Verify Product Count
**Priority:** P1  
**Precondition:** Components category page  

**Test Steps:**
1. On Components page, check "Apple" under Manufacturer
2. Wait for AJAX update

**Expected Results:**
- Only Apple products are shown
- Filter badge shows "42"
- Pagination updates (e.g., 42 products → 3 pages at 15 per page)

---

### TC-REG-07 — Apply Availability Filter (In Stock/Out Of Stock)
**Priority:** P1  
**Precondition:** Components category page  

**Test Steps:**
1. Check "In stock" filter
2. Verify products are all in stock
3. Uncheck "In stock" and check "Out Of Stock"
4. Verify only out-of-stock products are shown

**Expected Results:**
- Product count matches filter badge (48 for In Stock, 17 for Out Of Stock)
- Products displayed match the selected availability

---

### TC-REG-08 — Apply Color Filter
**Priority:** P2  
**Precondition:** Category page with color filter (e.g., Components, but may need a category with color options; "Phone, Tablets & Ipod" likely works)

**Test Steps:**
1. Navigate to "Phone, Tablets & Ipod" category (path=57) (or another that has color filters)
2. Check a color filter (e.g., Black)
3. Verify grid update

**Expected Results:**
- Only products with the selected color option are displayed
- Filter count badge updates

---

### TC-REG-09 — Apply Price Range Filter
**Priority:** P2  
**Precondition:** Components category page (75 products, price range $98 - $2000)

**Test Steps:**
1. In the price slider, set min=100, max=500
2. Observe product grid

**Expected Results:**
- Products with prices outside the range are hidden
- Filter slider values reflect min/max
- Product count decreases

---

### TC-REG-10 — Combine Multiple Filters and Verify Intersection
**Priority:** P1  
**Precondition:** Components category page  

**Test Steps:**
1. Check Manufacturer: Apple
2. Check Availability: In Stock
3. Verify grid updates

**Expected Results:**
- Only Apple products that are in stock are shown
- Product count is less than or equal to the smaller of the two individual filter counts
- "Clear all" link appears and works

---

### TC-REG-11 — Sort Products by Each Sort Option
**Priority:** P1  
**Precondition:** Components category page (75 products)

**Test Steps:**
1. Test each sort option: Default, Name A-Z, Name Z-A, Price Low>High, Price High>Low, Newest, Best sellers, Popular
2. For each, verify the order is correct

**Expected Results:**
- Price sorts: numeric order correct
- Name sorts: alphabetical, case-insensitive
- No products missing after sort

---

### TC-REG-12 — Change Products Per Page (Pagination Limits)
**Priority:** P2  
**Precondition:** Components category page  

**Test Steps:**
1. Select Show: 15 → verify 15 products, 5 pages
2. Select Show: 25 → verify 25 products, 3 pages
3. Select Show: 50 → verify 50 products, 2 pages
4. Select Show: 100 → verify 75 products, 1 page

**Expected Results:**
- Products per page matches selection
- Pagination controls and text accurate

---

### TC-REG-13 — Product Detail Page Displays All Required Fields
**Priority:** P0  
**Precondition:** None  

**Test Steps:**
1. Navigate to iMac product detail page (product ID 41)
2. Verify: product name (h1), price ($170.00), brand link, availability (In Stock), quantity input, Add to Cart button, image gallery, tabs (Description, Reviews)

**Expected Results:**
- All elements visible
- Price formatting correct
- Add to Cart button enabled
- At least one image visible

---

### TC-REG-14 — In-Stock Product Can Be Added to Cart from Homepage
**Priority:** P0  
**Precondition:** Empty cart, guest user  

**Test Steps:**
1. On homepage, find iMac card
2. Click "Add to Cart"
3. Verify cart badge = "1", toast notification appears

**Expected Results:**
- Cart badge updates
- Success toast: "Success: You have added iMac to your shopping cart!"
- Cart drawer shows iMac

---

### TC-REG-15 — In-Stock Product Can Be Added to Cart from Category Page
**Priority:** P0  
**Precondition:** Empty cart, guest user  

**Test Steps:**
1. Go to Components category
2. Click "Add to Cart" for HTC Touch HD
3. Verify cart badge = "1"

**Expected Results:** Similar to TC-REG-14 but from category page.

---

### TC-REG-16 — In-Stock Product Can Be Added to Cart from Product Detail Page
**Priority:** P0  
**Precondition:** Empty cart, guest user  

**Test Steps:**
1. Go to iMac detail page (product ID 41)
2. Click "Add to Cart"
3. Verify cart badge = "1"

**Expected Results:** Similar to TC-REG-14.

---

### TC-REG-17 — Out-of-Stock Product Cannot Be Added to Cart
**Priority:** P0  
**Precondition:** None  

**Test Steps:**
1. Go to iPod Touch detail page (product ID 32, "Out Of Stock")
2. Verify Add to Cart button is disabled
3. Attempt to call `cart.add('32')` via console
4. Verify cart remains empty

**Expected Results:**
- Button disabled attribute present
- Cart badge stays at 0 after attempted add

---

### TC-REG-18 — Increase Product Quantity in Cart and Verify Totals
**Priority:** P0  
**Precondition:** Cart with 1 iMac (qty 1, $170.00)

**Test Steps:**
1. Go to Cart page
2. Change iMac quantity to 3
3. Click Update

**Expected Results:**
- Line total: $510.00
- Sub-Total: $510.00
- Eco Tax: $6.00
- VAT: $102.00
- Total: $618.00

---

### TC-REG-19 — Decrease Product Quantity in Cart (But Not to Zero)
**Priority:** P1  
**Precondition:** Cart with iMac qty 3

**Test Steps:**
1. Change iMac quantity from 3 to 2
2. Click Update

**Expected Results:**
- Line total: $340.00
- Totals recalculated correctly

---

### TC-REG-20 — Set Quantity to Zero (Remove Item or Error)
**Priority:** P1  
**Precondition:** Cart with iMac qty 2

**Test Steps:**
1. Change quantity to 0, click Update
2. Observe

**Expected Results:**
- Item either removed from cart or error shown (depends on implementation)
- If removed, cart becomes empty; if error, quantity reverts

---

### TC-REG-21 — Set Quantity to Negative Value (Error Handling)
**Priority:** P1  
**Precondition:** Cart with iMac qty 2

**Test Steps:**
1. Enter -1 in quantity input
2. Click Update

**Expected Results:**
- Error message appears
- Quantity not applied, cart unchanged

---

### TC-REG-22 — Remove Product from Cart
**Priority:** P0  
**Precondition:** Cart with 2 different products

**Test Steps:**
1. On Cart page, click Remove for one product
2. Verify cart updates

**Expected Results:**
- That product row disappears
- Cart badge decreases by 1
- Totals recalculated

---

### TC-REG-23 — Verify Cart Persistence Across Page Navigation
**Priority:** P0  
**Precondition:** Cart with 2 iMacs (total $340.00)

**Test Steps:**
1. Navigate to Homepage → Category → Product Detail → Search Results → Cart Page
2. At each step, check cart badge and drawer

**Expected Results:**
- Badge always shows "2"
- Cart page shows both items with correct totals

---

### TC-REG-24 — Verify Cart Calculation Decision Table (Multi-Product)
**Priority:** P0  
**Precondition:** Ability to set cart state

**Decision Table:**

| iMac Qty | Canon Qty | Palm Qty | Sub-Total | Eco Tax | VAT | Total |
|----------|-----------|----------|-----------|---------|-----|-------|
| 1 | 0 | 0 | $170.00 | $2.00 | $34.00 | $206.00 |
| 0 | 1 | 1 | $471.99 | $4.00 | $94.40 | $570.39 |
| 3 | 1 | 1 | $981.99 | $10.00 | $196.40 | $1,188.39 |
| 0 | 0 | 0 | $0.00 | $0.00 | $0.00 | $0.00 |

**Test Steps:** For each row, configure cart and verify totals.

---

### TC-REG-25 — Apply Invalid Coupon Code
**Priority:** P1  
**Precondition:** Cart with items

**Test Steps:**
1. On Cart page, expand "Use Coupon Code"
2. Enter "INVALID123"
3. Click Apply Coupon

**Expected Results:**
- Error: "Warning: Coupon is either invalid, expired or reached its usage limit!"
- Totals unchanged

---

### TC-REG-26 — Estimate Shipping (Valid Country/TC-REGion/Postcode)
**Priority:** P1  
**Precondition:** Cart with items

**Test Steps:**
1. Expand "Estimate Shipping & Taxes"
2. Select Country: United Kingdom
3. Select TC-REGion: Greater London
4. Enter Postcode: SW1A 1AA
5. Click "Get Quotes"

**Expected Results:**
- Modal with shipping methods appears
- Can select and apply shipping, totals update

---

### TC-REG-27 — Apply Invalid Gift Certificate
**Priority:** P2  
**Precondition:** Cart with items

**Test Steps:**
1. Expand "Use Gift Certificate"
2. Enter "FAKE-GIFT-123"
3. Click Apply

**Expected Results:**
- Error alert displayed
- Totals unchanged

---

### TC-REG-28 — TC-REGister New Account with Valid Data
**Priority:** P1  
**Precondition:** Guest user

**Test Steps:**
1. Go to TC-REGister page
2. Enter valid details (First Name, Last Name, unique Email, Telephone, Password, Confirm Password)
3. Check Privacy Policy
4. Click Continue

**Expected Results:**
- Redirect to Account Dashboard
- Success message
- User is logged in (My Account dropdown shows Dashboard, Logout, etc.)

---

### TC-REG-29 — TC-REGister with Mismatched Passwords
**Priority:** P1  
**Precondition:** Guest user

**Test Steps:**
1. Fill all fields with valid data except: Password and Confirm Password are different
2. Click Continue

**Expected Results:**
- Error: "Password confirmation does not match password!"
- Form retains other field values

---

### TC-REG-30 — TC-REGister with Invalid Email Format
**Priority:** P2  
**Precondition:** Guest user

**Test Steps:**
1. Enter email "notanemail" (no @)
2. Click Continue

**Expected Results:**
- Error: "E-Mail Address does not appear to be valid!"

---

### TC-REG-31 — TC-REGister with Missing Required Fields
**Priority:** P2  
**Precondition:** Guest user

**Test Steps:**
1. Leave First Name empty, fill others correctly
2. Click Continue

**Expected Results:**
- Error: "First Name must be between 1 and 32 characters!"

---

### TC-REG-32 — Login/Logout Preserves Cart Contents
**Priority:** P1  
**Precondition:** Cart with items as guest

**Test Steps:**
1. Add items to cart as guest
2. Login with valid account
3. Verify cart still has items
4. Logout
5. Verify cart state (may be preserved or empty depending on implementation; document actual)

**Expected Results:**
- Cart items survive login
- Behavior after logout is noted (ideally preserved but may be cleared)

---

## Execution Notes

- Run after every significant build or change.
- Can be run in parallel (tests are independent aside from cart state).
- Expected execution time: ~15–20 minutes.