
import React, { useState, useEffect } from 'react';
import { Menu, Home, ShoppingBag, Key, Calendar, Mail, Heart, GitCompare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useComparison } from '@/contexts/ComparisonContext';
import PropertyComparison from '@/components/PropertyComparison';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const location = useLocation();
  const { favorites } = useFavorites();
  const { comparisonList } = useComparison();

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
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-8">
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

            {/* Favorites and Comparison Actions */}
            <div className="flex items-center gap-2 border-l pl-6">
              <Link to="/favorites">
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="w-5 h-5" />
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setComparisonOpen(true)}
                disabled={comparisonList.length === 0}
              >
                <GitCompare className="w-5 h-5" />
                {comparisonList.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {comparisonList.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="text-foreground hover:text-muted-foreground p-2 transition-colors"
                  aria-label="Menu"
                >
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader className="mb-8">
                  <SheetTitle className="text-2xl font-bold text-left">
                    Clés de Paris
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-1">
                  <Link
                    to="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      location.pathname === '/'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={20} />
                    Accueil
                  </Link>

                  <Link
                    to="/buying"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      location.pathname === '/buying'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag size={20} />
                    Achat
                  </Link>

                  <Link
                    to="/renting"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      location.pathname === '/renting'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Key size={20} />
                    Location
                  </Link>

                  <Link
                    to="/short-term"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      location.pathname === '/short-term'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar size={20} />
                    Court durée
                  </Link>

                  <Link
                    to="/contact"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      location.pathname === '/contact'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Mail size={20} />
                    Contact
                  </Link>

                  <div className="border-t my-2 pt-2">
                    <Link
                      to="/favorites"
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        location.pathname === '/favorites'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Heart size={20} />
                        Favoris
                      </div>
                      {favorites.length > 0 && (
                        <Badge variant="secondary">
                          {favorites.length}
                        </Badge>
                      )}
                    </Link>

                    <button
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        setComparisonOpen(true);
                        setIsMenuOpen(false);
                      }}
                      disabled={comparisonList.length === 0}
                    >
                      <div className="flex items-center gap-3">
                        <GitCompare size={20} />
                        Comparer
                      </div>
                      {comparisonList.length > 0 && (
                        <Badge variant="secondary">
                          {comparisonList.length}
                        </Badge>
                      )}
                    </button>
                  </div>
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-xs text-muted-foreground text-center">
                    © 2025 Clés de Paris
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Property Comparison Modal */}
      <PropertyComparison open={comparisonOpen} onOpenChange={setComparisonOpen} />
    </nav>
  );
};

export default Navigation;
