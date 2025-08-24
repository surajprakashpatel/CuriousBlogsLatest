import { useState } from 'react';
// 1. Import Next.js components and hooks
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaBullhorn, FaPenAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

// Import the minimal layout for this page
import MinimalLayout from '../layouts/MinimalLayout';


const SignupPage = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({ /* ... */ });
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Replace useNavigate with useRouter
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
      {/* 4. Replace <Helmet> with <Head> and add a 'noindex' tag */}
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
                {/* Role selection cards remain the same */}
              </div>
              <div className="login-link">
                Already have an account? <Link href="/login">Log in</Link> {/* 5. Use <Link> */}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="signup-form">
              {/* The entire form structure remains the same */}
              <div className="login-link">
                Already have an account? <Link href="/login">Log in</Link> {/* 5. Use <Link> */}
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

// 6. Assign the minimal layout to this page
SignupPage.getLayout = function getLayout(page) {
  return <MinimalLayout>{page}</MinimalLayout>;
};

export default SignupPage;