# Order Management Module - End User Documentation

## Overview
The Order Management Module facilitates the processing and tracking of customer orders. It enables administrators to view and manage orders, monitor their status, and ensure timely delivery.

## Key Functionalities

### 1. Place an Order
- Customers can place orders by selecting products and adding them to their shopping cart.
- The system automatically calculates the total price, including any applicable taxes and shipping costs.

### 2. Order Dashboard
- Admins have access to a comprehensive dashboard to view all customer orders.
- Orders can be filtered and monitored based on their current status: **Pending, Shipped, Delivered, Cancelled**.
- Each order row displays vital details such as the Order ID, Customer Name, Shipping Address, Total Amount, and Order Status.

### 3. Update Order Status
- Administrators can easily update the status of an order to reflect its real-world shipping progress (e.g., updating an order from "Pending" to "Shipped" or "Delivered").

### 4. Cancel Order (Soft Delete)
- Both customers and admins have the ability to cancel an order, provided the order has **not been shipped yet**.
- **Soft Delete Implementation:** When an order is cancelled, it is not permanently deleted from the database. Instead, the `order_status` field is changed to "Cancelled". This preserves the order history for auditing and support purposes.

## Database Design

To support this module, the following database schema is implemented:

**Table Name:** `orders`

| Column Name | Datatype | Description |
| :--- | :--- | :--- |
| `user_id` | `int` (pk, auto_increment) | Unique identifier for each order |
| `customer_id` | `int` (fk) | Foreign key referencing the users table |
| `total_amount` | `decimal(10,2)` | Total cost of the order |
| `order_status` | `varchar(50)` | Status of the order (Pending, Shipped, etc.) |
| `shipping_address` | `varchar(300)` | Shipping address for the order |
| `created_at` | `datetime` | Timestamp when the order was placed |
| `updated_at` | `datetime` | Timestamp when the order status was last updated |
| `status` | `boolean` | True for active orders, False for cancelled orders |
