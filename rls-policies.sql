-- ============================================
-- RLS POLICIES FOR DROPSHOP ECUADOR
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PRODUCTS POLICIES
-- ============================================

-- Everyone can read products
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
USING (true);

-- Only authenticated users can insert products
CREATE POLICY "Users can insert products"
ON products FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update products
CREATE POLICY "Users can update products"
ON products FOR UPDATE
USING (auth.role() = 'authenticated');

-- Only authenticated users can delete products
CREATE POLICY "Users can delete products"
ON products FOR DELETE
USING (auth.role() = 'authenticated');

-- ============================================
-- ORDERS POLICIES
-- ============================================

-- Customers can read their own orders
CREATE POLICY "Customers can view own orders"
ON orders FOR SELECT
USING (auth.uid()::text = customer_id::text OR auth.role() = 'authenticated');

-- Anyone can insert orders (guest checkout)
CREATE POLICY "Anyone can create orders"
ON orders FOR INSERT
WITH CHECK (true);

-- Only authenticated can update orders
CREATE POLICY "Users can update orders"
ON orders FOR UPDATE
USING (auth.role() = 'authenticated');

-- ============================================
-- ORDER ITEMS POLICIES
-- ============================================

-- Customers can read their own order items
CREATE POLICY "Customers can view own order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (auth.uid()::text = orders.customer_id::text OR auth.role() = 'authenticated')
  )
);

-- Anyone can insert order items
CREATE POLICY "Anyone can create order items"
ON order_items FOR INSERT
WITH CHECK (true);

-- Only authenticated can update
CREATE POLICY "Users can update order items"
ON order_items FOR UPDATE
USING (auth.role() = 'authenticated');

-- Only authenticated can delete
CREATE POLICY "Users can delete order items"
ON order_items FOR DELETE
USING (auth.role() = 'authenticated');

-- ============================================
-- ANONYMIZED VIEWS (Optional)
-- ============================================

-- Create a view for public order stats (no personal data)
CREATE OR REPLACE VIEW order_stats AS
SELECT 
  status,
  COUNT(*) as count,
  SUM(total) as revenue
FROM orders
GROUP BY status;

-- Grant public access to stats
GRANT SELECT ON order_stats TO anon;
GRANT SELECT ON order_stats TO authenticated;
