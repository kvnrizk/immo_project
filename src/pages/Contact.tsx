import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
const Contact = () => {
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
    
    if (!formData.nom || !formData.email || !formData.typeProjet) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    console.log('Données du formulaire:', formData);
    
    toast({
      title: "Demande envoyée !",
      description: "Merci pour votre demande. Je vous recontacterai rapidement pour discuter de votre projet."
    });

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
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Contactez-moi
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discutons de votre projet immobilier. Je suis là pour vous accompagner 
            à chaque étape de votre parcours.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <Card className="shadow-2xl border-0 bg-card">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Parlez-moi de votre projet
                  </h2>
                  <p className="text-muted-foreground">
                    Remplissez ce formulaire et je vous recontacterai rapidement pour discuter de vos besoins.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom" className="text-sm font-semibold text-foreground mb-2">Nom complet *</Label>
                      <Input 
                        id="nom" 
                        name="nom" 
                        type="text" 
                        value={formData.nom} 
                        onChange={handleInputChange} 
                        placeholder="Votre nom et prénom" 
                        className="h-12 text-base" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="telephone" className="text-sm font-semibold text-foreground mb-2">Téléphone</Label>
                      <Input 
                        id="telephone" 
                        name="telephone" 
                        type="tel" 
                        value={formData.telephone} 
                        onChange={handleInputChange} 
                        placeholder="06 12 34 56 78" 
                        className="h-12 text-base" 
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground mb-2">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="votre.email@exemple.com" 
                      className="h-12 text-base" 
                      required 
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground mb-2">Type de projet *</Label>
                      <Select value={formData.typeProjet} onValueChange={(value) => handleSelectChange('typeProjet', value)}>
                        <SelectTrigger className="h-12 text-base">
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
                      <Label className="text-sm font-semibold text-foreground mb-2">Type de bien</Label>
                      <Select value={formData.typeBien} onValueChange={(value) => handleSelectChange('typeBien', value)}>
                        <SelectTrigger className="h-12 text-base">
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

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground mb-2">Nombre de pièces</Label>
                      <Select value={formData.nombrePieces} onValueChange={(value) => handleSelectChange('nombrePieces', value)}>
                        <SelectTrigger className="h-12 text-base">
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
                      <Label htmlFor="surfaceMin" className="text-sm font-semibold text-foreground mb-2">Surface min (m²)</Label>
                      <Input
                        id="surfaceMin"
                        name="surfaceMin"
                        type="number"
                        value={formData.surfaceMin}
                        onChange={handleInputChange}
                        placeholder="ex: 50"
                        className="h-12 text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="surfaceMax" className="text-sm font-semibold text-foreground mb-2">Surface max (m²)</Label>
                      <Input
                        id="surfaceMax"
                        name="surfaceMax"
                        type="number"
                        value={formData.surfaceMax}
                        onChange={handleInputChange}
                        placeholder="ex: 100"
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budgetMin" className="text-sm font-semibold text-foreground mb-2">Budget min (€)</Label>
                      <Input
                        id="budgetMin"
                        name="budgetMin"
                        type="number"
                        value={formData.budgetMin}
                        onChange={handleInputChange}
                        placeholder="ex: 200000"
                        className="h-12 text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="budgetMax" className="text-sm font-semibold text-foreground mb-2">Budget max (€)</Label>
                      <Input
                        id="budgetMax"
                        name="budgetMax"
                        type="number"
                        value={formData.budgetMax}
                        onChange={handleInputChange}
                        placeholder="ex: 350000"
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="localisation" className="text-sm font-semibold text-foreground mb-2">Localisation souhaitée</Label>
                      <Input
                        id="localisation"
                        name="localisation"
                        type="text"
                        value={formData.localisation}
                        onChange={handleInputChange}
                        placeholder="ex: Paris 15ème, Lyon centre..."
                        className="h-12 text-base"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-foreground mb-2">Délai souhaité</Label>
                      <Select value={formData.delai} onValueChange={(value) => handleSelectChange('delai', value)}>
                        <SelectTrigger className="h-12 text-base">
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
                    <Label htmlFor="message" className="text-sm font-semibold text-foreground mb-2">Message complémentaire</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleInputChange} 
                      placeholder="Décrivez vos critères spécifiques, vos attentes ou toute information complémentaire..." 
                      rows={4} 
                      className="resize-none text-base" 
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium flex items-center justify-center gap-2">
                    <Send size={20} />
                    Envoyer ma demande
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  Restons en contact
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 bg-muted rounded-xl">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                      <p className="text-lg text-foreground font-medium">+33 6 12 34 56 78</p>
                      <p className="text-sm text-muted-foreground">Disponible 7j/7 de 8h à 20h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-muted rounded-xl">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-lg text-foreground font-medium">contact@clesdeparis.fr</p>
                      <p className="text-sm text-muted-foreground">Réponse garantie sous 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-muted rounded-xl">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Zone d'intervention</h3>
                      <p className="text-lg text-foreground font-medium">Paris et Île-de-France</p>
                      <p className="text-sm text-muted-foreground">Déplacements possibles en région</p>
                    </div>
                  </div>

                  
                </div>
              </div>

              {/* CTA Card */}
              <Card className="bg-primary text-primary-foreground">
                
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Contact;