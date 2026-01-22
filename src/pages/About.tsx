const About = () => {
  return (
    <div className="page-container">
      <div className="container">
        <section className="about-section">
          <h1 className="page-title">About Our Dessert Shop</h1>
          
          <div className="about-content">
            <div className="about-text">
              <p className="lead">
                Welcome to our artisanal dessert shop, where every sweet creation 
                is crafted with passion and the finest ingredients.
              </p>
              
              <p>
                Since our founding, we've been dedicated to bringing you the most 
                exquisite desserts from around the world. From classic French 
                crème brûlée to innovative fusion treats, each item in our 
                collection tells a story of culinary excellence.
              </p>
              
              <p>
                Our commitment to quality means we source only the best ingredients, 
                work with skilled artisans, and maintain the highest standards in 
                every aspect of our operation.
              </p>
            </div>
            
            <div className="about-features">
              <div className="feature">
                <h3>🌱 Sustainable Sourcing</h3>
                <p>We partner with local suppliers and use eco-friendly packaging.</p>
              </div>
              
              <div className="feature">
                <h3>👨‍🍳 Expert Craftsmanship</h3>
                <p>Our desserts are made by skilled pastry chefs with years of experience.</p>
              </div>
              
              <div className="feature">
                <h3>🚚 Fresh Delivery</h3>
                <p>Carbon-neutral delivery ensures your desserts arrive fresh and delicious.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;