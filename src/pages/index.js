// src/pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
// Your Firebase imports are still needed for data fetching on the server
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { slugify } from '@/utils/slugify';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


export default function Home({ featured, popular, latest, displayedCategories }) {

  return (
    <>
      <Head>
        <title>Curious Blogs - Explore Ideas That Matter</title>
        <meta name="description" content="Discover trending, popular and latest blogs across technology, lifestyle, money and career." />
      </Head>
      <main className="home-container">

        {featured && (
          <section className="hero">
            <div className="hero-content">
              <span className="tag">{featured.category}</span>
              <h1>{featured.title}</h1>
              <p>{featured.description}</p>
              <div className="author-info-home">
                <span>By {featured.author || 'Admin'}</span>
                <span>{formatDate(featured.createdAt)}</span>
              </div>
           
              <Link href={`/blog/${featured.id}`} className="btn-read-featured">Read Article →</Link>
            </div>
            <div className="hero-image">
              <Image 
                src={featured.thumbnailUrl} 
                alt={featured.title}
                width={800}  // 4
                height={600} // 3
                priority={true}
                // The image will scale down to fit its container, but the space reserved will always be 4:3
              />
            </div>
          </section>
        )}

        <div className="home-content-wrapper">
          {/* --- Main Feed for Latest Articles --- */}
          <section className="main-feed">
            <h2 className="section-title">Latest Articles</h2>
            <div className="articles-grid">
              {latest.map(post => <ArticleCard key={post.id} {...post} />)}
            </div>
          </section>

          {/* --- Sidebar --- */}
          <aside className="sidebar">
            <div className="sidebar-widget">
              <h3 className="widget-title">Popular Posts</h3>
              <ul className="popular-posts-list">
                {popular.map(post => (
                  <li key={post.id}>
                    <Link href={`/blog/${post.id}`} className="popular-post-link">
                     <Image 
                        src={post.thumbnailUrl} 
                        alt={post.title} 
                        className="popular-post-thumbnail" 
                        width={80} // 4
                        height={60} // 3
                      />
                      <h4 className="popular-post-title">{post.title}</h4>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget">
              <h3 className="widget-title">Top Categories</h3>
              <ul className="categories-list">
                {displayedCategories.map(cat => (
                  <li key={cat.slug}>
                    <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

// --- The Reusable Article Card Component ---
function ArticleCard({ id, thumbnailUrl, category, title, author, createdAt }) {
  return (
    <article className="article-card">
      <Link href={`/blog/${id}`} className="card-image-link">
       <Image 
          src={thumbnailUrl} 
          alt={title} 
          width={400} // 4
          height={300} // 3
        />
      </Link>
      <div className="card-content">
        <span className="tag">{category}</span>
        <h3 className="card-title">
          <Link href={`/blog/${id}`}>{title}</Link>
        </h3>
        <div className="card-meta">
          <span>By {author || 'Admin'}</span>
          <span>•</span>
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
    </article>
  );
}


export async function getStaticProps() {

  const processDoc = (doc) => {
    const data = doc.data();
    const serializedData = {};

    for (const key in data) {
      const value = data[key];
      // Check if the value is a Firestore Timestamp
      if (value && typeof value.toDate === 'function') {
        // Convert it to a standardized string format (ISO string)
        serializedData[key] = value.toDate().toISOString();
      } else {
        // Otherwise, keep the value as is
        serializedData[key] = value;
      }
    }
    
    return {
      id: doc.id,
      ...serializedData,
    };
  };

  try {
    const articlesRef = collection(db, 'blogs');
    const publishedQuery = where('status', '==', 'published');

    // Fetch all data
    const featuredSnap = await getDocs(query(articlesRef, publishedQuery, orderBy('createdAt', 'desc'), limit(1)));
    const latestSnap = await getDocs(query(articlesRef, publishedQuery, orderBy('createdAt', 'desc'), limit(6)));
    const popularSnap = await getDocs(query(articlesRef, publishedQuery, orderBy('viewsCount', 'desc'), limit(4)));

    // Use our helper function to process every document
    const featured = !featuredSnap.empty ? processDoc(featuredSnap.docs[0]) : null;
    const latestPosts = latestSnap.docs.map(processDoc);
    const popularPosts = popularSnap.docs.map(processDoc);
    
    // Derive categories just like before
    const categorySet = new Set(latestPosts.map(post => post.category));

    const displayedCategories = [...categorySet].map(categoryName => ({
      name: categoryName,
      slug: slugify(categoryName) // Use the helper to create the correct slug
    }));

    return {
      props: {
        featured,
        popular: popularPosts,
        latest: latestPosts,
        displayedCategories,
      },
      revalidate: 600, 
    };
  } catch (error) {
    console.error("Error in getStaticProps for homepage:", error);
    // Return empty props in case of an error to prevent the build from failing
    return {
      props: {
        featured: null,
        popular: [],
        latest: [],
        displayedCategories: [],
      },
    };
  }
}