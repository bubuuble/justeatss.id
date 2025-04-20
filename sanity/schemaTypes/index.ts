// sanity/schemaTypes/index.ts

// Import your newly created schema types
import product from './product'
import category from './category'
// ... import other schemas

// Add them to the types array
export const schemaTypes = [
    product,
    category,
    // ... other imported schemas
]

// Or if your index file already has an array, add them to it:
// export const schema = {
//   types: [
//      product,
//      category,
//      storeLocation,
//      // ... other existing types
//   ],
// }
// Check the exact structure of your existing index.ts file.