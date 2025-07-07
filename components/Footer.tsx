import React from 'react';
import { Link } from 'react-router-dom';
import { F1Logo } from './icons/F1Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-f1-light-dark border-t border-f1-gray mt-8">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <F1Logo className="h-10 w-auto text-f1-red" />
              <span className="text-white font-bold text-2xl tracking-wider">REPLAYS</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your ultimate source for Formula 1 full race replays, news, and articles.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Navigate</h3>
                    <ul className="mt-4 space-y-2">
                        <li><Link to="/" className="text-base text-gray-400 hover:text-white">Home</Link></li>
                        <li><Link to="/articles" className="text-base text-gray-400 hover:text-white">Articles</Link></li>
                        <li><Link to="/about" className="text-base text-gray-400 hover:text-white">About</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Admin</h3>
                    <ul className="mt-4 space-y-2">
                        <li><Link to="/admin/dashboard" className="text-base text-gray-400 hover:text-white">Admin Panel</Link></li>
                    </ul>
                </div>
                <div className="col-span-2 sm:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Disclaimer</h3>
                    <p className="mt-4 text-sm text-gray-400">
                        f1fullreplay.com is an independent fan project and is not affiliated with, endorsed by, or associated with Formula 1, FIA, or any of its official partners. All video content is provided via external embeds.
                    </p>
                </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-f1-gray text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} f1fullreplay.com. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
