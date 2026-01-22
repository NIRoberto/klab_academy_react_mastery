

import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';

interface ConfirmOrderProps {
  isVisible: boolean;
  onClose: () => void;
}

const ConfirmOrder = ({ isVisible, onClose }: ConfirmOrderProps) => {
  const { items, total, clearCart } = useCart();

  const handleStartNewOrder = () => {
    clearCart();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <CheckCircle size={48} className="check-icon" color="#22c55e" />
        
        <h1 className="modal-title">Order Confirmed</h1>
        <p className="modal-subtitle">We hope you enjoy your food!</p>

        <div className="modal-items-container">
          {items.map((item) => (
            <div key={item.id} className="modal-item">
              <div className="modal-item-info">
                <strong className="modal-item-name">{item.name}</strong>
                <div className="modal-item-details">
                  <span className="modal-item-quantity">{item.quantity}x</span>
                  <span className="modal-item-price">@ ${item.price.toFixed(2)}</span>
                </div>
              </div>
              <span className="modal-item-total">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="modal-total">
          <span>Order Total</span>
          <h2 className="modal-total-price">${total.toFixed(2)}</h2>
        </div>

        <button 
          className="confirm-btn start-new-order"
          onClick={handleStartNewOrder}
        >
          Start New Order
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;
