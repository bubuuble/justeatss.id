// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure' // Use structureTool
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '@/sanity/schemaTypes' // Verify path

// --> IMPORT your structure definition <--
import { structure } from '@/sanity/structure' // Verify path (it exports 'structure')

export default defineConfig({
  // ... name, title, projectId, dataset ...
  name: 'justeatss_id',
  title: 'studio-justeatss_id',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/admin/studio',
  
  plugins: [
    // --> CONFIGURE structureTool <--
    structureTool({
      structure: structure // Pass the imported structure definition
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})