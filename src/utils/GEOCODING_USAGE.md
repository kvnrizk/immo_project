# Geocoding Usage Guide

This project includes automatic geocoding functionality using the Mapbox Geocoding API to convert addresses to coordinates.

## Overview

Coordinates are retrieved from addresses using the **Mapbox Geocoding API**. The implementation includes:

1. **Utility Function** (`src/utils/geocoding.ts`) - Core geocoding functions
2. **Batch Script** (`scripts/geocodeProperties.ts`) - Batch geocode existing properties
3. **Test Script** (`scripts/testGeocode.ts`) - Test geocoding functionality

## Files

### Core Utility: `src/utils/geocoding.ts`

Contains two main functions:

- `geocodeAddress(address, mapboxToken)` - Geocode a single address
- `geocodeBatch(addresses, mapboxToken, delayMs)` - Geocode multiple addresses with rate limiting

### Scripts

- `scripts/geocodeProperties.ts` - Automatically geocode properties without coordinates
- `scripts/testGeocode.ts` - Test the geocoding with sample addresses

## Usage

### 1. Command Line Scripts

Run the batch geocoding script to add coordinates to properties that don't have them:

```bash
npm run geocode
```

Test the geocoding functionality:

```bash
npm run geocode:test
```

### 2. In React Components

#### Example: Geocoding an address when adding a new property

```typescript
import { geocodeAddress } from '@/utils/geocoding';

// In your component
const handleAddProperty = async (address: string) => {
  // Geocode the address
  const coordinates = await geocodeAddress(address);

  if (coordinates) {
    console.log('Coordinates:', coordinates);
    // Use coordinates: { lat: number, lng: number }

    const newProperty = {
      ...otherPropertyData,
      location: address,
      coordinates: coordinates
    };

    // Save property...
  } else {
    console.error('Failed to geocode address');
  }
};
```

#### Example: Using a React Hook

```typescript
import { useState } from 'react';
import { geocodeAddress } from '@/utils/geocoding';

export function useGeocode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const coordinates = await geocodeAddress(address);

      if (!coordinates) {
        throw new Error('Failed to geocode address');
      }

      return coordinates;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Geocoding failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { geocode, loading, error };
}

// Usage in component:
const { geocode, loading, error } = useGeocode();

const handleSubmit = async (address: string) => {
  const coords = await geocode(address);
  if (coords) {
    // Use coordinates
  }
};
```

#### Example: Geocoding on Form Submit

```typescript
import { geocodeAddress } from '@/utils/geocoding';
import { useForm } from 'react-hook-form';

interface PropertyFormData {
  title: string;
  location: string;
  // ... other fields
}

export function PropertyForm() {
  const { register, handleSubmit } = useForm<PropertyFormData>();

  const onSubmit = async (data: PropertyFormData) => {
    // Geocode the location
    const coordinates = await geocodeAddress(data.location);

    if (coordinates) {
      const propertyWithCoords = {
        ...data,
        coordinates
      };

      // Save property with coordinates
      console.log('Property with coordinates:', propertyWithCoords);
    } else {
      alert('Could not find coordinates for this address');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Title" />
      <input {...register('location')} placeholder="Address" />
      {/* ... other fields */}
      <button type="submit">Add Property</button>
    </form>
  );
}
```

### 3. Batch Geocoding Multiple Addresses

```typescript
import { geocodeBatch } from '@/utils/geocoding';

const addresses = [
  'Lyon 6ème',
  'Villeurbanne',
  'Paris, France'
];

const coordinates = await geocodeBatch(addresses);

coordinates.forEach((coord, index) => {
  if (coord) {
    console.log(`${addresses[index]}: ${coord.lat}, ${coord.lng}`);
  } else {
    console.log(`Failed to geocode: ${addresses[index]}`);
  }
});
```

## API Details

### geocodeAddress

```typescript
async function geocodeAddress(
  address: string,
  mapboxToken?: string
): Promise<Coordinates | null>
```

- **address**: The address to geocode (e.g., "Lyon 6ème", "Paris, France")
- **mapboxToken**: Optional Mapbox token (uses `VITE_MAPBOX_TOKEN` from env if not provided)
- **Returns**: `{ lat: number, lng: number }` or `null` if geocoding fails

### geocodeBatch

```typescript
async function geocodeBatch(
  addresses: string[],
  mapboxToken?: string,
  delayMs: number = 200
): Promise<(Coordinates | null)[]>
```

- **addresses**: Array of addresses to geocode
- **mapboxToken**: Optional Mapbox token
- **delayMs**: Delay between requests in milliseconds (default: 200ms to respect rate limits)
- **Returns**: Array of coordinates (same order as input, `null` for failed geocoding)

## Rate Limits

Mapbox Geocoding API has the following rate limits:
- **Free tier**: 100,000 requests/month
- **Rate limit**: 600 requests/minute

The `geocodeBatch` function includes a 200ms delay by default between requests to respect rate limits.

## Configuration

Make sure your `.env` file contains the Mapbox token:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Get your token from: https://www.mapbox.com/

## Current Implementation

Currently, in `src/data/PropertyData.ts`, coordinates are **hardcoded** for each property:

```typescript
{
  id: 1,
  title: "Appartement moderne centre-ville",
  location: "Lyon 6ème",
  coordinates: { lat: 45.7701, lng: 4.8522 },
  // ... other fields
}
```

The `PropertyMap` component (`src/components/map/PropertyMap.tsx:12-16`) filters properties to show only those with coordinates:

```typescript
const mappableProperties = useMemo(() => {
  return properties.filter(property => property.coordinates);
}, [properties]);
```

## Future Enhancements

- Add automatic geocoding when properties are created/edited through a form
- Cache geocoding results to avoid redundant API calls
- Add geocoding for user-submitted addresses in real-time
- Implement reverse geocoding (coordinates to address)
