# Edge Cases Test Suite
## Playwright E-Commerce UI Automation Framework

**Automation:** `tests/ui/edge.spec.ts` · **Tags:** `@edge` `@responsive`  
**BASE_URL:** `.env` → `config/env.ts`  
**Platform:** OpenCart (LambdaTest E-Commerce Playground)  
**Purpose:** Boundary values, extreme inputs, and unusual sequences that expose hidden defects.  
**Author:** Parsa Besharati 
**Date:** 2026-05-19  
**Version:** 2.0  

---

## What is Edge Case Testing?

Edge case testing focuses on the limits of the system — the minimum, maximum, and just-beyond-valid values for every input, as well as unusual combinations of actions. These tests are designed to uncover defects that occur at the "edges" of the application's logic, where off-by-one errors, overflow conditions, and boundary-related bugs are most likely to reside.

**Selection Criteria for Edge Cases:**
- **Boundary Values** – The smallest and largest valid inputs, plus values immediately outside those boundaries.
- **Data Extremes** – Maximum cart items, longest names, special characters in text fields.
- **Concurrency & Timing** – Rapid interactions that might trigger race conditions.
- **System Limits** – Very large payloads, many items, or deep navigation.
- **Unusual Interactions** – Actions performed in unexpected sequences (e.g., removing the last item while updating quantity).

---

## Edge Case Test Cases

| ID | Test Case Description | Focus Area | Priority | Precondition |
|----|-----------------------|------------|----------|--------------|
| TC-EDGE-001 | Cart with ten different products | Cart Capacity | P2 | Empty cart |
| TC-EDGE-002 | Maximum quantity (100) on one product | Inventory Limits | P2 | iMac in stock |
| TC-EDGE-003 | Register with max-length name (32 chars) | Input Validation | P2 | Guest user |
| TC-EDGE-004 | Search with 500-character string | Input Handling | P3 | None |
| TC-EDGE-005 | Search with single character | Search Logic | P3 | None |
| TC-EDGE-006 | Price filter at exact boundary ($98) | Price Filter | P2 | Components category |
| TC-EDGE-007 | Pagination last page with 25 per page | Pagination | P3 | Components category |
| TC-EDGE-008 | Remove last item shows empty cart | Cart State | P1 | Cart with 1 item |
| TC-EDGE-009 | Rapid update and remove on different lines | Race Condition | P3 | Cart with 2+ items |
| TC-EDGE-010 | Product with missing metadata | Data Integrity | P3 | **Skipped** in automation |
| TC-EDGE-011 | Back and forward after quantity change | Browser State | P2 | Cart with items |
| TC-EDGE-012 | Cart cleared after session cookies removed | Session Handling | P3 | Cart with items |

---

### TC-EDGE-01 — Cart with Maximum Reasonable Number of Different Products
**Priority:** P2  
**Precondition:** Empty cart  

**Test Steps:**
1. Add products from multiple categories until a reasonable maximum is reached (e.g., 10 different products)
2. Navigate to Cart page
3. Verify all products are listed
4. Check page load time and responsiveness

**Expected Results:**
- All added products appear in the cart table
- Cart badge shows correct count
- Totals correctly sum all items
- Page remains responsive; no layout breaking

**Automation Notes:**
- Loop through a list of product IDs and call `cart.add()` or click Add to Cart buttons
- Verify the number of rows in the cart table matches the number of unique products

---

### TC-EDGE-02 — Single Product with Maximum Available Quantity
**Priority:** P2  
**Precondition:** A product known to be in stock (e.g., iMac)  

**Test Steps:**
1. Navigate to the product detail page
2. Set the quantity spinner to a very high number (e.g., 100)
3. Click "Add to Cart"
4. Go to Cart page and verify the quantity

**Expected Results:**
- Either the quantity is accepted (and the product is added with qty=100), OR
- A stock limit message appears if 100 exceeds available stock
- If accepted, line total = unit price × 100
- Cart page does not break with large numbers

---

### TC-EDGE-03 — Registration with Boundary-Length Values (Min/Max)
**Priority:** P2  
**Precondition:** Guest user on Register page  

**Test Steps:**
1. Enter First Name = "A" (1 character, minimum boundary)
2. Enter Last Name = "A" (1 character)
3. Enter a valid email and other required fields
4. Click Continue

**Alternate Scenario:**
1. Enter First Name with 32 characters (max boundary, if that's the limit)
2. Enter Last Name with 32 characters
3. Complete form and submit

**Expected Results:**
- Single-character names are accepted (if min length is 1)
- 32-character names are accepted (if max length is 32)
- Form submits successfully; account created

---

### TC-EDGE-04 — Search with Very Long Keyword String
**Priority:** P3  
**Precondition:** None  

**Test Steps:**
1. In the search bar, enter a string of 500+ characters (e.g., "a".repeat(500))
2. Submit the search

**Expected Results:**
- The page does not crash or error out
- Either: "No results found" or the string is truncated
- No database errors or timeouts visible to the user

---

### TC-EDGE-05 — Search with Single Character
**Priority:** P3  
**Precondition:** None  

**Test Steps:**
1. Search for: "a"
2. Observe results

**Expected Results:**
- Results page loads without error
- Products whose name or description contain "a" are listed (may be many)
- Pagination works if results exceed page limit

---

### TC-EDGE-06 — Filter Products at Exact Price Boundary
**Priority:** P2  
**Precondition:** Components category with known product prices ($98 minimum, $2000 maximum)

**Test Steps:**
1. Set price range slider to min=$98, max=$98
2. Observe filtered products

**Expected Results:**
- Only products priced exactly $98 (e.g., Nikon D300) are shown
- No products with prices $97 or $99 appear
- Product count is accurate

**Alternate:** Set min=$2000, max=$2000 and verify only $2000 products show.

---

### TC-EDGE-07 — Pagination at Last Page Boundary
**Priority:** P3  
**Precondition:** Components category, Show = 25 (3 pages)

**Test Steps:**
1. Navigate to Components
2. Set Show = 25
3. Click ">|" (last page) — should be page 3
4. Verify the ">" and ">|" buttons are disabled
5. Verify the product count on the last page is 25 (75 total, so last page has 25)

**Expected Results:**
- Last page shows the final 25 products
- Next/last navigation buttons disabled
- Previous/first buttons enabled
- "Showing 51 to 75 of 75 (3 Pages)"

---

### TC-EDGE-08 — Cart State When Removing the Last Remaining Item
**Priority:** P1  
**Precondition:** Cart with exactly 1 product (qty 1)

**Test Steps:**
1. Navigate to Cart page
2. Click "Remove" on the sole product

**Expected Results:**
- The product row is removed
- Cart page shows empty state: "Your shopping cart is empty!"
- Cart badge in header changes to "0"
- Sub-Total and Total display $0.00
- "Continue Shopping" button is visible; "Checkout" may still be visible but cart is empty

---

### TC-EDGE-09 — Simultaneous Quantity Update and Remove (Rapid Sequence)
**Priority:** P3  
**Precondition:** Cart with 2+ products

**Test Steps:**
1. On Cart page, rapidly change the quantity of one product and immediately click Remove on another product
2. Observe the final cart state

**Expected Results:**
- Cart correctly reflects one of the two operations (either the update or the remove is processed)
- No error, no duplicate items, no cart corruption
- Totals consistent with the resulting cart state

---

### TC-EDGE-10 — Product Detail Page for Product with Missing/Empty Data Fields
**Priority:** P3  
**Precondition:** Identify a product with minimal data (may not exist on this demo site; if not, note as not applicable)

**Test Steps:**
1. Navigate to a product detail page that might have missing description or image
2. Observe the rendering

**Expected Results:**
- No broken images (placeholder shown if image is missing)
- Description tab shows text or "No description available" instead of blank
- Page layout does not collapse

---

### TC-EDGE-11 — Back/Forward Browser Navigation with Cart Modifications
**Priority:** P2  
**Precondition:** Cart with items

**Test Steps:**
1. On Cart page, note the current items
2. Change a quantity and click Update
3. Press the browser "Back" button
4. Press the browser "Forward" button
5. Verify cart state

**Expected Results:**
- Cart reflects the updated quantity (not a cached version)
- No duplicate cart operations from resubmission
- Browser navigation does not cause data loss

---

### TC-EDGE-12 — Session Expiration During Cart Session (If Applicable)
**Priority:** P3  
**Precondition:** Cart with items, user logged in (or guest with cookies)

**Test Steps:**
1. Add items to cart
2. Clear browser cookies (or simulate session expiry by deleting session cookie)
3. Reload the page or navigate to Cart

**Expected Results:**
- Cart may be empty (session-based) or preserved (cookie-based)
- No error or crash
- User can start fresh or re-add items

---

## Execution Notes

- Edge cases are designed to be run after the main regression suite to further stress the system.
- Tests are independent and can be run in any order.
- Some edge cases may reveal limitations of the demo site (e.g., max quantity, missing data fields); document actual behavior in test results.