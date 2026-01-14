'use client';

import { useState } from 'react';

export default function Home() {
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeocode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !email.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data.status === 'success') {
        setResults(data);
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, address, result: data }),
        });
      } else {
        setError(data.message || 'Geocoding failed. Please try again.');
      }
    } catch (err) {
      setError('Network error—please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpsell = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Upgrade failed—please contact support@smartgeocode.io.');
      }
    } catch (error) {
      console.error('Upsell error:', error);
      setError('An error occurred during upgrade—please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Hero – Refined verbiage for broader appeal and clarity */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Accurate Geocoding, Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get precise latitude/longitude coordinates instantly. Free for single lookups—upgrade for batch processing from $29/mo. Ideal for real estate, logistics, marketing, and app development.
          </p>
          <p className="text-lg text-gray-500">
            No credit card required to get started.
          </p>
        </section>

        {/* Free Single Lookup Form – Functionality unchanged, minor verbiage tweaks for production polish */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-6 text-red-600">
            Try a Free Single Lookup
          </h3>
          <form onSubmit={handleGeocode} className="space-y-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter address (e.g., 123 Main St, East Meadow, NY)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
            <input
              type="email"
              placeholder="Your email to receive results"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Geocode Now'}
            </button>
          </form>

          {error && <p className="text-red-600 text-center mt-4 font-semibold">{error}</p>}

          {results && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-800">Geocoding Results</h3>
              <p><strong>Status:</strong> {results.status}</p>
              {results.status === 'success' && (
                <div className="mt-4 space-y-2">
                  <p><strong>Latitude:</strong> {results.lat}</p>
                  <p><strong>Longitude:</strong> {results.lng}</p>
                  <p><strong>Formatted Address:</strong> {results.formatted_address}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    A copy of these results has been emailed to you. Need to process multiple addresses? Upgrade for batch support.
                  </p>
                  <button
                    onClick={handleUpsell}
                    className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Upgrade to Premium ($29/mo)
                  </button>
                </div>
              )}
              {results.status === 'error' && <p className="text-red-500">{results.message}</p>}
            </div>
          )}
        </div>

        {/* Pricing Section – Refined verbiage for precision, added tooltips-like notes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Flexible Plans for Every Need
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Free – Updated verbiage */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Free</h3>
              <p className="text-3xl font-extrabold mb-6">$0<span className="text-lg font-normal text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-8 text-gray-700 text-sm">
                <li>Manual single-address lookups</li>
                <li>Up to 500 lookups per month</li>
                <li>Precise lat/long + formatted address</li>
                <li>Instant email delivery of results</li>
                <li className="text-gray-400 line-through">Batch CSV processing</li>
                <li className="text-gray-400 line-through">API integration</li>
              </ul>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Get Started Free
              </button>
            </div>

            {/* Premium – Highlighted, refined */}
            <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-red-600 relative text-center">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                Most Popular
              </span>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Premium</h3>
              <p className="text-3xl font-extrabold mb-6 text-red-600">$29<span className="text-lg font-normal text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-8 text-gray-700 text-sm">
                <li>Batch upload via CSV</li>
                <li>Up to 10,000 lookups per month</li>
                <li>Exports to CSV, JSON, KML for Google Maps</li>
                <li>No watermarks, priority processing</li>
                <li>Unlimited singles within monthly limit</li>
                <li className="text-gray-400 line-through">API access</li>
              </ul>
              <button
                onClick={handleUpsell}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Upgrade to Premium
              </button>
            </div>

            {/* Pro – Refined, mailto unchanged */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Pro</h3>
              <p className="text-3xl font-extrabold mb-6">$49<span className="text-lg font-normal text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-8 text-gray-700 text-sm">
                <li>Up to 50,000 lookups per month</li>
                <li>Full API access for real-time and batch</li>
                <li>Increased rate limits</li>
                <li>All Premium features included</li>
              </ul>
              <a
                href="mailto:support@smartgeocode.io?subject=Interest%20in%20SmartGeocode%20Pro%20Plan&body=Hello%20team%2C%0A%0AI%27m%20interested%20in%20the%20Pro%20plan.%20My%20use%20case%20is%3A%20[describe%20briefly%2C%20e.g.%2C%20integrating%20into%20my%20app].%0AExpected%20monthly%20volume%3A%20[estimate].%0A%0ALooking%20forward%20to%20details!%0A%0ABest%2C%0A[Your%20Name]"
                className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Contact for Pro Access
              </a>
            </div>

            {/* Unlimited – Refined, mailto unchanged */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Unlimited</h3>
              <p className="text-3xl font-bold mb-6 text-gray-800">Contact Us</p>
              <ul className="space-y-3 mb-8 text-gray-700 text-sm">
                <li>Unlimited lookups with fair use policy</li>
                <li>Scalable API for high-volume needs</li>
                <li>Dedicated support and custom options</li>
              </ul>
              <a
                href="mailto:support@smartgeocode.io?subject=SmartGeocode%20Unlimited%20Plan%20Inquiry&body=Hello%20team%2C%0A%0AI%27d%20like%20to%20discuss%20the%20Unlimited%20plan.%20Details%3A%0A-%20Expected%20monthly%20lookups%3A%20[estimate%2C%20e.g.%20100k%2B]%0A-%20Use%20case%3A%20[real%20estate%2C%20logistics%2C%20etc.]%0A-%20Specific%20requirements%3A%20[API%2C%20SLAs%2C%20etc.]%0A%0APlease%20provide%20pricing%20and%20next%20steps.%0A%0AThanks%2C%0A[Your%20Name]"
                className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Contact for Unlimited
              </a>
            </div>
          </div>
        </section>

        {/* Features Grid – Refined verbiage for production, ensuring no missing emphasis */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <i className="fas fa-bolt text-3xl text-red-500 mb-4"></i>
            <h3 className="font-semibold mb-2 text-gray-800">Blazing Fast</h3>
            <p className="text-gray-600">Get accurate coordinates in seconds, powered by reliable APIs.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <i className="fas fa-envelope text-5xl text-red-500 mb-4"></i>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Instant Email Delivery</h3>
            <p className="text-gray-600">Results sent to your inbox for easy access and sharing—every time.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <i className="fas fa-rocket text-3xl text-red-500 mb-4"></i>
            <h3 className="font-semibold mb-2 text-gray-800">Effortless Scaling</h3>
            <p className="text-gray-600">Start free, upgrade seamlessly for batch, API, or unlimited access.</p>
          </div>
        </section>
      </div>
    </main>
  );
}