-- Add customer_id column to orders if not exists
ALTER TABLE IF EXISTS orders ADD COLUMN IF NOT EXISTS customer_id UUID;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
