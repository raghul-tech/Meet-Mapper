import React from 'react';
import { MapPin } from 'lucide-react';

const SpaceMap = ({ spaces, center }) => {
  return (
    <div className="map-container">
      <div className="map-placeholder">
        <MapPin size={48} />
        <h3>Interactive Map</h3>
        <p>Showing {spaces.length} spaces near {center.name}</p>
        <div className="map-info">
          <p>Map integration would display:</p>
          <ul>
            <li>• Space locations as markers</li>
            <li>• Current location pin</li>
            <li>• Distance calculations</li>
            <li>• Interactive space details</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .map-container {
          width: 100%;
          height: 100%;
          min-height: 400px;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }

        .map-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          padding: 2rem;
        }

        .map-placeholder h3 {
          margin: 1rem 0 0.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .map-placeholder p {
          margin: 0.5rem 0;
          opacity: 0.9;
        }

        .map-info {
          margin-top: 2rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .map-info ul {
          list-style: none;
          padding: 0;
          margin: 1rem 0 0;
          text-align: left;
        }

        .map-info li {
          margin: 0.5rem 0;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default SpaceMap;