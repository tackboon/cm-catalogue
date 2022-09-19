CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(200),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL,
  position NUMERIC NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE SEQUENCE products_position_seq
  AS INTEGER
  INCREMENT BY 1
  OWNED BY products.position;

ALTER TABLE products
  ALTER COLUMN position SET DEFAULT nextval('products_position_seq');

ALTER TABLE products
  ADD CONSTRAINT check_products_status
  CHECK (status IN ('in_stock', 'out_of_stock'));

ALTER TABLE products
  ADD COLUMN tsvector_document tsvector;

CREATE INDEX products_tsvector_document_idx 
  ON products
  USING GIN(tsvector_document);

CREATE FUNCTION products_tsvector_trigger() RETURNS TRIGGER AS $$
  BEGIN
    new.tsvector_document := 
    to_tsvector(
      coalesce(new.name, '') || ' ' || 
      coalesce(new.description, '')
    );
    return new;
  END
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_tsvector_update BEFORE INSERT OR UPDATE
  ON products FOR EACH ROW EXECUTE PROCEDURE products_tsvector_trigger();