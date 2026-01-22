import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="container">
        <section className="contact-section">
          <h1 className="page-title">Contact Us</h1>
          
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Have questions about our desserts or need help with your order? 
                We'd love to hear from you!
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <MapPin size={20} />
                  <div>
                    <h3>Address</h3>
                    <p>123 Sweet Street<br />Dessert District, DD 12345</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <Phone size={20} />
                  <div>
                    <h3>Phone</h3>
                    <p>+1 (555) 123-CAKE</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <Mail size={20} />
                  <div>
                    <h3>Email</h3>
                    <p>hello@dessertshop.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <Clock size={20} />
                  <div>
                    <h3>Hours</h3>
                    <p>Mon-Sat: 8AM - 8PM<br />Sunday: 10AM - 6PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              {isSubmitted ? (
                <div className="success-message">
                  <CheckCircle size={48} color="#22c55e" />
                  <h3>Message Sent!</h3>
                  <p>Thank you for contacting us. We'll get back to you soon!</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="form-textarea"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    <Send size={16} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
