
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    typeProjet: '',
    typeBien: '',
    nombrePieces: '',
    surfaceMin: '',
    surfaceMax: '',
    budgetMin: '',
    budgetMax: '',
    localisation: '',
    delai: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.nom || !formData.email || !formData.typeProjet) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Simulation d'envoi
    console.log('Données du formulaire:', formData);
    
    toast({
      title: "Demande envoyée !",
      description: "Merci pour votre demande. Je vous recontacterai rapidement pour discuter de votre projet.",
    });

    // Reset du formulaire
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      typeProjet: '',
      typeBien: '',
      nombrePieces: '',
      surfaceMin: '',
      surfaceMax: '',
      budgetMin: '',
      budgetMax: '',
      localisation: '',
      delai: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Contactez-moi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Parlons de votre projet immobilier. Je suis à votre écoute pour vous 
            accompagner dans toutes vos démarches.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom complet *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Votre nom et prénom"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre.email@exemple.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Type de projet *</Label>
                    <Select value={formData.typeProjet} onValueChange={(value) => handleSelectChange('typeProjet', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="achat">Achat</SelectItem>
                        <SelectItem value="vente">Vente</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="investissement">Investissement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Type de bien</Label>
                    <Select value={formData.typeBien} onValueChange={(value) => handleSelectChange('typeBien', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="maison">Maison</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                        <SelectItem value="loft">Loft</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="commercial">Local commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Nombre de pièces</Label>
                    <Select value={formData.nombrePieces} onValueChange={(value) => handleSelectChange('nombrePieces', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nb pièces" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 pièce</SelectItem>
                        <SelectItem value="2">2 pièces</SelectItem>
                        <SelectItem value="3">3 pièces</SelectItem>
                        <SelectItem value="4">4 pièces</SelectItem>
                        <SelectItem value="5">5 pièces</SelectItem>
                        <SelectItem value="6+">6+ pièces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="surfaceMin">Surface min (m²)</Label>
                    <Input
                      id="surfaceMin"
                      name="surfaceMin"
                      type="number"
                      value={formData.surfaceMin}
                      onChange={handleInputChange}
                      placeholder="ex: 50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="surfaceMax">Surface max (m²)</Label>
                    <Input
                      id="surfaceMax"
                      name="surfaceMax"
                      type="number"
                      value={formData.surfaceMax}
                      onChange={handleInputChange}
                      placeholder="ex: 100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budgetMin">Budget min (€)</Label>
                    <Input
                      id="budgetMin"
                      name="budgetMin"
                      type="number"
                      value={formData.budgetMin}
                      onChange={handleInputChange}
                      placeholder="ex: 200000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="budgetMax">Budget max (€)</Label>
                    <Input
                      id="budgetMax"
                      name="budgetMax"
                      type="number"
                      value={formData.budgetMax}
                      onChange={handleInputChange}
                      placeholder="ex: 350000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="localisation">Localisation souhaitée</Label>
                    <Input
                      id="localisation"
                      name="localisation"
                      type="text"
                      value={formData.localisation}
                      onChange={handleInputChange}
                      placeholder="ex: Paris 15ème, Lyon centre..."
                    />
                  </div>

                  <div>
                    <Label>Délai souhaité</Label>
                    <Select value={formData.delai} onValueChange={(value) => handleSelectChange('delai', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent (&lt; 1 mois)</SelectItem>
                        <SelectItem value="court">Court terme (1-3 mois)</SelectItem>
                        <SelectItem value="moyen">Moyen terme (3-6 mois)</SelectItem>
                        <SelectItem value="long">Long terme (6+ mois)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message complémentaire</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez vos critères spécifiques, vos attentes ou toute information complémentaire..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium"
                >
                  Envoyer ma demande
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Mes coordonnées
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Téléphone</h4>
                    <p className="text-muted-foreground">+33 6 12 34 56 78</p>
                    <p className="text-sm text-muted-foreground">Disponible 7j/7 de 8h à 20h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Email</h4>
                    <p className="text-muted-foreground">contact@clesdeparis.fr</p>
                    <p className="text-sm text-muted-foreground">Réponse sous 24h garantie</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Zone d'intervention</h4>
                    <p className="text-muted-foreground">Lyon et métropole</p>
                    <p className="text-sm text-muted-foreground">Déplacements possibles en Rhône-Alpes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-6 rounded-xl">
              <h4 className="font-semibold text-foreground mb-3">
                Première consultation gratuite
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Je vous offre un premier rendez-vous sans engagement pour analyser 
                votre projet et vous présenter mes services. Cette consultation peut 
                se faire en présentiel ou en visioconférence selon vos préférences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
