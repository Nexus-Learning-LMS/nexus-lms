import Link from 'next/link'

const PrivacyPolicyPage = () => {
  return (
    <div>
      {/* Blue Header Section */}
      <div className="w-full bg-brand-primary-blue p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="text-slate-200 mt-2">Effective Date: 19/06/2025</p>
      </div>

      {/* Main Content Section */}
      <div className="max-w-4xl mx-auto p-6 md:p-10 text-slate-700">
        <div className="space-y-8 md:pb-16">
          <p className="text-lg">
            Welcome to Nexus Learning ("we," "our," or "us"). Your privacy is important to us. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our website (the
            "Site") and use our services.
          </p>
          <p>
            By accessing or using our Site, you agree to this Privacy Policy. If you do not agree with its terms, please
            do not use our services.
          </p>

          <hr className="my-6" />

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <h3 className="text-xl font-semibold text-brand-dark-blue">a) Personal Information</h3>
            <p>When you register, subscribe, or interact with our services, we may collect:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number (if provided)</li>
              <li>Password</li>
              <li>Educational information (e.g., courses enrolled, progress)</li>
              <li>Payment details (processed securely via third-party gateways)</li>
            </ul>
            <h3 className="text-xl font-semibold text-brand-dark-blue">b) Non-Personal Information</h3>
            <p>We may also collect data that does not personally identify you, such as:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Usage data (e.g., page visits, time on site)</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 p-4 border-l-4 border-yellow-500 bg-yellow-50">
            <h2 className="text-2xl font-bold text-brand-deep-blue">2. Strict Prohibition of Content Sharing</h2>
            <p className="font-semibold">
              Nexus Learning strictly prohibits the unauthorized sharing, reproduction, distribution, resale, or public
              display of any content provided on our platform, including but not limited to videos, course materials,
              PDFs, quizzes, and code.
            </p>
            <p>Violation of this policy will result in:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Immediate termination of access without refund</li>
              <li>Permanent account suspension</li>
              <li>
                Legal action including financial penalties, civil liability, and criminal charges as per applicable law
              </li>
            </ul>
            <p>
              We take intellectual property rights and digital content protection seriously. Users found guilty of
              breaching this policy will be held accountable through legal and regulatory compliance mechanisms.
            </p>
            <p>
              <strong>This clause is mandatory and non-negotiable.</strong>
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Provide, maintain, and improve our educational services</li>
              <li>Personalize your learning experience</li>
              <li>Communicate with you (e.g., for updates, support, promotional emails)</li>
              <li>Monitor site usage and analytics</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">4. Sharing of Information</h2>
            <p>We do not sell your personal information. However, we may share information with:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Service providers who assist us with hosting, analytics, payments, and communication</li>
              <li>Legal authorities, if required by law or to protect our rights</li>
              <li>Business partners, only with your explicit consent (e.g., for third-party certifications)</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to remember your preferences, improve site functionality, and
              analyze traffic. You can manage your cookie preferences through your browser settings.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes for which it was
              collected, comply with legal obligations, resolve disputes, and enforce our policies.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">7. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access the personal information we hold about you,
              request correction or deletion of your data, object to or restrict data processing, withdraw consent at
              any time, and request a copy of your data in a portable format.
            </p>
            <p>
              To exercise these rights, please contact us at{' '}
              <a href="mailto:nexuslearning.team@gmail.com" className="text-brand-primary-blue underline">
                nexuslearning.team@gmail.com
              </a>
              .
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">8. Security of Your Information</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data. However, no online
              transmission is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">9. Third-Party Links</h2>
            <p>
              Our site may contain links to external sites not operated by us. We are not responsible for the privacy
              practices of these third parties.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by
              posting the updated policy on this page with a new "Effective Date."
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">11. Consent to Communications</h2>
            <p>
              By signing up for our services, you agree to receive administrative and promotional emails from us. You
              may unsubscribe from promotional communications at any time by following the instructions in the email.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">12. User-Generated Content</h2>
            <p>
              Any content (such as comments, reviews, or forum posts) that you voluntarily submit to Nexus Learning
              becomes public information. Please do not share personal or sensitive information in these areas. We are
              not responsible for how others use that information.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-deep-blue">13. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy, contact us at:</p>
            <div className="pl-4">
              <p>
                <strong>Nexus Learning</strong>
              </p>
              <p>
                Email:{' '}
                <a href="mailto:nexuslearning.team@gmail.com" className="text-brand-primary-blue underline">
                  nexuslearning.team@gmail.com
                </a>
              </p>
              <p>
                Website:{' '}
                <Link href="/" className="text-brand-primary-blue underline">
                  https://nexus-learning.vercel.app
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
