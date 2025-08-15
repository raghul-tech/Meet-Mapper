import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, X } from "lucide-react";

interface LocationResult {
  placeId: string;
  description: string;
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  onLocationSelect: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearch({ 
  onLocationSelect, 
  placeholder = "Search for a city or location in India...",
  className = ""
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = async () => {
      if ((window as any).google?.maps) {
        initializeServices();
        return;
      }

      try {
        // Load Google Maps API with Places Library
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'YOUR_API_KEY'}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        // Set up callback
        (window as any).initMap = () => {
          console.log("Google Maps API loaded successfully");
          initializeServices();
        };
        
        // If no API key, use mock data
        if (!import.meta.env.VITE_GOOGLE_PLACES_API_KEY) {
          console.log("Google Maps API would be loaded here with proper API key");
        } else {
          document.head.appendChild(script);
          return;
        }
        
        // Mock the Google Maps services for now
        (window as any).google = {
          maps: {
            places: {
              AutocompleteService: class {
                getPlacePredictions(request: any, callback: any) {
                  // Mock implementation with comprehensive Indian cities
                  const mockResults = [
                    // Major Cities
                    { place_id: "mock_bangalore", description: "Bangalore, Karnataka, India", main_text: "Bangalore", secondary_text: "Karnataka, India" },
                    { place_id: "mock_mumbai", description: "Mumbai, Maharashtra, India", main_text: "Mumbai", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_delhi", description: "New Delhi, Delhi, India", main_text: "New Delhi", secondary_text: "Delhi, India" },
                    { place_id: "mock_pune", description: "Pune, Maharashtra, India", main_text: "Pune", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_hyderabad", description: "Hyderabad, Telangana, India", main_text: "Hyderabad", secondary_text: "Telangana, India" },
                    { place_id: "mock_chennai", description: "Chennai, Tamil Nadu, India", main_text: "Chennai", secondary_text: "Tamil Nadu, India" },
                    { place_id: "mock_kolkata", description: "Kolkata, West Bengal, India", main_text: "Kolkata", secondary_text: "West Bengal, India" },
                    { place_id: "mock_ahmedabad", description: "Ahmedabad, Gujarat, India", main_text: "Ahmedabad", secondary_text: "Gujarat, India" },
                    { place_id: "mock_jaipur", description: "Jaipur, Rajasthan, India", main_text: "Jaipur", secondary_text: "Rajasthan, India" },
                    { place_id: "mock_surat", description: "Surat, Gujarat, India", main_text: "Surat", secondary_text: "Gujarat, India" },
                    { place_id: "mock_lucknow", description: "Lucknow, Uttar Pradesh, India", main_text: "Lucknow", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_kanpur", description: "Kanpur, Uttar Pradesh, India", main_text: "Kanpur", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_nagpur", description: "Nagpur, Maharashtra, India", main_text: "Nagpur", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_indore", description: "Indore, Madhya Pradesh, India", main_text: "Indore", secondary_text: "Madhya Pradesh, India" },
                    { place_id: "mock_thane", description: "Thane, Maharashtra, India", main_text: "Thane", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_bhopal", description: "Bhopal, Madhya Pradesh, India", main_text: "Bhopal", secondary_text: "Madhya Pradesh, India" },
                    { place_id: "mock_visakhapatnam", description: "Visakhapatnam, Andhra Pradesh, India", main_text: "Visakhapatnam", secondary_text: "Andhra Pradesh, India" },
                    { place_id: "mock_pimpri", description: "Pimpri-Chinchwad, Maharashtra, India", main_text: "Pimpri-Chinchwad", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_patna", description: "Patna, Bihar, India", main_text: "Patna", secondary_text: "Bihar, India" },
                    { place_id: "mock_vadodara", description: "Vadodara, Gujarat, India", main_text: "Vadodara", secondary_text: "Gujarat, India" },
                    { place_id: "mock_ghaziabad", description: "Ghaziabad, Uttar Pradesh, India", main_text: "Ghaziabad", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_ludhiana", description: "Ludhiana, Punjab, India", main_text: "Ludhiana", secondary_text: "Punjab, India" },
                    { place_id: "mock_agra", description: "Agra, Uttar Pradesh, India", main_text: "Agra", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_nashik", description: "Nashik, Maharashtra, India", main_text: "Nashik", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_faridabad", description: "Faridabad, Haryana, India", main_text: "Faridabad", secondary_text: "Haryana, India" },
                    { place_id: "mock_meerut", description: "Meerut, Uttar Pradesh, India", main_text: "Meerut", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_rajkot", description: "Rajkot, Gujarat, India", main_text: "Rajkot", secondary_text: "Gujarat, India" },
                    { place_id: "mock_kalyan", description: "Kalyan-Dombivli, Maharashtra, India", main_text: "Kalyan-Dombivli", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_vasai", description: "Vasai-Virar, Maharashtra, India", main_text: "Vasai-Virar", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_varanasi", description: "Varanasi, Uttar Pradesh, India", main_text: "Varanasi", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_srinagar", description: "Srinagar, Jammu and Kashmir, India", main_text: "Srinagar", secondary_text: "Jammu and Kashmir, India" },
                    { place_id: "mock_aurangabad", description: "Aurangabad, Maharashtra, India", main_text: "Aurangabad", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_dhanbad", description: "Dhanbad, Jharkhand, India", main_text: "Dhanbad", secondary_text: "Jharkhand, India" },
                    { place_id: "mock_amritsar", description: "Amritsar, Punjab, India", main_text: "Amritsar", secondary_text: "Punjab, India" },
                    { place_id: "mock_navi_mumbai", description: "Navi Mumbai, Maharashtra, India", main_text: "Navi Mumbai", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_allahabad", description: "Prayagraj, Uttar Pradesh, India", main_text: "Prayagraj", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_howrah", description: "Howrah, West Bengal, India", main_text: "Howrah", secondary_text: "West Bengal, India" },
                    { place_id: "mock_gwalior", description: "Gwalior, Madhya Pradesh, India", main_text: "Gwalior", secondary_text: "Madhya Pradesh, India" },
                    { place_id: "mock_jabalpur", description: "Jabalpur, Madhya Pradesh, India", main_text: "Jabalpur", secondary_text: "Madhya Pradesh, India" },
                    { place_id: "mock_coimbatore", description: "Coimbatore, Tamil Nadu, India", main_text: "Coimbatore", secondary_text: "Tamil Nadu, India" },
                    { place_id: "mock_madurai", description: "Madurai, Tamil Nadu, India", main_text: "Madurai", secondary_text: "Tamil Nadu, India" },
                    { place_id: "mock_jodhpur", description: "Jodhpur, Rajasthan, India", main_text: "Jodhpur", secondary_text: "Rajasthan, India" },
                    { place_id: "mock_kota", description: "Kota, Rajasthan, India", main_text: "Kota", secondary_text: "Rajasthan, India" },
                    { place_id: "mock_guwahati", description: "Guwahati, Assam, India", main_text: "Guwahati", secondary_text: "Assam, India" },
                    { place_id: "mock_chandigarh", description: "Chandigarh, India", main_text: "Chandigarh", secondary_text: "India" },
                    { place_id: "mock_solapur", description: "Solapur, Maharashtra, India", main_text: "Solapur", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_hubli", description: "Hubballi-Dharwad, Karnataka, India", main_text: "Hubballi-Dharwad", secondary_text: "Karnataka, India" },
                    { place_id: "mock_mysore", description: "Mysuru, Karnataka, India", main_text: "Mysuru", secondary_text: "Karnataka, India" },
                    { place_id: "mock_tiruchirappalli", description: "Tiruchirappalli, Tamil Nadu, India", main_text: "Tiruchirappalli", secondary_text: "Tamil Nadu, India" },
                    { place_id: "mock_salem", description: "Salem, Tamil Nadu, India", main_text: "Salem", secondary_text: "Tamil Nadu, India" },
                    { place_id: "mock_mira_bhayandar", description: "Mira-Bhayandar, Maharashtra, India", main_text: "Mira-Bhayandar", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_warangal", description: "Warangal, Telangana, India", main_text: "Warangal", secondary_text: "Telangana, India" },
                    { place_id: "mock_thiruvananthapuram", description: "Thiruvananthapuram, Kerala, India", main_text: "Thiruvananthapuram", secondary_text: "Kerala, India" },
                    { place_id: "mock_guntur", description: "Guntur, Andhra Pradesh, India", main_text: "Guntur", secondary_text: "Andhra Pradesh, India" },
                    { place_id: "mock_bhiwandi", description: "Bhiwandi, Maharashtra, India", main_text: "Bhiwandi", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_saharanpur", description: "Saharanpur, Uttar Pradesh, India", main_text: "Saharanpur", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_gorakhpur", description: "Gorakhpur, Uttar Pradesh, India", main_text: "Gorakhpur", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_bikaner", description: "Bikaner, Rajasthan, India", main_text: "Bikaner", secondary_text: "Rajasthan, India" },
                    { place_id: "mock_amravati", description: "Amravati, Maharashtra, India", main_text: "Amravati", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_noida", description: "Noida, Uttar Pradesh, India", main_text: "Noida", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_jamshedpur", description: "Jamshedpur, Jharkhand, India", main_text: "Jamshedpur", secondary_text: "Jharkhand, India" },
                    { place_id: "mock_bhilai", description: "Bhilai, Chhattisgarh, India", main_text: "Bhilai", secondary_text: "Chhattisgarh, India" },
                    { place_id: "mock_cuttack", description: "Cuttack, Odisha, India", main_text: "Cuttack", secondary_text: "Odisha, India" },
                    { place_id: "mock_firozabad", description: "Firozabad, Uttar Pradesh, India", main_text: "Firozabad", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_kochi", description: "Kochi, Kerala, India", main_text: "Kochi", secondary_text: "Kerala, India" },
                    { place_id: "mock_nellore", description: "Nellore, Andhra Pradesh, India", main_text: "Nellore", secondary_text: "Andhra Pradesh, India" },
                    { place_id: "mock_bhavnagar", description: "Bhavnagar, Gujarat, India", main_text: "Bhavnagar", secondary_text: "Gujarat, India" },
                    { place_id: "mock_dehradun", description: "Dehradun, Uttarakhand, India", main_text: "Dehradun", secondary_text: "Uttarakhand, India" },
                    { place_id: "mock_durgapur", description: "Durgapur, West Bengal, India", main_text: "Durgapur", secondary_text: "West Bengal, India" },
                    { place_id: "mock_asansol", description: "Asansol, West Bengal, India", main_text: "Asansol", secondary_text: "West Bengal, India" },
                    { place_id: "mock_rourkela", description: "Rourkela, Odisha, India", main_text: "Rourkela", secondary_text: "Odisha, India" },
                    { place_id: "mock_nanded", description: "Nanded, Maharashtra, India", main_text: "Nanded", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_kolhapur", description: "Kolhapur, Maharashtra, India", main_text: "Kolhapur", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_ajmer", description: "Ajmer, Rajasthan, India", main_text: "Ajmer", secondary_text: "Rajasthan, India" },
                    { place_id: "mock_akola", description: "Akola, Maharashtra, India", main_text: "Akola", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_gulbarga", description: "Kalaburagi, Karnataka, India", main_text: "Kalaburagi", secondary_text: "Karnataka, India" },
                    { place_id: "mock_jamnagar", description: "Jamnagar, Gujarat, India", main_text: "Jamnagar", secondary_text: "Gujarat, India" },
                    { place_id: "mock_ujjain", description: "Ujjain, Madhya Pradesh, India", main_text: "Ujjain", secondary_text: "Madhya Pradesh, India" },
                    { place_id: "mock_loni", description: "Loni, Uttar Pradesh, India", main_text: "Loni", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_siliguri", description: "Siliguri, West Bengal, India", main_text: "Siliguri", secondary_text: "West Bengal, India" },
                    { place_id: "mock_jhansi", description: "Jhansi, Uttar Pradesh, India", main_text: "Jhansi", secondary_text: "Uttar Pradesh, India" },
                    { place_id: "mock_ulhasnagar", description: "Ulhasnagar, Maharashtra, India", main_text: "Ulhasnagar", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_jammu", description: "Jammu, Jammu and Kashmir, India", main_text: "Jammu", secondary_text: "Jammu and Kashmir, India" },
                    { place_id: "mock_sangli", description: "Sangli-Miraj & Kupwad, Maharashtra, India", main_text: "Sangli-Miraj & Kupwad", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_mangalore", description: "Mangaluru, Karnataka, India", main_text: "Mangaluru", secondary_text: "Karnataka, India" },
                    { place_id: "mock_erode", description: "Erode, Tamil Nadu, India", main_text: "Erode", secondary_text: "Tamil Nadu, India" },
                    { place_id: "mock_belgaum", description: "Belagavi, Karnataka, India", main_text: "Belagavi", secondary_text: "Karnataka, India" },
                    { place_id: "mock_ambattur", description: "Ambattur, Tamil Nadu, India", main_text: "Ambattur", secondary_text: "Tamil Nadu, India" },
                    { place_id: "mock_tirunelveli", description: "Tirunelveli, Tamil Nadu, India", main_text: "Tirunelveli", secondary_text: "Tamil Nadu, India" },
                    { place_id: "mock_malegaon", description: "Malegaon, Maharashtra, India", main_text: "Malegaon", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_gaya", description: "Gaya, Bihar, India", main_text: "Gaya", secondary_text: "Bihar, India" },
                    { place_id: "mock_jalgaon", description: "Jalgaon, Maharashtra, India", main_text: "Jalgaon", secondary_text: "Maharashtra, India" },
                    { place_id: "mock_udaipur", description: "Udaipur, Rajasthan, India", main_text: "Udaipur", secondary_text: "Rajasthan, India" },
                    { place_id: "mock_maheshtala", description: "Maheshtala, West Bengal, India", main_text: "Maheshtala", secondary_text: "West Bengal, India" }
                  ];
                  
                  // Filter results - show cities that START with typed letter(s)
                  const filteredResults = mockResults
                    .filter(result => {
                      const query = request.input.toLowerCase().trim();
                      if (!query) return false;
                      return result.main_text.toLowerCase().startsWith(query);
                    })
                    .slice(0, 6) // Limit to 6 results for better UX
                    .map(result => ({
                      place_id: result.place_id,
                      description: result.description,
                      structured_formatting: {
                        main_text: result.main_text,
                        secondary_text: result.secondary_text
                      }
                    }));
                  
                  setTimeout(() => callback(filteredResults, "OK"), 100);
                }
              },
              PlacesService: class {
                getDetails(request: any, callback: any) {
                  // Mock coordinates for Indian cities
                  const mockCoordinates: Record<string, { lat: number; lng: number }> = {
                    "mock_bangalore": { lat: 12.9716, lng: 77.5946 },
                    "mock_mumbai": { lat: 19.0760, lng: 72.8777 },
                    "mock_delhi": { lat: 28.6139, lng: 77.2090 },
                    "mock_pune": { lat: 18.5204, lng: 73.8567 },
                    "mock_hyderabad": { lat: 17.3850, lng: 78.4867 },
                    "mock_chennai": { lat: 13.0827, lng: 80.2707 },
                    "mock_kolkata": { lat: 22.5726, lng: 88.3639 },
                    "mock_ahmedabad": { lat: 23.0225, lng: 72.5714 },
                    "mock_jaipur": { lat: 26.9124, lng: 75.7873 },
                    "mock_surat": { lat: 21.1702, lng: 72.8311 },
                    "mock_lucknow": { lat: 26.8467, lng: 80.9462 },
                    "mock_kanpur": { lat: 26.4499, lng: 80.3319 },
                    "mock_nagpur": { lat: 21.1458, lng: 79.0882 },
                    "mock_indore": { lat: 22.7196, lng: 75.8577 },
                    "mock_thane": { lat: 19.2183, lng: 72.9781 },
                    "mock_bhopal": { lat: 23.2599, lng: 77.4126 },
                    "mock_visakhapatnam": { lat: 17.6868, lng: 83.2185 },
                    "mock_pimpri": { lat: 18.6298, lng: 73.7997 },
                    "mock_patna": { lat: 25.5941, lng: 85.1376 },
                    "mock_vadodara": { lat: 22.3072, lng: 73.1812 },
                    "mock_ghaziabad": { lat: 28.6692, lng: 77.4538 },
                    "mock_ludhiana": { lat: 30.9010, lng: 75.8573 },
                    "mock_agra": { lat: 27.1767, lng: 78.0081 },
                    "mock_nashik": { lat: 19.9975, lng: 73.7898 },
                    "mock_faridabad": { lat: 28.4089, lng: 77.3178 },
                    "mock_meerut": { lat: 28.9845, lng: 77.7064 },
                    "mock_rajkot": { lat: 22.3039, lng: 70.8022 },
                    "mock_kalyan": { lat: 19.2403, lng: 73.1305 },
                    "mock_vasai": { lat: 19.4034, lng: 72.8205 },
                    "mock_varanasi": { lat: 25.3176, lng: 82.9739 },
                    "mock_srinagar": { lat: 34.0837, lng: 74.7973 },
                    "mock_aurangabad": { lat: 19.8762, lng: 75.3433 },
                    "mock_dhanbad": { lat: 23.7957, lng: 86.4304 },
                    "mock_amritsar": { lat: 31.6340, lng: 74.8723 },
                    "mock_navi_mumbai": { lat: 19.0330, lng: 73.0297 },
                    "mock_allahabad": { lat: 25.4358, lng: 81.8463 },
                    "mock_howrah": { lat: 22.5958, lng: 88.2636 },
                    "mock_gwalior": { lat: 26.2183, lng: 78.1828 },
                    "mock_jabalpur": { lat: 23.1815, lng: 79.9864 },
                    "mock_coimbatore": { lat: 11.0168, lng: 76.9558 },
                    "mock_madurai": { lat: 9.9252, lng: 78.1198 },
                    "mock_jodhpur": { lat: 26.2389, lng: 73.0243 },
                    "mock_kota": { lat: 25.2138, lng: 75.8648 },
                    "mock_guwahati": { lat: 26.1445, lng: 91.7362 },
                    "mock_chandigarh": { lat: 30.7333, lng: 76.7794 },
                    "mock_solapur": { lat: 17.6599, lng: 75.9064 },
                    "mock_hubli": { lat: 15.3647, lng: 75.1240 },
                    "mock_mysore": { lat: 12.2958, lng: 76.6394 },
                    "mock_tiruchirappalli": { lat: 10.7905, lng: 78.7047 },
                    "mock_salem": { lat: 11.6643, lng: 78.1460 },
                    "mock_mira_bhayandar": { lat: 19.2952, lng: 72.8544 },
                    "mock_warangal": { lat: 17.9689, lng: 79.6000 },
                    "mock_thiruvananthapuram": { lat: 8.5241, lng: 76.9366 },
                    "mock_guntur": { lat: 16.3067, lng: 80.4365 },
                    "mock_bhiwandi": { lat: 19.2812, lng: 73.0482 },
                    "mock_saharanpur": { lat: 29.9680, lng: 77.5552 },
                    "mock_gorakhpur": { lat: 26.7606, lng: 83.3732 },
                    "mock_bikaner": { lat: 28.0229, lng: 73.3119 },
                    "mock_amravati": { lat: 20.9374, lng: 77.7796 },
                    "mock_noida": { lat: 28.5355, lng: 77.3910 },
                    "mock_jamshedpur": { lat: 22.8046, lng: 86.2029 },
                    "mock_bhilai": { lat: 21.1938, lng: 81.3509 },
                    "mock_cuttack": { lat: 20.4625, lng: 85.8828 },
                    "mock_firozabad": { lat: 27.1592, lng: 78.3957 },
                    "mock_kochi": { lat: 9.9312, lng: 76.2673 },
                    "mock_nellore": { lat: 14.4426, lng: 79.9865 },
                    "mock_bhavnagar": { lat: 21.7645, lng: 72.1519 },
                    "mock_dehradun": { lat: 30.3165, lng: 78.0322 },
                    "mock_durgapur": { lat: 23.5204, lng: 87.3119 },
                    "mock_asansol": { lat: 23.6839, lng: 86.9523 },
                    "mock_rourkela": { lat: 22.2604, lng: 84.8536 },
                    "mock_nanded": { lat: 19.1383, lng: 77.3210 },
                    "mock_kolhapur": { lat: 16.7050, lng: 74.2433 },
                    "mock_ajmer": { lat: 26.4499, lng: 74.6399 },
                    "mock_akola": { lat: 20.7002, lng: 77.0082 },
                    "mock_gulbarga": { lat: 17.3297, lng: 76.8343 },
                    "mock_jamnagar": { lat: 22.4707, lng: 70.0577 },
                    "mock_ujjain": { lat: 23.1765, lng: 75.7885 },
                    "mock_loni": { lat: 28.7500, lng: 77.2833 },
                    "mock_siliguri": { lat: 26.7271, lng: 88.3953 },
                    "mock_jhansi": { lat: 25.4484, lng: 78.5685 },
                    "mock_ulhasnagar": { lat: 19.2215, lng: 73.1645 },
                    "mock_jammu": { lat: 32.7266, lng: 74.8570 },
                    "mock_sangli": { lat: 16.8524, lng: 74.5815 },
                    "mock_mangalore": { lat: 12.9141, lng: 74.8560 },
                    "mock_erode": { lat: 11.3410, lng: 77.7172 },
                    "mock_belgaum": { lat: 15.8497, lng: 74.4977 },
                    "mock_ambattur": { lat: 13.1185, lng: 80.1574 },
                    "mock_tirunelveli": { lat: 8.7139, lng: 77.7567 },
                    "mock_malegaon": { lat: 20.5579, lng: 74.5287 },
                    "mock_gaya": { lat: 24.7914, lng: 85.0002 },
                    "mock_jalgaon": { lat: 21.0077, lng: 75.5626 },
                    "mock_udaipur": { lat: 24.5854, lng: 73.7125 },
                    "mock_maheshtala": { lat: 22.5050, lng: 88.2475 }
                  };
                  
                  const coords = mockCoordinates[request.placeId] || { lat: 12.9716, lng: 77.5946 };
                  
                  const result = {
                    geometry: {
                      location: {
                        lat: () => coords.lat,
                        lng: () => coords.lng
                      }
                    }
                  };
                  
                  setTimeout(() => callback(result, "OK"), 100);
                }
              }
            }
          }
        };
        
        initializeServices();
      } catch (error) {
        console.error("Failed to load Google Maps API:", error);
      }
    };

    const initializeServices = () => {
      if ((window as any).google?.maps?.places) {
        autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
        // Create a dummy div for PlacesService since it requires a map or div
        const dummyDiv = document.createElement('div');
        placesService.current = new (window as any).google.maps.places.PlacesService(dummyDiv);
      }
    };

    loadGoogleMaps();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim() || !autocompleteService.current) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setIsLoading(true);
    setShowPredictions(true);

    try {
      autocompleteService.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'in' }, // Restrict to India
          types: ['(cities)'] // Only cities
        },
        (predictions: any[], status: string) => {
          if (status === 'OK' && predictions) {
            const results: LocationResult[] = predictions.slice(0, 5).map(prediction => ({
              placeId: prediction.place_id,
              description: prediction.description,
              lat: 0, // Will be filled when selected
              lng: 0
            }));
            setPredictions(results);
          } else {
            setPredictions([]);
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setIsLoading(false);
      setPredictions([]);
    }
  };

  const handleSelectPlace = async (prediction: LocationResult) => {
    if (!placesService.current) return;

    setIsLoading(true);

    try {
      placesService.current.getDetails(
        { placeId: prediction.placeId },
        (place: any, status: string) => {
          if (status === 'OK' && place?.geometry?.location) {
            const location: LocationResult = {
              ...prediction,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            
            onLocationSelect(location);
            setSearchQuery(prediction.description);
            setShowPredictions(false);
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error getting place details:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce the search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPredictions([]);
    setShowPredictions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          className="pl-10 pr-10 py-3 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:shadow-md transition-shadow"
          onFocus={() => {
            if (predictions.length > 0) {
              setShowPredictions(true);
            }
          }}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>

      {/* Predictions Dropdown */}
      {showPredictions && (predictions.length > 0 || isLoading) && (
        <Card className="absolute top-full left-0 right-0 mt-1 shadow-lg border border-gray-200 location-search-dropdown" style={{ zIndex: 30 }}>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-3 text-center text-sm text-gray-500">
                Searching locations...
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {predictions.map((prediction) => (
                  <div
                    key={prediction.placeId}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectPlace(prediction)}
                  >
                    <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        {prediction.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}