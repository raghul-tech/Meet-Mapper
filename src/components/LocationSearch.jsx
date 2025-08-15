import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const LocationSearch = ({ onLocationSelect, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Indian cities data
  const indianCities = [
    { name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
    { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
    { name: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
    { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
    { name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
    { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
    { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
    { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
    { name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
    { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
    { name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
    { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
    { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
    { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
    { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
    { name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
    { name: "Vadodara", state: "Gujarat", lat: 22.3072, lng: 73.1812 },
    { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
    { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
    { name: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.3910 },
    { name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794 },
    { name: "Gurgaon", state: "Haryana", lat: 28.4595, lng: 77.0266 },
    { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366 }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setIsLoading(true);
    setShowPredictions(true);

    // Filter cities that start with the search query
    const filtered = indianCities
      .filter(city => 
        city.name.toLowerCase().startsWith(query.toLowerCase()) ||
        city.state.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 6)
      .map(city => ({
        placeId: `${city.name}-${city.state}`,
        description: `${city.name}, ${city.state}, India`,
        lat: city.lat,
        lng: city.lng
      }));

    setTimeout(() => {
      setPredictions(filtered);
      setIsLoading(false);
    }, 100);
  };

  const handleSelectPlace = (prediction) => {
    setSearchQuery(prediction.description);
    setShowPredictions(false);
    onLocationSelect(prediction);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPredictions([]);
    setShowPredictions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="location-search">
      <div className="location-search-input">
        <Search className="search-icon" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="input"
        />
        {searchQuery && (
          <button onClick={clearSearch} className="clear-btn">
            <X size={16} />
          </button>
        )}
      </div>

      {showPredictions && (
        <div className="predictions-dropdown">
          {isLoading ? (
            <div className="loading-item">Searching...</div>
          ) : predictions.length > 0 ? (
            predictions.map((prediction) => (
              <div
                key={prediction.placeId}
                className="prediction-item"
                onClick={() => handleSelectPlace(prediction)}
              >
                <div className="prediction-content">
                  <div className="prediction-main">{prediction.description.split(',')[0]}</div>
                  <div className="prediction-sub">{prediction.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results-item">No cities found</div>
          )}
        </div>
      )}

      <style jsx>{`
        .location-search {
          position: relative;
          width: 100%;
        }

        .location-search-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #6b7280;
          z-index: 1;
        }

        .input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .clear-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .predictions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          margin-top: 4px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          z-index: 50;
          max-height: 300px;
          overflow-y: auto;
        }

        .prediction-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
          transition: all 0.2s;
        }

        .prediction-item:hover {
          background: #f9fafb;
        }

        .prediction-item:last-child {
          border-bottom: none;
        }

        .prediction-content {
          display: flex;
          flex-direction: column;
        }

        .prediction-main {
          font-weight: 500;
          color: #111827;
          font-size: 14px;
        }

        .prediction-sub {
          color: #6b7280;
          font-size: 12px;
          margin-top: 2px;
        }

        .loading-item, .no-results-item {
          padding: 12px 16px;
          color: #6b7280;
          text-align: center;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default LocationSearch;