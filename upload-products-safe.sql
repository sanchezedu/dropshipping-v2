-- ============================================
-- INSERT/UPDATE PRODUCTS (Safe - No Delete)
-- ============================================

-- If products table doesn't exist, create it
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  image TEXT,
  rating DECIMAL(2,1),
  reviews INTEGER DEFAULT 0,
  stock BOOLEAN DEFAULT true,
  category TEXT,
  description TEXT,
  features TEXT,
  tags TEXT
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist and create new ones
DROP POLICY IF EXISTS "products_read_all" ON products;
DROP POLICY IF EXISTS "products_insert_all" ON products;
DROP POLICY IF EXISTS "products_update_all" ON products;
DROP POLICY IF EXISTS "products_delete_all" ON products;

CREATE POLICY "products_read_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_all" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_all" ON products FOR UPDATE USING (true);
CREATE POLICY "products_delete_all" ON products FOR DELETE USING (true);

-- Insert or Update products (使用 ON CONFLICT)
INSERT INTO products (id, name, price, old_price, image, rating, reviews, stock, category, description, features, tags) VALUES
(1, 'Auriculares Bluetooth Premium Noise Cancelling', 249.99, 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 4.8, 2847, true, 'electronica', 'Auriculares con cancelación activa de ruido, batería de 30 horas y sonido Hi-Fi premium.', '["Cancelación activa de ruido","Batería 30 horas","Sonido Hi-Fi"]', '["bestseller"]'),
(2, 'Smartwatch Fitness Pro Series 8', 189.99, 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 4.7, 1523, true, 'electronica', 'Reloj inteligente con monitor de frecuencia cardíaca, GPS y resistencia al agua 5ATM.', '["GPS integrado","Resistencia agua 5ATM","Monitor ritmo cardíaco"]', '["nuevo"]'),
(3, 'Cámara Acción 4K Waterproof Ultra', 329.99, 499.99, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600', 4.9, 892, true, 'electronica', 'Cámara 4K a 60fps con estabilización gyroscópica. Sumergible hasta 40 metros.', '["4K 60fps","Estabilización gyroscópica","Sumergible 40m"]', '["descuento"]'),
(4, 'Altavoz Bluetooth Portátil Boom 360', 79.99, 129.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 4.5, 2100, true, 'electronica', 'Altavoz portátil con sonido 360°, resistencia al agua IPX7 y 20 horas de batería.', '["Sonido 360°","IPX7 resistente agua","20 horas batería"]', '["bestseller"]'),
(5, 'Tablet Android 10.5" Pro', 299.99, 449.99, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600', 4.6, 567, true, 'electronica', 'Tablet con pantalla 10.5" AMOLED, 8GB RAM, 128GB almacenamiento y stylus incluido.', '["Pantalla AMOLED 10.5"","8GB RAM","128GB almacenamiento"]', '["nuevo"]'),
(6, 'Consola Retro Clásica Mini', 59.99, 89.99, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', 4.4, 3200, true, 'electronica', 'Consola retro con 620 juegos clásicos incluidos. HDMI y 2 controles.', '["620 juegos","HDMI","2 controles"]', '["descuento"]'),
(7, 'Dron Mini Foldable 4K', 449.99, 699.99, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600', 4.7, 423, true, 'electronica', 'Dron plegable con cámara 4K, GPS, modo seguimiento y 30 min de vuelo.', '["Cámara 4K","GPS","30 min vuelo","Plegable"]', '["nuevo"]'),
(8, 'Laptop Ultrafina 15.6" i7', 899.99, 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', 4.8, 234, true, 'electronica', 'Laptop con Intel Core i7, 16GB RAM, 512GB SSD y pantalla Full HD.', '["Intel Core i7","16GB RAM","512GB SSD","Full HD"]', '["bestseller"]'),
(9, 'Consola Gaming Portable 7"', 349.99, 499.99, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600', 4.6, 890, true, 'electronica', 'Consola portátil con pantalla 7", 64GB almacenamiento y 5000+ juegos.', '["Pantalla 7"","64GB","5000+ juegos"]', '["descuento"]'),
(10, 'Carga Inalámbrica Rápida 3-en-1', 49.99, 79.99, 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=600', 4.3, 4500, true, 'accesorios', 'Carga 3 dispositivos simultáneamente: teléfono, reloj y audífonos.', '["Carga 3 dispositivos","Carga rápida 15W","Compatible Qi"]', '["bestseller"]'),
(11, 'Kit Limpieza Electrónica Premium', 29.99, 49.99, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600', 4.2, 1800, true, 'accesorios', 'Kit completo de limpieza para pantallas, teclados y dispositivos electrónicos.', '["18 piezas","Seguro para pantallas","Bolso incluido"]', '["descuento"]'),
(12, 'Hub USB-C 7-en-1 Universal', 39.99, 59.99, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600', 4.5, 2300, true, 'accesorios', 'Hub con HDMI 4K, 3 USB 3.0, SD/microSD, Ethernet y 100W PD.', '["HDMI 4K","USB 3.0","100W PD","Ethernet"]', '["nuevo"]'),
(13, 'Mochila Tech AntiRobo 25L', 79.99, 119.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 4.6, 1200, true, 'accesorios', 'Mochila impermeable con puerto USB, compartimento para laptop 15.6" y antifrobo.', '["Impermeable","Puerto USB","Antifrobo"]', '["bestseller"]'),
(14, 'Soporte Celular Coche Magnetic', 19.99, 34.99, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600', 4.4, 5600, true, 'accesorios', 'Soporte magnético para coche con rotación 360° y sujeción fuerte.', '["Magnético","360° rotación","Fuerte sujeción"]', '["descuento"]'),
(15, 'Cámara Seguridad WiFi Interior', 89.99, 149.99, 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=600', 4.5, 890, true, 'hogar', 'Cámara de seguridad para interior con visión nocturna, audio bidireccional y app.', '["Visión nocturna","Audio bidireccional","App iOS/Android"]', '["nuevo"]'),
(16, 'Bombilla LED WiFi RGB pack x6', 34.99, 59.99, 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600', 4.3, 3200, true, 'hogar', 'Pack 6 bombillas LED WiFi multicolor controlables por app y voz.', '["WiFi integrado","RGB 16M colores","Control voz"]', '["bestseller"]'),
(17, 'Aspiradora Robot Inteligente', 299.99, 449.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 4.7, 1100, true, 'hogar', 'Aspiradora robot con mapeo láser, succión 3000Pa y autovaciado.', '["Mapeo láser","3000Pa succión","Autovaciado"]', '["nuevo"]'),
(18, 'Enchufe Inteligente WiFi pack x4', 29.99, 49.99, 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600', 4.4, 4100, true, 'hogar', 'Pack 4 enchufes inteligentes WiFi con control por app y programación.', '["WiFi","Control app","Programación"]', '["descuento"]'),
(19, 'Termostato Inteligente WiFi', 79.99, 129.99, 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600', 4.5, 670, true, 'hogar', 'Termostato inteligente con WiFi, control app y ahorro energético.', '["WiFi","Ahorro energético","Control app"]', '["nuevo"]'),
(20, 'Filtro Agua Carbono Activado Premium', 49.99, 79.99, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600', 4.6, 890, true, 'hogar', 'Sistema filtración agua carbono activado elimina 99% impurezas.', '["99% filtración","Carbono activado","6 meses duración"]', '["bestseller"]'),
(21, 'Juguete RC Coche Drift 1:18', 69.99, 109.99, 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600', 4.3, 2300, true, 'juguetes', 'Coche RC escala 1:18 con drift, velocidad 40km/h y batería 20 min.', '["Drift 1:18","40km/h","20 min batería"]', '["descuento"]'),
(22, 'Dron Juguete Indoor 3 Funciones', 29.99, 49.99, 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600', 4.1, 4500, true, 'juguetes', 'Dron para interior con 3 velocidades, protección rotor y 10 min vuelo.', '["3 velocidades","Protección rotor","10 min"]', '["descuento"]'),
(23, 'Patinete Eléctrico Adulto 350W', 399.99, 599.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 4.6, 560, true, 'deportes', 'Patinete eléctrico 350W, velocidad 25km/h, autonomía 30km y freno disco.', '["350W motor","30km autonomía","Freno disco"]', '["nuevo"]'),
(24, 'Bicicleta Estática Magnética Pro', 449.99, 699.99, 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600', 4.7, 340, true, 'deportes', 'Bicicleta estática con resistencia magnética, pantalla LCD y soporta 150kg.', '["Resistencia magnética","Pantalla LCD","150kg"]', '["nuevo"]'),
(25, 'Mancuernas Ajustables 20kg Par', 149.99, 249.99, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600', 4.8, 890, true, 'deportes', 'Pareja mancuernas ajustables 2.5-20kg cada una con seguro rápido.', '["2.5-20kg","Seguro rápido","Gomas antideslizantes"]', '["bestseller"]'),
(26, 'Esterilla Yoga Premium 6mm', 29.99, 49.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', 4.5, 5600, true, 'deportes', 'Esterilla yoga antideslizante, ecológica y con banda elástica.', '["Antideslizante","Ecológica","Banda elástica"]', '["bestseller"]'),
(27, 'Cuerda Saltar Velocidad Profesional', 19.99, 34.99, 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600', 4.4, 7800, true, 'deportes', 'Cuerda saltar velocidad profesional con contador digital y rodamientos.', '["Contador digital","Rodamientos 360°","Acero"]', '["descuento"]'),
(28, 'Balón Fútbol Profesional Match', 39.99, 59.99, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600', 4.6, 2300, true, 'deportes', 'Balón fútbol aprobación FIFA con tecnología y país Ecuador.', '["FIFA approved","País Ecuador"]', '["nuevo"]'),
(29, 'Set Paletas Pádel Carbono 2u', 79.99, 129.99, 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600', 4.5, 670, true, 'deportes', 'Set 2 paletas pádel carbono con funda y overgrip.', '["Carbono","Funda","Overgrip"]', '["nuevo"]'),
(30, 'Reloj Arena Decorativo Premium', 24.99, 39.99, 'https://images.unsplash.com/photo-1531971589569-0d9370cbe365?w=600', 4.3, 8900, true, 'hogar', 'Reloj arena decorativo 30/60 min para oficina y meditación.', '["30/60 min","Decorativo","Cristal"]', '["bestseller"]'),
(31, 'Diffuser Aromas Ultrasónico 400ml', 34.99, 54.99, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600', 4.4, 3400, true, 'hogar', 'Diffuser aromas ultrasónico 400ml con LED y temporizador.', '["400ml","LED 7 colores","Temporizador"]', '["bestseller"]'),
(32, 'Batas Soft Premium Algodón', 39.99, 59.99, 'https://images.unsplash.com/photo-1583847661867-1e5c3d47de67?w=600', 4.5, 1200, true, 'moda', 'Bata suave premium 100% algodón con capucha y bolsillo.', '["100% algodón","Con capucha","Bolsillo"]', '["nuevo"]'),
(33, 'Zapatillas Running Ultralight', 79.99, 119.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 4.7, 2300, true, 'moda', 'Zapatillas running ultralight con tecnología amortiguación.', '["Ultralight","Amortiguación","Transpirable"]', '["bestseller"]'),
(34, 'Gafas Sol Polarizadas Aviator', 49.99, 79.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', 4.5, 4100, true, 'moda', 'Gafas sol polarizadas UV400 estilo aviator con estuche.', '["Polarizadas","UV400","Estuche"]', '["descuento"]'),
(35, 'Mochila Urbana Impermeable 30L', 49.99, 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 4.4, 2300, true, 'moda', 'Mochila urbana impermeable 30L con puerto USB y antifrobo.', '["Impermeable","30L","Puerto USB"]', '["descuento"]'),
(36, 'Bolso Viaje Organizador 40cm', 29.99, 49.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 4.3, 5600, true, 'moda', 'Bolso viaje organizador 40cm con múltiples bolsillos y resistente.', '["40cm","Múltiples bolsillos","Resistente"]', '["bestseller"]')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  old_price = EXCLUDED.old_price,
  image = EXCLUDED.image,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  stock = EXCLUDED.stock,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tags = EXCLUDED.tags;

-- Verify
SELECT COUNT(*) as total_products FROM products;
