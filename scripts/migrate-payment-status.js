// Jalankan script ini dengan `sanity exec scripts/migrate-payment-status.js --with-user-token`
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function migratePaymentStatus() {
  // Ubah settlement dan pending menjadi paid jika orderStatus sudah delivered/confirmed/processing/shipped
  const orders = await client.fetch('*[_type == "order" && paymentStatus in ["settlement", "pending"]]{_id, orderStatus, paymentStatus}')
  if (!orders.length) {
    console.log('No orders with paymentStatus "settlement" or "pending" found.')
    return
  }
  console.log(`Migrating ${orders.length} orders...`)
  for (const order of orders) {
    // Hanya update jika orderStatus sudah bukan pending_confirmation/cancelled/refunded
    if (["confirmed", "processing", "shipped", "delivered"].includes(order.orderStatus)) {
      await client.patch(order._id).set({ paymentStatus: 'paid' }).commit()
      console.log(`Order ${order._id} migrated to paid.`)
    }
  }
  console.log('Migration complete!')
}

migratePaymentStatus().catch(console.error)
