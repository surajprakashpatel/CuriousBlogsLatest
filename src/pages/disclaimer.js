import Head from 'next/head';
import Link from 'next/link'; // 1. Import Link for internal navigation



const DisclaimerPage = () => {
  return (

    <>
    
      <Head>
        <title>Disclaimer | Curious Blogs</title>
        <meta name="description" content="Read the official disclaimer for Curious Blogs, covering content accuracy, contributor agreements, comment policies, affiliate disclosures, and more." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://curiousitylab.in/disclaimer" />
      </Head>

      {/* 4. Navbar and Footer are removed, handled by _app.js */}
      <div className="disclaimer">
        <header className="disclaimer-header">
          <h1>Disclaimer</h1>
          <div className="effective-date">
            <p>Effective Date: June 17, 2025</p>
            <p>Website: <a href="https://curiousitylab.in" target="_blank" rel="noopener noreferrer">https://curiousitylab.in</a></p>
          </div>
        </header>

        <div className="disclaimer-content">
          <p className="intro">
            Welcome to Curious Blogs. By accessing this website, you agree to the terms of this disclaimer and its included policies. Please read carefully.
          </p>

          <section className="disclaimer-section">
            <h2>1. General Disclaimer</h2>
            <p>
              The content on Curious Blogs is for informational and educational purposes only. We do not guarantee the accuracy, completeness, or timeliness of any information. While we aim to provide value-driven content, it should not be considered professional advice (legal, medical, financial, etc.).
            </p>
            <ul>
              <li>Use this site at your own discretion.</li>
              <li>Always consult a qualified professional before making decisions based on any content you read here.</li>
            </ul>
          </section>

          <section className="disclaimer-section">
            <h2>2. Contributor Agreement</h2>
            <p>
              Curious Blogs works with a growing network of independent contributors. When submitting or publishing content on our platform, contributors agree to the following:
            </p>
            <ul>
              <li>You affirm that all content submitted is original and does not infringe on any copyrights or third-party rights.</li>
              <li>You grant Curious Blogs a non-exclusive, royalty-free license to edit, publish, and promote your content.</li>
              <li>You accept that editorial changes may be made for clarity, grammar, SEO, or policy compliance.</li>
              <li>If compensation is involved, it will be disclosed and managed per a separate agreement.</li>
              <li>Plagiarism or AI-generated content without review may lead to removal and permanent ban.</li>
            </ul>
            <p>
              {/* 5. Upgraded internal link to use <Link> */}
              If you'd like to write for us, mail us at contact@curiousitylab.in.
            </p>
          </section>

          <section className="disclaimer-section">
            <h2>3. Comment Policy</h2>
            <p>
              We encourage open, respectful discussions on our content. However, we reserve the right to remove any comments that:
            </p>
            <ul>
              <li>Include hate speech, threats, or harassment</li>
              <li>Contain spam, promotional links, or misleading claims</li>
              <li>Are off-topic or add no value to the discussion</li>
              <li>Impersonate others or use fake identities</li>
            </ul>
            <p>
              By commenting, you grant us permission to display, moderate, and remove your comment as needed.
            </p>
          </section>

          <section className="disclaimer-section">
            <h2>4. Affiliate Disclosure</h2>
            <p>
              Some pages on Curious Blogs may contain affiliate links. This means that if you click on a product link and make a purchase, we may earn a small commission at no extra cost to you.
            </p>
            <ul>
              <li>We only promote products or services that we genuinely believe are valuable to our audience.</li>
              <li>All affiliate content is clearly labeled and never affects our editorial decisions.</li>
              <li>We believe in transparency and will always disclose any sponsored content.</li>
            </ul>
          </section>

          <section className="disclaimer-section">
            <h2>5. External Links Disclaimer</h2>
            <p>
              Curious Blogs may contain links to third-party websites. We do not control or guarantee the accuracy, relevance, or completeness of the information on external sites. Clicking on third-party links is at your own risk.
            </p>
          </section>

          <section className="disclaimer-section">
            <h2>6. Contact</h2>
            <p>
              For questions about this disclaimer or any policies included, contact us at:
              <br />
              {/* External mailto link remains a regular <a> tag */}
              📧 <a href="mailto:contact@curiousitylab.in">contact@curiousitylab.in</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default DisclaimerPage;