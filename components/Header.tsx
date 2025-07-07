import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { F1Logo } from './icons/F1Logo';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const activeLinkStyle = {
    color: '#e10600',
  };

  const navLinkClass = "text-gray-300 hover:text-f1-red px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors";

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const renderNavLinks = (isMobile = false) => {
    const mobileClass = isMobile ? 'block' : '';
    return (
      <>
        <NavLink
          to="/"
          end
          className={`${navLinkClass} ${mobileClass}`}
          style={({ isActive }) => (isActive ? activeLinkStyle : {})}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/articles"
          className={`${navLinkClass} ${mobileClass}`}
          style={({ isActive }) => (isActive ? activeLinkStyle : {})}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Articles
        </NavLink>
        <NavLink
          to="/about"
          className={`${navLinkClass} ${mobileClass}`}
          style={({ isActive }) => (isActive ? activeLinkStyle : {})}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          About
        </NavLink>
        
        {session ? (
           <>
            <NavLink
              to="/admin/dashboard"
              className={`${navLinkClass} ${mobileClass}`}
              style={({ isActive }) => (isActive ? activeLinkStyle : {})}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Panel
            </NavLink>
            <button onClick={handleLogout} className={`${navLinkClass} ${mobileClass} text-left w-full bg-f1-red/20 hover:bg-f1-red/50 text-f1-red hover:text-white`}>
              Logout
            </button>
          </>
        ) : (
          <NavLink
              to="/login"
              className={`${navLinkClass} ${mobileClass}`}
              style={({ isActive }) => (isActive ? activeLinkStyle : {})}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
          </NavLink>
        )}
      </>
    );
  };

  return (
    <header className="bg-f1-light-dark/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-f1-gray/30">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 text-white">
              <F1Logo className="h-8 w-auto text-f1-red" />
              <span className="font-black text-xl tracking-wider">
                F1 FULL <span className="text-f1-red">REPLAY</span>
              </span>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {renderNavLinks()}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="bg-f1-gray inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-f1-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-f1-dark focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks(true)}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;