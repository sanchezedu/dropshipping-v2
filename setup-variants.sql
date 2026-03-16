-- Tabla de variantes de productos
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- ej: "Rojo", "XL", "128GB"
  type TEXT NOT NULL, -- ej: "color", "size", "storage"
  price_modifier DECIMAL(10,2) DEFAULT 0, -- +$5, -$10, etc
  stock INTEGER DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de imágenes por variante
CREATE TABLE IF NOT EXISTS variant_images (
  id SERIAL PRIMARY KEY,
  variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false
);

-- Habilitar RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_images ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "variants_read" ON product_variants FOR SELECT USING (true);
CREATE POLICY "variants_insert" ON product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "variants_update" ON product_variants FOR UPDATE USING (true);
CREATE POLICY "variants_delete" ON product_variants FOR DELETE USING (true);

CREATE POLICY "variant_images_read" ON variant_images FOR SELECT USING (true);
CREATE POLICY "variant_images_insert" ON variant_images FOR INSERT WITH CHECK (true);
CREATE POLICY "variant_images_update" ON variant_images FOR UPDATE USING (true);
CREATE POLICY "variant_images_delete" ON variant_images FOR DELETE USING (true);

-- Insertar variantes de ejemplo para algunos productos
-- Auriculares (id=1) - Colores
INSERT INTO product_variants (product_id, name, type, price_modifier, stock, sku) VALUES
(1, 'Negro', 'color', 0, 50, 'AUD-BLK-001'),
(1, 'Blanco', 'color', 0, 30, 'AUD-WHT-001'),
(1, 'Azul', 'color', 10, 20, 'AUD-BLU-001');

-- Smartwatch (id=2) - Colores y tamaños
INSERT INTO product_variants (product_id, name, type, price_modifier, stock, sku) VALUES
(2, 'Negro', 'color', 0, 40, 'WATCH-BLK-001'),
(2, 'Plata', 'color', 20, 25, 'WATCH-SLV-001'),
(2, 'Oro', 'color', 50, 10, 'WATCH-GLD-001'),
(2, '40mm', 'size', 0, 35, 'WATCH-40-001'),
(2, '44mm', 'size', 30, 20, 'WATCH-44-001');

-- Tablet (id=5) - Almacenamiento
INSERT INTO product_variants (product_id, name, type, price_modifier, stock, sku) VALUES
(5, '128GB', 'storage', 0, 30, 'TAB-128-001'),
(5, '256GB', 'storage', 50, 20, 'TAB-256-001'),
(5, '512GB', 'storage', 120, 10, 'TAB-512-001');

SELECT COUNT(*) as total_variants FROM product_variants;
