import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi, Order } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package, Loader2, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING PAYMENT':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'PAID':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'SHIPPED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getAll();
      // Filter orders for current user if customer
      const userOrders = response.data?.filter(order => {
        const orderUserId = typeof order.userId === 'object' ? order.userId._id : order.userId;
        return orderUserId === user?.id;
      }) || [];
      setOrders(userOrders);
    } catch {
      toast({ title: 'Failed to load orders', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 font-serif text-3xl font-bold">My Orders</h1>

        {orders.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium">No orders yet</p>
              <p className="text-muted-foreground">Start shopping to see your orders here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} className="border-border/50 transition-shadow hover:shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Package className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-medium">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.bookId ? (
                            typeof item.bookId === 'object' ? item.bookId.title : 'Book'
                          ) : (
                            'Unknown Book'
                          )}{' '}
                          × {item.quantity}
                        </span>
                        <span>
                          ${item.bookId && typeof item.bookId === 'object'
                            ? (item.bookId.price * item.quantity).toFixed(2)
                            : '0.00'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${order.totalCost.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
