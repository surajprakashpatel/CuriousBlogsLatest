import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// --- Server-Side Imports (used in getStaticProps/Paths) ---
import { doc, getDoc, collection, getDocs, where, query, orderBy, limit, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';

// --- Client-Side Imports (used in the component) ---
import { addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedin, FaCopy, FaHeart, FaRegHeart, FaReply, FaEye } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuth } from '../../context/AuthContext';


// --- Helper Function ---
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ==================================================================
// --- THE MAIN BLOG POST PAGE COMPONENT ---
// ==================================================================
export default function BlogPostPage({ blog, author, relatedPosts }) {
  const router = useRouter();
  const { currentUser } = useAuth();
  
  // --- STATE MANAGEMENT (Client-Side) ---
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', message: '' });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likedComments, setLikedComments] = useState({});
  const [viewsCount, setViewsCount] = useState(blog?.viewsCount || 0);

  // --- CLIENT-SIDE LOGIC & EFFECTS ---

  // Effect for fetching comments in real-time
  useEffect(() => {
    if (!blog?.id) return;
    const commentsRef = collection(db, 'blogs', blog.id, 'comments');
    const q = query(commentsRef, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    });
    
    return () => unsubscribe();
  }, [blog?.id]);

  // Effect for incrementing view count
  useEffect(() => {
    const slug = router.query.slug;
    if (!slug) return;

    const viewed = sessionStorage.getItem(`viewed_${slug}`);
    if (viewed) return;

    const timer = setTimeout(async () => {
      try {
        const blogRef = doc(db, 'blogs', slug);
        await updateDoc(blogRef, { viewsCount: increment(1) });
        setViewsCount(prev => prev + 1);
        sessionStorage.setItem(`viewed_${slug}`, 'true');
      } catch (err) {
        console.error('Error incrementing views count:', err);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [router.query.slug]);

  // --- HANDLER FUNCTIONS ---

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingComment(true);
    try {
      if (!blog.id) throw new Error('No blog ID');
      if (!newComment.message.trim()) throw new Error('Comment cannot be empty');
      
      const commentsRef = collection(db, 'blogs', blog.id, 'comments');
      await addDoc(commentsRef, {
        name: newComment.name || 'Anonymous',
        message: newComment.message,
        timestamp: serverTimestamp(),
        userId: currentUser?.uid || null,
        likes: 0
      });
      
      setNewComment({ name: '', message: '' });
      toast.success('Comment posted successfully!');
    } catch (err) {
      toast.error(`Error posting comment: ${err.message}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleLike = (commentId) => { /* Your existing handleLike logic */ };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || '';
    switch (platform) {
      case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); break;
      case 'twitter': window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank'); break;
      case 'whatsapp': window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, '_blank'); break;
      case 'linkedin': window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank'); break;
      case 'copy': navigator.clipboard.writeText(url); toast.success('Link copied!'); break;
      default: break;
    }
  };

  // --- RENDER LOGIC ---

  // Shows a loading state while the page is being generated on-demand for the first time
  if (router.isFallback) {
    return <div className="blog-view-loading"><Skeleton count={10} /></div>;
  }

  return (
    <>
      <Head>
          <title>{blog.seoTitle || `${blog.title} | Curious Blogs`}</title>
        <meta 
            name="description" 
            content={blog.description || blog.content?.slice(0,160)} />
        <meta 
            name="keywords" 
            content={blog.seoKeywords?.join(", ") || blog.tags?.join(", ")} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.seoTitle} />
        <meta property="og:description" content={blog.description || blog.content.slice(0,160)} />
        <meta property="og:image" content={blog.thumbnailUrl || '/default-blog.jpg'} />
        <meta property="og:url" content={`https://curiousitylab.in/blog/${blog.blogId}`} />
        <link rel="canonical" href={`https://curiousitylab.in/blog/${blog.blogId}`} />
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:modified_time" content={blog.updatedAt || blog.createdAt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.description} />
        <meta name="twitter:image" content={blog.thumbnailUrl} />
        <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.description || blog.content.slice(0,160),
      image: blog.thumbnailUrl,
      author: { "@type": "Person", name:  "Curiousity Lab" },
      datePublished: blog.createdAt,
      dateModified: blog.updatedAt || blog.createdAt,
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://curiousitylab.in/blog/${blog.blogId}` }
    })}
  </script>
      </Head>

      <div className="blog-container">
        <ToastContainer position="bottom-right" autoClose={3000} />
        <div className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
        </div>
        <div className="blog-content-container">
          <main className="blog-main-content">
            <div className="blog-meta">
              <span className="author">By {author?.name || 'Unknown Author'}</span>
              <div className="meta-details">
                <span className="date">{formatDate(blog.publishedAt)}</span>
                <span className="read-time">{blog.readTime || '5'} min read</span>
                <span className="views-count">{viewsCount} views <FaEye className="views-icon" /></span>
              </div>
            </div>

            {blog.thumbnailUrl && (
              <Image 
                src={blog.thumbnailUrl} alt={blog.title}
                width={800} height={600} // 4:3 Ratio
                priority={true} className="blog-thumbnail"
              />
            )}

            <div className="blog-content"><ReactMarkdown>{blog.content}</ReactMarkdown></div>

            {/* --- RELATED ARTICLES SECTION --- */}
            <div className="related-articles">
              <h3>Related Articles</h3>
              <div className="related-posts-grid">
                {relatedPosts.map(post => (
                  <div key={post.id} className="related-post-card">
                    <Link href={`/blog/${post.id}`} className="related-post-link">
                      <Image src={post.thumbnailUrl} alt={post.title} width={400} height={300} className="related-post-thumbnail"/>
                      <div className="related-post-content">
                        <h4 className="related-post-title">{post.title}</h4>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* --- COMMENTS SECTION --- */}
            <div className="comment-section">
              <h3 className="comment-section-title">Comments ({comments.length})</h3>
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea placeholder="Share your thoughts..." value={newComment.message} onChange={(e) => setNewComment({...newComment, message: e.target.value})} className="comment-textarea" required />
                <button type="submit" className="submit-btn" disabled={isSubmittingComment || !newComment.message.trim()}>
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <div className="user-info">
                        <span className="username">{comment.name}</span>
                        <span className="comment-date">{formatDate(comment.timestamp)}</span>
                      </div>
                    </div>
                    <div className="comment-content">{comment.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* --- SIDEBAR --- */}
          <aside className="blog-sidebar">
            {author && (
              <div className="author-card">
                <Image src={author.profilePictureUrl || '/default-avatar.png'} alt={author.name} width={80} height={80} className="author-image" />
                <div className="author-info"><h4>{author.name}</h4><p>{author.bio}</p></div>
              </div>
            )}
            <div className="social-share">
              <h4>Share this post</h4>
              <div className="share-buttons">
                <button onClick={() => handleShare('facebook')}><FaFacebookF /></button>
                <button onClick={() => handleShare('twitter')}><FaTwitter /></button>
                <button onClick={() => handleShare('whatsapp')}><FaWhatsapp /></button>
                <button onClick={() => handleShare('linkedin')}><FaLinkedin /></button>
                <button onClick={() => handleShare('copy')}><FaCopy /></button>
              </div>
            </div>
            {blog.tags?.length > 0 && (
              <div className="tags-section">
                <h4>Tags</h4>
                <div className="tags">{blog.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}</div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

// ==================================================================
// --- NEXT.JS SERVER-SIDE DATA FETCHING ---
// ==================================================================

// Helper to convert Firestore Timestamps to strings, as they can't be passed from server to client directly.
const serializeData = (data) => JSON.parse(JSON.stringify(data, (key, value) => {
    if (value && value.hasOwnProperty('seconds') && value.hasOwnProperty('nanoseconds')) {
        return new Date(value.seconds * 1000).toISOString();
    }
    return value;
}));


export async function getStaticPaths() {
  const blogsRef = collection(db, 'blogs');
  const q = query(blogsRef, where('status', '==', 'published'), limit(50)); // Build the 50 most recent blogs
  const snapshot = await getDocs(q);
  const paths = snapshot.docs.map(doc => ({ params: { slug: doc.id } }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  try {
    // 1. Fetch Blog Post
    const blogRef = doc(db, 'blogs', slug);
    const blogSnap = await getDoc(blogRef);
    if (!blogSnap.exists() || blogSnap.data().status !== 'published') {
      return { notFound: true };
    }
    const blogData = { id: blogSnap.id, ...blogSnap.data() };

    // 2. Fetch Author
    let authorData = null;
    if (blogData.authorId) {
      const authorRef = doc(db, 'authors', blogData.authorId);
      const authorSnap = await getDoc(authorRef);
      if (authorSnap.exists()) authorData = authorSnap.data();
    }

    // 3. Fetch Related Posts
    const postsRef = collection(db, 'blogs');
    const q = query(postsRef, where('status', '==', 'published'), where('category', '==', blogData.category), limit(5));
    const relatedSnap = await getDocs(q);
    const relatedPostsData = relatedSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(post => post.id !== slug)
      .slice(0, 4);

    return {
      props: {
        blog: serializeData(blogData),
        author: serializeData(authorData),
        relatedPosts: serializeData(relatedPostsData),
      },
      revalidate: 600, // Regenerate page in background every 10 minutes
    };
  } catch (error) {
    console.error("Error in getStaticProps for slug:", slug, error);
    return { notFound: true };
  }
}