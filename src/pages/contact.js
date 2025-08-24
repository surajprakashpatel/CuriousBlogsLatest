// 1. Import useState for form state and Head for SEO
import { useState } from 'react';
import Head from 'next/head';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; 

const ContactPage = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        timestamp: serverTimestamp()
      });
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    
    <>
    
      <Head>
        <title>Contact | Curious Blogs</title>
        <meta name="description" content="Get in touch with Curious Blogs. We'd love to hear from you! Send us your questions, feedback, or just say hello."/>
        <meta name="keywords" content='contact curious blogs,curiousity lab, curiousity lab blogs, feedback, questions, say hello' />
      </Head>

 
      
      <div className="contact-page">
        <div className="contact-container">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-intro">
            We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, 
            please reach out using the form below or connect with us through our social media channels.
          </p>

          <div className="contact-sections">
          
            <div className="form-section">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="form-field">
                    <label htmlFor="name">Your Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Your Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="message">Your Message</label>
                    <textarea id="message" rows="5" name="message" value={formData.message} onChange={handleChange} required ></textarea>
                  </div>
                  <button type="submit" className="submit-button" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                  {submitStatus === 'success' && (
                    <p className="success-message">Thank you! Your message has been sent.</p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="error-message">Something went wrong. Please try again.</p>
                  )}
                </div>
              </form>
            </div>

            <div className="info-section">
              <h2 className="info-title">Contact Information</h2>
              <div className="info-item">
                <h3 className="info-subtitle">Email</h3>
                <p className="info-text">contact@curiousitylab.in</p>
              </div>
              <div className="info-item">
                <h3 className="info-subtitle">Our Office</h3>
                <p className="info-text">Vill- Behrapali, Jamgaon, Raigarh, Chhattisgarh</p>
              </div>
            </div>
          </div>
          <div className="divider-line full-width"></div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;