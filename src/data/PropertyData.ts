
export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  type: 'vente' | 'location' | 'saisonnier';
  image: string;
  description: string;
  bedrooms?: number;
  area?: number;
  images?: string[];
  features?: string[];
  isActive?: boolean;
}

export const properties: Property[] = [
  {
    id: 1,
    title: "Appartement moderne centre-ville",
    price: "285 000 €",
    location: "Lyon 6ème",
    type: "vente",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
    description: "Magnifique appartement de 85m² entièrement rénové avec goût, proche des commodités. Cet appartement bénéficie d'une exposition plein sud avec une vue dégagée. Il comprend un séjour spacieux, une cuisine équipée moderne, trois chambres dont une suite parentale avec dressing, et deux salles de bains. Le bien dispose également d'un balcon de 8m² et d'une cave. Proche métro et commerces.",
    bedrooms: 3,
    area: 85,
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Balcon 8m²", "Cave", "Exposition Sud", "Proche métro", "Cuisine équipée", "Dressing"]
  },
  {
    id: 2,
    title: "Maison familiale avec jardin",
    price: "1 200 €/mois",
    location: "Villeurbanne",
    type: "location",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
    description: "Belle maison de 120m² avec jardin privatif, idéale pour une famille. Cette maison récente propose un espace de vie généreux avec un salon-séjour de 40m², une cuisine ouverte entièrement équipée, et 4 chambres confortables. Le jardin de 300m² est parfaitement entretenu avec terrasse et barbecue. Garage et parking privé disponibles.",
    bedrooms: 4,
    area: 120,
    images: [
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Jardin 300m²", "Garage", "Terrasse", "Barbecue", "Parking privé", "Cuisine équipée"]
  },
  {
    id: 3,
    title: "Studio cosy Airbnb",
    price: "75 €/nuit",
    location: "Lyon 2ème",
    type: "saisonnier",
    image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80",
    description: "Studio parfaitement équipé en plein cœur de Lyon, idéal pour les voyageurs d'affaires. Situé au 3ème étage avec ascenseur, ce studio moderne offre tout le confort nécessaire avec un coin nuit, un espace de travail, une kitchenette équipée et une salle de bain moderne. Wifi haut débit et télévision inclus.",
    bedrooms: 1,
    area: 35,
    images: [
      "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564540574859-0dfb63293365?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Wifi haut débit", "Ascenseur", "Kitchenette", "3ème étage", "Centre-ville", "Meublé"]
  },
  {
    id: 4,
    title: "Loft industriel",
    price: "520 000 €",
    location: "Lyon 7ème",
    type: "vente",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
    description: "Loft unique de 150m² avec vue exceptionnelle, dans un quartier en pleine expansion.",
    bedrooms: 2,
    area: 150,
    images: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Vue exceptionnelle", "Loft industriel", "Quartier en expansion"]
  },
  {
    id: 5,
    title: "Appartement T3 lumineux",
    price: "950 €/mois",
    location: "Caluire-et-Cuire",
    type: "location",
    image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80",
    description: "T3 de 70m² avec balcon et vue dégagée, dans résidence récente avec parking.",
    bedrooms: 2,
    area: 70,
    images: [
      "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Balcon", "Vue dégagée", "Parking", "Résidence récente"]
  },
  {
    id: 6,
    title: "Appartement de charme",
    price: "90 €/nuit",
    location: "Lyon 5ème",
    type: "saisonnier",
    image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80",
    description: "Appartement de caractère dans le Vieux Lyon, décoré avec raffinement pour vos séjours. Ce bien de 60m² offre un cadre authentique avec ses pierres apparentes et ses poutres en bois. Il comprend une chambre spacieuse, un salon confortable, une cuisine équipée et une salle de bain moderne. Situé au cœur du quartier historique, à proximité des traboules et des restaurants typiques.",
    bedrooms: 2,
    area: 60,
    images: [
      "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560472354-b43ff0c44a43?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Vieux Lyon", "Caractère authentique", "Décoration raffinée", "Centre historique", "Pierres apparentes", "Poutres en bois"]
  }
];

export const unavailableDates = [
  new Date(2024, 11, 15), // December 15, 2024
  new Date(2024, 11, 16), // December 16, 2024
  new Date(2024, 11, 20), // December 20, 2024
  new Date(2024, 11, 25), // December 25, 2024
  new Date(2025, 0, 1),   // January 1, 2025
  new Date(2025, 0, 10),  // January 10, 2025
  new Date(2025, 0, 15),  // January 15, 2025
];
