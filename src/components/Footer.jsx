import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Services',
      links: [
        { label: 'Plumbing', path: '/services' },
        { label: 'Electrical', path: '/services' },
        { label: 'Cleaning', path: '/services' },
        { label: 'Painting', path: '/services' },
        { label: 'AC Service', path: '/services' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '#' },
        { label: 'How It Works', path: '/how-it-works' },
        { label: 'Contact', path: '/contact' },
        { label: 'Blog', path: '#' },
        { label: 'Careers', path: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '#' },
        { label: 'Safety', path: '#' },
        { label: 'Terms of Service', path: '#' },
        { label: 'Privacy Policy', path: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HE</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Home<span className="text-emerald-500">Ease</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed mb-6">
                India&apos;s most trusted platform for home services. We connect you with
                verified professionals for all your home needs.
              </p>
              <div className="flex gap-3">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs capitalize"
                  >
                    {social[0].toUpperCase()}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Sections */}
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {currentYear} HomeEase. All rights reserved.</p>
          <p>Made with care for Indian homes.</p>
        </div>
      </div>
    </footer>
  );
}
