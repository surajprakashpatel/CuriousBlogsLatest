import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { slugify } from '../utils/slugify'; // Import your slugify helper

// The base URL of your website
const BASE_URL = 'https://curiousitylab.in'; // IMPORTANT: REPLACE WITH YOUR ACTUAL DOMAIN

function generateSiteMap(staticPages, blogs, categories) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     ${staticPages
       .map((url) => {
         return `
       <url>
           <loc>${`${BASE_URL}${url}`}</loc>
           <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}

     {/* --- NEW SECTION FOR CATEGORY PAGES --- */}
     <!-- Category pages -->
     ${categories
       .map((categorySlug) => {
         return `
       <url>
           <loc>${`${BASE_URL}/category/${categorySlug}`}</loc>
           <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.9</priority>
       </url>
     `;
       })
       .join('')}

     <!-- Dynamic blog post pages -->
     ${blogs
       .map(({ id, updatedAt }) => {
         const lastModDate = updatedAt 
           ? new Date(updatedAt).toISOString().split('T')[0] 
           : new Date().toISOString().split('T')[0];

         return `
       <url>
           <loc>${`${BASE_URL}/blog/${id}`}</loc>
           <lastmod>${lastModDate}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>1.0</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  // --- 1. Fetch data for static pages ---
  const staticPages = [
    '/about',
    '/',
    '/contact',
    '/categories', // The main categories overview page
    '/privacy-policy',
    '/terms-and-conditions',
    '/disclaimer',
  ];

  // --- 2. Fetch data for dynamic pages (blogs and categories) ---
  const blogsRef = collection(db, 'blogs');
  const q = query(
    blogsRef,
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  
  const blogs = [];
  const uniqueCategories = new Set(); // Use a Set to store unique category names

  querySnapshot.forEach(doc => {
      const data = doc.data();
      
      // Add blog data for the sitemap
      blogs.push({
        id: doc.id,
        updatedAt: data.updatedAt?.toDate()?.toISOString() || data.createdAt?.toDate()?.toISOString(),
      });
      
      // Add the category name to our Set
      if (data.category) {
        uniqueCategories.add(data.category);
      }
  });

  // --- 3. Convert category names to slugs ---
  const categorySlugs = Array.from(uniqueCategories).map(cat => slugify(cat));


  // --- 4. Generate the sitemap XML ---
  const sitemap = generateSiteMap(staticPages, blogs, categorySlugs);

  // --- 5. Set headers and send the XML response ---
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;