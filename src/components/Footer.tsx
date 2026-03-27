
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white/60 dark:bg-gray-800 text-black dark:text-gray-200 py-6 mt-8 border-t border-emerald-900/10">
      <div className="container mx-auto px-4">
        {/* Flex container for the main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left Section: Copyright and Links */}
          <div className="text-center md:max-w-md md:mx-auto">
            <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              &copy; {new Date().getFullYear()} MuslimPal. MIT License | Open Source.
            </p>
            <div className="mt-2 space-x-4">
              <a href="/about" className="text-sm hover:text-[#0F766E] dark:hover:text-[#D4AF37]">
                About
              </a>
              <a href="/privacy" className="text-sm hover:text-[#0F766E] dark:hover:text-[#D4AF37]">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm hover:text-[#0F766E] dark:hover:text-[#D4AF37]">
                Terms
              </a>
            </div>
          </div>

          {/* Middle Section: Attribution */}
          <div className="text-center">
            <p className="text-sm">
              Quran text and recitation by{' '}
              <a
                href="https://alquran.cloud/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0F766E] hover:text-[#064E3B]"
              >
                Al-Quran Cloud
              </a>
              . AI responses powered by{' '}
              <a
                href="https://groq.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0F766E] hover:text-[#064E3B]"
              >
                Groq
              </a>
              . Prayer calculation method adapted from{' '}
              <a
                href="https://praytimes.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0F766E] hover:text-[#064E3B]"
              >
                PrayTimes.org
              </a>
              .
            </p>
          </div>

          {/* Right Section: Social Media Links */}
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com/Muhammad-Murtaazaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0F766E]"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-murtaza-577381327/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0F766E]"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://muhammadmurtaza.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0F766E]"
            >
              <FaGlobe size={20} />
            </a>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Version 2.0.0 | Built with Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
