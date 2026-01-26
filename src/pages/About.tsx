const About = () => {
  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <section>
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Our Dessert Shop</h1>
          
          <div className="space-y-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl font-medium text-red-600 mb-6">
                Welcome to our artisanal dessert shop, where every sweet creation 
                is crafted with passion and the finest ingredients.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Since our founding, we've been dedicated to bringing you the most 
                exquisite desserts from around the world. From classic French 
                crème brûlée to innovative fusion treats, each item in our 
                collection tells a story of culinary excellence.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Our commitment to quality means we source only the best ingredients, 
                work with skilled artisans, and maintain the highest standards in 
                every aspect of our operation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🌱 Sustainable Sourcing</h3>
                <p className="text-gray-600">We partner with local suppliers and use eco-friendly packaging.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">👨🍳 Expert Craftsmanship</h3>
                <p className="text-gray-600">Our desserts are made by skilled pastry chefs with years of experience.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🚚 Fresh Delivery</h3>
                <p className="text-gray-600">Carbon-neutral delivery ensures your desserts arrive fresh and delicious.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;