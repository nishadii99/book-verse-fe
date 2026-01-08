// import { useState, useEffect } from 'react';
// import { Plus, Pencil, Trash2, Loader2, Search, BookOpen } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { AdminSidebar } from '@/components/layout/AdminSidebar';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { booksApi, Book } from '@/lib/api';
// import { toast } from 'sonner';

// const AdminBooks = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingBook, setEditingBook] = useState<Book | null>(null);
//   const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   // Form state
//   const [formData, setFormData] = useState({
//     title: '',
//     author: '',
//     description: '',
//     price: '',
//     quantity: '',
//     tags: '',
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   const loadBooks = async () => {
//     try {
//       const response = await booksApi.getAll();
//       setBooks(response.data || []);
//     } catch (error) {
//       console.error('Failed to load books:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = async (query: string) => {
//     setSearchQuery(query);
//     if (!query.trim()) {
//       loadBooks();
//       return;
//     }

//     try {
//       const response = await booksApi.search(query);
//       setBooks(response.data || []);
//     } catch (error) {
//       console.error('Search failed:', error);
//     }
//   };

//   const openCreateDialog = () => {
//     setEditingBook(null);
//     setFormData({
//       title: '',
//       author: '',
//       description: '',
//       price: '',
//       quantity: '',
//       tags: '',
//     });
//     setImageFile(null);
//     setIsDialogOpen(true);
//   };

//   const openEditDialog = (book: Book) => {
//     setEditingBook(book);
//     setFormData({
//       title: book.title,
//       author: book.author,
//       description: book.description,
//       price: book.price.toString(),
//       quantity: book.quantity?.toString() || '',
//       tags: book.tags.join(', '),
//     });
//     setImageFile(null);
//     setIsDialogOpen(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('title', formData.title);
//       formDataToSend.append('author', formData.author);
//       formDataToSend.append('description', formData.description);
//       formDataToSend.append('price', formData.price);
//       formDataToSend.append('quantity', formData.quantity);
//       formDataToSend.append('tags', formData.tags);
//       if (imageFile) {
//         formDataToSend.append('image', imageFile);
//       }

//       if (editingBook) {
//         await booksApi.update(editingBook._id, formDataToSend);
//         toast.success('Book updated successfully!');
//       } else {
//         await booksApi.create(formDataToSend);
//         toast.success('Book created successfully!');
//       }

//       setIsDialogOpen(false);
//       loadBooks();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to save book');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteBookId) return;

//     try {
//       await booksApi.delete(deleteBookId);
//       toast.success('Book deleted successfully!');
//       setDeleteBookId(null);
//       loadBooks();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to delete book');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <AdminSidebar />

//       <main className="ml-64 p-8">
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="font-display text-3xl font-bold text-foreground">
//               Books Management
//             </h1>
//             <p className="mt-2 text-muted-foreground">
//               Add, edit, and manage your book inventory
//             </p>
//           </div>

//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button variant="hero" onClick={openCreateDialog}>
//                 <Plus className="h-4 w-4" />
//                 Add Book
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle className="font-display">
//                   {editingBook ? 'Edit Book' : 'Add New Book'}
//                 </DialogTitle>
//               </DialogHeader>

//               <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Title</Label>
//                   <Input
//                     id="title"
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="author">Author</Label>
//                   <Input
//                     id="author"
//                     value={formData.author}
//                     onChange={(e) => setFormData({ ...formData, author: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     rows={3}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="price">Price ($)</Label>
//                     <Input
//                       id="price"
//                       type="number"
//                       step="0.01"
//                       value={formData.price}
//                       onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                       required
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="quantity">Quantity</Label>
//                     <Input
//                       id="quantity"
//                       type="number"
//                       value={formData.quantity}
//                       onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="tags">Tags (comma separated)</Label>
//                   <Input
//                     id="tags"
//                     value={formData.tags}
//                     onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
//                     placeholder="Fiction, Fantasy, Adventure"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="image">Cover Image</Label>
//                   <Input
//                     id="image"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setImageFile(e.target.files?.[0] || null)}
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => setIsDialogOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" variant="hero" className="flex-1" disabled={isSaving}>
//                     {isSaving ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Saving...
//                       </>
//                     ) : editingBook ? (
//                       'Update Book'
//                     ) : (
//                       'Create Book'
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Search */}
//         <div className="relative mb-6 max-w-md">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search books..."
//             value={searchQuery}
//             onChange={(e) => handleSearch(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         {/* Books Table */}
//         {isLoading ? (
//           <div className="flex items-center justify-center py-20">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           </div>
//         ) : books.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 text-center">
//             <BookOpen className="h-16 w-16 text-muted-foreground/50" />
//             <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
//               No books found
//             </h3>
//             <p className="mt-2 text-muted-foreground">
//               Start by adding your first book
//             </p>
//           </div>
//         ) : (
//           <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
//             <table className="w-full">
//               <thead className="bg-muted/50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                     Book
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                     Author
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                     Price
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                     Stock
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {books.map((book) => (
//                   <tr key={book._id} className="hover:bg-muted/30 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded bg-muted">
//                           {book.imageURL ? (
//                             <img
//                               src={book.imageURL}
//                               alt={book.title}
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             <div className="flex h-full w-full items-center justify-center">
//                               <BookOpen className="h-4 w-4 text-muted-foreground" />
//                             </div>
//                           )}
//                         </div>
//                         <span className="font-medium text-foreground">{book.title}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-muted-foreground">
//                       {book.author}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-semibold text-foreground">
//                       ${book.price.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-muted-foreground">
//                       {book.quantity ?? 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => openEditDialog(book)}
//                         >
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-destructive hover:text-destructive"
//                           onClick={() => setDeleteBookId(book._id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Delete Confirmation */}
//         <AlertDialog open={!!deleteBookId} onOpenChange={() => setDeleteBookId(null)}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Delete Book</AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to delete this book? This action cannot be undone.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={handleDelete}
//                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//               >
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </main>
//     </div>
//   );
// };

// export default AdminBooks;

import { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  BookOpen,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { booksApi, Book } from '@/lib/api';
import { toast } from 'sonner';

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    quantity: '',
    tags: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await booksApi.getAll();
      setBooks(response.data || []);
    } catch {
      toast.error('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return loadBooks();

    try {
      const response = await booksApi.search(query);
      setBooks(response.data || []);
    } catch {
      toast.error('Search failed');
    }
  };

  const openCreateDialog = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      price: '',
      quantity: '',
      tags: '',
    });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price.toString(),
      quantity: book.quantity?.toString() || '',
      tags: book.tags.join(', '),
    });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editingBook) {
        await booksApi.update(editingBook._id, fd);
        toast.success('Book updated');
      } else {
        await booksApi.create(fd);
        toast.success('Book created');
      }

      setIsDialogOpen(false);
      loadBooks();
    } catch {
      toast.error('Failed to save book');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBookId) return;

    try {
      await booksApi.delete(deleteBookId);
      toast.success('Book deleted');
      setDeleteBookId(null);
      loadBooks();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 h-full w-64 transform bg-background transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Main */}
      <main className="p-4 md:ml-64 md:p-8">
        {/* Mobile header */}
        <div className="mb-6 flex items-center justify-between md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-border p-2"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-bold">Books</h1>
        </div>

        {/* Desktop header */}
        <div className="mb-8 hidden md:flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Books Management</h1>
            <p className="mt-2 text-muted-foreground">
              Add, edit, and manage your book inventory
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={openCreateDialog}>
                <Plus className="h-4 w-4" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Cover Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImageFile(e.target.files?.[0] || null)
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : editingBook ? (
                      'Update'
                    ) : (
                      'Create'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-card shadow-soft">
            <table className="min-w-[700px] w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">
                      {book.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ${book.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {book.quantity ?? 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(book)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setDeleteBookId(book._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete dialog */}
        <AlertDialog
          open={!!deleteBookId}
          onOpenChange={() => setDeleteBookId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Book</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default AdminBooks;

