import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';


export default function Footer() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsQuery = query(collection(db, 'blogs'), orderBy('viewsCount', 'desc'), limit(3));
        const postsSnapshot = await getDocs(postsQuery);
        setPopularPosts(postsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'
          };
        }));

        // Fetch categories
        const catsQuery = query(collection(db, 'categories'), limit(6));
        const catsSnapshot = await getDocs(catsQuery);
        setCategories(catsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (err) {
        console.error("Error loading footer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-heading">About Us</h3>
          <p className="footer-text">Welcome to Curious Blogs your trusted source for engaging stories and practical insights.</p>
          <div className="footer-socials">{/* ... your social links ... */}</div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
            <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3 className="footer-heading">Categories</h3>
          {loading ? (<p>Loading...</p>) : (
            <ul className="footer-links">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug || cat.id}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Popular Posts */}
        <div className="footer-section">
          <h3 className="footer-heading">Popular Posts</h3>
          {loading ? (<p>Loading...</p>) : (
            <div className="footer-posts">
              {popularPosts.map(post => (
                <div key={post.id} className="footer-post">
                  {post.thumbnailUrl && (
                    // 5. Replaced <img> with the optimized <Image> component
                    <Image 
                      src={post.thumbnailUrl} 
                      alt={post.title} 
                      width={50} // Small thumbnail size
                      height={50}
                      className="footer-post-img" 
                    />
                  )}
                  <div>
                    <Link href={`/blog/${post.id}`} className="footer-post-title">{post.title}</Link>
                    <span className="footer-post-date">{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Curious Blogs. All rights reserved.</p>
      </div>
    </footer>
  );
}