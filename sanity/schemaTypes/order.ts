// sanity/schemaTypes/order.ts
import {defineField, defineType, ConditionalPropertyCallbackContext} from 'sanity' // Import ConditionalPropertyCallbackContext
import { ShoppingCartIcon } from 'lucide-react'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: ShoppingCartIcon,
  fields: [
    // ... other fields (orderId, userId, userName, userEmail, items, totalAmount, shippingAddress, paymentStatus, orderStatus) ...
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'userId',
      title: 'User ID (Clerk)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'userName',
      title: 'User Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'items',
      title: 'Items Ordered',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'productId', type: 'string', title: 'Product ID'}),
            defineField({name: 'productName', type: 'string', title: 'Product Name'}),
            defineField({name: 'quantity', type: 'number', title: 'Quantity'}),
            defineField({name: 'price', type: 'number', title: 'Price per Item'}),
            defineField({name: 'imageUrl', type: 'string', title: 'Image URL (Optional)'}),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount (IDR)',
      type: 'number',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({name: 'street_address', type: 'string', title: 'Street Address'}),
        defineField({name: 'city', type: 'string', title: 'City'}),
        defineField({name: 'state_province', type: 'string', title: 'State/Province'}),
        defineField({name: 'postal_code', type: 'string', title: 'Postal Code'}),
        defineField({name: 'country', type: 'string', title: 'Country'}),
        defineField({name: 'phone_number', type: 'string', title: 'Phone Number'}),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: { /* ... list ... */ },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: { /* ... list ... */ },
      initialValue: 'pending_confirmation',
      validation: (Rule) => Rule.required(),
    }),
    // --- MODIFIED FIELD ---
    defineField({
      name: 'paymentGatewayResponse',
      title: 'Payment Gateway Response (JSON String)',
      type: 'text', // Use 'text' to store as a string
      rows: 5,     // Show a multi-line text input in the Studio
      // Correctly type the 'hidden' callback argument
      hidden: ({ document }: ConditionalPropertyCallbackContext) => !document?.paymentGatewayResponse,
    }),
    // --- END MODIFICATION ---
    defineField({
      name: 'notes',
      title: 'Order Notes (Internal)',
      type: 'text',
    }),
  ],
  preview: { /* ... your preview config ... */ },
})