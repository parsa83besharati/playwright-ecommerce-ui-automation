# Sanity Test Suite
## Playwright E-Commerce UI Automation Framework

**Type:** Manual / deep-dive reference (not a separate Playwright spec)  
**BASE_URL:** `.env` → `config/env.ts`  
**Platform:** OpenCart (LambdaTest E-Commerce Playground)  
**Purpose:** Narrow but deep checks after a targeted fix. Map scenarios to automated `TC-REG-*`, `TC-NEG-*`, or `TC-EDGE-*` where noted.  
**Author:** Parsa Besharati  
**Date:** 2026-05-19  
**Version:** 2.0  

---

## What is a Sanity Test?

Sanity tests are a subset of regression testing focused on verifying that a specific feature or component works correctly after a change (e.g., a new deployment, a hotfix, or a feature update). Unlike smoke tests (which are broad and shallow), sanity tests are **narrow and deep** — they dive into one functional area and check its details, edge cases, and interactions with related components.

**Selection Criteria for Sanity Tests:**
1. **Feature-Focused** – Each test validates a single feature in depth.
2. **Post-Change Verification** – Run when a specific fix or update has been made to that feature.
3. **Fast Feedback** – Quick to execute (similar to smoke), but more detailed in assertions.
4. **Prerequisite** – A passing smoke suite.

---

## Sanity Test Cases

| ID | Test Case Description | Feature Focus | Priority | Key Precondition |
|----|-----------------------|---------------|----------|------------------|
| TC-SANITY-01 | Cart calculation accuracy across multiple scenarios | Cart Pricing | P0 | Cart with configurable products |
| TC-SANITY-02 | Category filter combinations return correct results | Product Filtering | P1 | Category page with filters |
| TC-SANITY-03 | Product search with and without descriptions | Search | P1 | None |
| TC-SANITY-04 | Sort order accuracy across all sort options | Product Sorting | P1 | Category with multiple products |
| TC-SANITY-05 | Pagination boundaries and controls | Pagination | P2 | Category with 75 products |
| TC-SANITY-06 | Stock status enforcement (In Stock vs Out Of Stock) | Inventory | P0 | Products with different stock statuses |
| TC-SANITY-07 | User registration form validation | Registration | P1 | Guest user |
| TC-SANITY-08 | Cart quantity edge cases (update, remove, max) | Cart Management | P1 | Cart with products |

---

### TC-SANITY-01 — Cart Calculation Accuracy Across Multiple Scenarios
**Feature Focus:** Cart Pricing  
**Priority:** P0  
**Technique:** Decision Table Testing  
**Precondition:** Cart can be loaded with specific products and quantities  

**Why TC-SANITY?** After any change to the pricing engine, tax logic, or cart component, these precise calculations must hold.

**Decision Table:**

| # | iMac Qty | Canon Qty | Palm Qty | Sub-Total | Eco Tax (×$2) | VAT (20%) | Total |
|---|----------|-----------|----------|-----------|----------------|-----------|-------|
| 1 | 1 | 0 | 0 | $170.00 | $2.00 | $34.00 | $206.00 |
| 2 | 1 | 1 | 0 | $304.00 | $4.00 | $60.80 | $368.80 |
| 3 | 1 | 1 | 1 | $641.99 | $6.00 | $128.40 | $776.39 |
| 4 | 3 | 1 | 1 | $981.99 | $10.00 | $196.40 | $1,188.39 |
| 5 | 0 | 0 | 0 | $0.00 | $0.00 | $0.00 | $0.00 |

**Test Steps:**
1. For each row, configure the cart with the specified quantities of each product.
2. Navigate to the Cart page.
3. Record Sub-Total, Eco Tax, VAT, and Total.

**Expected Results:**
- All calculated values match the decision table exactly.
- Line-item totals equal Unit Price × Quantity for each product.

**Automation Notes:**
- Use API calls or direct navigation to set up each cart state.
- Fetch values from the cart table cells by selector (e.g., `.table tbody tr td.text-right strong`).
- Compute expected values in the script using known product prices ($170.00, $134.00, $337.99) to avoid hardcoding all totals.

---

### TC-SANITY-02 — Category Filter Combinations Return Correct Results
**Feature Focus:** Product Filtering  
**Priority:** P1  
**Technique:** Equivalence Partitioning + Use Case Testing  
**Precondition:** Components category page (path=25, 75 products)  

**Why TC-SANITY?** Filter logic is complex (multiple checkboxes, AJAX calls, product counts). After changes to the filter module, each combination must work.

**Filter Scenarios:**

| # | Filter(s) Applied | Expected Min Products | Notes |
|---|-------------------|-----------------------|-------|
| 1 | None | 75 | All products shown |
| 2 | Manufacturer: Apple | 42 | Only Apple products |
| 3 | Availability: In Stock | 48 | Only in-stock products |
| 4 | Availability: Out Of Stock | 17 | Only out-of-stock products |
| 5 | Manufacturer: Apple + In Stock | >0, ≤42 | Intersection of Apple and in-stock |
| 6 | Manufacturer: Canon + In Stock | >0, ≤10 | Intersection of Canon and in-stock |
| 7 | Color: Black | >0 | Only products with Black color option |
| 8 | Price: $100 to $200 | >0 | Products within range |

**Test Steps:**
1. Navigate to Components category.
2. Apply each filter combination.
3. Verify the product grid updates (AJAX, no page reload).
4. Count the displayed products.

**Expected Results:**
- Each filter correctly reduces the product set.
- Product count badges update to match filter results.
- "Clear all" link appears when any filter is active and removes all filters when clicked.
- No products appear that don't match the filter criteria (spot-check a few).

**Automation Notes:**
- Use `page.check()` on filter checkboxes.
- Wait for AJAX completion (e.g., network idle or a loading spinner to disappear).
- Verify product count by counting elements matching `.product-layout`.

---

### TC-SANITY-03 — Product Search with and without Descriptions
**Feature Focus:** Search  
**Priority:** P1  
**Technique:** Equivalence Partitioning  
**Precondition:** None  

**Why TC-SANITY?** Search is a key discovery tool. After any change to the search engine or indexing, accuracy must be verified.

**Search Scenarios:**

| # | Search Term | Description Checkbox | Expected |
|---|-------------|---------------------|----------|
| 1 | "palm" | Unchecked | Finds Palm Treo Pro (2 products) |
| 2 | "palm" | Checked | Finds Palm Treo Pro (possibly more if description contains "palm") |
| 3 | "canon" | Unchecked | Finds Canon EOS 5D (10+ products) |
| 4 | "ipad" | Unchecked | No results ("There is no product that matches...") |
| 5 | "" (empty) | Unchecked | Should show a message or all products |
| 6 | "a" (single character) | Unchecked | Should return results or a graceful message |

**Test Steps:**
1. Navigate to the search page or use the search bar.
2. Enter each search term and toggle the "Search in product descriptions" checkbox.
3. Submit the search.
4. Record the number of results or the "no results" message.

**Expected Results:**
- Known product names return the expected products.
- Checking "Search in product descriptions" returns at least as many results as unchecked.
- Non-existent terms show "There is no product that matches the search criteria."
- Special characters (e.g., quotes, angle brackets) are handled gracefully.

**Automation Notes:**
- Use `page.fill('[name="search"]', term)`.
- Toggle checkbox with `page.check('#description')` or `page.uncheck('#description')`.
- Verify result presence by checking for `.product-layout` elements or the "no results" text.

---

### TC-SANITY-04 — Sort Order Accuracy Across All Sort Options
**Feature Focus:** Product Sorting  
**Priority:** P1  
**Technique:** Equivalence Partitioning  
**Precondition:** Category page with multiple products (e.g., Components, 75 products)  

**Why TC-SANITY?** Sorting affects product visibility. If sorting is broken (e.g., price sort is wrong), users may see incorrect product order.

**Sort Options to Test:**

| # | Sort Option | Verification |
|---|-------------|--------------|
| 1 | Default | Products appear in the initial order |
| 2 | Name (A - Z) | Products alphabetically ascending by name |
| 3 | Name (Z - A) | Products alphabetically descending by name |
| 4 | Price (Low > High) | Cheapest product first, most expensive last |
| 5 | Price (High > Low) | Most expensive first, cheapest last |
| 6 | Newest | Products ordered by date added |
| 7 | Best sellers | Products ordered by sales count |

**Test Steps:**
1. Navigate to Components category.
2. For each sort option, select it from the "Sort By" dropdown.
3. Verify the product order against the expected criteria.

**Expected Results:**
- Sorting changes the order of products immediately.
- Price sorts show correct ascending/descending order.
- Name sorts are case-insensitive alphabetical.
- No products are missing or duplicated after a sort.
- URL reflects the selected sort option.

**Automation Notes:**
- Select sort option via `page.selectOption()`.
- For price sort, extract prices from the grid and validate order with a simple array comparison.

---

### TC-SANITY-05 — Pagination Boundaries and Controls
**Feature Focus:** Pagination  
**Priority:** P2  
**Technique:** Boundary Value Analysis  
**Precondition:** Components category (75 products)  

**Why TC-SANITY?** Pagination issues can hide products from users. After any change to product loading logic, pagination must be verified.

**Pagination Scenarios:**

| # | Show | Expected Pages | "Showing X to Y of Z" |
|---|------|---------------|----------------------|
| 1 | 15 | 5 pages | "Showing 1 to 15 of 75 (5 Pages)" |
| 2 | 25 | 3 pages | "Showing 1 to 25 of 75 (3 Pages)" |
| 3 | 50 | 2 pages | "Showing 1 to 50 of 75 (2 Pages)" |
| 4 | 100 | 1 page | "Showing 1 to 75 of 75 (1 Pages)" |

**Test Steps:**
1. Navigate to Components category.
2. For each "Show" option, select it.
3. Verify the number of products on the page.
4. Verify the pagination controls (page numbers, arrows).
5. Click ">" (next page) and verify the correct offset.
6. Click ">|" (last page) and verify the final products are shown.

**Expected Results:**
- Products per page matches the selected option.
- Pagination text is accurate.
- Navigating through pages shows the correct product subsets.
- ">" is disabled on the last page, "<" is disabled on the first page.

**Automation Notes:**
- Count product elements on the page after each selection.
- Verify pagination text with a selector for the "Showing..." string.

---

### TC-SANITY-06 — Stock Status Enforcement (In Stock vs Out Of Stock)
**Feature Focus:** Inventory Management  
**Priority:** P0  
**Technique:** Decision Table Testing  
**Precondition:** Two known products: one in stock (e.g., iMac, ID 41), one out of stock (e.g., iPod Touch, ID 32)  

**Why Sanity?** If out-of-stock products can be added to cart, it leads to checkout failures and poor user experience. This is a critical business rule.

**Test Scenarios:**

| # | Product | Stock Status | Add to Cart Button State | Can Add to Cart? |
|---|---------|-------------|-------------------------|------------------|
| 1 | iMac (ID 41) | In Stock | Enabled | Yes |
| 2 | iPod Touch (ID 32) | Out Of Stock | Disabled | No |

**Test Steps:**
1. Navigate to iMac product page.
2. Verify the "Add to Cart" button is **enabled** and clickable.
3. Click it — verify product is added to cart.
4. Navigate to iPod Touch product page.
5. Verify the "Add to Cart" button is **disabled** (grayed out, has `disabled` attribute).
6. Attempt to trigger add-to-cart programmatically (e.g., via JavaScript `cart.add('32')` in console).
7. Verify cart is unchanged.

**Expected Results:**
- In-stock product: button enabled, cart updated on click.
- Out-of-stock product: button disabled, cannot be added to cart even via direct JS call.
- Cart badge unchanged after out-of-stock attempt.

**Automation Notes:**
- Verify button state with `page.isDisabled('button.cart-32')` or the `disabled` attribute.
- For programmatic add attempt, use `page.evaluate(() => cart.add('32'))` and verify the cart badge remains the same.

---

### TC-SANITY-07 — User Registration Form Validation
**Feature Focus:** Registration  
**Priority:** P1  
**Technique:** Equivalence Partitioning + Negative Testing  
**Precondition:** Guest user  

**Why Sanity?** Registration is the entry point for logged-in users. After changes to the account module, form validation must work correctly.

**Validation Scenarios:**

| # | Field(s) | Input | Expected Result |
|---|----------|-------|-----------------|
| 1 | All required fields | Valid data (First Name, Last Name, Email, Telephone, Password, Confirm, Privacy Policy checked) | Redirect to account dashboard; success message |
| 2 | Password Confirm | Different from Password | Error: "Password confirmation does not match password!" |
| 3 | Email | Invalid format (e.g., "notanemail") | Error: "E-Mail Address does not appear to be valid!" |
| 4 | First Name | Empty | Error: "First Name must be between 1 and 32 characters!" |
| 5 | Telephone | Empty | Error: "Telephone must be between 3 and 32 characters!" |
| 6 | Privacy Policy | Unchecked | Error: "Warning: You must agree to the Privacy Policy!" |

**Test Steps:**
1. Navigate to Register page (`account/register`).
2. For each scenario, fill the form with the specified data.
3. Click "Continue".
4. Verify either successful registration (Scenario 1) or the appropriate error message (Scenarios 2–6).

**Expected Results:**
- Form validation catches all invalid inputs with clear, user-friendly error messages.
- Successful registration redirects to the account dashboard.
- All fields retain their values after a validation error (except passwords for security).

**Automation Notes:**
- Use `page.fill()` for each field.
- For Scenario 1, use a unique email each run (e.g., `test+timestamp@example.com`).
- Verify error messages with a selector for `.text-danger` or `.alert-danger`.

---

### TC-SANITY-08 — Cart Quantity Edge Cases
**Feature Focus:** Cart Management  
**Priority:** P1  
**Technique:** Boundary Value Analysis + Negative Testing  
**Precondition:** Cart with one iMac (ID 41, qty 1)  

**Why Sanity?** After cart component changes, quantity handling must be verified across valid, invalid, and boundary values.

**Quantity Scenarios:**

| # | Input | Expected Behavior |
|---|-------|-------------------|
| 1 | 1 (default) | Line total = $170.00 |
| 2 | 5 | Line total = $850.00; totals recalculated |
| 3 | 0 | Item removed or error message |
| 4 | -1 | Error message; quantity not applied |
| 5 | "abc" (text) | Error message or ignored |
| 6 | 999999 (very large) | Stock warning or accepted with recalculated totals |
| 7 | Leave empty and update | Error or default to 1 |

**Test Steps:**
1. Go to Cart page.
2. For each scenario, enter the value in the quantity input and click "Update".

**Expected Results:**
- Valid quantities (1, 5) update the line total and cart totals correctly.
- Invalid quantities (0, -1, "abc") show an appropriate error and do not corrupt totals.
- Large quantities either show a stock warning or are accepted gracefully.

**Automation Notes:**
- Use `page.fill('input[name="quantity[...]"]', value)`.
- Verify error message appearance or line total update after each attempt.

---

## Execution Notes

- Sanity tests should be run **after a smoke suite passes** and **when a specific feature has been changed**.
- Each test is self-contained and can be run independently.
- Total execution time should be under 5 minutes for the full suite.