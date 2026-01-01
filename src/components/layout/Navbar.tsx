import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold">Book Verse</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Button variant="ghost" asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/books" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Books
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/cart" className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/orders" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Orders
                    </Link>
                  </Button>
                </>
              )}
              <div className="ml-2 flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1">
                <span className="text-sm font-medium">{user?.firstname}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="gradient-primary text-primary-foreground">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
