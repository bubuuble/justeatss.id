// sanity/lib/live.ts
import { defineLive } from "next-sanity";
import { sanityClient } from './client';

// Read the token from environment variables
const sanityReadToken = process.env.SANITY_API_READ_TOKEN;

// Optional: Check if token exists
if (!sanityReadToken && process.env.NODE_ENV !== 'production') {
  // Only warn/error loudly if not in production, as previews are usually dev/staging features
  console.warn('Missing SANITY_API_READ_TOKEN. Draft previews may not work.');
  // throw new Error('Server Error: Missing SANITY_API_READ_TOKEN for live previews.');
}

// Configure client *without* the token initially if defineLive handles it separately
// OR Keep the token here, it shouldn't hurt. Let's keep it simple for now.
const liveClient = sanityClient.withConfig({
  // token: sanityReadToken, // Token CAN be here, but we'll also pass it explicitly below
  stega: {
    enabled: process.env.NODE_ENV !== 'production', // Enable stega outside production
    studioUrl: '/admin/studio',
  },
});

// Export using the configured liveClient AND explicitly passing tokens
export const { sanityFetch, SanityLive } = defineLive({
  client: liveClient,
  // Explicitly provide the token for server-side fetches in live mode
  serverToken: sanityReadToken,
  // Explicitly provide the token for client-side subscriptions
  // It's okay to use the same read-only token here
  browserToken: sanityReadToken,
});