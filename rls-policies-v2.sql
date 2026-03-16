-- ============================================
-- RLS POLICIES - SOLO VERIFICAR Y AGREGAR FALTANTES
-- ============================================

-- 1. Habilitar RLS si no está habilitado
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;

-- 2. Verificar si existen políticas para products
-- Si no existe, crearla
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE policyname = 'products_read_all' AND tablename = 'products'
   ) THEN
      CREATE POLICY products_read_all ON products FOR SELECT USING (true);
   END IF;
END $$;

-- 3. Verificar si existen políticas para orders
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE policyname = 'orders_insert_all' AND tablename = 'orders'
   ) THEN
      CREATE POLICY orders_insert_all ON orders FOR INSERT WITH CHECK (true);
   END IF;
   
   IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE policyname = 'orders_select_all' AND tablename = 'orders'
   ) THEN
      CREATE POLICY orders_select_all ON orders FOR SELECT USING (true);
   END IF;
   
   IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE policyname = 'orders_update_all' AND tablename = 'orders'
   ) THEN
      CREATE POLICY orders_update_all ON orders FOR UPDATE USING (true);
   END IF;
END $$;

-- 4. Verificar si existen políticas para order_items
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE policyname = 'order_items_insert_all' AND tablename = 'order_items'
   ) THEN
      CREATE POLICY order_items_insert_all ON order_items FOR INSERT WITH CHECK (true);
   END IF;
   
   IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE policyname = 'order_items_select_all' AND tablename = 'order_items'
   ) THEN
      CREATE POLICY order_items_select_all ON order_items FOR SELECT USING (true);
   END IF;
END $$;

-- Verificar estado
SELECT 
  'products' as table_name,
  rowsecurity as rls_enabled,
  (SELECT count(*) FROM pg_policies WHERE tablename = 'products') as policy_count
FROM pg_tables WHERE tablename = 'products'
UNION ALL
SELECT 
  'orders',
  rowsecurity,
  (SELECT count(*) FROM pg_policies WHERE tablename = 'orders')
FROM pg_tables WHERE tablename = 'orders'
UNION ALL
SELECT 
  'order_items',
  rowsecurity,
  (SELECT count(*) FROM pg_policies WHERE tablename = 'order_items')
FROM pg_tables WHERE tablename = 'order_items';
