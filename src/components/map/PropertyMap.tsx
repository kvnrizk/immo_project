import React, { useState, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import { Property } from '@/data/PropertyData';
import PropertyMapPopup from './PropertyMapPopup';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PropertyMapProps {
  properties: Property[];
}

const PropertyMap: React.FC<PropertyMapProps> = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 11
  });

  // Filter properties that have coordinates
  const mappableProperties = useMemo(() => {
    return properties.filter(property => property.coordinates);
  }, [properties]);

  // Get marker color based on property type
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'vente':
        return '#10b981'; // green
      case 'location':
        return '#3b82f6'; // blue
      case 'saisonnier':
        return '#f59e0b'; // amber
      default:
        return '#6b7280'; // gray
    }
  };

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="w-full h-[600px] rounded-lg overflow-hidden border flex items-center justify-center bg-muted">
        <div className="text-center p-8">
          <p className="text-lg font-semibold mb-2">Configuration requise</p>
          <p className="text-sm text-muted-foreground">
            La clé API Mapbox n'est pas configurée.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border">
      <style>{`
        .mapboxgl-popup-close-button {
          font-size: 24px;
          padding: 0 8px;
          right: 4px;
          top: 4px;
          color: #64748b;
          z-index: 10;
        }
        .mapboxgl-popup-close-button:hover {
          background-color: #f1f5f9;
          color: #0f172a;
        }
        .mapboxgl-popup-content {
          padding: 0 !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
        .property-popup .mapboxgl-popup-content {
          border-radius: 0.5rem;
          overflow: hidden;
        }
      `}</style>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
      >
        {/* Controls */}
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Property Markers */}
        {mappableProperties.map((property) => (
          <Marker
            key={property.id}
            longitude={property.coordinates!.lng}
            latitude={property.coordinates!.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              // Toggle: if clicking same marker, keep it open; if different, switch
              if (selectedProperty?.id !== property.id) {
                setSelectedProperty(property);
              }
            }}
          >
            <div className="cursor-pointer group relative">
              {/* Marker Pin */}
              <svg
                width="32"
                height="42"
                viewBox="0 0 32 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg transition-transform group-hover:scale-110"
              >
                <path
                  d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 42 16 42C16 42 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
                  fill={getMarkerColor(property.type)}
                />
                <circle cx="16" cy="16" r="6" fill="white" />
              </svg>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="text-xs font-semibold">{property.title}</p>
                <p className="text-xs text-muted-foreground">{property.price}</p>
              </div>
            </div>
          </Marker>
        ))}

        {/* Property Popup */}
        {selectedProperty && selectedProperty.coordinates && (
          <Popup
            longitude={selectedProperty.coordinates.lng}
            latitude={selectedProperty.coordinates.lat}
            anchor="bottom"
            onClose={() => setSelectedProperty(null)}
            closeButton={true}
            closeOnClick={false}
            offset={25}
            className="property-popup"
          >
            <PropertyMapPopup property={selectedProperty} />
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border z-10">
        <p className="text-xs font-semibold mb-2">Légende</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span className="text-xs">À vendre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span className="text-xs">À louer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
            <span className="text-xs">Location court durée</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
