import { useCart } from '../hooks/useCart';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, items, updateQuantity } = useCart();
  
  const cartItem = items.find(item => item.id === product.id);
  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image.desktop}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        
        <button 
          className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
          onClick={isInCart ? undefined : handleAddToCart}
        >
          {isInCart ? (
            <>
              <span onClick={handleDecrement}>
                <Minus size={16} />
              </span>
              <span>{quantity}</span>
              <span onClick={handleIncrement}>
                <Plus size={16} />
              </span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>
      
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
