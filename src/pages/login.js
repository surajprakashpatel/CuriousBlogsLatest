import { useState } from 'react';
// 1. Import Next.js hooks and components
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; 
import { FaUser, FaLock, FaGoogle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login, signInWithGoogle } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      router.push('/author-dashboard'); 
    } catch (error) {
      toast.error(error.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'Google') {
        await signInWithGoogle();
        toast.success('Google login successful!');
        router.push('/author-dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Social login failed.');
    }
  };

  return (
    <>
      
      <Head>
        <title>Login | Curious Blogs</title>
        <meta name="description" content="Login to your Curious Blogs account to manage your content and profile."/>
        <meta name="keywords" content='login, sign in, curious blogs account' />
      </Head>
      
      
      <div className="login-page">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="login-container">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
              </div>
              <div className="forgot-password">
              
                <Link href="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="divider"><span>or continue with</span></div>

            <div className="social-login">
              <button type="button" className="social-btn google" onClick={() => handleSocialLogin('Google')}>
                <FaGoogle className="social-icon" /> Google
              </button>
            </div>

            <div className="signup-link">
              Don't have an account? <Link href="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;