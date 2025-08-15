import { useState, useEffect } from "react";

interface GeolocationState {
  coordinates: GeolocationCoordinates | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationHook extends GeolocationState {
  getCurrentPosition: () => Promise<void>;
  clearError: () => void;
}

export function useGeolocation(): GeolocationHook {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: false,
  });

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const getCurrentPosition = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        error: "Geolocation is not supported by this browser." 
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      setState({
        coordinates: position.coords,
        error: null,
        loading: false,
      });
    } catch (error) {
      let errorMessage = "Unable to retrieve location.";
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
      }

      setState({
        coordinates: null,
        error: errorMessage,
        loading: false,
      });
    }
  };

  return {
    ...state,
    getCurrentPosition,
    clearError,
  };
}
