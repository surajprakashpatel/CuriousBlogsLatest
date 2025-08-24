import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Firebase imports
import { db } from '../../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

// Import the new slugify helpers
import { slugify, unslugify } from '../../utils/slugify';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

function CategoryBlogsPage({ blogs, formattedCategory, categorySlug }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading category...</div>;
  }

  return (
    <div className="category-blogs-page">
      <Head>
        <title>{formattedCategory} Blogs | Curious Blogs</title>
        <meta name="description" content={`Explore all articles, tutorials, and guides related to ${formattedCategory} on Curious Blogs.`} />
        <link rel="canonical" href={`https://curiousitylab.in/category/${categorySlug}`} />
        <meta property="og:title" content={`${formattedCategory} Blogs | Curious Blogs`} />
        <meta property="og:description" content={`Explore all articles related to ${formattedCategory}.`} />
      </Head>

      <div className="category-header">
        <h1>{formattedCategory}</h1>
        <p className="category-subtitle">Explore the latest in {formattedCategory.toLowerCase()}</p>
        <div className="blog-count">{blogs.length} {blogs.length === 1 ? 'article' : 'articles'} found</div>
      </div>
      
      <div className="blogs-container">
        {blogs.length > 0 ? (
          <div className="blog-list-category">
            {blogs.map(blog => (
              <article key={blog.id} className="blog-card-category">
                <Link href={`/blog/${blog.id}`} className="blog-image-link">
                  <div className="blog-image-container">
                    <Image 
                      src={blog.thumbnailUrl} 
                      alt={blog.title} 
                      width={400}
                      height={300}
                      className="blog-image"
                    />
                    <div className="category-read-time">{blog.readTime} min read</div>
                  </div>
                </Link>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-subcategory">{blog.subCategory}</span>
                    <span className="blog-date">{formatDate(blog.createdAt)}</span>
                  </div>
                  <h2 className="blog-title">
                    <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h2>
                  <p className="blog-description">{blog.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-blogs">
            <div className="no-blogs-icon">📭</div>
            <h3>No blogs found in this category yet</h3>
            <p>Check back later or explore other categories</p>
            <Link href="/categories" className="browse-categories">
              Browse all categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryBlogsPage;

export async function getStaticPaths() {
  const blogsRef = collection(db, 'blogs');
  const q = query(blogsRef, where('status', '==', 'published'));
  const snapshot = await getDocs(q);

  const categories = new Set();
  snapshot.forEach(doc => {
    const categoryName = doc.data().category;
    if (categoryName) {
      categories.add(categoryName);
    }
  });

  const paths = Array.from(categories).map(cat => ({
    params: { categorySlug: slugify(cat) }, // USE THE NEW HELPER
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { categorySlug } = params;

  // USE THE NEW HELPER to get the real category name for querying
  const formattedCategoryName = unslugify(categorySlug); 

  const blogsRef = collection(db, 'blogs');
  const q = query(
    blogsRef,
    where('category', '==', formattedCategoryName),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const blogsData = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const serializableBlogs = JSON.parse(JSON.stringify(blogsData, (key, value) => {
      if (value && value.hasOwnProperty('seconds') && value.hasOwnProperty('nanoseconds')) {
          return new Date(value.seconds * 1000).toISOString();
      }
      return value;
  }));

  return {
    props: {
      blogs: serializableBlogs,
      formattedCategory: formattedCategoryName,
      categorySlug: categorySlug,
    },
    revalidate: 600,
  };
}