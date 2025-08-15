import type { Express } from "express";
import { createServer, type Server } from "http";
import { searchRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search nearby spaces using GoFloaters API
  app.get("/api/spaces/nearby", async (req, res) => {
    try {
      const { lat, lng, spaceSubType = "meetingSpace", query } = searchRequestSchema.parse({
        lat: parseFloat(req.query.lat as string),
        lng: parseFloat(req.query.lng as string),
        spaceSubType: req.query.spaceSubType as string,
        query: req.query.query as string,
      });

      // Build the GoFloaters API URL
      const apiUrl = new URL("https://gofloaters.web.app/spaces/nearby");
      apiUrl.searchParams.set("lat", lat.toString());
      apiUrl.searchParams.set("lng", lng.toString());
      apiUrl.searchParams.set("spaceSubType", spaceSubType);

      console.log("Fetching from GoFloaters API:", apiUrl.toString());

      const response = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "GoFloaters-Search-App/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`GoFloaters API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the data to include calculated distances and filter by query if provided
      const transformedData: Record<string, any> = {};
      
      Object.entries(data).forEach(([key, space]: [string, any]) => {
        // Calculate distance if not provided
        if (!space.distance && space.location) {
          const [spaceLat, spaceLng] = space.location.split(',').map(parseFloat);
          const distance = calculateDistance(lat, lng, spaceLat, spaceLng);
          space.distance = `${distance.toFixed(1)} km away`;
        }

        // Filter by query if provided
        if (!query || 
            space.spaceName?.toLowerCase().includes(query.toLowerCase()) ||
            space.address?.locality?.toLowerCase().includes(query.toLowerCase()) ||
            space.address?.city?.toLowerCase().includes(query.toLowerCase())) {
          transformedData[key] = space;
        }
      });

      res.json(transformedData);
    } catch (error) {
      console.error("Error fetching spaces:", error);
      res.status(500).json({ 
        error: "Failed to fetch spaces",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
