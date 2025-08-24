import { useState } from 'react';
// 1. Import Link from 'next/link' and useRouter from 'next/router'
import Link from 'next/link';
import { useRouter } from 'next/router';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // 3. Replace useNavigate with useRouter
  const router = useRouter();

  const handleSubscribeClick = (e) => {
    e.preventDefault(); // Prevent default link/button behavior
    setIsOpen(false); // Close mobile menu if open

    // 4. Use router.pathname to check the current page
    if (router.pathname === '/') {
      // If on homepage, scroll to the newsletter section
      const newsletterSection = document.getElementById('newsletter-section');
      if (newsletterSection) {
        newsletterSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to homepage first
      // 5. Use router.push for programmatic navigation
      router.push('/');
      
      // The setTimeout logic remains the same to allow the page to transition
      setTimeout(() => {
        const newsletterSection = document.getElementById('newsletter-section');
        if (newsletterSection) {
          newsletterSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // A small delay is often still needed
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-left">
          {/* 6. Replaced <Link to="..."> with <Link href="..."> */}
          <Link href="/" className="logo-link">
            <div className="logo-icon">C</div>
            <span className="logo-text">Curious Blogs</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className={`navbar-center ${isOpen ? 'open' : ''}`}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/categories" className="nav-link">Categories</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* User Actions */}
        <div className="navbar-right">
          {/* 7. Changed the subscribe action to a <button> for better semantics */}
          <button onClick={handleSubscribeClick} className="subscribe-button">
            Subscribe
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Link href="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Home</Link>
        <Link href="/categories" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Categories</Link>
        <Link href="/about" className="mobile-nav-link" onClick={() => setIsOpen(false)}>About</Link>
        <Link href="/contact" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
        <div className="mobile-actions">
          <button onClick={handleSubscribeClick} className="mobile-subscribe-button">
            Subscribe
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;