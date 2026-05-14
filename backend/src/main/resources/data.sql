-- Insert Categories
-- Insert Categories (use INSERT IGNORE to avoid duplicate-key errors)
INSERT IGNORE INTO categories (name, description, created_at) VALUES
('Burgers', 'Delicious burgers with fresh toppings', CURRENT_TIMESTAMP),
('Pizza', 'Wood-fired pizzas with gourmet toppings', CURRENT_TIMESTAMP),
('Salads', 'Fresh and healthy salads', CURRENT_TIMESTAMP),
('Pasta', 'Italian pasta dishes', CURRENT_TIMESTAMP),
('Beverages', 'Drinks and beverages', CURRENT_TIMESTAMP),
('Desserts', 'Sweet treats and desserts', CURRENT_TIMESTAMP);

-- Insert Food Items (Burgers)
INSERT IGNORE INTO food_items (name, description, price, category_id, status, image_url, created_at, deleted) VALUES
('Classic Cheeseburger', 'Juicy beef patty with melted cheddar, lettuce, and tomato', 450.00, 1, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Bacon Burger', 'Double patty with crispy bacon, cheese, and special sauce', 550.00, 1, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Spicy Chicken Burger', 'Crispy chicken breast with jalapeños and sriracha mayo', 480.00, 1, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Mushroom Swiss Burger', 'Sautéed mushrooms and Swiss cheese on a beef patty', 520.00, 1, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0);

-- Insert Food Items (Pizza)
INSERT IGNORE INTO food_items (name, description, price, category_id, status, image_url, created_at, deleted) VALUES
('Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil', 650.00, 2, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Pepperoni Pizza', 'Loaded with pepperoni and extra cheese', 700.00, 2, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Vegetarian Pizza', 'Bell peppers, onions, mushrooms, and olives', 680.00, 2, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('BBQ Chicken Pizza', 'Grilled chicken with BBQ sauce and red onions', 750.00, 2, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Four Cheese Pizza', 'Mozzarella, cheddar, parmesan, and gouda', 720.00, 2, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0);

-- Insert Food Items (Salads)
INSERT IGNORE INTO food_items (name, description, price, category_id, status, image_url, created_at, deleted) VALUES
('Caesar Salad', 'Crisp romaine with parmesan and homemade Caesar dressing', 380.00, 3, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Greek Salad', 'Feta cheese, olives, tomatoes, and cucumbers', 420.00, 3, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Grilled Chicken Salad', 'Mixed greens with grilled chicken and ranch dressing', 450.00, 3, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Caprese Salad', 'Fresh mozzarella, tomatoes, and basil with balsamic glaze', 410.00, 3, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0);

-- Insert Food Items (Pasta)
INSERT IGNORE INTO food_items (name, description, price, category_id, status, image_url, created_at, deleted) VALUES
('Spaghetti Carbonara', 'Creamy sauce with bacon and parmesan', 520.00, 4, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Penne Arrabbiata', 'Spicy tomato sauce with garlic and red peppers', 480.00, 4, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Fettuccine Alfredo', 'Rich and creamy parmesan sauce', 550.00, 4, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Lasagna', 'Layered pasta with meat sauce and cheese', 600.00, 4, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Shrimp Pasta', 'Fresh shrimp with garlic and white wine sauce', 650.00, 4, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0);

-- Insert Food Items (Beverages)
INSERT IGNORE INTO food_items (name, description, price, category_id, status, image_url, created_at, deleted) VALUES
('Iced Cola', 'Classic refreshing cola with ice', 120.00, 5, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 180.00, 5, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Iced Coffee', 'Chilled coffee with ice and milk', 150.00, 5, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Lemonade', 'Fresh homemade lemonade', 140.00, 5, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Smoothie Bowl', 'Mixed berry smoothie with granola', 320.00, 5, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0);

-- Insert Food Items (Desserts)
INSERT IGNORE INTO food_items (name, description, price, category_id, status, image_url, created_at, deleted) VALUES
('Chocolate Cake', 'Rich chocolate cake with frosting', 280.00, 6, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and nuts', 220.00, 6, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Cheesecake', 'Creamy New York style cheesecake', 300.00, 6, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Brownie', 'Fudgy chocolate brownie with vanilla ice cream', 240.00, 6, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0),
('Apple Pie', 'Classic apple pie with cinnamon and vanilla', 260.00, 6, 'AVAILABLE', NULL, CURRENT_TIMESTAMP, 0);
