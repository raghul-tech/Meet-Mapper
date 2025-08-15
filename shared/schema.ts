import { z } from "zod";

// GoFloaters Space Schema
export const spaceSchema = z.object({
  spaceId: z.string(),
  spaceName: z.string(),
  spaceDisplayName: z.string(),
  spaceDesc: z.string(),
  spaceOverview: z.string(),
  priceperhr: z.string(),
  seatsAvailable: z.number(),
  city: z.string(),
  address: z.object({
    street: z.string(),
    locality: z.string(),
    city: z.string(),
    country: z.string(),
    zipcode: z.string(),
    landmark: z.string().optional(),
  }),
  location: z.string(), // "lat,lng" format
  facilitiesList: z.array(z.string()),
  photos: z.array(z.string()),
  googleRating: z.string(),
  googleReviewCount: z.string(),
  operationTiming: z.object({
    displayName: z.string(),
    days: z.record(z.object({
      from: z.string(),
      to: z.string(),
      holiday: z.boolean().optional(),
      useNow: z.boolean().optional(),
    })),
  }),
  purposes: z.array(z.string()).optional(),
  purposesList: z.array(z.string()).optional(),
  distance: z.string().optional(),
  spaceSubType: z.array(z.string()),
  operatorName: z.string().optional(),
  minHeadCount: z.number().optional(),
});

export const spacesResponseSchema = z.record(spaceSchema);

export const searchRequestSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  spaceSubType: z.string().optional(),
  query: z.string().optional(),
});

export type Space = z.infer<typeof spaceSchema>;
export type SpacesResponse = z.infer<typeof spacesResponseSchema>;
export type SearchRequest = z.infer<typeof searchRequestSchema>;
