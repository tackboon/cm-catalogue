CREATE TABLE cash_books (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(10) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  description VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE cash_books
  ADD CONSTRAINT check_cash_books_type
  CHECK (type IN ('credit', 'debit'));