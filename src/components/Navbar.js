import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useModal } from '../context/ModalContext';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { openSubscribeModal } = useModal();

  const handleSubscribeClick = (e) => {
    e.preventDefault();
    setIsOpen(false); 
    openSubscribeModal()
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link href="/" className="logo-link">
            <div className="logo-icon">C</div>
            <span className="logo-text">Curious Blogs</span>
          </Link>
        </div>

        <nav className={`navbar-center ${isOpen ? 'open' : ''}`}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/categories" className="nav-link">Categories</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </nav>

        <div className="navbar-right">
          <button onClick={handleSubscribeClick} className="subscribe-button">
            Subscribe
          </button>
        </div>

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