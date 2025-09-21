
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const scrollToContact = () => {
    window.location.href = '/contact';
  };

  return (
    <section id="accueil" className="min-h-screen flex items-center bg-gradient-to-br from-primary/10 via-background to-muted/50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                ✨ Agent immobilier certifié à Paris
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Votre projet
                <span className="text-primary block">immobilier</span>
                entre de bonnes mains
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Spécialisé dans l'immobilier parisien, je vous accompagne avec expertise 
                dans tous vos projets : achat, vente, location et investissement locatif.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">Expertise du marché parisien</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">Accompagnement sur-mesure</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">Transparence garantie</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">Disponible 7j/7</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={scrollToContact}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Discutons de votre projet
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('biens')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-medium transition-all"
                >
                  Découvrir nos biens
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 h-96">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-primary/20 to-muted rounded-2xl overflow-hidden shadow-xl h-32">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80"
                    alt="Appartement parisien moderne"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-muted rounded-2xl overflow-hidden shadow-xl h-40">
                  <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80"
                    alt="Salon élégant"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-gradient-to-br from-primary/20 to-muted rounded-2xl overflow-hidden shadow-xl h-40">
                  <img
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80"
                    alt="Cuisine moderne"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-muted rounded-2xl overflow-hidden shadow-xl h-32">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80"
                    alt="Chambre design"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-xl shadow-2xl border">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Clients satisfaits</div>
              </div>
            </div>
            
            {/* Achievement Badge */}
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">98%</div>
                <div className="text-xs">Taux de réussite</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
