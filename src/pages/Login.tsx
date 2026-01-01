import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Eye, EyeOff, Loader2, BookOpen, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.roles?.includes('ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/books');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-soft opacity-50" />
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="w-full max-w-md space-y-8 animate-fade-in relative z-10">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero shadow-soft group-hover:shadow-card transition-shadow">
                <Book className="h-6 w-6 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="mt-6 font-display text-3xl font-bold text-foreground">
              Welcome Back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue your reading journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-card"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full shadow-soft"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-hero p-12 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        {/* Floating book icons */}
        <div className="absolute top-20 left-16 opacity-20">
          <Library className="h-16 w-16 text-primary-foreground animate-float" />
        </div>
        <div className="absolute bottom-32 right-20 opacity-15">
          <BookOpen className="h-20 w-20 text-primary-foreground animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="absolute top-1/2 right-12 opacity-10">
          <Book className="h-12 w-12 text-primary-foreground animate-float" style={{ animationDelay: '0.8s' }} />
        </div>
        
        <div className="relative text-center text-primary-foreground">
          <h2 className="font-display text-4xl font-bold mb-4">
            Your Literary Adventure Awaits
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Discover thousands of books, connect with fellow readers, and find your next favorite story.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
