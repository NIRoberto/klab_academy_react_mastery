import { useCart } from "../../hooks/useCart";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import type { Product } from "../../data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, items, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.id === product.id);
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
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={product.image.desktop}
          alt={product.name}
          className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />

        <button
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg ${
            isInCart 
              ? "bg-red-600 text-white flex items-center justify-between min-w-36" 
              : "bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white flex items-center gap-2"
          }`}
          onClick={isInCart ? undefined : handleAddToCart}
        >
          {isInCart ? (
            <>
              <span 
                onClick={handleDecrement}
                className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 cursor-pointer"
              >
                <Minus size={16} />
              </span>
              <span className="font-bold">{quantity}</span>
              <span 
                onClick={handleIncrement}
                className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 cursor-pointer"
              >
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

      <div className="p-5">
        <p className="text-gray-500 text-sm uppercase tracking-wide font-medium mb-2">{product.category}</p>
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h3>
        <p className="text-2xl font-extrabold text-red-600">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
