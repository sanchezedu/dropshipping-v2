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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-4 md:py-8 pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto px-3 md:px-4 text-center">
          <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-indigo-600 mx-auto" />
        </div>
      </div>
    );
  }

  // Show single post view
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-4 md:py-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-3 md:px-4">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-1 md:gap-2 text-indigo-600 hover:underline mb-4 md:mb-6 text-sm md:text-base touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="hidden md:inline">Volver al Blog</span><span className="md:hidden">Volver</span>
          </button>
          
          <article className="bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title}
              className="w-full h-40 md:h-64 lg:h-96 object-cover"
            />
            <div className="p-4 md:p-8">
              <span className="text-xs md:text-sm text-indigo-600 font-medium">{selectedPost.category}</span>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold mt-1 md:mt-2 mb-2 md:mb-4 dark:text-white">{selectedPost.title}</h1>
              
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-slate-400 mb-4 md:mb-6">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 md:w-4 md:h-4" />
                  {selectedPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  {selectedPost.published_at ? new Date(selectedPost.published_at).toLocaleDateString('es-EC') : 'Reciente'}
                </span>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-sm md:text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
                  {selectedPost.excerpt}
                </p>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
                  {selectedPost.content || 'Contenido completo del artículo. Este es un artículo de nuestro blog con consejos, tendencias y guías para tu negocio de dropshipping en Ecuador.'}
                </p>
              </div>

              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
                <button 
                  onClick={() => onNavigate && onNavigate('shop')}
                  className="bg-indigo-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-bold hover:bg-indigo-700 w-full md:w-auto touch-manipulation"
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-4 md:py-8 pb-24 md:pb-8">
      {/* Mobile Back */}
      <div className="md:hidden max-w-6xl mx-auto px-3 mb-4">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-1 text-sm text-indigo-600">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-3 md:px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 dark:text-white">Blog DropShop</h1>
          <p className="text-sm md:text-lg text-gray-600 dark:text-slate-400">Consejos, tendencias y guías</p>
        </div>

        {/* Search & Categories */}
        <div className="mb-4 md:mb-8">
          <div className="relative max-w-md mx-auto mb-4 md:mb-6">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm md:text-base"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-1 md:gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium transition-colors text-xs md:text-sm ${
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

        {/* Featured Post - Hide on mobile when not "Todos" */}
        {selectedCategory === "Todos" && searchQuery === "" && posts.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-6 md:mb-12 cursor-pointer" onClick={() => setSelectedPost(posts[0])}>
            <div className="grid md:grid-cols-2">
              <img 
                src={posts[0].image} 
                alt={posts[0].title}
                className="w-full h-40 md:h-64 lg:h-full object-cover"
              />
              <div className="p-4 md:p-8 flex flex-col justify-center">
                <span className="text-xs md:text-sm text-indigo-600 font-medium mb-1 md:mb-2">{posts[0].category}</span>
                <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 dark:text-white">{posts[0].title}</h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-slate-400 mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">{posts[0].excerpt}</p>
                <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 md:w-4 md:h-4" />
                    {posts[0].author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    5 min
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(filteredPosts.length > 0 ? filteredPosts.slice(selectedCategory === "Todos" && searchQuery === "" ? 1 : 0) : [
            { id: 1, title: 'Cómo iniciar tu negocio de dropshipping', excerpt: 'Guía completa para comenzar en el mundo del dropshipping en Ecuador.', category: 'Guía', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600', author: 'DropShop', published_at: '2026-03-01' },
            { id: 2, title: 'Tendencias de ecommerce 2026', excerpt: 'Las tendencias que están revolucionando el comercio electrónico.', category: 'Tendencias', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', author: 'DropShop', published_at: '2026-02-28' },
            { id: 3, title: 'Marketing digital para tiendas online', excerpt: 'Estrategias de marketing que funcionan para dropshipping.', category: 'Marketing', image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600', author: 'DropShop', published_at: '2026-02-25' },
          ]).map((post, idx) => (
            <div 
              key={post.id || idx}
              className="bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPost(post)}
            >
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-32 md:h-48 object-cover"
              />
              <div className="p-3 md:p-4">
                <span className="text-[10px] md:text-xs text-indigo-600 font-medium">{post.category}</span>
                <h3 className="font-bold text-sm md:text-base mt-1 md:mb-2 dark:text-white line-clamp-2">{post.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-2 md:mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] md:text-xs text-gray-500">{post.author}</span>
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
