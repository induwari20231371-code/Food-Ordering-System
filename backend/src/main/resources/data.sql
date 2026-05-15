-- Insert Categories
-- Insert Categories (use INSERT IGNORE to avoid duplicate-key errors)
INSERT IGNORE INTO categories (name, description, created_at) VALUES
('Burgers', 'Delicious burgers with fresh toppings', CURRENT_TIMESTAMP),
('Pizza', 'Wood-fired pizzas with gourmet toppings', CURRENT_TIMESTAMP),
('Salads', 'Fresh and healthy salads', CURRENT_TIMESTAMP),
('Pasta', 'Italian pasta dishes', CURRENT_TIMESTAMP),
('Beverages', 'Drinks and beverages', CURRENT_TIMESTAMP),
('Desserts', 'Sweet treats and desserts', CURRENT_TIMESTAMP);
