-- Plantilla de email personalizada para Supabase
-- En Supabase Dashboard: Authentication > Settings > Emails > Templates

-- Reemplaza el template de "Confirm signup" con:

---
SUBJECT: Confirma tu cuenta - DropShop Ecuador

HTML:
---
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px; text-align: center; }
    .logo { color: white; font-size: 28px; font-weight: bold; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; }
    .footer { background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🛒 DropShop Ecuador</div>
    </div>
    <div class="content">
      <h2 style="color: #1f2937; margin-top: 0;">¡Bienvenido a DropShop! 🇪🇨</h2>
      <p style="color: #4b5563; line-height: 1.6;">
        Gracias por registrarte en DropShop Ecuador. Para completar tu registro, por favor confirma tu dirección de email.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirmar mi cuenta</a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
        <span style="color: #4f46e5;">{{ .ConfirmationURL }}</span>
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
        Este enlace expira en 24 horas. Si no creaste una cuenta en DropShop, puedes ignorar este email.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 DropShop Ecuador - Tu tienda de confianza</p>
      <p>Guayaquil, Ecuador</p>
    </div>
  </div>
</body>
</html>
---

-- Para cambiar esto:
-- 1. Ve a Supabase Dashboard > Authentication > Settings > Emails > Templates
-- 2. Edita "Confirm signup" con el HTML de arriba
