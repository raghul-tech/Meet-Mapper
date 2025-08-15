import React, { useState, useEffect } from 'react';
import LocationSearch from './components/LocationSearch';
import FilterSidebar from './components/FilterSidebar';
import SpaceCard from './components/SpaceCard';
import SpaceMap from './components/SpaceMap';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  // Initialize location from localStorage or default
  const getInitialLocation = () => {
    try {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        const location = JSON.parse(savedLocation);
        // Check if saved location is still valid (not older than 24 hours)
        const savedTime = localStorage.getItem('userLocationTime');
        if (savedTime && Date.now() - parseInt(savedTime) < 24 * 60 * 60 * 1000) {
          return location;
        }
      }
    } catch (error) {
      console.error('Error loading saved location:', error);
    }
    // Fallback to default location
    return {
      name: 'Bangalore, Karnataka',
      lat: 12.9716,
      lng: 77.5946,
      isDefault: true
    };
  };

  const [currentLocation, setCurrentLocation] = useState(getInitialLocation());
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    capacityRange: [1, 20],
    facilities: [],
    rating: 0,
    distance: 25,
    sortBy: 'distance',
    sortOrder: 'asc'
  });
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  // Fetch spaces data
  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://gofloaters.web.app/spaces/nearby?lat=${currentLocation.lat}&lng=${currentLocation.lng}&spaceSubType=meetingSpace`
        );
        const data = await response.json();
        
        // Convert object to array
        const spacesArray = Object.entries(data).map(([key, space]) => ({
          ...space,
          spaceId: key,
        }));
        
        setSpaces(spacesArray);
      } catch (error) {
        console.error('Error fetching spaces:', error);
        setSpaces([]);
      }
      setLoading(false);
    };

    fetchSpaces();
  }, [currentLocation]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Filter and sort spaces
  useEffect(() => {
    let filtered = [...spaces];

    // First, filter by actual distance from current location (stricter validation)
    filtered = filtered.filter(space => {
      if (!space.address?.latitude || !space.address?.longitude) return false;
      
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        parseFloat(space.address.latitude),
        parseFloat(space.address.longitude)
      );
      
      // Only show spaces within 25km by default to avoid distant locations
      return distance <= 25;
    });

    // Add calculated distance to each space
    filtered = filtered.map(space => ({
      ...space,
      calculatedDistance: space.address?.latitude && space.address?.longitude 
        ? calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            parseFloat(space.address.latitude),
            parseFloat(space.address.longitude)
          )
        : null
    }));

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(space =>
        space.spaceName?.toLowerCase().includes(query) ||
        space.address?.area?.toLowerCase().includes(query) ||
        space.address?.city?.toLowerCase().includes(query)
      );
    }

    // Price filter
    if (filters.priceRange[1] < 5000) {
      filtered = filtered.filter(space => {
        const price = parseInt(space.priceperhr || "0");
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Capacity filter
    if (filters.capacityRange[1] < 20) {
      filtered = filtered.filter(space =>
        space.seatsAvailable >= filters.capacityRange[0] &&
        space.seatsAvailable <= filters.capacityRange[1]
      );
    }

    // Facility filter
    if (filters.facilities.length > 0) {
      filtered = filtered.filter(space => {
        const spaceFacilities = space.facilitiesList || [];
        return filters.facilities.every(facility =>
          spaceFacilities.includes(facility)
        );
      });
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(space => {
        const rating = parseFloat(space.googleRating || "0");
        return rating >= filters.rating;
      });
    }

    // Distance filter using calculated distance
    if (filters.distance < 50) {
      filtered = filtered.filter(space => {
        if (space.calculatedDistance === null) return false;
        return space.calculatedDistance <= filters.distance;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
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
          aValue = a.calculatedDistance || 999;
          bValue = b.calculatedDistance || 999;
          break;
      }
      
      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredSpaces(filtered);
  }, [spaces, searchQuery, filters]);

  const handleLocationSelect = (location) => {
    const newLocation = {
      name: location.description,
      lat: location.lat,
      lng: location.lng,
      isUserSelected: true,
      isCurrentLocation: false // Clear current location flag when manually selecting
    };
    
    setCurrentLocation(newLocation);
    
    // Save to localStorage
    try {
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
      localStorage.setItem('userLocationTime', Date.now().toString());
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        const newLocation = {
          name: `Current Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
          lat: latitude,
          lng: longitude,
          isCurrentLocation: true,
          timestamp: Date.now()
        };
        
        setCurrentLocation(newLocation);
        
        // Save current location and set as user preference
        try {
          localStorage.setItem('currentLocation', JSON.stringify(newLocation));
          localStorage.setItem('currentLocationTime', Date.now().toString());
          localStorage.setItem('userLocation', JSON.stringify(newLocation));
          localStorage.setItem('userLocationTime', Date.now().toString());
        } catch (error) {
          console.error('Error saving location:', error);
        }
        
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permission.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        alert(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Always get fresh location
      }
    );
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>GoFloaters</h1>
          </div>
          
          <div className="search-container">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              placeholder="Search for a city in India..."
            />
          </div>
          
          <div className="header-actions">
            <button 
              className={`location-btn ${currentLocation.isCurrentLocation ? 'active' : ''}`}
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
              title={currentLocation.isCurrentLocation ? 'Click to refresh your current location' : 'Click to use your current GPS location'}
            >
              <MapPin size={16} />
              {locationLoading ? 'Getting location...' : 
               currentLocation.isCurrentLocation ? 'Refresh location' : 'Use my location'}
            </button>
            <div className="user-avatar">U</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="search-filters-bar">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search meeting spaces by name or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchSuggestions(true);
              }}
              onFocus={() => setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              className="search-input"
            />
            
            {/* Search suggestions dropdown */}
            {searchQuery.trim() && showSearchSuggestions && (
              <div className="search-suggestions">
                {filteredSpaces.slice(0, 5).map(space => (
                  <div 
                    key={space.spaceId} 
                    className="search-suggestion-item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSearchQuery(space.spaceName);
                      setShowSearchSuggestions(false);
                    }}
                  >
                    <div className="suggestion-icon">
                      <MapPin size={16} />
                    </div>
                    <div className="suggestion-content">
                      <div className="suggestion-details">
                        <div className="suggestion-name">{space.spaceName}</div>
                        <div className="suggestion-location">
                          {space.address?.area}, {space.address?.city}
                          {space.calculatedDistance && <span> • {space.calculatedDistance.toFixed(1)} km</span>}
                        </div>
                      </div>
                      <div className="suggestion-price">₹{space.priceperhr}/hr</div>
                    </div>
                  </div>
                ))}
                {filteredSpaces.length === 0 && searchQuery.trim() && (
                  <div className="no-suggestions">
                    No meeting spaces found for "{searchQuery}"
                  </div>
                )}
                {filteredSpaces.length > 5 && (
                  <div className="more-suggestions">
                    +{filteredSpaces.length - 5} more spaces available
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button
            className={`filter-btn ${filters.facilities.length > 0 || filters.rating > 0 ? 'active' : ''}`}
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={20} />
            Filters & Sort
            {(filters.facilities.length > 0 || filters.rating > 0) && (
              <span className="active-badge">Active</span>
            )}
          </button>
        </div>

        <div className="results-info">
          <span>
            {filteredSpaces.length} meeting spaces found near {currentLocation.name}
            {locationLoading && <span className="location-updating"> (detecting your location...)</span>}
            {currentLocation.isDefault && <span className="default-location"> (default location)</span>}
            {currentLocation.isCurrentLocation && <span className="current-gps"> (your GPS location)</span>}
            {currentLocation.isUserSelected && <span className="user-selected"> (manually selected)</span>}
          </span>
          <span>Sorted by {filters.sortBy} ({filters.sortOrder === 'asc' ? 'low to high' : 'high to low'})</span>
        </div>

        <div className="content-grid">
          {/* Spaces List */}
          <div className="spaces-list">
            {loading ? (
              <div className="loading">Loading spaces...</div>
            ) : filteredSpaces.length === 0 ? (
              <div className="no-results">
                <MapPin size={48} />
                <h3>No spaces found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              filteredSpaces.map(space => (
                <SpaceCard key={space.spaceId} space={space} />
              ))
            )}
          </div>

          {/* Map */}
          <div className="map-container">
            <SpaceMap 
              spaces={filteredSpaces}
              center={currentLocation}
            />
          </div>
        </div>
      </main>

      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
}

export default App;