import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1500);
    }
  }, []);

  const handleClose = (choice: 'accepted' | 'refused') => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem('cookie-consent', choice);
      setShowBanner(false);
      if (choice === 'accepted') {
        enableAnalytics();
      } else {
        disableAnalytics();
      }
    }, 400);
  };

  const handleAccept = () => handleClose('accepted');
  const handleRefuse = () => handleClose('refused');

  const enableAnalytics = () => {
    console.log('✅ Analytics enabled');
  };

  const disableAnalytics = () => {
    console.log('❌ Analytics disabled');
  };

  if (!showBanner) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-end justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop with gradient - blocks all interaction */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Banner */}
      <div className={`relative m-4 md:m-8 max-w-5xl w-full transform transition-all duration-500 ease-out ${isClosing ? 'translate-y-full opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
        <Card className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-background via-background to-primary/5">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Animated Icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
                  <div className="relative p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 shadow-lg">
                    <Cookie className="w-8 h-8 md:w-10 md:h-10 text-primary animate-in spin-in-180 duration-700" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Nous respectons votre vie privée
                  </h3>
                  <Shield className="w-5 h-5 text-primary hidden md:block" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Ce site utilise des cookies pour améliorer votre expérience.
                  Les cookies essentiels maintiennent votre session, tandis que les cookies d'analyse
                  nous aident à améliorer notre service.
                </p>
                <Link
                  to="/politique-cookies"
                  className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors group"
                >
                  En savoir plus
                  <Sparkles className="w-3 h-3 group-hover:scale-110 transition-transform" />
                </Link>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[200px]">
                <Button
                  onClick={handleAccept}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Cookie className="w-4 h-4 mr-2" />
                  Accepter tout
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefuse}
                  className="w-full hover:bg-muted/50 transition-all duration-300 border-primary/20"
                >
                  Essentiels uniquement
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CookieConsent;
