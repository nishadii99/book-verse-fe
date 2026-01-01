import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, ShoppingBag, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi, Order } from '@/lib/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await ordersApi.getAll();
      const userOrders = (response.data || []).filter(
        (order: Order) => order.userId._id === user?.id || order.userId.email === user?.email
      );

      setRecentOrders(userOrders.slice(0, 3));
      setStats({
        totalOrders: userOrders.length,
        totalSpent: userOrders.reduce((sum: number, order: Order) => sum + order.totalCost, 0),
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, {user?.firstname}!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here's an overview of your reading journey
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-400">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  ${stats.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <Link to="/books" className="group">
            <div className="rounded-xl border border-border bg-gradient-soft p-6 shadow-soft transition-all hover:shadow-card hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                    <Book className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Browse</p>
                    <p className="font-display text-lg font-bold text-foreground">
                      Find New Books
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Recent Orders
            </h2>
            <Link to="/my-orders">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No orders yet</p>
              <Link to="/books">
                <Button variant="hero" className="mt-4">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-border bg-card p-4 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="font-display font-semibold text-foreground">
                        ${order.totalCost.toFixed(2)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PAID'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
