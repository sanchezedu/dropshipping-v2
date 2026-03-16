import { useState } from 'react';
import { Star } from 'lucide-react';

export default function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Juan P.', rating: 5, comment: 'Excelente producto, muy recomendado!', date: '2026-03-10' },
    { id: 2, user: 'Maria G.', rating: 4, comment: 'Buena calidad, llegó rápido.', date: '2026-03-08' },
    { id: 3, user: 'Carlos R.', rating: 5, comment: 'Exactamente como en las fotos. Muy satisfecho.', date: '2026-03-05' },
  ]);
  
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showForm, setShowForm] = useState(false);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;
    
    const review = {
      id: Date.now(),
      user: 'Tú',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowForm(false);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Reseñas del Producto</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-gray-600">{avgRating} ({reviews.length} reseñas)</span>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
        >
          Escribir reseña
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="font-medium mb-3">Tu reseña</h4>
          
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Calificación</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({...newReview, rating: star})}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} hover:fill-yellow-400`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Tu opinión</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder="¿Qué te gustó o no te gustó?"
              required
            />
          </div>
          
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
              Publicar
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium text-sm">{review.user.charAt(0)}</span>
                </div>
                <span className="font-medium">{review.user}</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-2">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
