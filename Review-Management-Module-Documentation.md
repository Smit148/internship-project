# Review and Rating Management Module - End User Documentation

## Overview
The Review and Rating Management Module enables customers to leave feedback on products they have purchased. This feature helps other customers make informed purchasing decisions and allows administrators to gather insights about product quality and customer satisfaction while keeping the platform safe through moderation.

## Key Functionalities

### 1. View Product Reviews (Customer)
- Customers can view all approved reviews and ratings at the bottom of every product details page.
- Each review displays the customer's name, their 1-5 star rating, and their detailed text feedback.

### 2. Add a Review / Rating (Customer)
- A "Write a Review" form is available on the product page.
- Customers can select a rating between 1 to 5 stars using a dropdown menu.
- Customers can provide text feedback describing what they liked or disliked about the product.
- *Note: Newly submitted reviews are sent to the admin dashboard for moderation before appearing publicly.*

### 3. Update / Delete Own Reviews (Customer)
- If a customer has previously submitted a review, they are provided with **"Edit"** and **"Delete"** buttons below their specific review.
- Clicking "Delete" will permanently remove their review from the product page.

### 4. Review Moderation Dashboard (Admin)
- Administrators can access the Review Management Dashboard by clicking **"⭐ Reviews"** in the Admin Panel sidebar.
- The dashboard provides overall statistics:
  - **Total Reviews**
  - **Approved count**
  - **Rejected / Pending count**
  - **Global Average Rating** (across all products)
- Admins can view every submitted review, including the associated product, customer name, star rating, and full text.

### 5. Approve / Reject / Delete Reviews (Admin)
- **Approve/Reject:** Admins can click **"✅ Approve"** to make a review visible on the product page, or **"🚫 Reject"** to hide it if it violates guidelines.
- **Permanent Deletion:** If a review contains inappropriate content, spam, or violates community standards, admins can click the **"🗑️ Delete"** button. This permanently removes the review from the database after a confirmation prompt.

## Database Design

The following schema represents the underlying structure for storing review data.

**Table Name:** `reviews`

| Column Name | Datatype | Description |
| :--- | :--- | :--- |
| `review_id` | `int` (pk, auto_increment) | Unique identifier for each review |
| `product_id` | `int` (fk) | Foreign key referencing the products table |
| `customer_id` | `int` (fk) | Foreign key referencing the customers table |
| `rating` | `int` | Rating given by the customer (1-5 stars) |
| `review_text` | `varchar(1000)` | Textual feedback provided by the customer |
| `created_at` | `datetime` | Timestamp when the review was created |
| `updated_at` | `datetime` | Timestamp when the review was last updated |
| `status` | `boolean` | True for approved reviews, False for rejected/pending |
