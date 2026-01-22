import React, { useState } from "react";
import { products, type Product } from "../data/products";
import ProductCard from "../components/ProductCard";
import ConfirmOrder from "../components/ConfirmOrder";

const Home = () => {
  const [productsData, setProductData] = useState<Product[]>(products);

  console.log(productsData);

  const [isConfirmedVisible, setIsCOnfirmedVisible] = useState<boolean>(false);

  const handleConfirmModel = (): void => {
    setIsCOnfirmedVisible(!isConfirmedVisible);
    setProductData([]);
  };

  return (
    <div>
      <main className="page">
        <div className="container">
          <section className="desserts-section">
            <h1>Desserts</h1>
            <div className="desserts-grid">
              {products.map((product: Product) => {
                return <ProductCard key={product.id} product={product} />;
              })}
            </div>
          </section>
          <aside className="cart-section">
            <h2>
              Your Cart (<span id="cart-count">0</span>)
            </h2>
            <div id="cart-items-container">
              <p className="empty-msg">Your added items will appear here</p>
            </div>

            <div className="cart-total">
              <span>Order Total</span>
              <strong id="total-price">$0.00</strong>
            </div>
            <button className="confirm-btn" onClick={handleConfirmModel}>
              Confirm Order
            </button>
          </aside>
        </div>
      </main>

      {isConfirmedVisible ? (
        <ConfirmOrder handleConfirmModel={handleConfirmModel} />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Home;
