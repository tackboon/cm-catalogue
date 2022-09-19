DROP TRIGGER IF EXISTS products_tsvector_update ON products;
DROP FUNCTION IF EXISTS products_tsvector_trigger;
DROP INDEX IF EXISTS products_tsvector_document_idx;
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_products_status;
DROP TABLE IF EXISTS products;
