# Test Design Document
## Playwright E-Commerce UI Automation Framework

**Application:** LambdaTest E-Commerce Playground (OpenCart)  
**BASE_URL:** Configured in `.env` (`config/env.ts`)  
**Automation:** 82 cases in `tests/ui/*.spec.ts` — see [Docs/README.md](./README.md)  
**Task reference:** Guest shopping flow — browse, add products from multiple categories, modify cart, shipping/coupon checks.  
**Author:** Parsa Besharati
**Date:** 2026-05-19  
**Version:** 2.0  

---

## Table of Contents

1. [Scope & Objectives](#1-scope--objectives)  
2. [Risk Assessment](#2-risk-assessment)  
3. [Test Design Techniques](#3-test-design-techniques)  
4. [Test Scenarios](#4-test-scenarios)  
   - [S1 – Core Shopping Flow](#s1--core-shopping-flow)  
   - [S2 – Cart Management](#s2--cart-management)  
   - [S3 – Product Discovery & Browsing](#s3--product-discovery--browsing)  
   - [S4 – User Authentication](#s4--user-authentication)  
   - [S5 – Data Integrity & Calculations](#s5--data-integrity--calculations)  
   - [S6 – Edge Cases & Negative Testing](#s6--edge-cases--negative-testing)  
   - [S7 – UI/UX & Cross‑Browser Consistency](#s7--uiux--crossbrowser-consistency)  
5. [Traceability Matrix](#5-traceability-matrix)  
6. [Assumptions & Limitations](#6-assumptions--limitations)  

---

## 1. Scope & Objectives

### In Scope

| Area | Description |
|------|-------------|
| **Product browsing** | Homepage, category pages, product detail pages |
| **Product search** | Keyword search with category filtering and search‑specific filters |
| **Cart operations** | Add, update quantity, remove, apply coupon, estimate shipping, gift certificate |
| **User authentication** | Registration, login, account dashboard |
| **UI validation** | Element visibility, error messaging, responsive behavior |
| **Price calculations** | Sub‑total, Eco Tax, VAT, total verification |
| **State transitions** | Cart emptiness, logged‑in vs. guest behavior |

### Out of Scope

| Area | Reason |
|------|--------|
| **Checkout / Billing Address** | Does not exist on this demo site |
| **Payment processing** | No payment gateway implemented |
| **Order placement / confirmation** | Flow ends at cart; no order completion |
| **Backend / admin functionality** | Not part of front‑end testing |
| **Performance / load testing** | Requires separate tools and environment |
| **Full penetration testing** | Out of scope; basic checks automated in `tests/ui/security.spec.ts` (TC-SEC-001 … 010) |

---

## 2. Risk Assessment

| Risk ID | Risk Description | Impact | Likelihood | Priority |
|---------|-----------------|--------|------------|----------|
| **R01** | Products added to cart do not persist across page navigation | High | Medium | P0 |
| **R02** | Cart total calculations are incorrect (Sub‑Total, VAT, Eco Tax) | High | Medium | P0 |
| **R03** | Quantity update in cart does not reflect in totals | High | Medium | P0 |
| **R04** | Products from different categories cannot be mixed in the same cart | Medium | Low | P1 |
| **R05** | Out‑of‑stock products allow adding to cart despite unavailability | High | Medium | P0 |
| **R06** | Search returns no results for valid product names | Medium | Medium | P1 |
| **R07** | Category filters return incorrect product sets | Medium | Medium | P1 |
| **R08** | Cart data lost on user login / logout | High | Low | P1 |
| **R09** | Registration form accepts invalid data (e.g., weak password, invalid email) | Medium | Medium | P1 |
| **R10** | Coupon application produces incorrect discount or crashes | Medium | Low | P2 |
| **R11** | UI elements (buttons, inputs) not accessible or visible on mobile viewports | Medium | Medium | P2 |

---

## 3. Test Design Techniques

| Technique | Applied To (Scenario IDs) | Justification |
|-----------|---------------------------|---------------|
| **Use Case Testing** | S1.1, S1.2, S1.3, S2.2, S3.4, S4.1, S4.2 | Models real user journeys; validates end‑to‑end flows from the user’s perspective. |
| **State Transition Testing** | S2.1, S4.3 | Validates system behavior as the user moves between distinct states (empty cart → filled → empty; guest → logged in). |
| **Equivalence Partitioning** | S3.1, S3.2, S5.3, S6.1, S6.2 | Reduces test volume by selecting representative values from each input class (valid/invalid). |
| **Boundary Value Analysis** | S3.3, S5.1, S5.2, S6.3 | Targets edge conditions (e.g., max/min quantities, price limits) where defects often hide. |
| **Decision Table Testing** | S5.1, S5.2 | Handles complex business rules like tax calculation and stock availability logic. |
| **Negative Testing** | S2.3, S2.5, S3.5, S6.1, S6.2, S6.4 | Ensures the system handles invalid inputs and error conditions gracefully. |
| **Exploratory Testing** | S7.1, S7.2 | Uncovers unexpected UI/UX issues not covered by scripted scenarios; relies on tester intuition and experience. |

---

## 4. Test Scenarios

### S1 – Core Shopping Flow

#### S1.1 – Add Multiple Products from Different Categories
**Priority:** P0  
**Technique:** Use Case Testing (Happy Path)  
**Actor:** Guest user  
**Precondition:** Empty cart, user on homepage  

**Flow:**
1. From the homepage, locate a product in the *“Laptops & Notebooks”* category (e.g., iMac, $170.00).
2. Click “Add to Cart” on that product’s card.
3. Verify the cart badge updates to “1”.
4. Open the category side menu and navigate to *“Cameras”*.
5. Add a second product (e.g., Canon EOS 5D, $134.00).
6. Navigate to *“Phone, Tablets & Ipod”*.
7. Add a third product (e.g., Palm Treo Pro, $337.99).
8. Go to the Cart page (`checkout/cart`).

**Expected Results:**
- Cart badge shows “3”.
- All three products appear in the cart table with correct names, images, model numbers.
- Each line shows quantity = 1 and correct unit price.
- **Financial breakdown:**
  - Sub‑Total: $641.99
  - Eco Tax (3 × $2.00): $6.00
  - VAT (20%): $128.40
  - Total: $776.39

**Risk Mapped:** R01, R04  

---

#### S1.2 – Modify Cart (Increase Quantity)
**Priority:** P0  
**Technique:** Use Case Testing  
**Actor:** Guest user  
**Precondition:** Cart contains at least one product (after S1.1)  

**Flow:**
1. On the Cart page, find the quantity input for the iMac.
2. Change the value from “1” to “3”.
3. Click the “Update” button (refresh icon) for that row.
4. Observe the updated cart totals.

**Expected Results:**
- iMac line total updates to $510.00 (3 × $170.00).
- New Sub‑Total: $510.00 + $134.00 + $337.99 = **$981.99**
- Eco Tax (5 items): $10.00
- VAT (20%): $196.40
- Total: **$1,188.39**
- Cart badge and drawer reflect the new quantity and total.

**Risk Mapped:** R03  

---

#### S1.3 – Remove Product from Cart
**Priority:** P0  
**Technique:** Use Case Testing  
**Actor:** Guest user  
**Precondition:** Cart has multiple products (after S1.2)  

**Flow:**
1. On the Cart page, click the “Remove” button (× icon) for the Canon EOS 5D.
2. Observe the cart update.

**Expected Results:**
- Canon EOS 5D row disappears.
- Cart badge decreases to “2”.
- New Sub‑Total: $510.00 + $337.99 = **$847.99**
- Eco Tax (4 items): $8.00
- VAT (20%): $169.60
- Total: **$1,025.59**

**Risk Mapped:** R01  

---

### S2 – Cart Management

#### S2.1 – Cart State Transition (Empty → Filled → Empty)
**Priority:** P0  
**Technique:** State Transition Testing  
**Actor:** Guest user  

**States:**

| State | Cart Badge | Drawer Content | Sub‑Total |
|-------|------------|---------------|-----------|
| Empty | “0” | “Your shopping cart is empty!” | $0.00 |
| Single Item | “1” | 1 line item | Item price |
| Multiple Items | “N” | N line items | Sum of unit prices |
| Modified | Updated | Line totals updated | Recalculated |
| Empty (Restored) | “0” | “Your shopping cart is empty!” | $0.00 |

**Flow:**
1. **Empty → Single:** Add iMac → badge = 1, drawer shows iMac, sub‑total = $170.00.
2. **Single → Multiple:** Add Canon EOS 5D and Palm Treo Pro → badge = 3, sub‑total = $641.99.
3. **Multiple → Modified:** Change iMac qty to 3 → badge = 5 items, sub‑total = $981.99.
4. **Modified → Multiple:** Remove Canon EOS 5D → badge = 4 items, sub‑total = $847.99.
5. **Multiple → Single:** Remove Palm Treo Pro → badge = 3 items (iMac ×3), sub‑total = $510.00.
6. **Single → Empty:** Remove iMac → badge = 0, empty message displayed, sub‑total = $0.00.

**Expected Results:**
- All transitions occur instantly without page reload.
- Cart badge and drawer always reflect the current state.
- Empty state fully restored after all items removed; no residual data.

**Risk Mapped:** R01, R08  

---

#### S2.2 – Cart Persistence Across Page Navigation
**Priority:** P0  
**Technique:** Use Case Testing  
**Actor:** Guest user  
**Precondition:** Cart contains 2 items (e.g., two iMacs, total $340.00)  

**Flow:**
1. Add products to cart on the homepage.
2. Navigate to a category page (e.g., Components).
3. Open the cart drawer → verify items.
4. Go to a product detail page (e.g., iPod Touch).
5. Open the cart drawer → verify items.
6. Perform a search (“palm”) and go to the search results page.
7. Open the cart drawer → verify items.
8. Finally, go to the Cart page.

**Expected Results:**
- On every page, the cart badge shows “2” and the drawer lists both iMacs with qty=1 and price=$170.00 each.
- The Cart page shows the complete line‑item table with Sub‑Total $280.00, Eco Tax $4.00, VAT $56.00, Total $340.00.

**Risk Mapped:** R01  

---

#### S2.3 – Apply Invalid Coupon Code
**Priority:** P1  
**Technique:** Negative Testing  
**Actor:** Guest user  
**Precondition:** Cart has products  

**Flow:**
1. On the Cart page, expand the “Use Coupon Code” accordion.
2. Enter `INVALID123` in the coupon input.
3. Click “Apply Coupon”.

**Expected Results:**
- An error alert appears: *“Warning: Coupon is either invalid, expired or reached its usage limit!”*
- Cart totals remain unchanged.
- The input field retains the entered code so the user can correct it.

**Risk Mapped:** R10  

---

#### S2.4 – Estimate Shipping
**Priority:** P1  
**Technique:** Use Case Testing  
**Actor:** Guest user  
**Precondition:** Cart has products  

**Flow:**
1. On the Cart page, expand the “Estimate Shipping & Taxes” accordion.
2. Select Country: **United Kingdom**.
3. Select Region/State: **Greater London**.
4. Enter Post Code: **SW1A 1AA**.
5. Click “Get Quotes”.

**Expected Results:**
- A modal window appears titled “Please select the preferred shipping method…”.
- It lists available shipping methods with their costs.
- The user can select a method and click “Apply Shipping”.
- After applying, cart totals update to include the shipping charge.

---

#### S2.5 – Apply Invalid Gift Certificate
**Priority:** P2  
**Technique:** Negative Testing  
**Actor:** Guest user  
**Precondition:** Cart has products  

**Flow:**
1. On the Cart page, expand the “Use Gift Certificate” accordion.
2. Enter `FAKE-GIFT-123`.
3. Click “Apply Gift Certificate”.

**Expected Results:**
- An error alert appears (same pattern as coupon error).
- Cart totals remain unchanged.

---

### S3 – Product Discovery & Browsing

#### S3.1 – Filter Products by Manufacturer and Availability
**Priority:** P1  
**Technique:** Equivalence Partitioning, Use Case Testing  
**Actor:** Guest user  
**Precondition:** On the Components category page (75 products)  

**Flow:**
1. In the filter sidebar, check the **Apple** checkbox under Manufacturer (42 products).
2. The product grid updates via AJAX; only Apple products are shown.
3. Next, check **In stock** under Availability.
4. The grid updates again, showing only in‑stock Apple products.

**Expected Results:**
- After step 2, only Apple products are displayed; the filter badge shows “42”.
- After step 4, the product count decreases further; the “Clear all” reset link appears.
- Pagination adjusts to match the filtered count.
- All visible products belong to the selected manufacturer and are in stock.

**Risk Mapped:** R07  

---

#### S3.2 – Sort Products by Price
**Priority:** P1  
**Technique:** Equivalence Partitioning  
**Actor:** Guest user  
**Precondition:** On a category or search results page with multiple products  

**Flow:**
1. Select Sort By: **Price (Low > High)**.
2. Observe the product order.
3. Select Sort By: **Price (High > Low)**.
4. Observe the product order.

**Expected Results:**
- In (Low > High), the cheapest product appears first, most expensive last.
- In (High > Low), the order is reversed.
- No products are missing or duplicated after sorting.
- The URL includes the correct `sort` and `order` parameters.

---

#### S3.3 – Change Number of Products Displayed Per Page
**Priority:** P2  
**Technique:** Boundary Value Analysis  
**Actor:** Guest user  
**Precondition:** On the Components category page (75 products)  

**Flow:**
1. Select **Show: 15** → verify 15 products per page, 5 pages.
2. Select **Show: 25** → verify 25 products per page, 3 pages.
3. Select **Show: 50** → verify 50 products per page, 2 pages.
4. Select **Show: 100** → verify all 75 products on 1 page.

**Expected Results:**
- The correct number of products is displayed per selection.
- Pagination controls (page numbers, “>”, “>|”) update accordingly.
- The text “Showing X to Y of Z” is always accurate.

---

#### S3.4 – Search for an Existing Product
**Priority:** P1  
**Technique:** Use Case Testing  
**Actor:** Guest user  

**Flow:**
1. In the search bar, type `palm` and submit.
2. Observe the Search Results page.

**Expected Results:**
- The page title is **“Search - palm”**.
- Two products are displayed: Palm Treo Pro (ID 29) and Palm Treo Pro (ID 64), both priced $337.99.
- The filter sidebar shows Manufacturer: Palm (2), Colors: Black / Pink, Availability: In stock (1) / Out Of Stock (1).
- Sort and Show controls are present and functional.
- Breadcrumb: Home → Search.

**Risk Mapped:** R06  

---

#### S3.5 – Search for a Non‑Existent Product
**Priority:** P2  
**Technique:** Negative Testing  
**Actor:** Guest user  

**Flow:**
1. Search for `ipad`.
2. Observe the results.

**Expected Results:**
- Message: *“There is no product that matches the search criteria.”*
- A “Continue” button appears to reset the search.
- The search criteria form retains the keyword `ipad`.
- Filter sidebar shows all filters with zero counts and disabled inputs.

**Risk Mapped:** R06  

---

#### S3.6 – Product Detail Page Display
**Priority:** P1  
**Technique:** Use Case Testing  
**Actor:** Guest user  

**Flow:**
1. Navigate to a product detail page (e.g., iPod Touch, product ID 32).
2. Inspect all sections.

**Expected Results:**
- Product title is an `<h1>`.
- Image gallery with multiple thumbnails and a video link.
- Price: **$194.00** (Ex Tax: $160.00).
- Brand: Apple (clickable link).
- Availability: **Out Of Stock** (red badge).
- Product Code: Product 5.
- “Add to Cart” and “Buy Now” buttons are **disabled**.
- Quantity spinner allows values ≥1 but cannot be added to cart.
- Wishlist and Compare buttons are functional.
- Tabs: Description, Reviews (shows “no reviews”), Custom tab.

**Risk Mapped:** R05  

---

### S4 – User Authentication

#### S4.1 – Register a New Account (Valid Data)
**Priority:** P1  
**Technique:** Use Case Testing, Equivalence Partitioning  
**Actor:** Guest user  

**Flow:**
1. Navigate to Register page (`account/register`).
2. Fill the form:
   - First Name: `John`
   - Last Name: `Doe`
   - E‑Mail: `john.doe@example.com`
   - Telephone: `+1234567890`
   - Password: `StrongP@ss1`
   - Password Confirm: `StrongP@ss1`
   - Newsletter: No (default)
   - Privacy Policy: Checked
3. Click “Continue”.

**Expected Results:**
- Redirected to a success page or account dashboard.
- User is logged in automatically.
- The header shows “My account” dropdown with Dashboard, My order, etc.
- A confirmation message is displayed (e.g., “Your Account Has Been Created!”).

**Risk Mapped:** R09  

---

#### S4.2 – Register with Mismatched Passwords
**Priority:** P1  
**Technique:** Negative Testing, Equivalence Partitioning  
**Actor:** Guest user  

**Flow:**
1. Fill all fields as in S4.1, but set:
   - Password: `StrongP@ss1`
   - Password Confirm: `DifferentP@ss2`
2. Click “Continue”.

**Expected Results:**
- The form is not submitted.
- An error message appears: *“Password confirmation does not match password!”*
- All other fields retain their values.

**Risk Mapped:** R09  

---

#### S4.3 – State Transition: Guest → Logged In → Guest (Cart Preservation)
**Priority:** P1  
**Technique:** State Transition Testing  
**Actor:** First guest, then logged‑in user  

**Flow:**
1. **Guest state:** Add products to cart (e.g., iMac ×2, total $340.00).
2. Log in using an existing account.
3. After login, check the cart.
4. Log out.
5. Check the cart again as a guest.

**Expected Results:**
- After login, the same 2 iMacs remain in the cart (cart preserved across login).
- After logout, the cart may either:
  - Still contain the items (OpenCart often preserves session cart), **or**
  - Be empty (depending on implementation).  
  → Document the actual behavior.
- If items are lost, this is a high‑risk issue (R08).

**Risk Mapped:** R08  

---

### S5 – Data Integrity & Calculations

#### S5.1 – Cart Total Calculation with Multiple Products and Quantities
**Priority:** P0  
**Technique:** Decision Table Testing, Boundary Value Analysis  

**Decision Table:**

| iMac Qty | Canon Qty | Palm Qty | Sub‑Total | Eco Tax (×$2) | VAT (20%) | Total |
|----------|-----------|----------|-----------|----------------|-----------|-------|
| 1 | 1 | 1 | $641.99 | $6.00 | $128.40 | $776.39 |
| 3 | 1 | 1 | $981.99 | $10.00 | $196.40 | $1,188.39 |
| 3 | 0 | 1 | $847.99 | $8.00 | $169.60 | $1,025.59 |
| 0 | 0 | 0 | $0.00 | $0.00 | $0.00 | $0.00 |

**Flow:** Recreate each row and verify the totals.  
**Expected Results:** All calculated totals match the decision table exactly.  
**Risk Mapped:** R02  

---

#### S5.2 – VAT & Eco Tax Verification (Single Item)
**Priority:** P1  
**Technique:** Boundary Value Analysis  
**Actor:** Guest user  

**Flow:**
1. Add a single product with a clear unit price (e.g., iMac, $170.00).
2. Go to Cart page.

**Expected Results:**
- Sub‑Total: $170.00
- Eco Tax: $2.00 (flat $2.00 per item)
- VAT: $34.00 (20% of $170.00)
- Total: $206.00

**Risk Mapped:** R02  

---

### S6 – Edge Cases & Negative Testing

#### S6.1 – Attempt to Add Out‑of‑Stock Product to Cart
**Priority:** P0  
**Technique:** Negative Testing  
**Actor:** Guest user  

**Flow:**
1. Navigate to an out‑of‑stock product detail page (e.g., iPod Touch, product ID 32).
2. Observe the “Add to Cart” button state.
3. Click the disabled button if possible, or inspect its disabled attribute.

**Expected Results:**
- The “Add to Cart” button is visibly disabled (grayed out, `disabled` attribute present).
- Clicking it does **not** add the product to the cart.
- Cart badge and drawer remain unchanged.

**Risk Mapped:** R05  

---

#### S6.2 – Enter Invalid Quantity (Zero or Negative)
**Priority:** P1  
**Technique:** Negative Testing, Boundary Value Analysis  
**Actor:** Guest user  

**Flow:**
1. Add a product to cart.
2. On the Cart page, change the quantity to `0` and click “Update”.
3. Repeat with quantity = `-1`.

**Expected Results:**
- For `0`, the system either removes the item or shows an error.
- For `-1`, an error message is displayed (e.g., “Quantity must be at least 1”).
- Cart totals do not become negative or zero unless the item is removed.

---

#### S6.3 – Maximum Quantity Input
**Priority:** P3  
**Technique:** Boundary Value Analysis  
**Actor:** Guest user  

**Flow:**
1. Add a product to cart.
2. Set quantity to a very large value (e.g., `999999`).
3. Click “Update”.

**Expected Results:**
- Either the quantity is accepted (and totals update astronomically), **or**
- An error/stock limit warning appears: *“Products marked with *** are not available in the desired quantity…”*
- The system remains stable (no crash or timeout).

---

#### S6.4 – Direct URL Access to Cart with Empty Cart
**Priority:** P2  
**Technique:** Negative Testing  
**Actor:** Guest user  

**Flow:**
1. Clear all cookies/local storage or open a fresh browser session.
2. Directly navigate to `checkout/cart`.

**Expected Results:**
- The Cart page displays an empty cart message: *“Your shopping cart is empty!”*
- No line items are shown.
- Totals are $0.00.
- “Continue Shopping” and “Checkout” buttons are still present.

---

### S7 – UI/UX & Cross‑Browser Consistency

#### S7.1 – Responsive Layout (Mobile Viewport)
**Priority:** P2  
**Technique:** Exploratory Testing  
**Actor:** Guest user  

**Flow:**
1. Resize browser to a mobile width (e.g., 375×812 — iPhone X).
2. Navigate through: Homepage → Category → Product Detail → Cart.
3. Check all interactive elements.

**Expected Results:**
- Hamburger menu replaces the desktop navigation.
- Category drawer slides in from the left.
- Quick Links drawer slides in from the right.
- Cart drawer works correctly.
- Product cards stack in a single or double column.
- “Add to Cart” buttons are large enough to tap.
- No horizontal scrolling; all text is readable.

---

#### S7.2 – Visual Feedback on “Add to Cart”
**Priority:** P3  
**Technique:** Exploratory Testing  
**Actor:** Guest user  

**Flow:**
1. Click “Add to Cart” on any product.
2. Observe visual changes.

**Expected Results:**
- A spinner briefly appears on the button.
- A toast notification appears at the top: *“Success: You have added … to your shopping cart!”*
- Cart badge updates with a subtle animation (if any).
- The toast disappears after a few seconds or can be dismissed.

---

## 5. Traceability Matrix

| Scenario | Risk(s) Mapped |
|----------|----------------|
| S1.1 | R01, R04 |
| S1.2 | R03 |
| S1.3 | R01 |
| S2.1 | R01, R08 |
| S2.2 | R01 |
| S2.3 | R10 |
| S3.1 | R07 |
| S3.4 | R06 |
| S3.5 | R06 |
| S3.6 | R05 |
| S4.1 | R09 |
| S4.2 | R09 |
| S4.3 | R08 |
| S5.1 | R02 |
| S5.2 | R02 |
| S6.1 | R05 |
| S6.2 | (general input validation) |
| S7.1 | R11 |

---

## 6. Assumptions & Limitations

- The demo site explicitly states *“This is a dummy website for Web Automation Testing”* and does **not** include a functional checkout or payment flow.  
- The “Checkout” button in the cart drawer navigates to a non‑existent checkout page; therefore, scenarios after the cart step are limited to what the site actually provides.  
- Guest users can add products to the cart without logging in, but the cart icon on the homepage may not open the drawer unless the user is on a page that supports the slide‑out (e.g., category, product detail).  
- Product stock status is static; inventory does not change during testing.  
- Shipping quotes depend on a third‑party service; we assume basic functional testing only.  
- No actual coupon codes were discovered; only invalid code testing is feasible.  
- The test design assumes a single‑user, single‑session environment; concurrent user testing is out of scope.