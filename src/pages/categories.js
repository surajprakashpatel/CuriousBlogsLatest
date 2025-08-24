import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
function CategoryPage({ categories }) {

  const handleSidebarLinkClick = (e, slug) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="category-page-v2">
            <Head>
  
        <title>All Blog Categories | Curious Blogs</title>
        <meta name="description" content="Dive into a wide range of topics. Explore our full list of blog categories including Technology, Personal Growth, Finance, and more, all sorted by popularity." />
        <link rel="canonical" href="https://curiousitylab.in/categories" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://curiousitylab.in/categories" />
        <meta property="og:title" content="All Blog Categories | Curious Blogs" />
        <meta property="og:description" content="Dive into a wide range of topics. Explore our full list of blog categories including Technology, Personal Growth, Finance, and more." />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yourwebsite.com/categories" />
        <meta name="twitter:title" content="All Blog Categories | Curious Blogs" />
        <meta name="twitter:description" content="Dive into a wide range of topics. Explore our full list of blog categories including Technology, Personal Growth, Finance, and more." />
        {/* <meta name="twitter:image" content="https://curiousitylab.in/images/curious-blogs-og-banner.jpg" /> */}
      </Head>

      <div className="category-main-content">
        <main className="category-list">
          {categories.map(category => (
            <section key={category.slug} id={category.slug} className="category-section">
              <div className="section-header">
                <h2 className="section-title">{category.name}</h2>
                <Link href={`/category/${category.slug}`} className="see-all-btn">
                  See All
                </Link>
              </div>
              <div className="article-grid">
                {category.articles.slice(0, 3).map(article => (
                  <Link href={`/blog/${article.id}`} key={article.id} className="article-card">
                    <div className="article-image-wrapper">
                      <Image 
                        src={article.thumbnailUrl} 
                        alt={article.title}
                        width={400} // 4:3 Aspect Ratio
                        height={300}
                      />
                    </div>
                    <div className="article-content">
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-description">{article.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </main>

        <aside className="category-sidebar">
           <div className="sidebar-sticky-content">
            <h3 className="sidebar-title">Categories</h3>
            <nav className="sidebar-nav">
              {categories.map(category => (
                <a 
                  key={category.slug} 
                  href={`#${category.slug}`} 
                  className="sidebar-link"
                  onClick={(e) => handleSidebarLinkClick(e, category.slug)}
                >
                  {category.name}
                  <span className="sidebar-arrow">&rarr;</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CategoryPage;

export async function getStaticProps() {
  try {
    const blogsCollection = collection(db, 'blogs');
    const q = query(
      blogsCollection,
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    
    const blogSnapshot = await getDocs(q);
    const allBlogs = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const groupedCategories = allBlogs.reduce((acc, blog) => {
      const categoryName = blog.category;
      if (!categoryName) return acc;

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
          articles: []
        };
      }
      
      acc[categoryName].articles.push(blog);
      return acc;
    }, {});

    const sortedCategories = Object.values(groupedCategories)
      .sort((a, b) => b.articles.length - a.articles.length);

    const serializableCategories = JSON.parse(JSON.stringify(sortedCategories, (key, value) => {
        if (value && value.hasOwnProperty('seconds') && value.hasOwnProperty('nanoseconds')) {
            return new Date(value.seconds * 1000).toISOString();
        }
        return value;
    }));

    return {
      props: {
        categories: serializableCategories,
      },
      revalidate: 600, 
    };

  } catch (error) {
    console.error("Error in getStaticProps for categories page:", error);
    return {
      props: {
        categories: [], 
      },
    };
  }
}