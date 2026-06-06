CREATE DATABASE IF NOT EXISTS order_management;
USE order_management;

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  store_id VARCHAR(100) NOT NULL,
  items JSON NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('PLACED', 'PREPARING', 'COMPLETED') DEFAULT 'PLACED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_store_id (store_id),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS orders_archive (
  id VARCHAR(36) PRIMARY KEY,
  store_id VARCHAR(100) NOT NULL,
  items JSON NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('PLACED', 'PREPARING', 'COMPLETED'),
  created_at TIMESTAMP,
  archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_store_id (store_id),
  INDEX idx_created_at (created_at)
);