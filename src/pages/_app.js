

import { AuthProvider } from '../context/AuthContext';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import '../styles/Navbar.css';
import '../styles/Footer.css';
import '../styles/Home.css';
import '../styles/About.css';
import '../styles/Contact.css';
import '../styles/BlogView.css';
import '../styles/Login.css';
import '../styles/Categories.css';
import '../styles/CategoryBlogs.css';
import '../styles/CreateBlog.css';
import '../styles/Disclaimer.css';
import '../styles/TermsAndConditions.css';
import '../styles/PrivacyPolicy.css';
import '../styles/Signup.css';

function MyApp({ Component, pageProps }) {

  return (

    <AuthProvider>
      
      <Navbar />
      <main>
       <Component {...pageProps} />
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;