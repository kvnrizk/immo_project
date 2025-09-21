
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 shadow-sm border-b transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-foreground hover:text-muted-foreground transition-colors">
              Clés de Paris
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/buying"
                className="text-foreground hover:text-muted-foreground px-3 py-2 text-sm font-medium transition-colors"
              >
                Achat
              </Link>
              <Link
                to="/renting"
                className="text-foreground hover:text-muted-foreground px-3 py-2 text-sm font-medium transition-colors"
              >
                Location
              </Link>
              <Link
                to="/short-term"
                className="text-foreground hover:text-muted-foreground px-3 py-2 text-sm font-medium transition-colors"
              >
                Court durée
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-muted-foreground px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-foreground hover:text-muted-foreground p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
              <Link
                to="/buying"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-muted-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Achat
              </Link>
              <Link
                to="/renting"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-muted-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Location
              </Link>
              <Link
                to="/short-term"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-muted-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Court durée
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-muted-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
