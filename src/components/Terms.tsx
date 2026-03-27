import Link from 'next/link';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-pal-gold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 dark:text-white/70">Last updated: March 2026</p>
      </div>

      <div className="space-y-6">

        <section className="bg-white dark:bg-pal-surface/90 rounded-xl border border-gray-100 dark:border-pal-sage/25 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-pal-gold mb-3">Overview</h2>
          <p className="text-gray-600 dark:text-white/85 leading-relaxed">
            By using MuslimPal, you agree to these Terms of Service. MuslimPal is an Islamic utility
            application that provides Quran reading, prayer tools, zakat calculation, and AI-assisted
            educational support. Please review these terms carefully.
          </p>
        </section>

        <section className="bg-white dark:bg-pal-surface/90 rounded-xl border border-gray-100 dark:border-pal-sage/25 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-pal-gold mb-3">1. Use of the Service</h2>
          <p className="text-gray-600 dark:text-white/85 leading-relaxed mb-3">
            MuslimPal is provided for personal and lawful use. You agree not to:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-white/85">
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Use the service for any unlawful purpose</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Attempt to scrape or mass-download content in violation of third-party API terms</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Abuse API integrations or attempt to disrupt service availability</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Misrepresent or alter Quranic content displayed by this application</span>
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-pal-surface/90 rounded-xl border border-gray-100 dark:border-pal-sage/25 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-pal-gold mb-3">2. Third-Party APIs &amp; Content</h2>
          <p className="text-gray-600 dark:text-white/85 leading-relaxed mb-3">
            MuslimPal fetches Quran data, translations, and supporting services from third-party providers. By using
            this app, you also agree to their respective terms:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-white/85">
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <a href="https://quran.foundation" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">Quran Foundation (Quran.com)</a>
                {' '}— Legacy ecosystem attribution and references
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <a href="https://alquran.cloud/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">Al-Quran Cloud</a>
                {' '}— Quran text and audio editions
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <a href="https://groq.com/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">Groq</a>
                {' '}— AI response infrastructure for educational assistant features
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <a href="https://open.er-api.com/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">ExchangeRate API</a>
                {' '}— Currency conversion support for zakat estimates
              </span>
            </li>
          </ul>
          <p className="text-gray-500 dark:text-white/70 text-sm mt-3 leading-relaxed">
            We are not responsible for the availability, accuracy, or content of these external services.
          </p>
        </section>

        <section className="bg-white dark:bg-pal-surface/90 rounded-xl border border-gray-100 dark:border-pal-sage/25 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-pal-gold mb-3">3. Quranic Content</h2>
          <p className="text-gray-600 dark:text-white/85 leading-relaxed">
            All Quranic text and translations are sourced from scholarly verified providers. The
            content is displayed for educational and spiritual purposes only. MuslimPal does not
            claim ownership of any Quranic text, translations, or audio recordings.
          </p>
        </section>

        <section className="bg-white dark:bg-pal-surface/90 rounded-xl border border-gray-100 dark:border-pal-sage/25 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-pal-gold mb-3">4. AI Disclaimer</h2>
          <p className="text-gray-600 dark:text-white/85 leading-relaxed">
            AI outputs in MuslimPal are for educational support only and are not a substitute for
            qualified scholarly advice. Users are responsible for verifying important religious matters
            with trusted scholars and authentic references.
          </p>
        </section>

        <section className="bg-white dark:bg-pal-surface/90 rounded-xl border border-gray-100 dark:border-pal-sage/25 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-pal-gold mb-3">5. Disclaimer of Warranties</h2>
          <p className="text-gray-600 dark:text-white/85 leading-relaxed">
            MuslimPal is provided &quot;as is&quot; without warranty of any kind. We do not guarantee that the
            service will be uninterrupted, error-free, or that any defects will be corrected. Use
            of the service is at your own risk.
          </p>
        </section>

        <section className="bg-white dark:bg-pal-surface/90 rounded-xl border border-gray-100 dark:border-pal-sage/25 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-pal-gold mb-3">6. Open Source License</h2>
          <p className="text-gray-600 dark:text-white/85 leading-relaxed">
            MuslimPal is released under the{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              MIT License
            </a>
            . You are free to use, modify, and distribute the source code in accordance with that license.
          </p>
        </section>

        <section className="bg-white dark:bg-pal-surface/90 rounded-xl border border-gray-100 dark:border-pal-sage/25 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-pal-gold mb-3">7. Changes to These Terms</h2>
          <p className="text-gray-600 dark:text-white/85 leading-relaxed">
            We may update these terms from time to time. The updated version will be posted on
            this page with a revised date. Continued use of MuslimPal after changes are posted
            constitutes acceptance of the new terms.
          </p>
        </section>

      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-blue-600 dark:text-pal-gold hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Terms;
