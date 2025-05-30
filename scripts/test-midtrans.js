// scripts/test-midtrans.js
// Test script for Midtrans integration
// Run with: node scripts/test-midtrans.js

const testPayment = async () => {
  try {
    const testOrder = {
      cartItems: [
        {
          id: "test-product-1",
          name: "Test Choux Cream",
          price: 25000,
          quantity: 2,
          category: "food",
          imageUrl: "/assets/choux.jpg",
          slug: "test-choux-cream"
        },
        {
          id: "test-product-2", 
          name: "Test Cookies",
          price: 15000,
          quantity: 1,
          category: "food",
          imageUrl: "/assets/cookies.jpg",
          slug: "test-cookies"
        }
      ],
      totalAmount: 65000, // (25000 * 2) + (15000 * 1)
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhone: "081234567890",
      shippingAddress: {
        first_name: "John",
        last_name: "Doe",
        address: "Jl. Test No. 123",
        city: "Jakarta",
        postal_code: "12345",
        phone: "081234567890"
      }
    };

    console.log('Testing Midtrans payment creation...');
    console.log('Test order:', JSON.stringify(testOrder, null, 2));

    const response = await fetch('http://localhost:3000/api/midtrans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(result, null, 2));

    if (response.ok && result.success) {
      console.log('✅ Payment creation successful!');
      console.log('Payment URL:', result.redirectUrl);
      console.log('Order ID:', result.orderId);
      console.log('Token:', result.token);
    } else {
      console.log('❌ Payment creation failed');
      console.log('Error:', result.message || result.error);
    }
  } catch (error) {
    console.error('❌ Error testing payment:', error.message);
  }
};

// Test webhook notification handler
const testWebhook = async () => {
  try {
    console.log('\nTesting webhook endpoint...');
    
    // Test GET request to webhook
    const getResponse = await fetch('http://localhost:3000/api/midtrans/notification');
    const getResult = await getResponse.json();
    
    console.log('Webhook GET response:', JSON.stringify(getResult, null, 2));
    
    if (getResponse.ok) {
      console.log('✅ Webhook endpoint is accessible');
    } else {
      console.log('❌ Webhook endpoint error');
    }
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
  }
};

// Run tests
(async () => {
  console.log('🧪 Starting Midtrans Integration Tests\n');
  await testPayment();
  await testWebhook();
  console.log('\n🧪 Tests completed');
})();
