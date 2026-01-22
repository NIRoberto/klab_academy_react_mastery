import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, X, Leaf } from 'lucide-react';

interface CartProps {
  onConfirmOrder: () => void;
}

const Cart = ({ onConfirmOrder }: CartProps) => {
  const { items, total, itemCount, removeItem } = useCart();

  if (itemCount === 0) {
    return (
      <aside className="cart-section">
        <h2 className="cart-title">
          <ShoppingCart size={20} />
          Your Cart (0)
        </h2>
        <div className="empty-cart">
          <ShoppingCart size={48} className="empty-cart-icon" />
          <p className="empty-cart-message">Your added items will appear here</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="cart-section">
      <h2 className="cart-title">
        <ShoppingCart size={20} />
        Your Cart ({itemCount})
      </h2>
      
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h4 className="cart-item-name">{item.name}</h4>
              <div className="cart-item-details">
                <span className="cart-item-quantity">{item.quantity}x</span>
                <span className="cart-item-price">@ ${item.price.toFixed(2)}</span>
                <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
            
            <button
              className="remove-btn"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Order Total</span>
        <strong className="total-price">${total.toFixed(2)}</strong>
      </div>

      <div className="carbon-neutral">
        <Leaf size={16} />
        <span>This is a <strong>carbon-neutral</strong> delivery</span>
      </div>

      <button className="confirm-btn" onClick={onConfirmOrder}>
        Confirm Order
      </button>
    </aside>
  );
};

export default Cart;