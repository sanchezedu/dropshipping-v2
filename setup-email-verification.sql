-- Configurar email en Supabase
-- En Supabase Dashboard: Authentication > Settings > Email

-- URLs configuradas:
-- Site URL: https://dropshipping-v2.vercel.app
-- Redirect URLs: https://dropshipping-v2.vercel.app

-- Para habilitar verificación de email:
-- 1. Ir a Authentication > Providers > Email
-- 2. Enable "Confirm email"
-- 3. Save

-- Verificar que el email esté configurado:
SELECT * FROM auth.config;

-- Verificar tabla de confirmations:
SELECT * FROM auth.confirmations LIMIT 5;
