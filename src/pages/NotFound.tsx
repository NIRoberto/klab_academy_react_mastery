import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <Search size={80} />
        </div>
        
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            <Home size={20} />
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
        
        <div className="not-found-suggestions">
          <h3>You might be looking for:</h3>
          <ul>
            <li><Link to="/">Our Dessert Collection</Link></li>
            <li><Link to="/about">About Our Shop</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;