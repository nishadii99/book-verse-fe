import { Book } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const { addToCart } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleAddToCart = () => {
    addToCart(book, 1);
    toast.success(`"${book.title}" added to cart!`);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {book.imageURL ? (
          <img
            src={book.imageURL}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-soft">
            <BookOpen className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        {/* Tags overlay */}
        {book.tags && book.tags.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
            {book.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">by {book.author}</p>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {book.description}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl font-bold text-primary">
              ${book.price.toFixed(2)}
            </span>
            {book.quantity !== undefined && (
              <span className="text-xs text-muted-foreground">
                {book.quantity} in stock
              </span>
            )}
          </div>

          {isAuthenticated && !isAdmin && (
            <Button
              variant="hero"
              size="sm"
              className="mt-3 w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
