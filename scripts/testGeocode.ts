/**
 * Simple test script to verify geocoding functionality
 *
 * Usage:
 *   tsx scripts/testGeocode.ts
 */

import 'dotenv/config';

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapboxGeocodeResponse {
  features: Array<{
    center: [number, number];
    place_name: string;
    relevance: number;
  }>;
}

async function geocodeAddress(
  address: string,
  mapboxToken: string
): Promise<Coordinates | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxToken}&limit=1&country=FR`;

    console.log(`\nGeocoding: "${address}"`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`✗ Failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: MapboxGeocodeResponse = await response.json();

    if (!data.features || data.features.length === 0) {
      console.warn(`✗ No results found`);
      return null;
    }

    const [lng, lat] = data.features[0].center;
    const placeName = data.features[0].place_name;

    console.log(`✓ Success!`);
    console.log(`  Result: ${placeName}`);
    console.log(`  Coordinates: { lat: ${lat}, lng: ${lng} }`);

    return { lat, lng };
  } catch (error) {
    console.error(`✗ Error:`, error);
    return null;
  }
}

async function main() {
  const mapboxToken = process.env.VITE_MAPBOX_TOKEN;

  if (!mapboxToken) {
    console.error('Error: VITE_MAPBOX_TOKEN environment variable is not set');
    process.exit(1);
  }

  console.log('=== Geocoding Test ===\n');
  console.log('Testing with sample French addresses...\n');

  // Test addresses
  const testAddresses = [
    'Lyon 6ème',
    'Villeurbanne',
    'Lyon 2ème',
    'Paris, France',
    'Marseille, France'
  ];

  for (const address of testAddresses) {
    await geocodeAddress(address, mapboxToken);

    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n=== Test Complete ===');
}

main().catch(console.error);
