
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const ContactCard: React.FC = () => {
  const navigate = useNavigate();

  const handleContact = () => {
    navigate('/contact');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Intéressé par ce bien ?</h3>
        <Button 
          onClick={handleContact}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Contacter l'agent
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
