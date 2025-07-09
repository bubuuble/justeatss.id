import { useDocumentOperation } from 'sanity'
import { DocumentActionComponent, DocumentActionProps } from 'sanity'

// Action untuk mengubah status order
function createStatusAction(label: string, newStatus: string): DocumentActionComponent {
  return function StatusAction(props: DocumentActionProps) {
    const { patch, publish } = useDocumentOperation(props.id, props.type)
    const { draft, published, onComplete } = props
    const doc = draft || published
    if (!doc || doc._type !== 'order' || doc.orderStatus === newStatus) return null

    return {
      label,
      onHandle: () => {
        patch.execute([
          {
            set: {
              orderStatus: newStatus,
              orderHistory: [
                ...(Array.isArray(doc.orderHistory) ? doc.orderHistory : []),
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  note: `Status changed to ${newStatus}`
                }
              ]
            }
          }
        ])
        publish.execute()
        onComplete()
      },
      tone: newStatus === 'cancelled' ? 'critical' : 'primary',
      disabled: false,
    }
  }
}

export const orderActions: DocumentActionComponent[] = [
  createStatusAction('Mark as Confirmed', 'confirmed'),
  createStatusAction('Mark as Processing', 'processing'),
  createStatusAction('Mark as Shipped', 'shipped'),
  createStatusAction('Mark as Delivered', 'delivered'),
  createStatusAction('Cancel Order', 'cancelled'),
]
