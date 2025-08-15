import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Users, Wifi, DollarSign, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SpaceCard } from "@/components/space-card";
import { SpaceMap } from "@/components/space-map";
import { LocationModal } from "@/components/location-modal";
import { LoadingOverlay } from "@/components/loading-overlay";
import { LocationSearch } from "@/components/location-search";
import { FilterSidebar, type FilterOptions } from "@/components/filter-sidebar";
import { useGeolocation } from "@/hooks/use-geolocation";
import { searchNearbySpaces } from "@/lib/api";
import type { Space } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const { coordinates, error, loading, getCurrentPosition, clearError } = useGeolocation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hasTriedLocation, setHasTriedLocation] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 5000],
    capacityRange: [1, 20],
    facilities: [],
    rating: 0,
    distance: 25,
    sortBy: 'distance',
    sortOrder: 'asc'
  });

  // Default location (Koramangala, Bengaluru) if user doesn't provide location
  const defaultLocation = { lat: 12.9304278, lng: 77.678404, name: "Koramangala, Bengaluru" };
  const currentSearchLocation = searchLocation || 
    (coordinates ? { lat: coordinates.latitude, lng: coordinates.longitude, name: "Your location" } : defaultLocation);

  // Show location modal on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasTriedLocation && !coordinates) {
        setShowLocationModal(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [hasTriedLocation, coordinates]);

  // Fetch spaces
  const { 
    data: spacesData, 
    isLoading, 
    error: apiError, 
    refetch 
  } = useQuery({
    queryKey: ["/api/spaces/nearby", currentSearchLocation.lat, currentSearchLocation.lng, searchQuery],
    queryFn: () => searchNearbySpaces({
      lat: currentSearchLocation.lat,
      lng: currentSearchLocation.lng,
      spaceSubType: "meetingSpace",
      query: searchQuery || undefined,
    }),
    enabled: true, // Always enabled, will use default location if needed
  });

  // Convert spaces data to array and apply filters
  const spaces: Space[] = useMemo(() => {
    if (!spacesData) return [];
    
    let filteredSpaces = Object.entries(spacesData).map(([key, space]) => ({
      ...space,
      spaceId: key,
    }));

    // Apply filters
    filteredSpaces = filteredSpaces.filter(space => {
      // Budget filter - check if price is within range
      const price = parseInt(space.priceperhr || "0");
      if (filters.priceRange[1] < 5000) { // Only apply if not default max
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false;
        }
      }

      // Team size filter - check if capacity matches
      if (filters.capacityRange[1] < 20) { // Only apply if not default max
        if (space.seatsAvailable < filters.capacityRange[0] || space.seatsAvailable > filters.capacityRange[1]) {
          return false;
        }
      }

      // Facilities filter
      if (filters.facilities.length > 0) {
        const hasAllFacilities = filters.facilities.every(facility => 
          space.facilitiesList?.includes(facility)
        );
        if (!hasAllFacilities) return false;
      }

      // Rating filter
      const rating = parseFloat(space.googleRating || "0");
      if (rating < filters.rating) return false;

      // Distance filter (parse distance from string like "4.9 km away")
      if (space.distance) {
        const distanceMatch = space.distance.match(/(\d+\.?\d*)/);
        const distance = distanceMatch ? parseFloat(distanceMatch[1]) : 0;
        if (distance > filters.distance) return false;
      }

      return true;
    });

    // Apply sorting
    filteredSpaces.sort((a, b) => {
      let aValue: number, bValue: number;

      switch (filters.sortBy) {
        case 'price':
          aValue = parseInt(a.priceperhr || "0");
          bValue = parseInt(b.priceperhr || "0");
          break;
        case 'rating':
          aValue = parseFloat(a.googleRating || "0");
          bValue = parseFloat(b.googleRating || "0");
          break;
        case 'capacity':
          aValue = a.seatsAvailable || 0;
          bValue = b.seatsAvailable || 0;
          break;
        case 'distance':
        default:
          // Parse distance from string
          const aDistanceMatch = a.distance?.match(/(\d+\.?\d*)/);
          const bDistanceMatch = b.distance?.match(/(\d+\.?\d*)/);
          aValue = aDistanceMatch ? parseFloat(aDistanceMatch[1]) : 999;
          bValue = bDistanceMatch ? parseFloat(bDistanceMatch[1]) : 999;
          break;
      }

      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filteredSpaces;
  }, [spacesData, filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationSelect = (location: { lat: number; lng: number; description: string }) => {
    setSearchLocation({ 
      lat: location.lat, 
      lng: location.lng, 
      name: location.description 
    });
    setHasTriedLocation(true);
  };

  const handleSpaceSelect = (spaceId: string) => {
    setSelectedSpaceId(spaceId);
    // Scroll to the selected space card on mobile
    const element = document.querySelector(`[data-space-id="${spaceId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAllowLocation = async () => {
    setHasTriedLocation(true);
    clearError();
    // Clear manual location selection so GPS coordinates take priority
    setSearchLocation(null);
    await getCurrentPosition();
  };

  const handleDenyLocation = () => {
    setHasTriedLocation(true);
    toast({
      title: "Using default location",
      description: "Showing spaces near Koramangala, Bengaluru. You can enable location access anytime.",
    });
  };

  const handleUseMyLocation = async () => {
    if (loading) return;
    clearError();
    // Clear manual location selection so GPS coordinates take priority
    setSearchLocation(null);
    await getCurrentPosition();
  };

  // Show error toast for geolocation errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Location Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Show error toast for API errors
  useEffect(() => {
    if (apiError) {
      toast({
        title: "Search Error",
        description: "Failed to load spaces. Please try again.",
        variant: "destructive",
      });
    }
  }, [apiError, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-semibold text-blue-600">GoFloaters</div>
            </div>
            
            {/* Location Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <LocationSearch
                onLocationSelect={handleLocationSelect}
                placeholder="Search for a city or location in India..."
                className="w-full"
              />
            </div>
            
            {/* Location & Profile */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={handleUseMyLocation}
                disabled={loading}
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {loading ? "Getting location..." : "Use my location"}
                </span>
              </Button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Search and Filters Bar */}
          <div className="mb-6 space-y-4">
            {/* Search and Filter Controls - Prominent Position */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text" 
                    placeholder="Search meeting spaces by name or location..." 
                    className="pl-10 pr-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all font-medium"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="h-5 w-5" />
                Filters & Sort
                {(filters.facilities.length > 0 || filters.rating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 ml-1 text-xs">
                    Active
                  </Badge>
                )}
              </Button>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-900">{spaces.length}</span> meeting spaces found near{" "}
                <span className="font-medium">
                  {searchLocation ? `${searchLocation.name} (manually selected)` : 
                   coordinates ? "Your location (GPS)" : 
                   "Koramangala, Bengaluru (default)"}
                </span>
              </div>
              <div className="hidden sm:block">
                Sorted by {filters.sortBy} ({filters.sortOrder === 'asc' ? 'low to high' : 'high to low'})
              </div>
            </div>
          </div>

          {/* Split Layout: Cards + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-240px)]">
            
            {/* Space Cards Section */}
            <div className="overflow-y-auto space-y-4 pr-2 max-h-[calc(100vh-240px)]">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="animate-pulse">
                        <div className="flex space-x-4">
                          <div className="bg-gray-300 rounded-lg w-48 h-24"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : spaces.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces found</h3>
                  <p className="text-gray-600">
                    {searchQuery 
                      ? `No meeting spaces found matching "${searchQuery}"`
                      : "No meeting spaces found in this area"
                    }
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                spaces.map((space) => (
                  <div key={space.spaceId} data-space-id={space.spaceId}>
                    <SpaceCard 
                      space={space} 
                      onSelect={handleSpaceSelect}
                    />
                  </div>
                ))
              )}
              
              {/* Load More Button - Future enhancement */}
              {spaces.length > 0 && (
                <div className="text-center py-4">
                  <Button 
                    variant="outline"
                    className="rounded-full"
                    onClick={() => toast({ title: "Feature coming soon!", description: "Load more functionality will be available soon." })}
                  >
                    Load More Spaces
                  </Button>
                </div>
              )}
            </div>
            
            {/* Map Section */}
            <div className="h-[calc(100vh-240px)]">
              <SpaceMap 
                spaces={spaces}
                userLocation={currentSearchLocation}
                selectedSpaceId={selectedSpaceId}
                onSpaceSelect={handleSpaceSelect}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Location Modal */}
      <LocationModal
        open={showLocationModal}
        onOpenChange={setShowLocationModal}
        onAllowLocation={handleAllowLocation}
        onDenyLocation={handleDenyLocation}
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Loading Overlay */}
      <LoadingOverlay 
        show={loading}
        message="Getting your location..."
      />
    </div>
  );
}
