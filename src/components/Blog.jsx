import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Search, Loader2, ArrowLeft, User, Clock } from 'lucide-react';
import { fetchBlogPosts } from '../lib/supabase';

export default function Blog({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  async function loadBlogPosts() {
    setLoading(true);
    try {
      const data = await fetchBlogPosts();
      if (data && data.length > 0) {
        setPosts(data);
      }
    } catch (e) {
      console.log('Error loading blog posts');
    }
    setLoading(false);
  }

  const categories = ["Todos", "Consejos", "Tendencias", "Marketing", "Guía"];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
        </div>
      </div>
    );
  }

  // Show single post view
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-indigo-600 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Blog
          </button>
          
          <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="p-8">
              <span className="text-indigo-600 font-medium">{selectedPost.category}</span>
              <h1 className="text-3xl font-bold mt-2 mb-4 dark:text-white">{selectedPost.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 mb-6">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedPost.published_at ? new Date(selectedPost.published_at).toLocaleDateString('es-EC') : 'Reciente'}
                </span>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
                  {selectedPost.excerpt}
                </p>
                <p className="mt-4 text-gray-600 dark:text-slate-300 leading-relaxed">
                  {selectedPost.content || 'Contenido completo del artículo. Este es un artículo de nuestro blog con consejos, tendencias y guías para tu negocio de dropshipping en Ecuador. Mantente informado con las últimas noticias y estrategias de comercio electrónico.'}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t">
                <button 
                  onClick={() => onNavigate && onNavigate('shop')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700"
                >
                  Ver Productos
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Show blog list
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Blog DropShop</h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg">Consejos, tendencias y guías para tu negocio</p>
        </div>

        {/* Search & Categories */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {selectedCategory === "Todos" && searchQuery === "" && posts.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-12 cursor-pointer" onClick={() => setSelectedPost(posts[0])}>
            <div className="grid md:grid-cols-2">
              <img 
                src={posts[0].image} 
                alt={posts[0].title}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="p-8 flex flex-col justify-center">
                <span className="text-indigo-600 font-medium mb-2">{posts[0].category}</span>
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{posts[0].title}</h2>
                <p className="text-gray-600 dark:text-slate-400 mb-4">{posts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(posts[0].published_at).toLocaleDateString('es-EC')}
                  </span>
                  <span>Por {posts[0].author}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <article 
              key={post.id} 
              className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-2">
                  <span className="text-indigo-600 font-medium">{post.category}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-white line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-slate-500">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('es-EC') : 'Reciente'}
                  </span>
                  <button className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:underline">
                    Leer más <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-slate-400">No se encontraron artículos</p>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 bg-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Suscríbete a nuestro newsletter</h2>
          <p className="mb-4 opacity-90">Recibe consejos y ofertas exclusivas en tu correo</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="Tu email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100">
              Suscribir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
