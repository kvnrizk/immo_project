import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Send, Home, Building, KeyRound, TrendingUp } from 'lucide-react';
import { contactAPI } from '@/services/api';
const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    typeProjet: '',
    typeBien: '',
    nombrePieces: '',
    surfaceRange: [50, 150] as [number, number],
    budgetRange: [150000, 500000] as [number, number],
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

  const handleRangeChange = (name: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value as [number, number]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom || !formData.email || !formData.typeProjet) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive"
      });
      return;
    }

    try {
      await contactAPI.submit(formData);

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
        surfaceRange: [50, 150],
        budgetRange: [150000, 500000],
        localisation: '',
        delai: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive"
      });
    }
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

                  <div>
                    <Label className="text-sm font-semibold text-foreground mb-4">Type de projet *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'achat', label: 'Achat', icon: KeyRound },
                        { value: 'vente', label: 'Vente', icon: TrendingUp },
                        { value: 'location', label: 'Location', icon: Home },
                        { value: 'investissement', label: 'Investissement', icon: Building }
                      ].map(({ value, label, icon: Icon }) => (
                        <Button
                          key={value}
                          type="button"
                          variant={formData.typeProjet === value ? 'default' : 'outline'}
                          onClick={() => handleSelectChange('typeProjet', value)}
                          className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium"
                        >
                          <Icon size={20} />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-foreground mb-4">Type de bien</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'appartement', label: 'Appartement' },
                        { value: 'maison', label: 'Maison' },
                        { value: 'studio', label: 'Studio' },
                        { value: 'duplex', label: 'Duplex' },
                        { value: 'loft', label: 'Loft' },
                        { value: 'terrain', label: 'Terrain' },
                        { value: 'commercial', label: 'Commercial' }
                      ].map(({ value, label }) => (
                        <Button
                          key={value}
                          type="button"
                          variant={formData.typeBien === value ? 'default' : 'outline'}
                          onClick={() => handleSelectChange('typeBien', value)}
                          className="h-12 text-sm font-medium"
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground mb-4">Nombre de pièces</Label>
                      <div className="flex flex-wrap gap-3">
                        {['1', '2', '3', '4', '5', '6+'].map((pieces) => (
                          <Button
                            key={pieces}
                            type="button"
                            variant={formData.nombrePieces === pieces ? 'default' : 'outline'}
                            onClick={() => handleSelectChange('nombrePieces', pieces)}
                            className="h-12 w-16 text-sm font-medium"
                          >
                            {pieces}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold text-foreground mb-4">Surface souhaitée (m²)</Label>
                      <div className="px-4 my-4">
                        <Slider
                          value={formData.surfaceRange}
                          onValueChange={(value) => handleRangeChange('surfaceRange', value)}
                          max={300}
                          min={20}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                          <span>{formData.surfaceRange[0]} m²</span>
                          <span>{formData.surfaceRange[1]} m²</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-foreground mb-4">Budget souhaité (€)</Label>
                     <div className="px-4 my-4">
                      <Slider
                        value={formData.budgetRange}
                        onValueChange={(value) => handleRangeChange('budgetRange', value)}
                        max={1000000}
                        min={50000}
                        step={10000}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{formData.budgetRange[0].toLocaleString('fr-FR')} €</span>
                        <span>{formData.budgetRange[1].toLocaleString('fr-FR')} €</span>
                      </div>
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
                        <SelectTrigger className="h-12 text-base bg-background border border-input">
                          <SelectValue placeholder="Sélectionnez votre délai..." />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-input z-50">
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