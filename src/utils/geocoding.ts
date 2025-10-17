/**
 * Geocoding utility using Mapbox Geocoding API
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

interface MapboxGeocodeResponse {
  features: Array<{
    center: [number, number]; // [longitude, latitude]
    place_name: string;
    relevance: number;
  }>;
}

/**
 * Geocode an address to get coordinates using Mapbox Geocoding API
 * @param address - The address to geocode
 * @param mapboxToken - Mapbox API token
 * @returns Coordinates or null if geocoding fails
 */
export async function geocodeAddress(
  address: string,
  mapboxToken?: string
): Promise<Coordinates | null> {
  const token = mapboxToken || import.meta.env.VITE_MAPBOX_TOKEN;

  if (!token) {
    console.error('Mapbox token is not configured');
    return null;
  }

  if (!address || address.trim() === '') {
    console.error('Address is empty');
    return null;
  }

  try {
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address);

    // Mapbox Geocoding API endpoint
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}&limit=1`;

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

    // Get the first (most relevant) result
    const [lng, lat] = data.features[0].center;

    return {
      lat,
      lng
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

/**
 * Geocode multiple addresses in batch
 * @param addresses - Array of addresses to geocode
 * @param mapboxToken - Mapbox API token
 * @param delayMs - Delay between requests in milliseconds (to respect rate limits)
 * @returns Array of coordinates (null for failed geocoding)
 */
export async function geocodeBatch(
  addresses: string[],
  mapboxToken?: string,
  delayMs: number = 200
): Promise<(Coordinates | null)[]> {
  const results: (Coordinates | null)[] = [];

  for (const address of addresses) {
    const coords = await geocodeAddress(address, mapboxToken);
    results.push(coords);

    // Add delay between requests to respect rate limits
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}
