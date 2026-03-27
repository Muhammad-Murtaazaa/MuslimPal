import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">About MuslimPal</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">A premium Islamic utility platform for daily worship, learning, and reflection</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-12 border border-gray-100 dark:border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">What is MuslimPal?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            MuslimPal is an Islamic companion app that brings together Quran reading,
            prayer times and qibla guidance, zakat estimation, duas, and AI-assisted scholarly
            learning into one focused experience.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Features</h2>
          <ul className="grid md:grid-cols-2 gap-4 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">All 114 surahs with Arabic text, translation, search, and filtering</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Live prayer times and qibla direction based on location</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Currency-aware zakat calculator with nisab status tracking</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">AI Scholar assistant with educational, Sharia-conscious responses</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Verse-level recitation playback with selectable Quran audio editions</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Hijri calendar with current Islamic date widget and monthly navigation</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Interactive dashboard cards that open each service in the same tab</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Bookmarks, reading mode preferences, and responsive web-first design</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-12 border border-gray-100 dark:border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Developer</h2>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {/* Placeholder for founder image - replace with your actual image */}
              <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-4xl text-blue-600 dark:text-blue-300">
                MM
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Muhammad Murtaza</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                MuslimPal is being built to provide practical Islamic tools in one reliable platform.
                The goal is to make daily worship easier through accurate prayer support, structured Quran
                reading, and responsible AI-based educational assistance.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.linkedin.com/in/muhammad-murtaza-577381327/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <FaLinkedin className="mr-2" size={20} />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Muhammad-Murtaazaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <FaGithub className="mr-2" size={20} />
                  GitHub
                </a>
                <a
                  href="https://muhammadmurtaza.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                >
                  <FaGlobe className="mr-2" size={20} />
                  MuslimPal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Project Direction</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            MuslimPal continues to evolve with features focused on worship accuracy,
            practical usability, and trustworthy Islamic educational guidance with safer AI usage controls.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Explore</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Continue with Quran reading, AI Scholar, prayer tools, and zakat guidance from the main navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
