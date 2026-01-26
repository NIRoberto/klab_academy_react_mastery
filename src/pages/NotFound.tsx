import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <Search size={80} className="mx-auto text-gray-400" />
        </div>
        
        <h1 className="text-8xl font-extrabold text-red-600 mb-4 leading-none">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            <Home size={20} />
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
        
        <div className="bg-gray-100 p-8 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">You might be looking for:</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-red-600 hover:underline font-medium">Our Dessert Collection</Link></li>
            <li><Link to="/about" className="text-red-600 hover:underline font-medium">About Our Shop</Link></li>
            <li><Link to="/contact" className="text-red-600 hover:underline font-medium">Contact Us</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;