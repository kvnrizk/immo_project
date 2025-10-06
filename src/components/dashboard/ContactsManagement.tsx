
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar, Eye, Trash2 } from 'lucide-react';
import { contactAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  type_projet: string;
  type_bien: string;
  nombre_pieces: string;
  surface_min: number;
  surface_max: number;
  budget_min: number;
  budget_max: number;
  localisation: string;
  delai: string;
  message: string;
  status: string;
  created_at: string;
}

const ContactsManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactAPI.getAll();
      setContacts(data);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await contactAPI.updateStatus(id, newStatus);
      setContacts(prev =>
        prev.map(contact =>
          contact.id === id ? { ...contact, status: newStatus } : contact
        )
      );
      toast({
        title: "Succès",
        description: "Statut mis à jour",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau':
        return 'bg-blue-100 text-blue-800';
      case 'en cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'traité':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'nouveau': 'Nouveau',
      'en cours': 'En cours',
      'traité': 'Traité'
    };
    return labels[status] || status;
  };

  const getProjectTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'achat': 'Achat',
      'vente': 'Vente',
      'location': 'Location',
      'investissement': 'Investissement'
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="text-center py-12">Chargement des contacts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
              <div className="w-full">
                <div className="flex items-center justify-between md:block">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Total</p>
                  <Mail className="md:hidden h-6 w-6 text-primary" />
                </div>
                <p className="text-xl md:text-2xl font-bold mt-1">{contacts.length}</p>
              </div>
              <Mail className="hidden md:block h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
              <div className="w-full">
                <div className="flex items-center justify-between md:block">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Nouveaux</p>
                  <Badge className="md:hidden bg-blue-100 text-blue-800 text-xs">Nouveau</Badge>
                </div>
                <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                  {contacts.filter(c => c.status === 'nouveau').length}
                </p>
              </div>
              <Badge className="hidden md:block bg-blue-100 text-blue-800">Nouveau</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow col-span-2 md:col-span-1">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
              <div className="w-full">
                <div className="flex items-center justify-between md:block">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">En cours</p>
                  <Badge className="md:hidden bg-yellow-100 text-yellow-800 text-xs">En cours</Badge>
                </div>
                <p className="text-xl md:text-2xl font-bold text-yellow-600 mt-1">
                  {contacts.filter(c => c.status === 'en cours').length}
                </p>
              </div>
              <Badge className="hidden md:block bg-yellow-100 text-yellow-800">En cours</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucune demande de contact</p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-base md:text-lg">{contact.nom}</h3>
                        <Badge className={`md:hidden ${getStatusColor(contact.status)} text-xs`}>
                          {getStatusLabel(contact.status)}
                        </Badge>
                      </div>
                      <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3 mt-2 text-xs md:text-sm text-muted-foreground">
                        <span className="flex items-center truncate">
                          <Mail className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{contact.email}</span>
                        </span>
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                          {contact.telephone}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                          {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <Badge className={`hidden md:block ${getStatusColor(contact.status)}`}>
                      {getStatusLabel(contact.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <span className="font-medium">Projet:</span> {getProjectTypeLabel(contact.type_projet)}
                    </div>
                    <div>
                      <span className="font-medium">Type de bien:</span> {contact.type_bien}
                    </div>
                    <div>
                      <span className="font-medium">Pièces:</span> {contact.nombre_pieces}
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span> {contact.budget_min}€ - {contact.budget_max}€
                    </div>
                    <div>
                      <span className="font-medium">Surface:</span> {contact.surface_min}m² - {contact.surface_max}m²
                    </div>
                    <div>
                      <span className="font-medium">Délai:</span> {contact.delai}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {contact.localisation}
                      </span>
                    </div>
                  </div>

                  {contact.message && (
                    <div className="mb-3 p-3 bg-muted/50 rounded text-sm">
                      <span className="font-medium">Message:</span>
                      <p className="mt-1">{contact.message}</p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-2">
                    {contact.status !== 'en cours' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full md:w-auto"
                        onClick={() => handleStatusChange(contact.id, 'en cours')}
                      >
                        Marquer en cours
                      </Button>
                    )}
                    {contact.status !== 'traité' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full md:w-auto"
                        onClick={() => handleStatusChange(contact.id, 'traité')}
                      >
                        Marquer traité
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsManagement;
