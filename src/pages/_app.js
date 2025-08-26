

import { AuthProvider } from '../context/AuthContext';
import { ModalProvider } from '../context/ModalContext'; 
import SubscribeModal from '../components/SubscribeModal'; 

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
import '../styles/AuthorDashboard.css';
import '../styles/Admin.css';
import '../styles/SubscribeModal.css';
function MyApp({ Component, pageProps }) {

  return (

    <AuthProvider>
      
      <main>
      <ModalProvider> 
      <Navbar />

       <Component {...pageProps} />
        <SubscribeModal /> 
        <Footer />
      </ModalProvider>
      </main>
     
    </AuthProvider>
  );
}

export default MyApp;