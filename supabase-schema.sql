-- Database Schema for DropShop Ecuador
-- Run this in Supabase SQL Editor

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  image TEXT,
  category VARCHAR(50),
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  stock BOOLEAN DEFAULT true,
  description TEXT,
  features TEXT[],
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  provincia VARCHAR(100),
  pais VARCHAR(50) DEFAULT 'Ecuador',
  metodo_pago VARCHAR(50),
  subtotal DECIMAL(10,2) NOT NULL,
  envio DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Allow inserting orders
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow inserting order items
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Insert sample products ONE BY ONE
INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Auriculares Bluetooth Premium Noise Cancelling', 249.99, 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'electronica', 4.8, 2847, true, 'Auriculares con cancelación activa de ruido.', ARRAY['Cancelación activa de ruido', 'Batería 30 horas'], ARRAY['bestseller']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Smartwatch Fitness Pro Series 8', 189.99, 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 'electronica', 4.7, 1523, true, 'Reloj inteligente con monitor de frecuencia cardíaca.', ARRAY['GPS', 'Resistencia agua'], ARRAY['nuevo']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Cámara Acción 4K Waterproof Ultra', 329.99, 499.99, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600', 'electronica', 4.9, 892, true, 'Cámara 4K a 60fps.', ARRAY['4K 60fps', 'Estabilización'], ARRAY['descuento']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Altavoz Bluetooth Portátil Boom 360', 79.99, 129.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 'electronica', 4.5, 2341, true, 'Altavoz potente con sonido 360°.', ARRAY['Sonido 360°', 'IPX7'], ARRAY[]::text[]);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Laptop Stand Ergonómico Premium', 59.99, 89.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 'accesorios', 4.6, 567, true, 'Soporte de aluminio regulable.', ARRAY['Aluminio', 'Regulable'], ARRAY['nuevo']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Mouse Gamer RGB Wireless Pro', 45.99, 79.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 'accesorios', 4.4, 1892, true, 'Mouse gamer 16000 DPI.', ARRAY['16000 DPI', 'RGB'], ARRAY['bestseller']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Teclado Mecánico RGB Gaming', 119.99, 179.99, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600', 'accesorios', 4.8, 756, true, 'Teclado mecánico con RGB.', ARRAY['Switches', 'RGB Chroma'], ARRAY[]::text[]);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Webcam HD 1080p Streamer Pro', 69.99, 99.99, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600', 'electronica', 4.3, 1234, true, 'Webcam Full HD.', ARRAY['Full HD', 'Autofocus'], ARRAY['descuento']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Power Bank 20000mAh Carga Rápida', 39.99, 59.99, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600', 'accesorios', 4.6, 3421, true, 'Batería 20000mAh.', ARRAY['20000mAh', 'Carga rápida'], ARRAY['bestseller']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Hub USB-C 7 en 1 Universal', 49.99, 79.99, 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=600', 'accesorios', 4.5, 891, true, 'Hub multipuerto.', ARRAY['HDMI 4K', 'USB 3.0'], ARRAY['nuevo']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Luz Anillo LED 12" with Stand', 34.99, 54.99, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600', 'hogar', 4.7, 2156, true, 'Luz ring light profesional.', ARRAY['12 pulgadas', 'Control remoto'], ARRAY[]::text[]);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Trípode Profesional para Cámara', 29.99, 49.99, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600', 'accesorios', 4.4, 678, true, 'Trípode profesional.', ARRAY['Aluminio', 'Cabeza panorámica'], ARRAY['descuento']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Mancuernas Ajustables 20kg Set', 159.99, 229.99, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', 'fitness', 4.8, 1245, true, 'Set mancuernas ajustables.', ARRAY['2.5-20kg', 'Cambio rápido'], ARRAY['bestseller']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Esterilla Yoga Premium 6mm', 24.99, 39.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', 'fitness', 4.6, 1876, true, 'Esterilla de yoga.', ARRAY['6mm', 'Antideslizante'], ARRAY[]::text[]);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Banda Elástica Set Resistencia', 19.99, 34.99, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600', 'fitness', 4.5, 2341, true, 'Set bandas elásticas.', ARRAY['5 niveles', 'Garantía'], ARRAY['nuevo']);

INSERT INTO products (name, price, old_price, image, category, rating, reviews, stock, description, features, tags) VALUES
('Báscula Digital Inteligente', 29.99, 49.99, 'https://images.unsplash.com/photo-1558771370-e2d0bfc0c6e9?w=600', 'hogar', 4.4, 987, true, 'Báscula con Bluetooth.', ARRAY['Bluetooth', 'App'], ARRAY['descuento']);

SELECT COUNT(*) as products_created FROM products;
