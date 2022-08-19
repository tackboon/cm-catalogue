CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10),
  name VARCHAR(100) NOT NULL UNIQUE,
  contact VARCHAR(20),
  relationship VARCHAR(20) NOT NULL,
  address VARCHAR(200),
  postcode VARCHAR(5),
  city VARCHAR(30),
  state VARCHAR(30),
  total_unbilled_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE customers
  ADD CONSTRAINT check_customers_relationship
  CHECK (relationship IN ('in_cooperation', 'suspended'));

ALTER TABLE customers
  ADD COLUMN tsvector_document tsvector;

CREATE INDEX customers_tsvector_document_idx 
  ON customers
  USING GIN(tsvector_document);

CREATE FUNCTION customers_tsvector_trigger() RETURNS TRIGGER AS $$
  BEGIN
    new.tsvector_document := 
    to_tsvector(
      coalesce(new.name, '') || ' ' || 
      coalesce(new.code, '') || ' ' || 
      coalesce(new.contact, '') || ' ' ||
      coalesce(new.city, '') || ' ' ||
      coalesce(new.state, '')
    );
    return new;
  END
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_tsvector_update BEFORE INSERT OR UPDATE
  ON customers FOR EACH ROW EXECUTE PROCEDURE customers_tsvector_trigger();