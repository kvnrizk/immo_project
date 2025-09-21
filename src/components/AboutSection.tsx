import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
const AboutSection = () => {
  const values = [{
    title: "Intégrité",
    description: "Transparence totale et honnêteté dans chaque transaction"
  }, {
    title: "Expertise",
    description: "Connaissance approfondie du marché immobilier français"
  }, {
    title: "Orientation client",
    description: "Vos objectifs et votre satisfaction sont ma priorité absolue"
  }];
  return <section id="a-propos" className="py-20 mt-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Votre partenaire immobilier de confiance
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>je suis ravi de vous accompagner dans le monde de l'immobilier. Fort d'une solide formation et d'une passion grandissante pour ce secteur, je me lance aujourd'hui comme agent immobilier indépendant.</p>
                <p>Ma mission est claire : vous offrir un accompagnement professionnel, transparent et bienveillant pour concrétiser vos projets immobiliers. Que vous soyez à la recherche de votre premier achat, que vous souhaitiez vendre votre bien, ou que vous envisagiez un investissement locatif, je mets toute mon énergie et ma détermination à votre service.</p>
                <p>Parce que chaque projet est unique, je prends le temps de comprendre vos besoins spécifiques et de vous guider pas à pas. Mon objectif est de faire de votre parcours immobilier une expérience sereine et réussie.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {values.map((value, index) => <div key={index} className="text-center">
                  <h3 className="font-semibold text-primary mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>)}
            </div>
          </div>

          <div className="relative">
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" alt="Professionnel de l'immobilier" className="w-full h-96 object-cover" />
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;