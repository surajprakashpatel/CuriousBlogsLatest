// 1. Import the necessary components from Next.js
import Head from 'next/head';
import Link from 'next/link';


const AboutPage = () => {
  return (
    <>

      <Head>
        <title>About | Curious Blogs</title>
        <meta name="description" content="Learn about Curious Blogs, a growing ecosystem of knowledge born from the idea that curiosity should never be limited by categories." />
        <meta name="keywords" content='curious blogs, curiousity lab, about us, suraj prakash, knowledge hub, tech blog, lifestyle blog' />
      </Head>

 
      
      <div className="about-us">
        <header className="about-header">
          <h1>About Us</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              Curious Blogs was born from a simple idea: that curiosity should never be limited by categories. Founded by Suraj Prakash, a multidisciplinary creator and tech-savvy entrepreneur, Curious Blogs is more than just a blog—it's a growing ecosystem of knowledge.
            </p>
            <p>
              What began as a platform to document insights across personal development, tech, career growth, finance, psychology, and modern culture, quickly evolved into a diverse knowledge hub curated for today's digital-native learners. Our content is created by contributors from varied backgrounds—students, professionals, and thinkers—united by one goal: to feed curiosity with meaningful, insightful content.
            </p>
          </section>

          <section className="about-section">
            <h2>What We Stand For</h2>
            <p>
              We believe knowledge is leverage. But in a world flooded with information, what matters is clarity, accuracy, and relevance. At Curious Blogs, we simplify complexity and highlight what truly matters—so our readers can learn faster, act smarter, and think deeper.
            </p>
            <p>
              No clickbait. No fluff. Just real, actionable knowledge across 20+ diverse topics that impact your day-to-day life and long-term goals.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Vision</h2>
            <p>
              To become the go-to destination for curious minds who refuse to be boxed in by one niche. We want to create a space where readers can learn, explore, and grow across disciplines—because in today's world, being multi-skilled is not optional, it's essential.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Mission</h2>
            <ul>
              <li>Deliver value-first content that answers real-world questions.</li>
              <li>Create opportunity for new writers, students, and freelancers to showcase their insights.</li>
              <li>Stay ad-and-reader-friendly, keeping monetization strategies ethical and non-intrusive.</li>
              <li>Promote knowledge distribution through a network of organic contributors and engaged readers.</li>
              <li>Always evolve, just like the world we live in.</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Who We Write For</h2>
            <p>
              Whether you're a student figuring out life, a young professional trying to level up, a tech enthusiast, or just someone who's hungry to learn—Curious Blogs is for you. We blend depth with simplicity, offering both surface-level guidance and deep dives based on your needs.
            </p>
          </section>

          <section className="about-section">
            <h2>Want to Contribute?</h2>
            <p>
              We're building a network of passionate content creators who earn by sharing their knowledge. If you have a perspective worth sharing and want to grow with us, reach out to us via our mail.
            </p>
         
            {/* <Link href="/write-for-us" className="cta-button">
              Write for Us
            </Link> */}
          </section>

          <section className="about-section">
            <h2>Connect With Us</h2>
            <p>
              We value conversations. Got feedback? A question? A story idea? Want to partner or just say hi? Let's talk.
            </p>
            <div className="contact-info">
              <p> Email: <a href="mailto:contact@curiousitylab.in">contact@curiousitylab.in</a></p>
              <p> Instagram: <a href="https://www.instagram.com/curiousitylabblogs/" target="_blank" rel="noopener noreferrer">@CuriousBlogs</a></p>
              <p> Facebook: <a href="https://www.facebook.com/people/Curiousity-Lab/61579725156441/" target="_blank" rel="noopener noreferrer">Curious Blogs</a></p>
            </div>
          </section>

          <section className="closing-section">
            <p className="closing-text">Stay Curious. Keep Learning.</p>
          </section>
        </div>
      </div>
    </> 
  );
};

export default AboutPage;