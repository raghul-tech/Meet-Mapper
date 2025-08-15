import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, MapPin } from "lucide-react";
import type { Space } from "@shared/schema";

interface SpaceMapProps {
  spaces: Space[];
  userLocation: { lat: number; lng: number; name?: string } | null;
  selectedSpaceId: string | null;
  onSpaceSelect: (spaceId: string) => void;
  className?: string;
}

export function SpaceMap({ 
  spaces, 
  userLocation, 
  selectedSpaceId,
  onSpaceSelect,
  className = ""
}: SpaceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Load Leaflet dynamically
    const loadMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;

      // Load Leaflet CSS and JS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        if (document.head) {
          document.head.appendChild(link);
        }
      }

      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          if (document.head) {
            document.head.appendChild(script);
          }
        });
      }

      if (mapRef.current && !mapInstance && window.L) {
        const L = window.L;
        
        // Clear any existing map instance on the container
        if (mapRef.current._leaflet_id) {
          mapRef.current._leaflet_id = null;
        }
        
        // Default to Koramangala, Bengaluru if no user location
        const center = userLocation ? [userLocation.lat, userLocation.lng] : [12.9304278, 77.678404];
        
        try {
          const map = L.map(mapRef.current, {
            zoomControl: false,
          }).setView(center, 14);

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          setMapInstance(map);
        } catch (error) {
          console.error('Error creating map:', error);
        }
      }
    };

    loadMap();

    // Cleanup
    return () => {
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        setMapInstance(null);
      }
    };
  }, [mapInstance]);

  // Update markers when spaces, userLocation, or selectedSpaceId changes
  useEffect(() => {
    if (!mapInstance || !window.L) return;

    const L = window.L;

    // Clear existing markers
    markers.forEach(marker => mapInstance.removeLayer(marker));
    setMarkers([]);

    const newMarkers: any[] = [];

    // Add user location marker
    if (userLocation) {
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1
      }).addTo(mapInstance);

      userMarker.bindPopup("Your location").openPopup();
      newMarkers.push(userMarker);
    }

    // Add space markers
    spaces.forEach((space) => {
      const [lat, lng] = space.location.split(',').map(s => parseFloat(s.trim()));
      
      if (isNaN(lat) || isNaN(lng)) return;

      const price = space.priceperhr ? `₹${parseInt(space.priceperhr).toLocaleString()}` : "Contact";
      const isSelected = selectedSpaceId === space.spaceId;
      
      // Create custom marker icon
      const markerIcon = L.divIcon({
        html: `
          <div class="bg-white border-2 ${isSelected ? 'border-blue-600' : 'border-gray-300'} rounded-lg px-2 py-1 shadow-lg text-xs font-medium cursor-pointer hover:border-blue-600 transition-colors">
            ${price}/hr
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-r border-b ${isSelected ? 'border-blue-600' : 'border-gray-300'} rotate-45"></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [60, 30],
        iconAnchor: [30, 35]
      });

      const marker = L.marker([lat, lng], { 
        icon: markerIcon 
      }).addTo(mapInstance);

      marker.bindPopup(`
        <div class="text-sm">
          <h3 class="font-semibold mb-1">${space.spaceDisplayName || space.spaceName}</h3>
          <p class="text-gray-600 mb-2">${space.address.locality}, ${space.address.city}</p>
          <p class="font-medium text-blue-600">${price}/hr</p>
          <p class="text-xs text-gray-500 mt-1">Click to view details</p>
        </div>
      `);

      marker.on('click', () => {
        onSpaceSelect(space.spaceId);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit bounds to show all markers or center on user location
    if (newMarkers.length > 0) {
      const group = new L.featureGroup(newMarkers);
      mapInstance.fitBounds(group.getBounds(), { padding: [20, 20] });
    } else if (userLocation) {
      // If no markers but we have user location, center on it
      mapInstance.setView([userLocation.lat, userLocation.lng], 14);
    }
  }, [mapInstance, spaces, userLocation, selectedSpaceId, onSpaceSelect]);

  // Separate effect to handle location changes and re-center map
  useEffect(() => {
    if (!mapInstance || !userLocation) return;
    
    // Re-center map when user location changes
    mapInstance.setView([userLocation.lat, userLocation.lng], 14, {
      animate: true
    });
  }, [mapInstance, userLocation]);

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.zoomOut();
    }
  };

  return (
    <Card className={`h-full ${className}`}>
      <CardContent className="p-0 h-full relative" style={{ zIndex: 1 }}>
        {/* Map Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border">
            <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 bg-white shadow-sm"
              onClick={handleZoomIn}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 bg-white shadow-sm"
              onClick={handleZoomOut}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Map Container */}
        <div 
          ref={mapRef} 
          className="w-full h-full rounded-lg"
          style={{ minHeight: '400px' }}
        />
        
        {/* Loading state */}
        {!mapInstance && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading map...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
