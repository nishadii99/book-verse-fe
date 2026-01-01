import { Link } from 'react-router-dom';
import { Book, Sparkles, ArrowRight, BookOpen, Users, Truck, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';

const features = [
  {
    icon: BookOpen,
    title: 'Vast Collection',
    description: 'Explore thousands of books across every genre imaginable.',
  },
  {
    icon: Users,
    title: 'Community Reviews',
    description: 'Read authentic reviews from fellow book lovers.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get your books delivered right to your doorstep.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="absolute inset-0 bg-book-spines opacity-30" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        
        {/* Floating book decorations */}
        <div className="absolute top-32 left-[15%] opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>
          <Library className="h-24 w-24 text-primary" />
        </div>
        <div className="absolute bottom-32 right-[10%] opacity-10 animate-float" style={{ animationDelay: '1s' }}>
          <Book className="h-16 w-16 text-accent" />
        </div>

        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground animate-fade-in border border-border/50">
              <Sparkles className="h-4 w-4 text-accent" />
              Discover Your Next Favorite Book
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl animate-slide-up">
              Welcome to{' '}
              <span className="text-gradient">BookVerse</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '100ms' }}>
              Your gateway to endless stories and knowledge. Browse our curated collection
              of books and find the perfect read for every moment.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/books">
                <Button variant="hero" size="xl" className="gap-2 shadow-elevated">
                  <Book className="h-5 w-5" />
                  Browse Books
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="xl" className="border-2">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card/50 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border bg-card/50 py-20">
        <div className="absolute inset-0 bg-gradient-paper opacity-50" />
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Why Choose BookVerse?
            </h2>
            <p className="mt-4 text-muted-foreground">
              We're passionate about connecting readers with the books they'll love.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border bg-card p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero shadow-soft">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-warm opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 text-center shadow-elevated">
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            
            {/* Floating decorative books */}
            <div className="absolute top-4 left-8 opacity-20">
              <Book className="h-8 w-8 text-primary-foreground animate-float" />
            </div>
            <div className="absolute bottom-4 right-8 opacity-20">
              <BookOpen className="h-10 w-10 text-primary-foreground animate-float" style={{ animationDelay: '1.5s' }} />
            </div>
            
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                Ready to Start Reading?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Join thousands of book lovers and discover your next great read today.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="xl" className="bg-background text-foreground hover:bg-background/90 shadow-card">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
                <Book className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-semibold">BookVerse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 BookVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
