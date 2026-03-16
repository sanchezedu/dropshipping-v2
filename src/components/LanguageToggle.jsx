import { useState } from 'react';

export default function LanguageToggle() {
  const [lang, setLang] = useState('es');

  const toggle = () => {
    const newLang = lang === 'es' ? 'en' : 'es';
    setLang(newLang);
    localStorage.setItem('dropshop-lang', newLang);
    // In a full implementation, this would trigger a translation
    alert(`Idioma cambiado a: ${newLang === 'es' ? 'Español' : 'English'}. (Funcionalidad completacoming soon)`);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 hover:bg-gray-100 rounded-full text-sm font-medium"
      title={lang === 'es' ? 'Cambiar a inglés' : 'Cambiar a español'}
    >
      {lang === 'es' ? '🇪🇨' : '🇺🇸'} {lang.toUpperCase()}
    </button>
  );
}
