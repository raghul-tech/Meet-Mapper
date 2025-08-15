import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  X, 
  DollarSign, 
  Users, 
  Wifi, 
  Monitor, 
  Car, 
  Coffee,
  MapPin,
  Star
} from "lucide-react";

export interface FilterOptions {
  priceRange: [number, number];
  capacityRange: [number, number];
  facilities: string[];
  rating: number;
  distance: number;
  sortBy: 'distance' | 'price' | 'rating' | 'capacity';
  sortOrder: 'asc' | 'desc';
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const facilityOptions = [
  { id: "AC", label: "Air Conditioning", icon: Monitor },
  { id: "Hi Speed WiFi", label: "WiFi", icon: Wifi },
  { id: "Paid Parking", label: "Parking", icon: Car },
  { id: "Coffee/Tea", label: "Coffee/Tea", icon: Coffee },
  { id: "Television", label: "TV/Display", icon: Monitor },
  { id: "Power Backup", label: "Power Backup", icon: Monitor }
];

const sortOptions = [
  { value: 'distance', label: 'Distance', icon: MapPin },
  { value: 'price', label: 'Price', icon: DollarSign },
  { value: 'rating', label: 'Rating', icon: Star },
  { value: 'capacity', label: 'Capacity', icon: Users }
];

export function FilterSidebar({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  className = ""
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    // Immediately apply filters for fast refresh
    onFiltersChange(updatedFilters);
  };

  const handleFacilityToggle = (facilityId: string) => {
    const updatedFacilities = localFilters.facilities.includes(facilityId)
      ? localFilters.facilities.filter(f => f !== facilityId)
      : [...localFilters.facilities, facilityId];
    
    // Immediately update and apply facility filters when checkbox is clicked
    const updatedFilters = { ...localFilters, facilities: updatedFacilities };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
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

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 10000) count++;
    if (localFilters.capacityRange[0] > 1 || localFilters.capacityRange[1] < 50) count++;
    if (localFilters.facilities.length > 0) count++;
    if (localFilters.rating > 0) count++;
    if (localFilters.distance < 50) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Shows for all screen sizes when filter is open */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar - Fixed positioning for desktop */}
      <div className={`
        fixed top-16 right-0 h-[calc(100vh-4rem)] w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:block
        ${className}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className=""
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Sort By */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-900">Sort By</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sortOptions.map(option => (
                  <div 
                    key={option.value} 
                    className={`filter-option filter-transition flex items-center p-3 rounded-lg cursor-pointer ${
                      localFilters.sortBy === option.value ? 'active bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFilterChange('sortBy', option.value)}
                  >
                    <option.icon className="h-4 w-4 mr-3 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    {localFilters.sortBy === option.value && (
                      <span className="ml-auto text-xs text-blue-600 font-bold">✓</span>
                    )}
                  </div>
                ))}
                
                {/* Sort Order */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <Button
                      variant={localFilters.sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('sortOrder', 'asc')}
                    >
                      Low to High
                    </Button>
                    <Button
                      variant={localFilters.sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('sortOrder', 'desc')}
                    >
                      High to Low
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Filter */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget per Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Quick Budget Options */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { min: 0, max: 500, label: "Under ₹500" },
                      { min: 500, max: 1000, label: "₹500-₹1000" },
                      { min: 1000, max: 2000, label: "₹1000-₹2000" },
                      { min: 2000, max: 5000, label: "₹2000+" }
                    ].map(budget => (
                      <Button
                        key={`${budget.min}-${budget.max}`}
                        variant={
                          localFilters.priceRange[0] === budget.min && 
                          localFilters.priceRange[1] === budget.max ? 'default' : 'outline'
                        }
                        size="sm"
                        className="text-xs"
                        onClick={() => handleFilterChange('priceRange', [budget.min, budget.max])}
                      >
                        {budget.label}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Custom Range Slider */}
                  <div className="px-2">
                    <Slider
                      value={localFilters.priceRange}
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                      max={5000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                      <span>₹{localFilters.priceRange[0]}</span>
                      <span>₹{localFilters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Size */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Quick Size Options */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { min: 1, max: 4, label: "1-4 people" },
                      { min: 5, max: 8, label: "5-8 people" },
                      { min: 9, max: 15, label: "9-15 people" },
                      { min: 16, max: 30, label: "16+ people" }
                    ].map(size => (
                      <Button
                        key={`${size.min}-${size.max}`}
                        variant={
                          localFilters.capacityRange[0] === size.min && 
                          localFilters.capacityRange[1] === size.max ? 'default' : 'outline'
                        }
                        size="sm"
                        className="text-xs"
                        onClick={() => handleFilterChange('capacityRange', [size.min, size.max])}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Distance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="px-2">
                  <Slider
                    value={[localFilters.distance]}
                    onValueChange={(value) => handleFilterChange('distance', value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center mt-2 text-sm text-gray-600">
                    Within {localFilters.distance} km
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Minimum Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="grid grid-cols-2 gap-2">
                  {[0, 3, 4, 4.5].map(rating => (
                    <Button
                      key={rating}
                      variant={localFilters.rating === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('rating', rating)}
                      className="text-xs"
                    >
                      {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                    </Button>
                  ))}
                </div>
                </div>
              </CardContent>
            </Card>

            {/* AC/Non-AC & Facilities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-900">Facilities & Amenities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* AC/Non-AC Quick Filter */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Air Conditioning</h4>
                  <div className="flex gap-2">
                    <Button
                      variant={localFilters.facilities.includes("AC") ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFacilityToggle("AC")}
                      className="text-xs flex-1"
                    >
                      AC
                    </Button>
                    <Button
                      variant={!localFilters.facilities.includes("AC") && localFilters.facilities.length === 0 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        // Remove AC from facilities if present
                        const updatedFacilities = localFilters.facilities.filter(f => f !== "AC");
                        handleFilterChange('facilities', updatedFacilities);
                      }}
                      className="text-xs flex-1"
                    >
                      Non-AC
                    </Button>
                  </div>
                </div>
                
                {/* Other Facilities */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Other Amenities</h4>
                  {facilityOptions.filter(f => f.id !== "AC").map(facility => (
                    <div key={facility.id} className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 ${
                      localFilters.facilities.includes(facility.id) ? 'bg-blue-50 border border-blue-200' : ''
                    }`}>
                      <Checkbox
                        id={facility.id}
                        checked={localFilters.facilities.includes(facility.id)}
                        onCheckedChange={() => handleFacilityToggle(facility.id)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <label
                        htmlFor={facility.id}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer flex-1"
                        onClick={() => handleFacilityToggle(facility.id)}
                      >
                        <facility.icon className="h-4 w-4" />
                        {facility.label}
                        {localFilters.facilities.includes(facility.id) && (
                          <span className="ml-auto text-xs text-blue-600">✓</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              className="w-full"
              onClick={resetFilters}
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}