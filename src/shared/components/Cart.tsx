import { useCart } from "../../hooks/useCart";
import { ShoppingCart, X, Leaf } from "lucide-react";

interface CartProps {
  onConfirmOrder: () => void;
}

const Cart = ({ onConfirmOrder }: CartProps) => {
  const { items, total, itemCount, removeItem } = useCart();

  if (itemCount === 0) {
    return (
      <aside className="bg-white p-6 rounded-xl shadow-lg sticky top-20 min-w-80">
        <h2 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
          <ShoppingCart size={20} />
          Your Cart (0)
        </h2>
        <div className="text-center py-8">
          <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-sm">
            Your added items will appear here
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white p-6 rounded-xl shadow-lg sticky top-20 min-w-80">
      <h2 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
        <ShoppingCart size={20} />
        Your Cart ({itemCount})
      </h2>

      <div className="mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
              <div className="flex gap-3 text-sm">
                <span className="text-red-600 font-semibold">{item.quantity}x</span>
                <span className="text-gray-600">
                  @ ${item.price.toFixed(2)}
                </span>
                <span className="text-gray-800 font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="w-6 h-6 border border-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-4">
        <span>Order Total</span>
        <strong className="text-xl font-bold text-gray-900">${total.toFixed(2)}</strong>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-lg mb-6 text-sm">
        <Leaf size={16} className="text-green-500" />
        <span>
          This is a <strong>carbon-neutral</strong> delivery
        </span>
      </div>

      <button 
        className="w-full bg-red-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-red-700 transition-colors"
        onClick={onConfirmOrder}
      >
        Confirm Order
      </button>
    </aside>
  );
};

export default Cart;
