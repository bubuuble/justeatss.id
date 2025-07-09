// Jalankan script ini dengan `sanity exec scripts/migrate-settlement-to-paid.js --with-user-token`
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function migrateSettlementToPaid() {
  const orders = await client.fetch('*[_type == "order" && paymentStatus == "settlement"]{_id}')
  if (!orders.length) {
    console.log('No orders with paymentStatus "settlement" found.')
    return
  }
  console.log(`Migrating ${orders.length} orders...`)
  for (const order of orders) {
    await client.patch(order._id).set({ paymentStatus: 'paid' }).commit()
    console.log(`Order ${order._id} migrated to paid.`)
  }
  console.log('Migration complete!')
}

migrateSettlementToPaid().catch(console.error)
