# Customer Management Module - End User Documentation

## Overview
The Customer Management Module is designed to manage customer data efficiently. It handles personal information, contact details, and account settings, empowering administrators to track customers, provide support, and manage account statuses.

## Key Functionalities

### 1. Add a New Customer
- **Frontend Registration:** Customers can independently register their accounts via the public-facing registration page.
- **Admin Dashboard:** Administrators can manually add customer information directly through the Customer Management panel if needed.

### 2. Customer Dashboard
- The admin dashboard provides a comprehensive view of all registered customers.
- Important details such as **First Name, Last Name, Email, Phone Number, and Order History** (number of orders) are displayed in an intuitive table.

### 3. Update Customer Details
- Administrators can seamlessly update a customer's personal details.
- This includes correcting contact information (Email/Phone) or updating their active status.

### 4. Delete / Deactivate Customer Account (Soft Delete)
- Customer accounts can be deactivated by administrators.
- **Soft Delete Implementation:** Deactivating an account does not permanently erase the user's data from the database. It merely switches their `status` to `Inactive` (False), preserving their order history and data integrity.

## Database Design

The following schema represents the underlying structure for storing customer data in the database.

**Table Name:** `users`

| Column Name | Datatype | Description |
| :--- | :--- | :--- |
| `user_id` | `int` (pk, auto_increment) | Unique identifier for each customer |
| `first_name` | `varchar(100)` | Customer's first name |
| `last_name` | `varchar(100)` | Customer's last name |
| `email` | `varchar(100)` | Customer's email address |
| `phone` | `varchar(15)` | Customer's phone number |
| `created_at` | `datetime` | Timestamp when the customer account was created |
| `updated_at` | `datetime` | Timestamp when the customer details were last updated |
| `status` | `boolean` | True for active customers, False for inactive |
