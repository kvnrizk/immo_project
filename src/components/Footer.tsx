
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-foreground">Charbel's Agency</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Votre agent immobilier indépendant de confiance à Paris. 
              Accompagnement personnalisé pour tous vos projets immobiliers.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Nos Services</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link 
                  to="/buying" 
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Achat immobilier
                </Link>
              </li>
              <li>
                <Link 
                  to="/buying" 
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Vente immobilière
                </Link>
              </li>
              <li>
                <Link 
                  to="/renting" 
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Location longue durée
                </Link>
              </li>
              <li>
                <Link 
                  to="/short-term" 
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Location court durée
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <a
                href="tel:+33612345678"
                className="flex items-center gap-2 hover:text-primary-foreground transition-colors cursor-pointer"
              >
                <Phone size={16} className="text-black" />
                +33 6 12 34 56 78
              </a>
              <a
                href="mailto:csablouny@gmail.com"
                className="flex items-center gap-2 hover:text-primary-foreground transition-colors cursor-pointer"
              >
                <Mail size={16} className="text-black" />
                csablouny@gmail.com
              </a>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-black" />
                Paris et Île-de-France
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Charbel's Agency. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                Mentions légales
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
