// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign up with email and password
  const signup = async (email, password, displayName = '') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }

      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .catch(err => {
        setError(err.message);
        throw err;
      });
  };

  // Logout
  const logout = () => {
    return signOut(auth)
      .catch(err => {
        setError(err.message);
        throw err;
      });
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
      .catch(err => {
        setError(err.message);
        throw err;
      });
  };

  // Update email
  const updateUserEmail = (email) => {
    return updateEmail(currentUser, email)
      .catch(err => {
        setError(err.message);
        throw err;
      });
  };

  // Update password
  const updateUserPassword = (password) => {
    return updatePassword(currentUser, password)
      .catch(err => {
        setError(err.message);
        throw err;
      });
  };

  // Update profile (display name, photo URL)
  const updateUserProfile = (profileData) => {
    return updateProfile(currentUser, profileData)
      .catch(err => {
        setError(err.message);
        throw err;
      });
  };

  // Social media login providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const twitterProvider = new TwitterAuthProvider();

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider)
      .catch(err => {
        setError(err.message);
        throw err;
      });
  };

  const signInWithFacebook = () => {
    return signInWithPopup(auth, facebookProvider)
      .catch(err => {
        setError(err.message);
        throw err;
      });
  };

  const signInWithTwitter = () => {
    return signInWithPopup(auth, twitterProvider)
      .catch(err => {
        setError(err.message);
        throw err;
      });
  };

  // Subscribe to user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    updateUserProfile,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}