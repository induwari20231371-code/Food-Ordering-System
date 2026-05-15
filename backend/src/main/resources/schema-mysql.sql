-- MySQL schema adjustments to keep delete flows working with nullable category references.
ALTER TABLE food_items MODIFY COLUMN category_id BIGINT NULL;
