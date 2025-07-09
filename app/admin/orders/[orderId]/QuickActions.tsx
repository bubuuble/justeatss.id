// app/admin/orders/[orderId]/QuickActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
}

const STATUS_ACTIONS = [
  {
    id: 'confirmed',
    label: 'Mark as Confirmed',
    icon: '✅',
    color: 'bg-green-600 hover:bg-green-700',
    status: 'confirmed',
    allowedFromStatuses: ['pending_confirmation']
  },
  {
    id: 'processing',
    label: 'Mark as Processing',
    icon: '⚙️',
    color: 'bg-blue-600 hover:bg-blue-700',
    status: 'processing',
    allowedFromStatuses: ['confirmed', 'settlement']
  },
  {
    id: 'shipped',
    label: 'Mark as Shipped',
    icon: '🚚',
    color: 'bg-purple-600 hover:bg-purple-700',
    status: 'shipped',
    allowedFromStatuses: ['confirmed', 'processing'] // Allow from both confirmed and processing
  },
  {
    id: 'delivered',
    label: 'Mark as Delivered',
    icon: '📦',
    color: 'bg-emerald-600 hover:bg-emerald-700',
    status: 'delivered',
    allowedFromStatuses: ['shipped']
  },
  {
    id: 'cancelled',
    label: 'Cancel Order',
    icon: '❌',
    color: 'bg-red-600 hover:bg-red-700',
    status: 'cancelled',
    allowedFromStatuses: ['pending_confirmation', 'confirmed', 'processing', 'shipped', 'settlement']
  }
];

export default function QuickActions({ orderId, currentStatus, currentPaymentStatus }: QuickActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Enhanced debug logging
  console.log('🔧 QuickActions Debug Info:', {
    orderId,
    currentStatus,
    currentPaymentStatus,
    timestamp: new Date().toISOString()
  });

  const allowedActions = STATUS_ACTIONS.filter(action => 
    action.allowedFromStatuses.includes(currentStatus)
  );

  const handleStatusUpdate = async (newStatus: string, actionLabel: string) => {
    try {
      setLoading(newStatus);
      setError(null);
      setSuccess(null);

      console.log('Attempting status update:', { orderId, currentStatus, newStatus, actionLabel });

      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newStatus,
          note: `${actionLabel} via Quick Actions`
        }),
      });

      const data = await response.json();
      console.log('Status update response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status');
      }

      setSuccess(`Order ${actionLabel.toLowerCase()} successfully!`);
      
      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh();
      }, 1500);

    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setLoading(null);
    }
  };

  const isActionAllowed = (action: typeof STATUS_ACTIONS[0]) => {
    return action.allowedFromStatuses.includes(currentStatus);
  };

  const getButtonOpacity = (action: typeof STATUS_ACTIONS[0]) => {
    if (!isActionAllowed(action)) return 'opacity-50 cursor-not-allowed';
    if (loading) return loading === action.status ? 'opacity-75' : 'opacity-50';
    return '';
  };

  return (
    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">⚡ Quick Actions</h2>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Current Status Info */}
      <div className="mb-4 p-3 bg-zinc-700/30 rounded-lg">
        <div className="text-sm text-zinc-300">
          <p><strong>Current Status:</strong> {currentStatus?.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Payment:</strong> {currentPaymentStatus?.toUpperCase()}</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        {STATUS_ACTIONS.map((action) => {
          const isAllowed = isActionAllowed(action);
          const isCurrentlyLoading = loading === action.status;
          
          return (            <button
              key={action.id}
              onClick={() => {
                console.log('🖱️ Button clicked:', {
                  actionId: action.id,
                  actionLabel: action.label,
                  actionStatus: action.status,
                  isAllowed,
                  isLoading: loading !== null,
                  currentStatus,
                  allowedFromStatuses: action.allowedFromStatuses
                });
                
                if (isAllowed && !loading) {
                  console.log('✅ Conditions met, calling handleStatusUpdate');
                  handleStatusUpdate(action.status, action.label);
                } else {
                  console.log('❌ Conditions not met:', {
                    isAllowed,
                    loading,
                    reason: !isAllowed ? 'Action not allowed' : 'Currently loading'
                  });
                }
              }}
              disabled={!isAllowed || loading !== null}
              className={`
                w-full px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                ${action.color}
                ${getButtonOpacity(action)}
                ${isAllowed && !loading ? 'transform hover:scale-[1.02] active:scale-[0.98]' : ''}
              `}
              title={!isAllowed ? `Cannot ${action.label.toLowerCase()} from current status` : ''}
            >
              <div className="flex items-center justify-center gap-2">
                {isCurrentlyLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-zinc-700/20 rounded-lg">
        <p className="text-xs text-zinc-400">
          💡 Actions are only available for valid status transitions. 
          {currentStatus === 'delivered' && ' Order is already delivered.'}
          {currentStatus === 'cancelled' && ' Order is cancelled - no further actions available.'}
          {currentStatus === 'refunded' && ' Order is refunded - no further actions available.'}
        </p>
      </div>

      {/* Additional Actions */}
      <div className="mt-4 pt-4 border-t border-zinc-600">
        <div className="space-y-2">
          <button
            onClick={() => router.push(`/admin/studio/structure/order;${orderId}`)}
            className="w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors text-sm"
          >
            ✏️ Edit in Studio
          </button>
          <button
            onClick={() => window.print()}
            className="w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors text-sm"
          >
            🖨️ Print Order
          </button>
        </div>
      </div>
    </div>
  );
}
