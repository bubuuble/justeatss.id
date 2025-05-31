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
    }),    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Settlement (Paid)', value: 'settlement' },
          { title: 'Capture', value: 'capture' },
          { title: 'Deny', value: 'deny' },
          { title: 'Cancel', value: 'cancel' },
          { title: 'Expire', value: 'expire' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refund', value: 'refund' },
          { title: 'Partial Refund', value: 'partial_refund' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: '🕐 Pending Confirmation', value: 'pending_confirmation' },
          { title: '✅ Confirmed', value: 'confirmed' },
          { title: '👨‍🍳 Processing', value: 'processing' },
          { title: '📦 Ready for Pickup', value: 'ready_for_pickup' },
          { title: '🚚 Shipped', value: 'shipped' },
          { title: '🏠 Delivered', value: 'delivered' },
          { title: '❌ Cancelled', value: 'cancelled' },
          { title: '↩️ Returned', value: 'returned' },
        ],
      },
      initialValue: 'pending_confirmation',
      validation: (Rule) => Rule.required(),
    }),    // Payment Information Section
    defineField({
      name: 'paymentDetails',
      title: 'Payment Details',
      type: 'object',
      fields: [
        defineField({
          name: 'transactionId',
          title: 'Transaction ID (Midtrans)',
          type: 'string',
          readOnly: true,
        }),
        defineField({
          name: 'paymentType',
          title: 'Payment Type',
          type: 'string',
          readOnly: true,
        }),
        defineField({
          name: 'bank',
          title: 'Bank',
          type: 'string',
          readOnly: true,
        }),
        defineField({
          name: 'transactionTime',
          title: 'Transaction Time',
          type: 'datetime',
          readOnly: true,
        }),
        defineField({
          name: 'settlementTime',
          title: 'Settlement Time',
          type: 'datetime',
          readOnly: true,
        }),
        defineField({
          name: 'fraudStatus',
          title: 'Fraud Status',
          type: 'string',
          readOnly: true,
        }),
      ],
    }),// --- MODIFIED FIELD ---
    defineField({
      name: 'paymentGatewayResponse',
      title: 'Payment Gateway Response (JSON String)',
      type: 'text', // Use 'text' to store as a string
      rows: 5,     // Show a multi-line text input in the Studio
      // Correctly type the 'hidden' callback argument
      hidden: ({ document }: ConditionalPropertyCallbackContext) => !document?.paymentGatewayResponse,
      readOnly: true,
    }),
    // --- END MODIFICATION ---
    
    // Admin Management Fields
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes for admin use',
    }),
    defineField({
      name: 'orderNotes',
      title: 'Order Notes (Customer Visible)',
      type: 'text',
      rows: 2,
      description: 'Notes that can be visible to customer (delivery instructions, etc.)',
    }),
    defineField({
      name: 'customerNotes',
      title: 'Customer Notes',
      type: 'text',
      rows: 2,
      description: 'Notes from customer',
      readOnly: true,
    }),
    defineField({
      name: 'orderHistory',
      title: 'Order Status History',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
            }),
            defineField({
              name: 'timestamp',
              title: 'Timestamp',
              type: 'datetime',
            }),
            defineField({
              name: 'note',
              title: 'Note',
              type: 'string',
            }),
            defineField({
              name: 'updatedBy',
              title: 'Updated By',
              type: 'string',
            }),
          ],
        },
      ],
      readOnly: true,
    }),
    defineField({
      name: 'estimatedDelivery',
      title: 'Estimated Delivery Date',
      type: 'datetime',
      description: 'When the order is expected to be delivered',
    }),
    defineField({
      name: 'actualDelivery',
      title: 'Actual Delivery Date',
      type: 'datetime',
      description: 'When the order was actually delivered',
      readOnly: true,
    }),  ],
  preview: {
    select: {
      orderId: 'orderId',
      userName: 'userName',
      userEmail: 'userEmail',
      totalAmount: 'totalAmount',
      orderStatus: 'orderStatus',
      paymentStatus: 'paymentStatus',
      createdAt: '_createdAt',
    },
    prepare(selection) {
      const { orderId, userName, userEmail, totalAmount, orderStatus, paymentStatus } = selection;
      
      // Status emojis
      const statusEmojis: Record<string, string> = {
        pending_confirmation: '🕐',
        confirmed: '✅',
        processing: '👨‍🍳',
        ready_for_pickup: '📦',
        shipped: '🚚',
        delivered: '🏠',
        cancelled: '❌',
        returned: '↩️',
      };
      
      const paymentEmojis: Record<string, string> = {
        pending: '⏳',
        settlement: '💰',
        capture: '💳',
        failed: '❌',
        deny: '🚫',
        cancel: '❌',
        expire: '⏰',
        refund: '↩️',
      };
      
      const statusEmoji = statusEmojis[orderStatus] || '📄';
      const paymentEmoji = paymentEmojis[paymentStatus] || '💳';
      
      return {
        title: `${statusEmoji} Order #${orderId?.slice(-8) || 'N/A'}`,
        subtitle: `${userName || userEmail || 'Unknown'} • ${paymentEmoji} ${paymentStatus} • IDR ${totalAmount?.toLocaleString() || '0'}`,
        media: ShoppingCartIcon,
      };
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Oldest First', 
      name: 'oldestFirst',
      by: [{ field: '_createdAt', direction: 'asc' }],
    },
    {
      title: 'Highest Amount',
      name: 'highestAmount',
      by: [{ field: 'totalAmount', direction: 'desc' }],
    },
    {
      title: 'Order Status',
      name: 'orderStatus',
      by: [{ field: 'orderStatus', direction: 'asc' }],
    },
    {
      title: 'Payment Status',
      name: 'paymentStatus', 
      by: [{ field: 'paymentStatus', direction: 'asc' }],
    },
  ],
})