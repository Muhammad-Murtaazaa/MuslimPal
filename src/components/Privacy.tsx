import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: March 2026</p>
      </div>

      <div className="space-y-6">

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Overview</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            MuslimPal is an Islamic utility platform providing Quran reading, prayer and qibla tools,
            zakat calculation, and AI-based learning support. We are committed to minimizing data
            collection and keeping user data private by design.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Data We Collect</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            MuslimPal does not require account signup for core usage. The app does not intentionally
            collect personal profile data for reading, prayer, or zakat features.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Local data such as bookmarks, selected settings, and calculated values may be stored in
            your browser&apos;s <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">localStorage</code>.
            This data stays on your device unless you explicitly submit information to an external service.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Third-Party Services</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            To fetch Quran text and audio, the app makes requests to these external services:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <a href="https://alquran.cloud/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">Al-Quran Cloud</a>
                {' '}— Quran text &amp; verse audio
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <a href="https://open.er-api.com/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">ExchangeRate API</a>
                {' '}— Currency conversion data used in zakat calculator
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <a href="https://groq.com/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">Groq API</a>
                {' '}— AI answer generation for Ask MuslimPal and Scholar experiences
              </span>
            </li>
          </ul>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-3 leading-relaxed">
            These services may log standard HTTP request data (IP address, timestamp) as part of
            normal server operations. Please review their respective privacy policies for details.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Location Data</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            If you grant permission, location coordinates are used in-session for prayer and qibla
            accuracy. MuslimPal does not intentionally store precise location history on our servers.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. AI Interactions</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Questions sent in Ask MuslimPal and AI Scholar are transmitted to backend processing
            and then to the configured AI provider to generate responses. Do not submit highly
            sensitive personal data in AI prompts.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. Open Source</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            MuslimPal is open source. You can inspect exactly what the app does in our{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub repository
            </a>.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. Changes to This Policy</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            If this policy changes, the updated version will be posted on this page with a revised date.
            Continued use of the app constitutes acceptance of the updated policy.
          </p>
        </section>

      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
