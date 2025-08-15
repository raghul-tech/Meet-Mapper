import { Star, MapPin, Route, Wifi, Snowflake, Monitor, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Space } from "@shared/schema";

interface SpaceCardProps {
  space: Space;
  onSelect: (spaceId: string) => void;
}

export function SpaceCard({ space, onSelect }: SpaceCardProps) {
  const handleClick = () => {
    onSelect(space.spaceId);
  };

  // Parse coordinates for default image
  const [lat, lng] = space.location.split(',').map(s => parseFloat(s.trim()));
  
  // Use first photo or a placeholder
  const imageUrl = space.photos?.[0] || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250`;
  
  // Format price
  const pricePerHour = space.priceperhr ? `₹${parseInt(space.priceperhr).toLocaleString()}` : "Contact for price";
  
  // Get main facilities (first 3 + count)
  const mainFacilities = space.facilitiesList?.slice(0, 3) || [];
  const remainingCount = (space.facilitiesList?.length || 0) - 3;
  
  // Format rating
  const rating = space.googleRating ? parseFloat(space.googleRating).toFixed(1) : "4.0";
  const reviewCount = space.googleReviewCount ? parseInt(space.googleReviewCount).toLocaleString() : "0";

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Space Image */}
          <div className="flex-shrink-0">
            <img 
              src={imageUrl}
              alt={space.spaceDisplayName || space.spaceName}
              className="w-full sm:w-48 h-32 sm:h-24 object-cover rounded-lg"
              onError={(e) => {
                // Fallback to a different meeting room image
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";
              }}
            />
          </div>
          
          {/* Space Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                  {space.spaceDisplayName || space.spaceName}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {space.address.locality}, {space.address.city}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {pricePerHour}
                </div>
                <div className="text-sm text-gray-500">per hour</div>
              </div>
            </div>
            
            {/* Rating and Distance */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
              </div>
              {space.distance && (
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Route className="h-3 w-3" />
                  {space.distance}
                </div>
              )}
            </div>
            
            {/* Facilities */}
            <div className="flex flex-wrap gap-1 mb-3">
              {mainFacilities.map((facility, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {facility === "Hi Speed WiFi" && <Wifi className="h-3 w-3 mr-1" />}
                  {facility === "AC" && <Snowflake className="h-3 w-3 mr-1" />}
                  {(facility === "Television" || facility === "Audio Equipment") && <Monitor className="h-3 w-3 mr-1" />}
                  {facility}
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  <Plus className="h-3 w-3 mr-1" />
                  {remainingCount} more
                </Badge>
              )}
            </div>
            
            {/* Purpose */}
            {(space.purposes || space.purposesList) && (
              <div className="text-sm text-gray-600">
                Perfect for: {(space.purposes || space.purposesList || []).join(", ")}
              </div>
            )}
            
            {/* Seats */}
            {space.seatsAvailable && (
              <div className="text-sm text-gray-600 mt-1">
                Capacity: {space.seatsAvailable} people
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
