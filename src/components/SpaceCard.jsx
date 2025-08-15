import React from 'react';
import { MapPin, Star, Users, Wifi, Car, Coffee } from 'lucide-react';

const SpaceCard = ({ space }) => {
  const {
    spaceName,
    images,
    priceperhr,
    seatsAvailable,
    googleRating,
    address,
    distance,
    facilitiesList = []
  } = space;

  const getFacilityIcon = (facility) => {
    switch (facility.toLowerCase()) {
      case 'hi speed wifi':
        return <Wifi size={16} />;
      case 'paid parking':
        return <Car size={16} />;
      case 'coffee/tea':
        return <Coffee size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-card">
      <div className="card-image">
        {images && images.length > 0 ? (
          <img src={images[0]} alt={spaceName} />
        ) : (
          <div className="image-placeholder">
            <Users size={24} />
          </div>
        )}
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="space-name">{spaceName}</h3>
          <div className="rating">
            <Star size={14} fill="currentColor" />
            <span>{googleRating || 'N/A'}</span>
          </div>
        </div>

        <div className="location">
          <MapPin size={14} />
          <span>{address?.area}, {address?.city}</span>
          {space.calculatedDistance && (
            <span className="distance">• {space.calculatedDistance.toFixed(1)} km away</span>
          )}
        </div>

        <div className="space-details">
          <div className="capacity">
            <Users size={14} />
            <span>Up to {seatsAvailable} people</span>
          </div>
          
          <div className="facilities">
            {facilitiesList.slice(0, 3).map((facility, index) => (
              <div key={index} className="facility">
                {getFacilityIcon(facility)}
                <span>{facility}</span>
              </div>
            ))}
            {facilitiesList.length > 3 && (
              <span className="more-facilities">+{facilitiesList.length - 3} more</span>
            )}
          </div>
        </div>

        <div className="card-footer">
          <div className="price">
            <span className="price-value">₹{priceperhr}</span>
            <span className="price-unit">/hour</span>
          </div>
          
          <button className="book-btn">
            View Details
          </button>
        </div>
      </div>

      <style jsx>{`
        .space-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.2s;
          cursor: pointer;
        }

        .space-card:hover {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-image {
          height: 200px;
          background: #f3f4f6;
          position: relative;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        }

        .card-content {
          padding: 20px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .space-name {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0;
          line-height: 1.3;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f59e0b;
          font-size: 14px;
          font-weight: 500;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .distance {
          color: #2563eb;
          font-weight: 500;
        }

        .space-details {
          margin-bottom: 20px;
        }

        .capacity {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #374151;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .facilities {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .facility {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          color: #6b7280;
        }

        .more-facilities {
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .price-value {
          font-size: 20px;
          font-weight: 700;
          color: #2563eb;
        }

        .price-unit {
          font-size: 14px;
          color: #6b7280;
        }

        .book-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .book-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default SpaceCard;