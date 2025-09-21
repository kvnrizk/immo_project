
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ServicesSection = () => {
  const services = [
    {
      title: "Achat immobilier",
      description: "Je vous accompagne dans la recherche et l'acquisition de votre bien idéal. Négociation, conseils juridiques et suivi complet jusqu'à la signature.",
      icon: "🏠"
    },
    {
      title: "Vente immobilière",
      description: "Estimation précise, mise en valeur de votre bien, marketing ciblé et négociation pour obtenir le meilleur prix dans les délais optimaux.",
      icon: "💰"
    },
    {
      title: "Location longue durée",
      description: "Gestion locative complète : recherche de locataires, rédaction de bail, état des lieux et suivi de la relation locative.",
      icon: "🔑"
    },
    {
      title: "Location court durée",
      description: "Optimisation Airbnb : création d'annonces attractives, gestion des réservations, optimisation des revenus et service conciergerie.",
      icon: "🌟"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Mes services immobiliers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un accompagnement sur-mesure pour tous vos projets immobiliers, 
            de l'achat à la gestion locative en passant par la vente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-shadow duration-300 border">
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
