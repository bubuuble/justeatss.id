// app/(main)/terms/page.tsx
import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms & Conditions</h1>
        <p className="text-zinc-400 text-center mb-12">Last updated: May 30, 2025</p>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">1. Introduction</h2>
            <p className="text-zinc-300 leading-relaxed">
              Welcome to Justeatss.id. These Terms and Conditions ("Terms") govern your use of our website, mobile application, and food ordering and delivery services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">2. Definitions</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li><strong>"Company," "we," "us," or "our"</strong> refers to Justeatss.id</li>
              <li><strong>"Service"</strong> refers to our food ordering and delivery platform, website, and mobile application</li>
              <li><strong>"User," "you," or "your"</strong> refers to anyone who accesses or uses our services</li>
              <li><strong>"Products"</strong> refers to food items, beverages, and other consumables offered through our platform</li>
              <li><strong>"Order"</strong> refers to a request for Products placed through our Service</li>
            </ul>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">3. Acceptance of Terms</h2>
            <p className="text-zinc-300 leading-relaxed">
              By using our Service, you confirm that you accept these Terms and agree to comply with them. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          {/* Use of Service */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">4. Use of Service</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Eligibility</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  <li>You must be at least 18 years old to use our services</li>
                  <li>If you are under 18, you must have parental or guardian consent</li>
                  <li>You must provide accurate and truthful information</li>
                  <li>You must be located within our delivery area in Indonesia</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Account Registration</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  <li>You must provide accurate, current, and complete information during registration</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>You are responsible for all activities that occur under your account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Prohibited Uses</h3>
                <p className="text-zinc-300 mb-2">You agree not to:</p>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  <li>Use the service for any illegal or unauthorized purpose</li>
                  <li>Violate any local, state, national, or international laws</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Use automated systems (bots) to access the service</li>
                  <li>Share false, misleading, or fraudulent information</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Products and Menu */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">5. Products and Menu</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>All food items are prepared fresh daily using quality ingredients</li>
              <li>Menu items and prices are subject to availability and may change without notice</li>
              <li>Product images are for illustration purposes and may vary from actual items</li>
              <li>We reserve the right to modify or discontinue any product at any time</li>
              <li>All products are prepared in facilities that may contain allergens</li>
              <li>We follow halal food preparation standards</li>
            </ul>
          </section>

          {/* Orders and Payment */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">6. Orders and Payment</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Order Process</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>All orders are subject to acceptance and product availability</li>
                  <li>We reserve the right to refuse or cancel orders for any reason</li>
                  <li>Order confirmation does not guarantee acceptance</li>
                  <li>Minimum order amounts may apply for delivery</li>
                  <li>Orders must be placed during operational hours (Monday-Saturday: 10:00-21:00 GMT+7)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Pricing</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>All prices are displayed in Indonesian Rupiah (IDR)</li>
                  <li>Prices include applicable taxes unless stated otherwise</li>
                  <li>Delivery fees and service charges may apply</li>
                  <li>Prices are subject to change without prior notice</li>
                  <li>Promotional prices are subject to terms and conditions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Payment</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>Payment must be completed at the time of order placement</li>
                  <li>We accept various payment methods through DOKU payment gateway</li>
                  <li>All payments are processed securely through certified payment providers</li>
                  <li>Payment confirmation is required before order processing begins</li>
                  <li>Failed payments will result in automatic order cancellation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">7. Delivery</h2>
            <div className="space-y-4">
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Delivery times are estimates and may vary due to traffic, weather, or high demand</li>
                <li>You must provide accurate and complete delivery information</li>
                <li>Someone must be available to receive the order at the delivery address</li>
                <li>Additional charges may apply for delivery to certain areas</li>
                <li>We are not responsible for delays caused by external factors beyond our control</li>
                <li>Delivery is available through our direct service or third-party partners (GoFood, GrabFood)</li>
                <li>Temperature-sensitive items are delivered in appropriate packaging</li>
              </ul>
              
              <div className="bg-zinc-900 p-4 rounded-lg mt-4">
                <h4 className="font-medium text-zinc-100 mb-2">Delivery Areas</h4>
                <p className="text-zinc-300 text-sm">
                  We currently serve customers within our designated delivery zones. 
                  Please check availability by entering your address during checkout.
                </p>
              </div>
            </div>
          </section>

          {/* Food Safety and Quality */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">8. Food Safety and Quality</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>All food is prepared following Indonesian food safety regulations</li>
              <li>We maintain high hygiene standards in our kitchen facilities</li>
              <li>Products are packaged securely to maintain freshness during delivery</li>
              <li>Please consume food items promptly upon delivery for best quality</li>
              <li>Report any quality issues within 2 hours of delivery for investigation</li>
              <li>We are not responsible for food quality deterioration due to delivery delays beyond our control</li>
            </ul>
          </section>

          {/* Cancellation and Refunds */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">9. Cancellation and Refunds</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Cancellation Policy</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>Orders can be cancelled within 5 minutes of placement if not yet confirmed</li>
                  <li>Once food preparation begins, orders cannot be cancelled</li>
                  <li>We may cancel orders due to ingredient unavailability or operational issues</li>
                  <li>Cancelled orders will receive full refunds</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Refund Policy</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>Refunds are processed for cancelled orders or verified service issues</li>
                  <li>Quality complaints must be reported within 2 hours of delivery</li>
                  <li>Refund processing time varies by payment method (3-14 business days)</li>
                  <li>Partial refunds may apply for partially fulfilled orders</li>
                  <li>Delivery fees are non-refundable unless the cancellation is due to our error</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Customer Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">10. Customer Responsibilities</h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Provide accurate delivery address and contact information</li>
              <li>Be available to receive delivery or arrange for someone to accept it</li>
              <li>Check order contents upon delivery and report any discrepancies immediately</li>
              <li>Inform us of any food allergies or dietary restrictions when ordering</li>
              <li>Treat our delivery personnel with respect and courtesy</li>
              <li>Provide safe and accessible delivery location</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">11. Intellectual Property</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              All content on our platform, including but not limited to text, graphics, logos, images, recipes, and software, is the property of Justeatss.id and is protected by Indonesian and international intellectual property laws.
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>You may not reproduce, distribute, or create derivative works without permission</li>
              <li>The Justeatss.id name and logo are our trademarks</li>
              <li>User-generated content may be used by us for promotional purposes</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">12. Limitation of Liability</h2>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <p className="text-zinc-300 leading-relaxed mb-4">
                To the maximum extent permitted by Indonesian law, Justeatss.id shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Loss of profits, data, or use</li>
                <li>Business interruption</li>
                <li>Personal injury (except where caused by our negligence)</li>
                <li>Food allergic reactions (unless we failed to disclose known allergens)</li>
              </ul>
              <p className="text-zinc-300 mt-4">
                Our total liability for any claim shall not exceed the amount paid for the specific order in question.
              </p>
            </div>
          </section>

          {/* Force Majeure */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">13. Force Majeure</h2>
            <p className="text-zinc-300 leading-relaxed">
              We shall not be liable for any failure or delay in performance under these Terms due to circumstances beyond our reasonable control, including but not limited to natural disasters, government actions, pandemics, strikes, or internet/technology failures.
            </p>
          </section>

          {/* Governing Law and Disputes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">14. Governing Law and Dispute Resolution</h2>
            <div className="space-y-4">
              <p className="text-zinc-300 leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of the Republic of Indonesia.
              </p>
              <div>
                <h3 className="text-lg font-medium mb-2 text-zinc-100">Dispute Resolution</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>We encourage resolving disputes through direct communication first</li>
                  <li>Formal complaints can be submitted through our customer service channels</li>
                  <li>Unresolved disputes may be subject to mediation or arbitration</li>
                  <li>Legal disputes shall be subject to the jurisdiction of Indonesian courts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">15. Contact Us</h2>
            <p className="text-zinc-300 mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="text-zinc-300 space-y-2">
                <p><strong>Business Name:</strong> Justeatss.id</p>
                <p><strong>Email:</strong> legal@justeatss.id</p>
                <p><strong>Customer Service:</strong> support@justeatss.id</p>
                <p><strong>WhatsApp:</strong> +62 877-4170-4737</p>
                <p><strong>Instagram:</strong> @justeatss.id</p>
                <p><strong>Business Hours:</strong> Monday - Saturday: 10:00 - 21:00 (GMT+7)</p>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">16. Changes to Terms</h2>
            <p className="text-zinc-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. We will notify users of material changes via email or prominent notice on our platform. Your continued use of the service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">17. Severability</h2>
            <p className="text-zinc-300 leading-relaxed">
              If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">18. Entire Agreement</h2>
            <p className="text-zinc-300 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Justeatss.id regarding the use of our services.
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
