CREATE TABLE products_catalogue_files (
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  file_id VARCHAR(255) REFERENCES catalogue_files(id),
  is_preview INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, file_id)
);