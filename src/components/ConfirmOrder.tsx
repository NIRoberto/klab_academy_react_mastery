

const ConfirmOrder = ({ handleConfirmModel }: { handleConfirmModel: () => void }) => {
  return (
    <div>
      <div id="order-modal" className="modal-overlay">
        <div className="modal-content">
          <img
            src="path-to-your-check-icon.svg"
            alt="Confirmed"
            className="check-icon"
          />

          <h1>Order Confirmed</h1>
          <p>We hope you enjoy your food!</p>

          <div id="modal-items-container"></div>

          <div className="modal-total">
            <span>Order Total</span>
            <h2 id="modal-total-price">$0.00</h2>
          </div>

          <button id="start-new-order" className="confirm-btn">
            Start New Order
          </button>

          <button
            id="start-new-order"
            className="confirm-btn"
            onClick={() => {
              handleConfirmModel();
            }}
          >
            Close
          </button>
        </div>
      </div>
      ;
    </div>
  );
};

export default ConfirmOrder;
