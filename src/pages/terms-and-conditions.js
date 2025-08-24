import Head from 'next/head';

const TermsAndConditionsPage = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions | Curious Blogs</title>
        <meta name="description" content="Read the official Terms and Conditions for using the Curious Blogs website, covering content usage, intellectual property, user-generated content, and more." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com/terms-and-conditions" />
      </Head>

      {/* Navbar and Footer are removed, handled by _app.js */}
      <div className="terms">
        <header className="terms-header">
          <h1>Terms and Conditions</h1>
          <p>Effective Date: June 17, 2025</p>
        </header>

        <div className="terms-content">
          <p className="intro">
            Welcome to Curious Blogs! These Terms and Conditions ("Terms") govern your access to and use of our website located at https://curiousitylab.in. By accessing or using our site, you agree to be bound by these Terms. If you do not agree, please do not use the site.
          </p>

          <section className="terms-section">
            <h2>1. Use of the Website</h2>
            <p>
              You agree to use Curious Blogs only for lawful purposes. You must not:
            </p>
            <ul>
              <li>Attempt to hack, disrupt, or interfere with the site.</li>
              <li>Copy or distribute content without permission.</li>
              <li>Submit false or misleading information.</li>
              <li>Use our platform to promote spam, scams, or illegal activity.</li>
            </ul>
            <p>
              We reserve the right to block access or take legal action if these Terms are violated.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Intellectual Property</h2>
            <p>
              All content on this site—including articles, graphics, logos, and layout—is the property of Curious Blogs or its content creators and is protected by copyright laws.
              <br /><br />
              You may:
            </p>
            <ul>
              <li>Read, share, and link to our content for personal or educational use.</li>
            </ul>
            <p>You may not:</p>
            <ul>
              <li>Copy, reproduce, or republish any material without our written permission.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. User-Generated Content</h2>
            <p>
              When you submit content (e.g., comments, articles, feedback), you:
            </p>
            <ul>
              <li>Grant us a non-exclusive, royalty-free license to use, display, and distribute your content.</li>
              <li>Confirm that your content does not infringe on anyone else's rights.</li>
            </ul>
            <p>
              We reserve the right to remove any content that violates our policies or is deemed harmful or irrelevant.
            </p>
          </section>

          <section className="terms-section">
            <h2>4. Disclaimer</h2>
            <p>
              All information provided on Curious Blogs is for general informational and educational purposes only.
              <br /><br />
              We do not guarantee:
            </p>
            <ul>
              <li>The completeness, accuracy, or reliability of any information.</li>
              <li>That reading or acting on our content will achieve specific outcomes.</li>
            </ul>
            <p>
              Use your discretion and consult a professional where appropriate.
            </p>
          </section>

          <section className="terms-section">
            <h2>5. Third-Party Links</h2>
            <p>
              Our site may contain links to third-party websites. We do not control or endorse the content, privacy practices, or policies of those websites. Accessing third-party sites is at your own risk.
            </p>
          </section>

          <section className="terms-section">
            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Curious Blogs and its team are not liable for any indirect, incidental, or consequential damages resulting from your use of the site.
              <br /><br />
              This includes, but is not limited to, data loss, loss of revenue, or interruption of service.
            </p>
          </section>

          <section className="terms-section">
            <h2>7. Changes to These Terms</h2>
            <p>
              We may update these Terms at any time. Changes will be effective immediately when posted on this page. Continued use of the website after changes means you accept the revised Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>8. Termination</h2>
            <p>
              We reserve the right to suspend or permanently block access to any user who violates these Terms or abuses the website in any form.
            </p>
          </section>

          <section className="terms-section">
            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed by and interpreted in accordance with the laws of India, without regard to its conflict of law principles.
            </p>
          </section>

          <section className="terms-section">
            <h2>10. Contact Us</h2>
            <p>
              For questions, concerns, or feedback about these Terms, reach out to:
              <br />
              📧 <a href="mailto:contact@curiousitylab.in">contact@curiousitylab.in</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditionsPage;