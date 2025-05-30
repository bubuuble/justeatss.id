# Midtrans Payment Integration - JustEatss.id

## Overview

This document outlines the complete Midtrans payment integration for the JustEatss.id e-commerce website. The integration includes payment processing, result handling, and webhook notifications.

## Features Implemented

### 1. Payment Processing
- **API Endpoint**: `/api/midtrans`
- **Method**: POST
- **Purpose**: Create Midtrans payment transactions
- **Response**: Returns payment token and redirect URL

### 2. Payment Result Pages
- **Success Page**: `/payment/success` - Displays successful payment confirmation
- **Error Page**: `/payment/error` - Handles failed payments with troubleshooting
- **Pending Page**: `/payment/pending` - Shows payment pending status with countdown

### 3. Webhook Handler
- **API Endpoint**: `/api/midtrans/notification`
- **Method**: POST
- **Purpose**: Handle payment status notifications from Midtrans
- **Security**: Validates signature for authenticity

## Configuration

### Environment Variables (.env.local)
```bash
# Midtrans Configuration
MIDTRANS_SERVER_KEY=SB-Mid-server-PO8Ufm3Jn_h5fub4CiQwmxeR
MIDTRANS_CLIENT_KEY=SB-Mid-client-q1PGPa9UjktedwwN
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-q1PGPa9UjktedwwN
MERCHANT_ID_SANDBOX=G753863671

# Base URL for callbacks
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# For Production (when you go live)
# MIDTRANS_SERVER_KEY=YOUR_PRODUCTION_SERVER_KEY
# MIDTRANS_CLIENT_KEY=YOUR_PRODUCTION_CLIENT_KEY
# NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=YOUR_PRODUCTION_CLIENT_KEY
# NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Dependencies
```json
{
  "midtrans-client": "latest"
}
```

## API Endpoints

### 1. Create Payment Transaction
**Endpoint**: `POST /api/midtrans`

**Request Body**:
```json
{
  "cartItems": [
    {
      "id": "item-id",
      "name": "Product Name",
      "price": 50000,
      "quantity": 2,
      "category": "food"
    }
  ],
  "totalAmount": 100000,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "081234567890",
  "shippingAddress": {
    "first_name": "John",
    "last_name": "Doe",
    "address": "Jl. Example No. 123",
    "city": "Jakarta",
    "postal_code": "12345",
    "phone": "081234567890"
  }
}
```

**Response**:
```json
{
  "success": true,
  "token": "payment-token",
  "redirectUrl": "https://app.sandbox.midtrans.com/snap/v1/transactions/...",
  "orderId": "ORDER-1234567890-abc123"
}
```

### 2. Payment Notification Webhook
**Endpoint**: `POST /api/midtrans/notification`

**Purpose**: Receives payment status updates from Midtrans
**Security**: Validates signature to ensure authenticity
**Handled Statuses**:
- `settlement/capture` → Order marked as paid
- `pending` → Payment pending confirmation
- `deny` → Payment denied
- `cancel/expire` → Payment cancelled/expired
- `refund/partial_refund` → Payment refunded

## Payment Flow

### 1. Customer Checkout Process
1. Customer adds items to cart
2. Customer proceeds to checkout
3. Customer selects shipping address
4. Customer clicks "Place Order"
5. System calls `/api/midtrans` to create payment
6. Customer redirected to Midtrans payment page

### 2. Payment Completion
1. Customer completes payment on Midtrans
2. Midtrans redirects to result pages:
   - Success: `/payment/success?order_id=...&transaction_status=settlement`
   - Error: `/payment/error?order_id=...&transaction_status=deny`
   - Pending: `/payment/pending?order_id=...&transaction_status=pending`

### 3. Webhook Notification
1. Midtrans sends notification to `/api/midtrans/notification`
2. System validates signature
3. System updates order status in database
4. System triggers business logic (email, inventory, etc.)

## Security Features

### 1. Signature Validation
- Validates incoming webhook notifications
- Uses SHA512 hash with server key
- Prevents unauthorized status updates

### 2. Environment Protection
- Sensitive keys stored in environment variables
- Different keys for sandbox/production
- Client keys exposed only when needed

## Testing

### Midtrans Sandbox
- **Dashboard**: https://dashboard.sandbox.midtrans.com/
- **Test Cards**: Use Midtrans provided test card numbers
- **Webhook URL**: Set to `https://your-domain.com/api/midtrans/notification`

### Test Payment Flow
1. Add items to cart
2. Proceed to checkout
3. Use test payment methods:
   - **Credit Card**: 4811 1111 1111 1114 (CVV: 123, Exp: 01/25)
   - **BCA Virtual Account**: Will generate test VA number
   - **Gopay**: Use test phone number

## Production Deployment

### 1. Update Environment Variables
```bash
MIDTRANS_IS_PRODUCTION=true
MIDTRANS_SERVER_KEY=your-production-server-key
MIDTRANS_CLIENT_KEY=your-production-client-key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your-production-client-key
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 2. Configure Midtrans Dashboard
1. Set webhook URL: `https://your-domain.com/api/midtrans/notification`
2. Enable required payment methods
3. Configure settlement settings
4. Set up email notifications

### 3. SSL Certificate
- Ensure HTTPS is enabled for webhook security
- Midtrans requires HTTPS for production webhooks

## Monitoring and Logs

### Application Logs
- Payment creation: Console logs transaction details
- Webhook processing: Logs all notification events
- Error handling: Captures and logs payment failures

### Midtrans Dashboard
- Monitor transaction status
- View payment analytics
- Download transaction reports

## Troubleshooting

### Common Issues
1. **Invalid Signature**: Check server key in environment
2. **Webhook Not Received**: Verify webhook URL in Midtrans dashboard
3. **Payment Redirect Fails**: Check NEXT_PUBLIC_BASE_URL setting
4. **Build Errors**: Ensure all payment pages use Suspense boundaries

### Debug Mode
Enable detailed logging by adding console.log statements in:
- `/api/midtrans/route.ts`
- `/api/midtrans/notification/route.ts`
- Checkout page payment flow

## Next Steps

### Recommended Enhancements
1. **Database Integration**: Save orders and track payment status
2. **Email Notifications**: Send confirmation emails
3. **Inventory Management**: Update stock after successful payment
4. **Order History**: Allow customers to view order status
5. **Refund Processing**: Handle refund requests
6. **Analytics**: Track payment success rates

### Additional Payment Methods
- Bank Transfer (Virtual Account)
- E-wallets (Gopay, OVO, DANA)
- Convenience Store (Alfamart, Indomaret)
- Cardless Credit (Akulaku, Kredivo)

## Support Contacts

- **Midtrans Support**: https://support.midtrans.com/
- **Documentation**: https://docs.midtrans.com/
- **Status Page**: https://status.midtrans.com/
