// lib/image.ts (Recommended separate file)
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client'; // Import your configured client

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

// Function to generate image URLs
export function urlFor(source: any) { // Use 'any' or a more specific Sanity image type if available
  // Ensure that source image has an asset object with a _ref
  if (!source || !source.asset || !source.asset._ref) {
    // Return a placeholder or null if image data is invalid/missing
    // console.warn('Invalid image source passed to urlFor:', source);
    return null; // Or return a placeholder image URL: '/assets/placeholder.png';
  }
  
  return builder.image(source);
}