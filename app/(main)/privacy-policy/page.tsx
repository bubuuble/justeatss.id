// app/(main)/privacy-policy/page.tsx
import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <p className="text-zinc-400 text-center mb-12">Last updated: May 30, 2025</p>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">1. Introduction</h2>
            <p className="text-zinc-300 leading-relaxed">
              Welcome to Justeatss.id ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our food ordering and delivery services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Personal Information</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Delivery address and billing information</li>
                  <li>Payment information (processed securely through DOKU and other payment providers)</li>
                  <li>Order history and food preferences</li>
                  <li>Account credentials when you create an account</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  <li>IP address and browser information</li>
                  <li>Device information and operating system</li>
                  <li>Usage data and website interactions</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location data (when you enable location services)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Process and fulfill your food orders</li>
              <li>Arrange delivery through our partners or direct delivery</li>
              <li>Process payments securely</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send order confirmations, updates, and delivery notifications</li>
              <li>Improve our website, menu offerings, and services</li>
              <li>Send promotional emails and marketing communications (with your consent)</li>
              <li>Personalize your food recommendations</li>
              <li>Comply with legal obligations and food safety regulations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">4. Information Sharing and Disclosure</h2>
            <div className="space-y-4">
              <p className="text-zinc-300">We may share your information with:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Service Providers:</strong> DOKU payment processor, delivery partners, SMS/email service providers</li>
                <li><strong>Delivery Partners:</strong> GoFood, GrabFood, and other delivery platforms when you order through them</li>
                <li><strong>Technology Providers:</strong> Sanity CMS, Clerk authentication, hosting services</li>
                <li><strong>Legal Requirements:</strong> When required by Indonesian law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of business assets</li>
              </ul>
              <p className="text-zinc-300 mt-4">
                <strong>We do not sell, trade, or rent your personal information to third parties for marketing purposes.</strong>
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">5. Data Security</h2>
            <p className="text-zinc-300 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure payment processing through certified providers, and regular security assessments. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">6. Your Rights</h2>
            <p className="text-zinc-300 mb-4">Under Indonesian data protection laws, you have the right to:</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Access and review your personal information</li>
              <li>Update or correct your personal information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt-out of marketing communications at any time</li>
              <li>Request data portability</li>
              <li>Object to processing of your data for marketing purposes</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-zinc-300 mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">7. Cookies and Tracking Technologies</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, remember your preferences, and personalize content. Types of cookies we use include:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
            <p className="text-zinc-300 mt-4">
              You can control cookie settings through your browser preferences, but disabling certain cookies may affect website functionality.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">8. Data Retention</h2>
            <p className="text-zinc-300 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order information may be retained for accounting and legal compliance purposes as required by Indonesian law.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">9. Children's Privacy</h2>
            <p className="text-zinc-300 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have it removed.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">10. International Data Transfers</h2>
            <p className="text-zinc-300 leading-relaxed">
              Some of our service providers may be located outside Indonesia. When we transfer your data internationally, we ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">11. Contact Us</h2>
            <p className="text-zinc-300 mb-4">
              If you have any questions about this Privacy Policy, our data practices, or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="text-zinc-300 space-y-2">
                <p><strong>Business Name:</strong> Justeatss.id</p>
                <p><strong>Email:</strong> privacy@justeatss.id</p>
                <p><strong>WhatsApp:</strong> +62 877-4170-4737</p>
                <p><strong>Instagram:</strong> @justeatss.id</p>
                <p><strong>Response Time:</strong> We will respond to your inquiry within 7 business days</p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">12. Updates to This Policy</h2>
            <p className="text-zinc-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. For significant changes, we may also send you an email notification.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">13. Governing Law</h2>
            <p className="text-zinc-300 leading-relaxed">
              This Privacy Policy is governed by and construed in accordance with the laws of the Republic of Indonesia, including Law No. 27 of 2022 on Personal Data Protection (UU PDP).
            </p>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <a 
            href="/" 
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
