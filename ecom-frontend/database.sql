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

-- 3. Create payments table
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(user_id)
);

-- 4. Create carts table
CREATE TABLE carts (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    product_id INT,
    quantity INT,
    total_price DECIMAL(10,2),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

-- 5. Create wishlists table
CREATE TABLE wishlists (
    wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    product_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

-- 6. Create shipping table
CREATE TABLE shipping (
    shipping_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    courier_service VARCHAR(100),
    tracking_number VARCHAR(100),
    shipping_status VARCHAR(50),
    shipping_cost DECIMAL(10,2),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(user_id)
);
