import { useCart } from "../../hooks/useCart";
import { CheckCircle } from "lucide-react";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CheckCircle size={48} className="mx-auto mb-6 text-green-500" />

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Order Confirmed</h1>
        <p className="text-gray-600 mb-6 text-center">We hope you enjoy your food!</p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex-1">
                <strong className="block font-semibold text-gray-900 mb-1">{item.name}</strong>
                <div className="flex gap-3 text-sm text-gray-600">
                  <span className="text-red-600 font-semibold">{item.quantity}x</span>
                  <span>@ ${item.price.toFixed(2)}</span>
                </div>
              </div>
              <span className="font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center py-4 mb-6">
          <span className="text-lg">Order Total</span>
          <h2 className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</h2>
        </div>

        <button
          className="w-full bg-red-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-red-700 transition-colors"
          onClick={handleStartNewOrder}
        >
          Start New Order
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;
