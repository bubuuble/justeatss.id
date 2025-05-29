// studio/schemas/product.ts
import {defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons' // Example icon

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon, // Optional icon for the studio UI
  fields: [
    
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name', // Auto-generate slug from name
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true, // Allows focusing the image crop
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array', // Use 'array' for Portable Text (rich text)
      of: [
        {
          type: 'block', // Standard paragraph block
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [{title: 'Bullet', value: 'bullet'}],
          marks: {
            decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}],
          },
        },
        // You can add custom block types here later (e.g., image within text)
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price (IDR)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference', // Link to another document type
      to: [{type: 'category'}], // Assumes you have a 'category' schema
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isBestSeller',
      title: 'Best Seller?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck this when product is out of stock',
    }),
    // Add other fields like stock, variants, etc.
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      category: 'category.name', // Show category name in preview
      inStock: 'inStock',
    },
    prepare(selection) {
      const {title, media, category, inStock} = selection
      return {
        title: inStock === false ? `${title} (Out of Stock)` : title,
        media,
        subtitle: category ? `Category: ${category}` : 'No category',
      }
    },
  },
})