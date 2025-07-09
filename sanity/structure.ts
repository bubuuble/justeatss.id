import type {StructureResolver} from 'sanity/structure'
import { ShoppingCartIcon, CreditCardIcon, CheckCircleIcon, XCircleIcon, ClockIcon, TruckIcon, CalendarIcon, DollarSignIcon, UserIcon, AlertTriangleIcon, TrendingUpIcon } from 'lucide-react'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Justeatss Admin')
    .items([
      // Analytics & Overview Section
      S.listItem()
        .title('📊 Analytics & Overview')
        .icon(TrendingUpIcon)
        .child(
          S.list()
            .title('Analytics')
            .items([
              S.listItem()
                .title('📈 Daily Orders')
                .child(
                  S.documentTypeList('order')
                    .title('Today\'s Orders')
                    .filter('_type == "order" && _createdAt >= $today')
                    .params({
                      today: new Date().toISOString().split('T')[0]
                    })
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              
              S.listItem()
                .title('📅 This Week')
                .child(
                  S.documentTypeList('order')
                    .title('This Week\'s Orders')
                    .filter('_type == "order" && _createdAt >= $weekStart')
                    .params({
                      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                    })
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),

              S.listItem()
                .title('💰 High Value Orders')
                .child(
                  S.documentTypeList('order')
                    .title('Orders Above IDR 100,000')
                    .filter('_type == "order" && totalAmount >= 100000')
                    .defaultOrdering([{field: 'totalAmount', direction: 'desc'}])
                ),

              S.listItem()
                .title('🔄 Repeat Customers')
                .child(
                  S.documentTypeList('order')
                    .title('Orders from Repeat Customers')
                    .filter('_type == "order"')
                    .defaultOrdering([{field: 'userEmail', direction: 'asc'}, {field: '_createdAt', direction: 'desc'}])
                ),
            ])
        ),

      // Orders Management Section
      S.listItem()
        .title('📦 Orders Management')
        .icon(ShoppingCartIcon)
        .child(
          S.list()
            .title('Orders')
            .items([
              // All Orders
              S.listItem()
                .title('All Orders')
                .icon(ShoppingCartIcon)
                .child(
                  S.documentTypeList('order')
                    .title('All Orders')
                    .filter('_type == "order"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              
              // Urgent Actions Needed
              S.divider(),
              S.listItem()
                .title('🚨 Urgent Actions Needed')
                .icon(AlertTriangleIcon)
                .child(
                  S.list()
                    .title('Urgent Actions')
                    .items([
                      S.listItem()
                        .title('⚠️ Payment Failed - Action Required')
                        .child(
                          S.documentTypeList('order')
                            .title('Failed Payments Needing Review')
                            .filter('_type == "order" && paymentStatus in ["failed", "deny"] && orderStatus != "cancelled"')
                            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                        ),
                      
                      S.listItem()
                        .title('⏰ Payment Expired - Review Needed')
                        .child(
                          S.documentTypeList('order')
                            .title('Expired Payments')
                            .filter('_type == "order" && paymentStatus == "expire"')
                            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                        ),

                      S.listItem()
                        .title('🕐 Long Pending Orders (>24h)')
                        .child(
                          S.documentTypeList('order')
                            .title('Orders Pending Over 24 Hours')
                            .filter('_type == "order" && orderStatus == "pending_confirmation" && _createdAt < $yesterday')
                            .params({
                              yesterday: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                            })
                            .defaultOrdering([{field: '_createdAt', direction: 'asc'}])
                        ),
                    ])
                ),

              // Orders by Status
              S.divider(),
              S.listItem()
                .title('🕐 Pending Orders')
                .icon(ClockIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Pending Orders')
                    .filter('_type == "order" && orderStatus == "pending_confirmation"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              
              S.listItem()
                .title('✅ Confirmed Orders')
                .icon(CheckCircleIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Confirmed Orders')
                    .filter('_type == "order" && orderStatus == "confirmed"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              
              S.listItem()
                .title('🚚 Processing Orders')
                .icon(TruckIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Processing Orders')
                    .filter('_type == "order" && orderStatus in ["processing", "shipped"]')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              
              S.listItem()
                .title('✅ Completed Orders')
                .icon(CheckCircleIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Completed Orders')
                    .filter('_type == "order" && orderStatus == "delivered"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              
              S.listItem()
                .title('❌ Cancelled Orders')
                .icon(XCircleIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Cancelled Orders')
                    .filter('_type == "order" && orderStatus == "cancelled"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              
              // Payment Status
              S.divider(),
              S.listItem()
                .title('💳 Payment Pending')
                .icon(CreditCardIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Payment Pending')
                    .filter('_type == "order" && paymentStatus == "pending"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              
              S.listItem()
                .title('💰 Payment Completed')
                .icon(CheckCircleIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Payment Completed')
                    .filter('_type == "order" && paymentStatus == "paid"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              
              S.listItem()
                .title('⚠️ Payment Failed')
                .icon(XCircleIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Payment Failed')
                    .filter('_type == "order" && paymentStatus in ["failed", "deny", "cancel", "expire"]')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),

              // Customer Management
              S.divider(),
              S.listItem()
                .title('👥 Customer Views')
                .icon(UserIcon)
                .child(
                  S.list()
                    .title('Customer Management')
                    .items([
                      S.listItem()
                        .title('🏆 VIP Customers (>5 orders)')
                        .child(
                          S.documentTypeList('order')
                            .title('VIP Customers')
                            .filter('_type == "order"')
                            .defaultOrdering([{field: 'userEmail', direction: 'asc'}, {field: '_createdAt', direction: 'desc'}])
                        ),

                      S.listItem()
                        .title('🆕 First Time Customers')
                        .child(
                          S.documentTypeList('order')
                            .title('First Time Orders')
                            .filter('_type == "order"')
                            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                        ),

                      S.listItem()
                        .title('📧 Orders by Email')
                        .child(
                          S.documentTypeList('order')
                            .title('Orders Grouped by Email')
                            .filter('_type == "order"')
                            .defaultOrdering([{field: 'userEmail', direction: 'asc'}])
                        ),
                    ])
                ),

              // Time-based Views
              S.divider(),
              S.listItem()
                .title('📅 Time-based Views')
                .icon(CalendarIcon)
                .child(
                  S.list()
                    .title('Orders by Time Period')
                    .items([
                      S.listItem()
                        .title('📅 Today\'s Orders')
                        .child(
                          S.documentTypeList('order')
                            .title('Today\'s Orders')
                            .filter('_type == "order" && _createdAt >= $today')
                            .params({
                              today: new Date().toISOString().split('T')[0]
                            })
                            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                        ),

                      S.listItem()
                        .title('📅 Yesterday\'s Orders')
                        .child(
                          S.documentTypeList('order')
                            .title('Yesterday\'s Orders')
                            .filter('_type == "order" && _createdAt >= $yesterday && _createdAt < $today')
                            .params({
                              yesterday: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                              today: new Date().toISOString().split('T')[0]
                            })
                            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                        ),

                      S.listItem()
                        .title('📅 This Week')
                        .child(
                          S.documentTypeList('order')
                            .title('This Week\'s Orders')
                            .filter('_type == "order" && _createdAt >= $weekStart')
                            .params({
                              weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                            })
                            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                        ),

                      S.listItem()
                        .title('📅 This Month')
                        .child(
                          S.documentTypeList('order')
                            .title('This Month\'s Orders')
                            .filter('_type == "order" && _createdAt >= $monthStart')
                            .params({
                              monthStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
                            })
                            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                        ),
                    ])
                ),
            ])
        ),
      
      // Divider
      S.divider(),
      
      // Other content types
      ...S.documentTypeListItems().filter(listItem => 
        !['order'].includes(listItem.getId() || '')
      ),
    ])
