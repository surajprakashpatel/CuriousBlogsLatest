import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';



function AuthorDashboardPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const [author, setAuthor] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');     
  const router = useRouter();

  
  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      router.push('/login'); 
    }
  }, [currentUser, authLoading, router]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const authorsRef = collection(db, 'authors');
        const q = query(authorsRef, where('authorId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const authorData = querySnapshot.docs[0].data();
          setAuthor({ id: querySnapshot.docs[0].id, ...authorData });
        } else {
          setError('Author profile not found. Please complete your onboarding.');
          // Optional: Redirect to onboarding if profile is missing
          // router.push('/author-onboarding');
        }
        
        // Fetch recent posts
        const blogsRef = collection(db, 'blogs');
        const blogsQuery = query(
          blogsRef, where('authorId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'), limit(5)
        );
        const blogsSnapshot = await getDocs(blogsQuery);
        const posts = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentPosts(posts);
        
      } catch (err) {
        setError('Failed to load dashboard data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser, router]);

  if (authLoading || loading || !currentUser) {
    return (
      <>
        <Head>
          <title>Dashboard | Curious Blogs</title>
        </Head>
        <div className="dashboard-loading">
          <div className="loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head><title>Error | Curious Blogs</title></Head>
        <div className="dashboard-error">
          <h2>Error</h2>
          <p>{error}</p>
          <Link href="/">Go Home</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Author Dashboard | Curious Blogs</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      {/* The main dashboard content */}
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div className="welcome-section">
            <div className="profile-image-container">
              {author?.profilePictureUrl ? (
                <Image 
                  src={author.profilePictureUrl} 
                  alt={`${author.name}'s profile`}
                  className="profile-image"
                  width={80}
                  height={80}
                />
              ) : (
                <div className="profile-initial">
                  {author?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="welcome-text">
              <h1>Dashboard</h1>
              <p>Welcome back, {author?.name || 'Author'}!</p>
            </div>
          </div>
          <div className="new-post-btn-container">
            <Link href="/create-blog" className="new-post-btn">
              + New Post
            </Link>
          </div>
        </div>

        <div className="dashboard-stats">
          {/* ... stats JSX remains the same ... */}
        </div>

        <div className="recent-posts-section">
          <h2>Recent Posts</h2>
          <div className="posts-table-container">
            <table className="posts-table">
              <thead>
                <tr>
                  <th>TITLE</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.length > 0 ? (
                  recentPosts.map(post => (
                    <tr key={post.id}>
                      <td>
                        <div className="post-title-cell">
                          {post.thumbnailUrl && (
                            <Image 
                              src={post.thumbnailUrl} 
                              alt={post.title} 
                              className="post-thumbnail"
                              width={50}
                              height={50}
                            />
                          )}
                          <span>{post.title}</span>
                        </div>
                      </td>
                      <td>{post.category}</td>
                      <td>
                        <span className={`status-badge ${post.status}`}>
                          {post.status}
                        </span>
                      </td>
                      <td>
                        <Link href={`/edit-blog/${post.id}`} className="edit-btn">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-posts">
                      No posts found. Create your first post!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}


export default AuthorDashboardPage;