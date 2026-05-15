# Wishlist Management Module - End User Documentation

## Overview
The Wishlist Management Module allows customers to save products they are interested in but are not ready to purchase. This feature enhances user engagement and helps customers track products they may want to buy in the future. Administrators can also monitor wishlist data to understand product demand and customer interest.

## Key Functionalities

### 1. Add to Wishlist (Customer)
- Customers can add products to their Wishlist by clicking the **🤍 Add to Wishlist** button on any product detail page.
- Once added, the button changes to **❤️ Saved to Wishlist** to indicate the product is saved.

### 2. View Wishlist (Customer)
- Customers can view their Wishlist by navigating to the **"My Wishlist ❤️"** page.
- The wishlist displays each saved product with its:
  - Product image
  - Product name
  - Category
  - Price
  - Availability status

### 3. Remove from Wishlist (Customer)
- Customers can remove products from their Wishlist by clicking the **🗑️** button on the wishlist card.
- A toast notification confirms the removal.

### 4. Move from Wishlist to Cart (Customer)
- Customers can move a product directly from their Wishlist to their Shopping Cart by clicking the **"🛒 Move to Cart"** button.
- The item is automatically removed from the Wishlist and added to the Cart.
- A confirmation toast message appears: *"[Product Name] moved to cart!"*

### 5. Wishlist Dashboard (Admin)
- Administrators can access the Wishlist Dashboard from the Admin Panel sidebar by clicking **"❤️ Wishlists"**.
- The dashboard provides key statistics:
  - **Total Entries** — Total number of wishlist saves across all customers.
  - **Customers** — Number of unique customers who have wishlisted items.
  - **Unique Products** — Number of distinct products saved.
  - **Most Wishlisted** — The product with the highest number of saves, displayed in a highlighted banner.
- Admins can view all wishlist entries in a table showing Customer Name, Product, Price, Availability, and Date Added.
- Admins can remove wishlist entries if needed.

## Database Design

The following schema represents the underlying structure for storing wishlist data.

**Table Name:** `wishlists`

| Column Name | Datatype | Description |
| :--- | :--- | :--- |
| `wishlist_id` | `int` (pk, auto_increment) | Unique identifier for each Wishlist entry |
| `customer_id` | `int` (fk) | Foreign key referencing the customers table |
| `product_id` | `int` (fk) | Foreign key referencing the products table |
| `created_at` | `datetime` | Timestamp when the product was added to Wishlist |
| `updated_at` | `datetime` | Timestamp when the Wishlist was last updated |
