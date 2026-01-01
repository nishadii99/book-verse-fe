import { Order } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

interface AdminOrdersListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: string) => void;
}

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

const statusOptions = ['PENDING PAYMENT', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export const AdminOrdersList = ({ orders, onUpdateStatus }: AdminOrdersListProps) => {
  if (orders.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
          <p className="mt-4 text-lg font-medium">No orders yet</p>
          <p className="text-muted-foreground">Orders will appear here when customers place them</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const userEmail = typeof order.userId === 'object' ? order.userId.email : 'Unknown';
        
        return (
          <Card key={order._id} className="border-border/50">
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
                    {userEmail} • {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <Select
                  value={order.status}
                  onValueChange={(value) => onUpdateStatus(order._id, value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
        );
      })}
    </div>
  );
};
