# Shipping Management Module - End User Documentation

## Overview
The Shipping Management Module handles the shipping process, including calculating shipping costs, tracking shipments, and integrating with logistics providers. It ensures that products are delivered to customers efficiently and on time.

## Key Functionalities

### 1. Shipping Cost Calculation
- Shipping costs are calculated based on factors like weight, delivery location, and shipping method.
- Orders above ₹1,000 qualify for **free shipping**; otherwise, a shipping fee is applied.
- The calculated cost is displayed in both the customer's cart summary and the admin shipping dashboard.

### 2. Shipping Dashboard (Admin)
- Administrators can access the Shipping Dashboard from the Admin Panel sidebar by clicking **"🚚 Shipping"**.
- The dashboard provides key statistics at a glance:
  - **Total Shipments** — Number of all shipping entries.
  - **Pending** — Orders awaiting shipment.
  - **Shipped** — Orders that have been dispatched.
  - **In Transit** — Orders currently being delivered.
  - **Delivered** — Successfully delivered orders.
  - **Total Shipping Cost** — Sum of all shipping charges.
- The shipment table displays each entry's **Shipping ID, Order ID, Courier Service, Tracking Number, Status, Cost,** and **Last Updated** date.

### 3. Track Shipment (Customer)
- Customers can view the current status of their shipment using the tracking number provided by the courier service.
- Tracking numbers are assigned by the admin once the order has been shipped and are displayed on the order details page.

### 4. Update Shipping Information (Admin)
1. Locate the shipment in the Shipping Dashboard table.
2. Click the **"✏️ Update"** button.
3. An edit modal will appear where you can update:
   - **Courier Service** — Select from available providers (BlueDart, Delhivery, FedEx, DTDC, India Post).
   - **Tracking Number** — Enter the unique tracking ID from the courier.
   - **Shipping Status** — Update to Pending, Shipped, In Transit, or Delivered.
4. Click **"Save Changes"** to confirm.

## Database Design

The following schema represents the underlying structure for storing shipping data.

**Table Name:** `shipping`

| Column Name | Datatype | Description |
| :--- | :--- | :--- |
| `shipping_id` | `int` (pk, auto_increment) | Unique identifier for each shipping entry |
| `order_id` | `int` (fk) | Foreign key referencing the orders table |
| `courier_service` | `varchar(100)` | Name of the courier or shipping provider |
| `tracking_number` | `varchar(100)` | Unique tracking number provided by the courier |
| `shipping_status` | `varchar(50)` | Status of the shipment (Shipped, In Transit, Delivered) |
| `shipping_cost` | `decimal(10,2)` | Shipping cost for the order |
| `created_at` | `datetime` | Timestamp when the shipping was initiated |
| `updated_at` | `datetime` | Timestamp when the shipping details were last updated |
