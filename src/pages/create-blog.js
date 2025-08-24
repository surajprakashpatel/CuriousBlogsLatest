import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'; // Import for route protection


import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext'; // Import useAuth for protection

function CreateBlogPage() {
  const [formData, setFormData] = useState({ /* ... */ });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const steps = ['Basic Info', 'Content', 'SEO & Settings', 'Review'];

  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is still loading, do nothing.
    if (loading) return;
    // If auth has loaded and there's no user, redirect to login.
    if (!currentUser) {
      router.push('/login');
    }
    // You could also add a check here for a specific admin role if needed.
  }, [currentUser, loading, router]);


  // --- All your data fetching and handler functions remain the same ---
  useEffect(() => {
    const fetchCategories = async () => { /* ... your code ... */ };
    fetchCategories();
  }, []);

  useEffect(() => { /* ... your subcategory logic ... */ }, [formData.category, categories]);

  const handleChange = (e) => { /* ... your code ... */ };
  const handleFileChange = (e) => { /* ... your code ... */ };
  const handleTagInput = (e) => { /* ... your code ... */ };
  const handleKeywordInput = (e) => { /* ... your code ... */ };
  const removeTag = (index) => { /* ... your code ... */ };
  const removeKeyword = (index) => { /* ... your code ... */ };
  const uploadImage = async (file) => { /* ... your code ... */ };
  const handlePublish = async (publishType) => { /* ... your code ... */ };
  const resetForm = () => { /* ... your code ... */ };
  
  // --- Conditional Render for Protection ---
  // While loading or if there's no user, render a loading state or null
  // to prevent the form from flashing on screen before the redirect happens.
  if (loading || !currentUser) {
    return (
      <div>
        <Head>
          <title>Loading...</title>
        </Head>
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  // If we reach here, the user is authenticated and we can render the form.
  return (
    <div className="dashboard-container">
      {/* 1. Replaced <Helmet> with <Head> */}
      <Head>
        <title>Create New Blog Post | Curious Blogs</title>
        <meta name="robots" content="noindex, nofollow" /> {/* Tell search engines not to index this admin page */}
      </Head>

      {/* 2. <Navbar/> is removed. It is now handled by _app.js */}

      <div className="main-container">
        {/* --- All of your existing form and stepper JSX remains unchanged --- */}
        <div className="header-section">
          <h1>New Post</h1>
          <div className="stepper">{/* ... */}</div>
        </div>

        <div className="content-container">
          <div className="form-container">
            {currentStep === 1 && (
              <div className="form-section">{/* ... */}</div>
            )}
            {currentStep === 2 && (
              <div className="form-section">{/* ... */}</div>
            )}
            {currentStep === 3 && (
              <div className="form-section">{/* ... */}</div>
            )}
            {currentStep === 4 && (
              <div className="review-section">{/* ... */}</div>
            )}
            <div className="navigation-buttons">{/* ... */}</div>
          </div>

          <div className="preview-section">{/* ... */}</div>
        </div>
      </div>
    </div>
  );
}

export default CreateBlogPage;