-- Tabla de blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  category TEXT,
  author TEXT DEFAULT 'DropShop',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "blog_posts_read" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_insert" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_update" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_delete" ON blog_posts;

CREATE POLICY "blog_posts_read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "blog_posts_insert" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "blog_posts_update" ON blog_posts FOR UPDATE USING (true);
CREATE POLICY "blog_posts_delete" ON blog_posts FOR DELETE USING (true);

-- Insertar posts de ejemplo
INSERT INTO blog_posts (title, slug, excerpt, content, image, category, author) VALUES
('Guía completa: Cómo elegir el mejor producto para dropshipping', 'guia-elegir-producto-dropshipping', 'Aprende a seleccionar productos winners para tu tienda de dropshipping en Ecuador.', 'Contenido del artículo sobre cómo elegir productos winners...', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600', 'Consejos', 'DropShop'),
('Top 10 productos más vendidos en Ecuador 2026', 'top-10-productos-ecuador-2026', 'Descubre cuáles son los productos que están revolucionando el comercio electrónico en Ecuador.', 'Contenido sobre los productos más vendidos...', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600', 'Tendencias', 'DropShop'),
('Cómo aumentar tus ventas con Instagram Shopping', 'aumentar-ventas-instagram-shopping', 'Instagram se ha convertido en una herramienta poderosa para vender.', 'Estrategias para vender en Instagram...', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600', 'Marketing', 'DropShop'),
('Envíos en Ecuador: Todo lo que necesitas saber', 'envios-ecuador-guia-completa', 'Guía completa sobre métodos de envío, costos y tiempos de entrega en Ecuador.', 'Información sobre envíos en Ecuador...', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600', 'Guía', 'DropShop'),
('5 errores comunes en tiendas online y cómo evitarlos', 'errores-tiendas-online', 'Aprende de los errores de otros entrepreneurs y mejora tu tienda.', 'Errores comunes y cómo evitarlos...', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', 'Consejos', 'DropShop'),
('Cómo crear contenido que vende en redes sociales', 'contenido-vende-redes-sociales', 'El contenido es rey en redes sociales.', 'Cómo crear contenido que convierte...', 'https://images.unsplash.com/photo-1432888622747-4eb9a8f5a70d?w=600', 'Marketing', 'DropShop');

SELECT COUNT(*) as total_posts FROM blog_posts;
