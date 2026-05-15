# Cart Management Module - End User Documentation

## Overview
The Cart Management Module allows customers to add, update, and remove products from their shopping cart. It ensures that customers can review their selected items before proceeding to checkout, with prices and quantities updated in real-time. Administrators also have access to a Cart Dashboard to monitor customer carts and analyze cart abandonment trends.

## Key Functionalities

### 1. Add to Cart (Customer)
- Customers can add products to their shopping cart directly from any product page.
- The system validates that the product is in stock before adding it to the cart.
- A confirmation toast message appears when an item is successfully added.

### 2. Update Cart (Customer)
- Customers can modify the quantity of items in their cart using the **+** and **−** buttons.
- The total price is automatically recalculated in real-time when quantity changes.
- The system checks inventory for sufficient stock when increasing the quantity.

### 3. Remove from Cart (Customer)
- Customers can remove individual items from their cart by clicking the **🗑️** button.
- The **"🗑️ Clear Cart"** button removes all items at once.
- The total price is recalculated once an item is removed.

### 4. Cart Summary & Checkout (Customer)
- The cart page displays an **Order Summary** panel showing:
  - Subtotal (with item count)
  - Shipping cost (free for orders above ₹1,000)
  - Grand Total
- Customers can proceed to checkout by clicking **"Proceed to Checkout →"**.

### 5. Cart Dashboard (Admin)
- Administrators can access the Cart Dashboard from the Admin Panel sidebar by clicking **"🛒 Carts"**.
- The dashboard provides key statistics:
  - **Total Cart Items** — Number of all cart entries across all customers.
  - **Active Carts** — Currently active shopping carts.
  - **Abandoned** — Carts that were left without checkout.
  - **Converted** — Carts that successfully led to an order.
  - **Abandonment Rate** — Percentage of carts abandoned.
- Admins can **filter** carts by status: All, Active, Abandoned, or Converted.
- Admins can **remove** cart items on behalf of customers.

## Database Design

The following schema represents the underlying structure for storing cart data.

**Table Name:** `carts`

| Column Name | Datatype | Description |
| :--- | :--- | :--- |
| `cart_id` | `int` (pk, auto_increment) | Unique identifier for each cart |
| `customer_id` | `int` (fk) | Foreign key referencing the customers table |
| `product_id` | `int` (fk) | Foreign key referencing the products table |
| `quantity` | `int` | Number of items in the cart |
| `total_price` | `decimal(10,2)` | Total price for the items in the cart |
| `created_at` | `datetime` | Timestamp when the cart was created |
| `updated_at` | `datetime` | Timestamp when the cart was last updated |
