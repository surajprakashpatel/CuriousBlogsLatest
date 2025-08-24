import { useState } from 'react';
// 1. Import Next.js components and hooks
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaBullhorn, FaPenAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';


const SignupPage = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({ /* ... */ });
  const [isLoading, setIsLoading] = useState(false);
  

  const router = useRouter();

  const handleRoleSelection = (role) => {
    if (role === 'author') {
      // 3. Use router.push() for programmatic navigation
      router.push('/authorOnboarding');
      return;
    }
    setUserType(role);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Replace with your actual Firebase signup logic from AuthContext
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      toast.success('Promoter account created successfully!');
      router.push('/promoter-dashboard');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | Curious Blogs</title>
        <meta name="description" content="Join Curious Blogs as an author or promoter. Sign up to start creating content or helping it reach a wider audience."/>
        <meta name="robots" content="noindex, follow" />
      </Head>
      
      <div className="signup-page">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="signup-container">
          {!userType ? (
            <div className="role-selection">
              <div className="signup-header">
                <h2>Join as a...</h2>
                <p>Select your role to get started</p>
              </div>
             <div className="role-options">
              <div 
                className="role-card"
                onClick={() => handleRoleSelection('author')}
              >
                <div className="role-icon">
                  <FaPenAlt />
                </div>
                <h3>Author</h3>
                <p>Create and publish your own content</p>
                <div className="select-role">
                  Select <FaArrowRight />
                </div>
              </div>

              <div 
                className="role-card"
                onClick={() => handleRoleSelection('promoter')}
              >
                <div className="role-icon">
                  <FaBullhorn />
                </div>
                <h3>Promoter</h3>
                <p>Help spread great content and earn rewards</p>
                <div className="select-role">
                  Select <FaArrowRight />
                </div>
              </div>
            </div>
              <div className="login-link">
                Already have an account? <Link href="/login">Log in</Link> 
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-header">
              <h2>Create Your Promoter Account</h2>
              <p>Complete your details to get started</p>
              <button 
                type="button" 
                className="back-btn"
                onClick={() => setUserType('')}
              >
                ← Change role
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength="6"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  minLength="6"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="referralCode">Referral Code (Optional)</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="referralCode"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="Enter referral code if you have one"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="signup-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up as Promoter'}
            </button>

            <div className="login-link">
              Already have an account? <Link href="/login">Log in</Link>
            </div>
          </form>
          )}
        </div>
      </div>
    </>
  );
};


export default SignupPage;