import type { Product } from "../data/products";

const ProductCard = ({ product }: { product: Product }) => {
  const { name, image, price } = product;
  return (
    <div>
      <div className="b" data-name="Vanilla Crème Brûlée" data-price="7.00">
        <img src={image} alt="Creme Brulee" />
        <button className="add-btn">🛒 Add to Cart</button>
        <div className="card-body">
          <span className="category">{name}</span>
          <h3>Vanilla Crème Brûlée</h3>
          <p className="price">{price}0</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
