/*import { apiRequest } from "./queryClient";
import type { SpacesResponse, SearchRequest } from "@shared/schema";

export async function searchNearbySpaces(params: SearchRequest): Promise<SpacesResponse> {
  const searchParams = new URLSearchParams({
    lat: params.lat.toString(),
    lng: params.lng.toString(),
  });
  
  if (params.spaceSubType) {
    searchParams.set("spaceSubType", params.spaceSubType);
  }
  
  if (params.query) {
    searchParams.set("query", params.query);
  }

  const response = await apiRequest("GET", `/api/spaces/nearby?${searchParams.toString()}`);
  return await response.json();
}*/

import type { SpacesResponse, SearchRequest } from "@shared/schema";

export async function searchNearbySpaces(params: SearchRequest): Promise<SpacesResponse> {
  // Create URL query parameters
  const searchParams = new URLSearchParams({
    lat: params.lat.toString(),
    lng: params.lng.toString(),
  });

  if (params.spaceSubType) {
    searchParams.set("spaceSubType", params.spaceSubType);
  }

  if (params.query) {
    searchParams.set("query", params.query);
  }

  // API URL
  const apiUrl = `https://gofloaters.web.app/spaces/nearby?${searchParams.toString()}`;

  console.log("Fetching from API:", apiUrl);

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  // Return the parsed JSON directly
  return await response.json();
}
