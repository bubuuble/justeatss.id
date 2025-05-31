// lib/sanity.client.ts (create this file/folder if it doesn't exist)
import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION!;

// Assert that environment variables are set
if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET');
if (!apiVersion) throw new Error('Missing NEXT_PUBLIC_SANITY_API_VERSION');

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for speed
  // perspective: 'published', // Default. Use 'previewDrafts' for previews
  // token: process.env.SANITY_API_READ_TOKEN, // Uncomment if using token
});

// Client with write permissions for API routes
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN for write operations
  token: process.env.SANITY_API_WRITE_TOKEN, // Write token for admin operations
});

// You can add other helper functions here, like one for @sanity/image-url