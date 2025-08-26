import { useState } from 'react';
import { useModal } from '../context/ModalContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';




const SubscribeModal = () => {
  const { isSubscribeModalOpen, closeSubscribeModal } = useModal();
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openSubscribeModal } = useModal();

  if (!isSubscribeModalOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Email address is required.');
      return;
    }
    setIsSubmitting(true);

    try {
      // Add a new document to the "subscribers" collection in Firestore
      await addDoc(collection(db, 'subscribers'), {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        subscribedAt: serverTimestamp(),
      });

      toast.success('Thank you for subscribing!');
      setFormData({ name: '', email: '', whatsapp: '' }); // Reset form
      closeSubscribeModal(); // Close the modal
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeSubscribeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeSubscribeModal}>&times;</button>
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get the latest articles, insights, and updates delivered straight to your inbox.</p>
        
        <form onSubmit={handleSubmit} className="subscribe-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp (Optional)</label>
            <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="+1234567890" />
          </div>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribeModal;