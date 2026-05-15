# Coupon and Discount Management Module - End User Documentation

## Overview
The Coupon and Discount Management Module allows administrators to create and manage special promotional codes. This feature helps the business attract and retain customers by offering flexible discounts on their orders during the checkout process.

## Key Functionalities

### 1. Create a Coupon / Discount Code (Admin)
- Administrators can access the **"🎟️ Coupons"** tab in the Admin Panel to manage discounts.
- Clicking **"+ Create Coupon"** opens a creation form.
- The form allows admins to define:
  - **Coupon Code**: A unique code entered by the user (e.g., `SUMMER50`).
  - **Discount Type**: Choose between a *Percentage (%)* off the total or a *Fixed Amount (₹)*.
  - **Discount Value**: The numerical amount or percentage for the deduction.
  - **Validity**: Specify the exact `valid_from` and `valid_to` dates.
  - **Usage Limit**: Specify the total maximum number of times this coupon can be utilized system-wide.

### 2. Coupon Dashboard (Admin)
- The admin dashboard provides a holistic view of promotional performance:
  - Total Coupons created.
  - Currently Active vs. Expired coupons.
- The data table clearly identifies if a coupon is active, inactive, or has naturally expired based on its validity dates.

### 3. Deactivate / Delete Coupon (Admin)
- Admins can instantly **Activate** or **Deactivate** a coupon using the status toggle button. Deactivating a coupon prevents customers from applying it, acting as a soft delete.
- If a coupon needs to be entirely erased from the system, clicking **"🗑️ Delete"** will permanently remove it.

### 4. Apply Coupon at Checkout (Customer)
- When a customer proceeds to the **Checkout** page, they will see an "Enter Coupon Code" input box within the Order Summary panel.
- After typing the code and clicking **Apply**, the system validates it:
  - **If Valid**: A toast notification appears, the discount amount is instantly calculated, and the Grand Total updates.
  - **If Invalid/Expired**: An error notification alerts the customer.

## Database Design

The following schema represents the underlying structure for storing coupon data.

**Table Name:** `coupons`

| Column Name | Datatype | Description |
| :--- | :--- | :--- |
| `coupon_id` | `int` (pk, auto_increment) | Unique identifier for each coupon |
| `coupon_code` | `varchar(50)` | Unique code used by customers during checkout |
| `discount_type` | `varchar(50)` | Type of discount (Percentage or Fixed Amount) |
| `discount_value` | `decimal(10,2)` | Discount value (percentage or amount) |
| `valid_from` | `datetime` | Start date for the coupon's validity |
| `valid_to` | `datetime` | End date for the coupon's validity |
| `usage_limit` | `int` | Maximum number of times the coupon can be used |
| `status` | `boolean` | True for active coupons, False for inactive |
| `created_at` | `datetime` | Timestamp when the coupon was created |
| `updated_at` | `datetime` | Timestamp when the coupon details were last updated |
