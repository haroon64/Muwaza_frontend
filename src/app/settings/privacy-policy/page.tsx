import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const CustomerProfile: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Cookie Policy - Muawza Home Services</title>
        <meta name="description" content="Cookie Policy for Muawza Home Services" />
      </Head>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Cookie Policy</h1>
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. What Are Cookies</h2>
              <p className="text-gray-600">
                Cookies are small text files that are stored on your computer or mobile device when you 
                visit our website. They help us provide you with a better experience by remembering your 
                preferences and understanding how you use our site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Cookies</h2>
              <p className="text-gray-600 mb-4">
                Muawza Home Services uses cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Essential cookies for website functionality</li>
                <li>Preference cookies to remember your settings</li>
                <li>Analytics cookies to understand how visitors use our site</li>
                <li>Marketing cookies to deliver relevant advertisements</li>
                <li>Security cookies for authentication and security purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Essential Cookies</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    These cookies are necessary for the website to function properly. They enable core 
                    functionality such as security, network management, and accessibility.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Performance Cookies</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Functionality Cookies</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    These cookies allow the website to remember choices you make and provide enhanced, 
                    more personal features.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Targeting Cookies</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    These cookies may be set through our site by our advertising partners to build a 
                    profile of your interests and show you relevant ads on other sites.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">
                In addition to our own cookies, we may also use various third-party cookies including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Google Analytics for website analytics</li>
                <li>Payment processors for secure transactions</li>
                <li>Social media platforms for sharing functionality</li>
                <li>Advertising networks for relevant ads</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Managing Cookies</h2>
              <p className="text-gray-600 mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are 
                already on your computer and you can set most browsers to prevent them from being placed. 
                However, if you do this, you may have to manually adjust some preferences every time you 
                visit a site and some services and functionalities may not work.
              </p>
              <p className="text-gray-600">
                Most web browsers allow some control of most cookies through the browser settings. To find 
                out more about cookies, including how to see what cookies have been set and how to manage 
                and delete them, visit{' '}
                <a 
                  href="https://www.allaboutcookies.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  www.allaboutcookies.org
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Your Consent</h2>
              <p className="text-gray-600">
                By using our website, you consent to the use of cookies in accordance with this Cookie 
                Policy. You can withdraw your consent at any time by deleting the cookies stored on your 
                device and adjusting your browser settings accordingly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Cookie Policy from time to time to reflect changes in technology, 
                legislation, or our data practices. We encourage you to check this page periodically 
                for the latest information on our cookie practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="mt-2 text-gray-600">
                <p>Email: privacy@muawza.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Service Street, City, State 12345</p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;