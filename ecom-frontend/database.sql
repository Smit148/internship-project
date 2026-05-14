-- Database Schema for Order Management Module

-- Create orders table
CREATE TABLE orders (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    total_amount DECIMAL(10,2),
    order_status VARCHAR(50),
    shipping_address VARCHAR(300),
    created_at DATETIME,
    updated_at DATETIME,
    status BOOLEAN,
    FOREIGN KEY (customer_id) REFERENCES users(id) -- Assuming users table has an 'id' or 'user_id' column
);

-- Note: In the prompt schema, the primary key for the order is named 'user_id'. 
-- In a real-world scenario, this is typically named 'order_id', but it is implemented here exactly as requested by the assignment.
