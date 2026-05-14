-- Database Schema for E-commerce Modules

-- 1. Create users (Customers) table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    created_at DATETIME,
    updated_at DATETIME,
    status BOOLEAN
);

-- 2. Create orders table
CREATE TABLE orders (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    total_amount DECIMAL(10,2),
    order_status VARCHAR(50),
    shipping_address VARCHAR(300),
    created_at DATETIME,
    updated_at DATETIME,
    status BOOLEAN,
    FOREIGN KEY (customer_id) REFERENCES users(user_id)
);
