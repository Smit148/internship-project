# Payment Management Module - End User Documentation

## Overview
The Payment Management Module handles payment processing and records transaction history for each order. It integrates with third-party payment gateways (e.g., Stripe, PayPal) to securely process payments and provides administrators with full visibility into all transactions.

## Key Functionalities

### 1. Process Payment
- Payments are processed through external payment gateways such as **Stripe** and **PayPal**.
- Supported payment methods include:
  - 💳 Credit Card
  - 💳 Debit Card
  - 🅿️ PayPal
  - 🏦 Bank Transfer

### 2. Payment Dashboard
- Administrators can access the Payment Dashboard from the Admin Panel sidebar by clicking **"💳 Payments"**.
- The dashboard displays key statistics at a glance:
  - **Total Transactions** — Number of all payment records.
  - **Revenue (Paid)** — Sum of all successfully paid transactions.
  - **Refunded** — Total amount refunded to customers.
  - **Failed** — Count of failed payment attempts.
- The transaction table shows each payment's **Payment ID, Order ID, Amount, Payment Method, Status,** and **Date**.

### 3. View Payment Details
1. Click the **"🔍 Details"** button next to any transaction.
2. A modal will display full payment information including timestamps for when the payment was processed and last updated.

### 4. Refund Payment
1. Locate a payment with a **"Paid"** status in the transaction table.
2. Click the **"↩️ Refund"** button.
3. A confirmation modal will appear with a warning explaining that the refund will be returned via the customer's original payment method.
4. Click **"Yes, Process Refund"** to confirm.
5. The payment status will update to **"Refunded"** and the refund will be logged in the dashboard.

## Database Design

The following schema represents the underlying structure for storing payment data.

**Table Name:** `payments`

| Column Name | Datatype | Description |
| :--- | :--- | :--- |
| `payment_id` | `int` (pk, auto_increment) | Unique identifier for each payment |
| `order_id` | `int` (fk) | Foreign key referencing the order_id in orders table |
| `amount` | `decimal(10,2)` | Amount paid |
| `payment_method` | `varchar(50)` | Payment method used (Credit Card, PayPal, etc.) |
| `payment_status` | `varchar(50)` | Status of the payment (Paid, Failed, Refunded) |
| `created_at` | `datetime` | Timestamp when the payment was processed |
| `updated_at` | `datetime` | Timestamp when the payment details were last updated |
