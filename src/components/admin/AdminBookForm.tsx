import { useState } from 'react';
import { booksApi, Book } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AdminBookFormProps {
  book: Book | null;
  onClose: () => void;
  onSave: () => void;
}

export const AdminBookForm = ({ book, onClose, onSave }: AdminBookFormProps) => {
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [price, setPrice] = useState(book?.price?.toString() || '');
  const [quantity, setQuantity] = useState(book?.quantity?.toString() || '');
  const [description, setDescription] = useState(book?.description || '');
  const [tags, setTags] = useState(book?.tags?.join(', ') || '');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !author.trim()) {
      toast({ title: 'Title and author are required', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('price', price || '0');
      formData.append('quantity', quantity || '0');
      formData.append('description', description);
      formData.append('tags', tags);
      if (image) {
        formData.append('image', image);
      }

      let response;
      if (book) {
        response = await booksApi.update(book._id, formData);
      } else {
        response = await booksApi.create(formData);
      }

      if (response.data) {
        toast({ title: book ? 'Book updated!' : 'Book created!' });
        onSave();
      } else {
        toast({ title: 'Failed to save book', description: response.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error saving book', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {book ? 'Edit Book' : 'Add New Book'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Book description"
              disabled={isLoading}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Fantasy, Fiction, Adventure"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Cover Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Book'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
