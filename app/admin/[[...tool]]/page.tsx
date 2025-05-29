// app/studio/[[...tool]]/page.tsx
"use client";

/**
 * This route is responsible for the built-in Sanity Studio app.
 * All Studio related routes are covered by this dynamic route.
 */

import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config'; // Adjust the import path to your sanity.config.ts

export default function StudioPage() {
  // Ensure the config is imported correctly and passed to NextStudio
  return <NextStudio config={config} />;
}

// Optional: If you want static generation for the Studio route (usually not needed for dev)
// export {metadata} from 'next-sanity/studio/metadata'
// export {viewport} from 'next-sanity/studio/viewport'

// Optional: Force dynamic rendering if experiencing issues with static generation for Studio
// export const dynamic = 'force-dynamic'