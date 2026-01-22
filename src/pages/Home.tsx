import { useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import ConfirmOrder from "../components/ConfirmOrder";
import { useCart } from "../context/CartContext";

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
    <div className="home-page">
      <main className="main-content">
        <div className="container">
          <section className="desserts-section">
            <h1 className="section-title">Desserts</h1>
            <div className="desserts-grid">
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
