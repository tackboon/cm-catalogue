DROP TRIGGER IF EXISTS customers_tsvector_update ON customers;
DROP FUNCTION IF EXISTS customers_tsvector_trigger;
DROP INDEX IF EXISTS customers_tsvector_document_idx;
ALTER TABLE customers DROP CONSTRAINT IF EXISTS check_customers_relationship;
DROP TABLE IF EXISTS customers;