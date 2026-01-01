import { useState, useEffect } from 'react';
import { Package, Loader2, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { ordersApi, Order } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  'PENDING PAYMENT': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  'PAID': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  'SHIPPED': { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
  'DELIVERED': { icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
  'CANCELLED': { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await ordersApi.getAll();
      // Filter orders for current user
      const userOrders = (response.data || []).filter(
        (order: Order) => order.userId._id === user?.id || order.userId.email === user?.email
      );
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || statusConfig['PENDING PAYMENT'];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Orders
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage your orders
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
              No orders yet
            </h3>
            <p className="mt-2 text-muted-foreground">
              Your order history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;

              return (
                <div
                  key={order._id}
                  className="rounded-xl border border-border bg-card p-6 shadow-soft animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order ID: <span className="font-mono">{order._id}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <Badge
                      className={cn(
                        'gap-1.5',
                        status.bg,
                        status.color,
                        'border-0'
                      )}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {order.status}
                    </Badge>
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-foreground">
                            {item.bookId?.title || 'Unknown Book'} × {item.quantity}
                          </span>
                          <span className="text-muted-foreground">
                            ${((item.bookId?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <span className="font-semibold">Total</span>
                      <span className="font-display text-xl font-bold text-primary">
                        ${order.totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
