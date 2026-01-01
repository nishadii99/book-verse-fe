import { useState, useEffect } from 'react';
import { Search, Loader2, BookOpen, Library } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { BookCard } from '@/components/books/BookCard';
import { AISearchChat } from '@/components/books/AISearchChat';
import { booksApi, Book } from '@/lib/api';

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await booksApi.getAll();
      setBooks(response.data || []);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadBooks();
      return;
    }

    setIsSearching(true);
    try {
      const response = await booksApi.search(query);
      setBooks(response.data || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 relative">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl -z-10" />
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 right-20 opacity-5">
          <Library className="h-32 w-32 text-primary" />
        </div>
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Browse Books
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover your next great read from our collection
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books by title, author..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-card border-border shadow-soft"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Books Grid */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-muted p-6">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                  No books found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Check back later for new arrivals'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {books.map((book, index) => (
                  <div
                    key={book._id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AISearchChat />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Books;
