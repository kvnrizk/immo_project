import pool from './database.js';

const createTables = async () => {
  const client = await pool.connect();

  try {
    console.log('🔧 Starting database initialization...');

    // Create properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('vente', 'location', 'saisonnier')),
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        bedrooms INTEGER,
        area INTEGER,
        images TEXT[],
        features TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Properties table created');

    // Create contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telephone VARCHAR(50),
        type_projet VARCHAR(50) NOT NULL,
        type_bien VARCHAR(50),
        nombre_pieces VARCHAR(10),
        surface_min INTEGER,
        surface_max INTEGER,
        budget_min INTEGER,
        budget_max INTEGER,
        localisation VARCHAR(255),
        delai VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'nouveau'
      );
    `);
    console.log('✅ Contacts table created');

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        guests INTEGER DEFAULT 1,
        total_price VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Bookings table created');

    // Create unavailable_dates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS unavailable_dates (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        unavailable_date DATE NOT NULL,
        reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Unavailable dates table created');

    // Insert sample data from your existing PropertyData.ts
    await client.query(`
      INSERT INTO properties (title, price, location, type, image, description, bedrooms, area, images, features)
      VALUES
        (
          'Appartement moderne centre-ville',
          '285 000 €',
          'Lyon 6ème',
          'vente',
          'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80',
          'Magnifique appartement de 85m² entièrement rénové avec goût, proche des commodités. Cet appartement bénéficie d''une exposition plein sud avec une vue dégagée. Il comprend un séjour spacieux, une cuisine équipée moderne, trois chambres dont une suite parentale avec dressing, et deux salles de bains. Le bien dispose également d''un balcon de 8m² et d''une cave. Proche métro et commerces.',
          3,
          85,
          ARRAY['https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=800&q=80'],
          ARRAY['Balcon 8m²', 'Cave', 'Exposition Sud', 'Proche métro', 'Cuisine équipée', 'Dressing']
        ),
        (
          'Maison familiale avec jardin',
          '1 200 €/mois',
          'Villeurbanne',
          'location',
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
          'Belle maison de 120m² avec jardin privatif, idéale pour une famille. Cette maison récente propose un espace de vie généreux avec un salon-séjour de 40m², une cuisine ouverte entièrement équipée, et 4 chambres confortables. Le jardin de 300m² est parfaitement entretenu avec terrasse et barbecue. Garage et parking privé disponibles.',
          4,
          120,
          ARRAY['https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
          ARRAY['Jardin 300m²', 'Garage', 'Terrasse', 'Barbecue', 'Parking privé', 'Cuisine équipée']
        ),
        (
          'Studio cosy Airbnb',
          '75 €/nuit',
          'Lyon 2ème',
          'saisonnier',
          'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80',
          'Studio parfaitement équipé en plein cœur de Lyon, idéal pour les voyageurs d''affaires. Situé au 3ème étage avec ascenseur, ce studio moderne offre tout le confort nécessaire avec un coin nuit, un espace de travail, une kitchenette équipée et une salle de bain moderne. Wifi haut débit et télévision inclus.',
          1,
          35,
          ARRAY['https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564540574859-0dfb63293365?auto=format&fit=crop&w=800&q=80'],
          ARRAY['Wifi haut débit', 'Ascenseur', 'Kitchenette', '3ème étage', 'Centre-ville', 'Meublé']
        ),
        (
          'Loft industriel',
          '520 000 €',
          'Lyon 7ème',
          'vente',
          'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80',
          'Loft unique de 150m² avec vue exceptionnelle, dans un quartier en pleine expansion.',
          2,
          150,
          ARRAY['https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80'],
          ARRAY['Vue exceptionnelle', 'Loft industriel', 'Quartier en expansion']
        ),
        (
          'Appartement T3 lumineux',
          '950 €/mois',
          'Caluire-et-Cuire',
          'location',
          'https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80',
          'T3 de 70m² avec balcon et vue dégagée, dans résidence récente avec parking.',
          2,
          70,
          ARRAY['https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80'],
          ARRAY['Balcon', 'Vue dégagée', 'Parking', 'Résidence récente']
        ),
        (
          'Appartement de charme',
          '90 €/nuit',
          'Lyon 5ème',
          'saisonnier',
          'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80',
          'Appartement de caractère dans le Vieux Lyon, décoré avec raffinement pour vos séjours. Ce bien de 60m² offre un cadre authentique avec ses pierres apparentes et ses poutres en bois. Il comprend une chambre spacieuse, un salon confortable, une cuisine équipée et une salle de bain moderne. Situé au cœur du quartier historique, à proximité des traboules et des restaurants typiques.',
          2,
          60,
          ARRAY['https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560472354-b43ff0c44a43?auto=format&fit=crop&w=800&q=80'],
          ARRAY['Vieux Lyon', 'Caractère authentique', 'Décoration raffinée', 'Centre historique', 'Pierres apparentes', 'Poutres en bois']
        )
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Sample properties inserted');

    // Get the IDs of inserted properties to use for unavailable dates
    const propertiesResult = await client.query(`
      SELECT id FROM properties WHERE type = 'saisonnier' ORDER BY id LIMIT 2;
    `);

    if (propertiesResult.rows.length >= 2) {
      const prop1Id = propertiesResult.rows[0].id;
      const prop2Id = propertiesResult.rows[1].id;

      await client.query(`
        INSERT INTO unavailable_dates (property_id, unavailable_date, reason)
        VALUES
          ($1, '2024-12-15', 'Booked'),
          ($1, '2024-12-16', 'Booked'),
          ($1, '2024-12-20', 'Booked'),
          ($1, '2024-12-25', 'Booked'),
          ($1, '2025-01-01', 'Booked'),
          ($2, '2024-12-15', 'Booked'),
          ($2, '2024-12-16', 'Booked'),
          ($2, '2024-12-20', 'Booked'),
          ($2, '2024-12-25', 'Booked'),
          ($2, '2025-01-01', 'Booked')
        ON CONFLICT DO NOTHING;
      `, [prop1Id, prop2Id]);
      console.log('✅ Sample unavailable dates inserted');
    }

    console.log('');
    console.log('🎉 Database initialization completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - properties');
    console.log('   - contacts');
    console.log('   - bookings');
    console.log('   - unavailable_dates');
    console.log('');
    console.log('✨ Sample data has been inserted');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

createTables();
