/**
 * Script to geocode properties that don't have coordinates
 *
 * Usage:
 *   tsx scripts/geocodeProperties.ts
 *
 * Make sure to set VITE_MAPBOX_TOKEN in .env file
 */

import 'dotenv/config';
import { properties } from '../src/data/PropertyData';
import * as fs from 'fs';
import * as path from 'path';

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
  if (!address || address.trim() === '') {
    console.error('Address is empty');
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxToken}&limit=1&country=FR`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Geocoding failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: MapboxGeocodeResponse = await response.json();

    if (!data.features || data.features.length === 0) {
      console.warn(`No results found for address: ${address}`);
      return null;
    }

    const [lng, lat] = data.features[0].center;
    console.log(`✓ Geocoded "${address}" -> ${lat}, ${lng}`);

    return { lat, lng };
  } catch (error) {
    console.error(`Error geocoding address "${address}":`, error);
    return null;
  }
}

async function main() {
  // Get Mapbox token from environment
  const mapboxToken = process.env.VITE_MAPBOX_TOKEN;

  if (!mapboxToken) {
    console.error('Error: VITE_MAPBOX_TOKEN environment variable is not set');
    console.error('Please add it to your .env file or set it before running this script');
    process.exit(1);
  }

  console.log('Starting geocoding process...\n');

  // Find properties without coordinates
  const propertiesWithoutCoords = properties.filter(p => !p.coordinates);

  if (propertiesWithoutCoords.length === 0) {
    console.log('All properties already have coordinates!');
    return;
  }

  console.log(`Found ${propertiesWithoutCoords.length} properties without coordinates\n`);

  // Geocode each property
  const geocodedProperties = new Map<number, Coordinates>();

  for (const property of propertiesWithoutCoords) {
    console.log(`Geocoding: ${property.title} (${property.location})`);

    const coords = await geocodeAddress(property.location, mapboxToken);

    if (coords) {
      geocodedProperties.set(property.id, coords);
    } else {
      console.error(`✗ Failed to geocode: ${property.title}`);
    }

    // Add delay to respect rate limits (600 requests per minute for Mapbox)
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n✓ Successfully geocoded ${geocodedProperties.size} out of ${propertiesWithoutCoords.length} properties\n`);

  // Display results
  console.log('Geocoding results:');
  console.log('==================\n');

  for (const [id, coords] of geocodedProperties.entries()) {
    const property = properties.find(p => p.id === id);
    console.log(`ID ${id}: ${property?.title}`);
    console.log(`  Location: ${property?.location}`);
    console.log(`  Coordinates: { lat: ${coords.lat}, lng: ${coords.lng} }`);
    console.log('');
  }

  // Provide code to update PropertyData.ts
  console.log('\n📝 To update your PropertyData.ts, add these coordinates to the respective properties:\n');
  console.log('---');

  for (const [id, coords] of geocodedProperties.entries()) {
    console.log(`// Property ID ${id}`);
    console.log(`coordinates: { lat: ${coords.lat}, lng: ${coords.lng} }`);
    console.log('');
  }
}

main().catch(console.error);
