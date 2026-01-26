import { useState } from "react";
import { products } from "../data/products";
import ProductCard from "../shared/components/ProductCard";
import Cart from "../shared/components/Cart";
import ConfirmOrder from "../shared/components/ConfirmOrder";
import { useCart } from "../hooks/useCart";

const Home = () => {
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const { itemCount } = useCart();

  const handleConfirmOrder = () => {
    if (itemCount > 0) {
      setIsOrderModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsOrderModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex gap-8 flex-wrap">
          <section className="flex-1 min-w-80">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Desserts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <Cart onConfirmOrder={handleConfirmOrder} />
        </div>
      </main>

      <ConfirmOrder
        isVisible={isOrderModalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Home;
