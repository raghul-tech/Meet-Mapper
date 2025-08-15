import React, { useState } from 'react';
import { X, SlidersHorizontal, Star, MapPin, DollarSign, Users, Wifi, Car, Coffee, Monitor } from 'lucide-react';

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const facilityOptions = [
    { id: 'AC', label: 'Air Conditioning', icon: Monitor },
    { id: 'Hi Speed WiFi', label: 'WiFi', icon: Wifi },
    { id: 'Paid Parking', label: 'Parking', icon: Car },
    { id: 'Coffee/Tea', label: 'Coffee/Tea', icon: Coffee },
  ];

  const sortOptions = [
    { value: 'distance', label: 'Distance', icon: MapPin },
    { value: 'price', label: 'Price', icon: DollarSign },
    { value: 'rating', label: 'Rating', icon: Star },
    { value: 'capacity', label: 'Capacity', icon: Users }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleFacilityToggle = (facilityId) => {
    const updatedFacilities = localFilters.facilities.includes(facilityId)
      ? localFilters.facilities.filter(f => f !== facilityId)
      : [...localFilters.facilities, facilityId];
    
    handleFilterChange('facilities', updatedFacilities);
  };

  const resetFilters = () => {
    const defaultFilters = {
      priceRange: [0, 5000],
      capacityRange: [1, 20],
      facilities: [],
      rating: 0,
      distance: 25,
      sortBy: 'distance',
      sortOrder: 'asc'
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="backdrop" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="filter-sidebar">
        <div className="sidebar-content">
          {/* Header */}
          <div className="sidebar-header">
            <div className="header-left">
              <SlidersHorizontal size={20} />
              <h2>Filters</h2>
            </div>
            <button onClick={onClose} className="close-btn">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="sidebar-body">
            
            {/* Sort By */}
            <div className="filter-section">
              <h3>Sort By</h3>
              <div className="sort-options">
                {sortOptions.map(option => (
                  <div
                    key={option.value}
                    className={`sort-option ${localFilters.sortBy === option.value ? 'active' : ''}`}
                    onClick={() => handleFilterChange('sortBy', option.value)}
                  >
                    <option.icon size={16} />
                    <span>{option.label}</span>
                    {localFilters.sortBy === option.value && <span className="check">✓</span>}
                  </div>
                ))}
                
                {/* Sort Order */}
                <div className="sort-order">
                  <label>
                    <input
                      type="radio"
                      name="sortOrder"
                      value="asc"
                      checked={localFilters.sortOrder === 'asc'}
                      onChange={() => handleFilterChange('sortOrder', 'asc')}
                    />
                    Low to High
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sortOrder"
                      value="desc"
                      checked={localFilters.sortOrder === 'desc'}
                      onChange={() => handleFilterChange('sortOrder', 'desc')}
                    />
                    High to Low
                  </label>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="filter-section">
              <h3>Budget (per hour)</h3>
              <div className="range-input">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                />
                <div className="range-labels">
                  <span>₹0</span>
                  <span>₹{localFilters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Team Size */}
            <div className="filter-section">
              <h3>Team Size</h3>
              <div className="range-input">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={localFilters.capacityRange[1]}
                  onChange={(e) => handleFilterChange('capacityRange', [1, parseInt(e.target.value)])}
                />
                <div className="range-labels">
                  <span>1</span>
                  <span>{localFilters.capacityRange[1]} people</span>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="filter-section">
              <h3>Facilities</h3>
              <div className="facilities-grid">
                {facilityOptions.map(facility => (
                  <div
                    key={facility.id}
                    className={`facility-option ${localFilters.facilities.includes(facility.id) ? 'active' : ''}`}
                    onClick={() => handleFacilityToggle(facility.id)}
                  >
                    <facility.icon size={16} />
                    <span>{facility.label}</span>
                    {localFilters.facilities.includes(facility.id) && <span className="check">✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="filter-section">
              <h3>Distance from location</h3>
              <div className="range-input">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={localFilters.distance}
                  onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                />
                <div className="range-labels">
                  <span>1 km</span>
                  <span>{localFilters.distance} km away</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="filter-section">
              <h3>Rating</h3>
              <div className="rating-options">
                {[4, 3, 2, 1].map(rating => (
                  <div
                    key={rating}
                    className={`rating-option ${localFilters.rating === rating ? 'active' : ''}`}
                    onClick={() => handleFilterChange('rating', localFilters.rating === rating ? 0 : rating)}
                  >
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      ))}
                    </div>
                    <span>& above</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sidebar-footer">
            <button onClick={resetFilters} className="reset-btn">
              Reset All
            </button>
            <button onClick={onClose} className="apply-btn">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 40;
        }

        .filter-sidebar {
          position: fixed;
          top: 64px;
          right: 0;
          width: 400px;
          height: calc(100vh - 64px);
          background: white;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 50;
          transform: translateX(0);
          transition: transform 0.3s ease;
        }

        @media (max-width: 768px) {
          .filter-sidebar {
            top: 0;
            width: 100%;
            height: 100vh;
          }
        }

        .sidebar-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-left h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .sidebar-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .filter-section {
          margin-bottom: 32px;
        }

        .filter-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .sort-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sort-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sort-option:hover {
          background: #f3f4f6;
        }

        .sort-option.active {
          background: #dbeafe;
          color: #2563eb;
        }

        .check {
          margin-left: auto;
          color: #2563eb;
          font-weight: bold;
        }

        .sort-order {
          margin-top: 12px;
          display: flex;
          gap: 16px;
        }

        .sort-order label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .range-input {
          width: 100%;
        }

        .range-input input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e5e7eb;
          outline: none;
          -webkit-appearance: none;
        }

        .range-input input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .facilities-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .facility-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .facility-option:hover {
          border-color: #2563eb;
          background: #f8faff;
        }

        .facility-option.active {
          border-color: #2563eb;
          background: #dbeafe;
          color: #2563eb;
        }

        .rating-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rating-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .rating-option:hover {
          background: #f3f4f6;
        }

        .rating-option.active {
          background: #dbeafe;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
        }

        .reset-btn {
          flex: 1;
          padding: 12px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          background: #f9fafb;
          border-color: #6b7280;
        }

        .apply-btn {
          flex: 2;
          padding: 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .apply-btn:hover {
          background: #1d4ed8;
        }
      `}</style>
    </>
  );
};

export default FilterSidebar;