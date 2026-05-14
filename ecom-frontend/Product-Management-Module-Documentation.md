# Product Management Module - End User Documentation

## Overview
The Product Management Module is an essential component of the E-commerce platform's administrative dashboard. It provides administrators with a comprehensive interface to manage the product catalog efficiently. Using this module, admins can add new products, modify existing details, deactivate (soft-delete) products, and monitor inventory levels in real-time.

## Key Features
- **Product Listing**: View a complete list of products with essential details like ID, Name, SKU, Category, Price, Inventory, and Status.
- **Add Product**: Seamlessly create new products by specifying the product name, description, price, SKU, category, and initial inventory count.
- **Modify Product**: Edit the details of an existing product, including updating stock counts and revising descriptions or pricing.
- **Deactivate/Reactivate (Soft-Delete)**: Hide products from the customer interface without permanently deleting their data. A safety warning ensures products aren't accidentally deactivated.
- **Inventory Tracking**: Visual indicators (badges) alert admins to low stock or out-of-stock items at a glance.

## How to Use the Module

### 1. Viewing Products
Upon navigating to the "Product Management" section in the Admin panel, you will see a statistical overview of your inventory (Total Products, Active, Inactive, Out of Stock, Low Stock). Below the stats is the main product table.
- **Active Products** are displayed normally.
- **Inactive Products** are greyed out.
- **Inventory levels** are color-coded: Red (Out of Stock), Yellow/Orange (Low Stock), and Normal for healthy stock.

### 2. Adding a New Product
1. Click the **"+ Add Product"** button at the top right of the screen.
2. A modal window will appear. Fill in the required fields:
   - **Product Name**: The title of the product.
   - **Description**: Detailed information about the product (max 500 characters).
   - **Price (₹)**: The selling price.
   - **SKU**: A unique identifier for the stock keeping unit.
   - **Category**: Select the appropriate category from the dropdown.
   - **Inventory Count**: The initial number of units available for sale.
3. Click **"Create Product"** to save.

### 3. Editing an Existing Product
1. Locate the product in the table.
2. Click the **"✏️ Edit"** button in the "Actions" column.
3. The edit modal will open with the product's current details pre-filled.
4. Make the necessary changes (e.g., updating price or inventory count).
5. Click **"Save Changes"**.

### 4. Deactivating a Product (Soft-Delete)
To remove a product from the customer-facing storefront without permanently deleting its history:
1. Locate an active product in the table.
2. Click the **"🚫 Deactivate"** button.
3. A warning modal will appear, explaining that the product will be hidden from the customer interface.
4. Click **"Yes, Deactivate"** to confirm. 
*(Note: You can easily reactivate a product by clicking the **"✅ Reactivate"** button on any inactive product.)*

## Troubleshooting & Tips
- **Cannot find a product?** Ensure you check the "Inactive" rows, as it might have been deactivated.
- **Stock not updating?** If you just updated the inventory, refresh the page if the backend is slow to respond, though changes should reflect immediately in the table.
