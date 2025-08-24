import Head from 'next/head';

// CSS for this page must be moved to _app.js
// import '../styles/PrivacyPolicy.css';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Curious Blogs</title>
        <meta name="description" content="Read the official Privacy Policy for Curious Blogs. Learn what information we collect, how it's used, and your rights regarding your data." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com/privacy-policy" />
      </Head>

      {/* Navbar and Footer are removed, handled by _app.js */}
      <div className="privacy-policy">
        <header className="privacy-header">
          <h1>Privacy Policy</h1>
          <p>Last Updated: June 17, 2025</p>
        </header>

        <div className="privacy-content">
          <p className="intro">
            At Curious Blogs, accessible from https://curiousitylab.in, we take your privacy seriously. 
            This Privacy Policy outlines what information we collect, how we use it, and your choices regarding your data.
            <br /><br />
            By using our website, you consent to the collection and use of information in accordance with this policy.
          </p>

          <section className="policy-section">
            <h2>1. Information We Collect</h2>
            <h3>a. Personal Information</h3>
            <p>We may collect personal information when you:</p>
            <ul>
              <li>Subscribe to our newsletter</li>
              <li>Comment on a blog post</li>
              <li>Contact us via forms or email</li>
            </ul>
            <p>This may include:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>IP address</li>
              <li>Any message or comment you voluntarily provide</li>
            </ul>
            <h3>b. Non-Personal Information</h3>
            <p>We automatically collect data such as:</p>
            <ul>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Pages visited</li>
              <li>Referring URLs</li>
              <li>Time spent on pages</li>
            </ul>
            <p>This helps us improve user experience and website performance.</p>
          </section>

          <section className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Respond to your inquiries</li>
              <li>Send periodic newsletters or updates (if you opt in)</li>
              <li>Improve our website's functionality and content</li>
              <li>Monitor and prevent security issues</li>
              <li>Analyze user behavior for better content and advertising performance</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Cookies & Tracking Technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Understand user behavior</li>
              <li>Serve personalized content</li>
              <li>Display relevant advertisements</li>
            </ul>
            <p>You can choose to disable cookies through your browser settings. However, doing so may affect your user experience.</p>
          </section>

          <section className="policy-section">
            <h2>4. Google AdSense and Third-Party Ads</h2>
            <p>
              We use Google AdSense to display ads on our site. Google may use cookies or web beacons to serve ads based on your previous visits to this or other websites.
              <br /><br />
              To learn more about how Google uses data in its advertising, visit:
              <br />
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                https://policies.google.com/technologies/ads
              </a>
              <br /><br />
              You can opt out of personalized advertising by visiting Ads Settings.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Third-Party Links</h2>
            <p>Our site may contain links to external sites. We are not responsible for the privacy practices or content of those websites. Please review their policies before submitting any personal data.</p>
          </section>

          <section className="policy-section">
            <h2>6. Data Security</h2>
            <p>We implement appropriate security measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section className="policy-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access, update, or delete your personal data</li>
              <li>Withdraw consent at any time</li>
              <li>Opt-out of marketing communications</li>
              <li>Request information about how your data is used</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:contact@curiousitylab.in">contact@curiousitylab.in</a>.</p>
          </section>

          <section className="policy-section">
            <h2>8. Children's Privacy</h2>
            <p>Our content is not intended for children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us with information, please contact us for removal.</p>
          </section>

          <section className="policy-section">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy occasionally. When we do, we'll update the "Effective Date" above. We encourage you to review this page periodically to stay informed.</p>
          </section>

          <section className="policy-section">
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, reach out at:
              <br />
              📧 <a href="mailto:contact@curiousitylab.in">contact@curiousitylab.in</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;