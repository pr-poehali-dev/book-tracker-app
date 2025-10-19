import { useState } from 'react';
import BookSearchDialog from '@/components/BookSearchDialog';
import { type SearchedBook } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Book {
  id: number;
  title: string;
  author: string;
  status: 'read' | 'wishlist';
  cover: string;
  year?: number;
  rating?: number;
  pages?: number;
}

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBook: (book: Book) => void;
}

export default function AddBookDialog({ open, onOpenChange, onAddBook }: AddBookDialogProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'read' | 'wishlist'>('wishlist');
  const [year, setYear] = useState('');
  const [pages, setPages] = useState('');
  const [rating, setRating] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSearchedBook = (book: SearchedBook) => {
    setTitle(book.title);
    setAuthor(book.author);
    if (book.year) setYear(book.year.toString());
    if (book.pages) setPages(book.pages.toString());
    if (book.cover) setCoverPreview(book.cover);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBook: Book = {
      id: Date.now(),
      title,
      author,
      status,
      cover: coverPreview || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
      year: year ? parseInt(year) : undefined,
      pages: pages ? parseInt(pages) : undefined,
      rating: rating ? parseInt(rating) : undefined,
    };

    onAddBook(newBook);
    
    setTitle('');
    setAuthor('');
    setStatus('wishlist');
    setYear('');
    setPages('');
    setRating('');
    setCoverPreview('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-heading text-primary">
                Добавить книгу
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Заполните информацию о книге и загрузите обложку
              </DialogDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSearchDialogOpen(true)}
              className="gap-2 border-primary/30 hover:bg-primary/10"
            >
              <Icon name="Globe" size={18} />
              Найти в интернете
            </Button>
          </div>
        </DialogHeader>

        <BookSearchDialog
          open={searchDialogOpen}
          onOpenChange={setSearchDialogOpen}
          onSelectBook={handleSelectSearchedBook}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Название книги *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите название"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="author" className="text-sm font-medium">
                  Автор *
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Введите имя автора"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Статус *
                </Label>
                <Select value={status} onValueChange={(value) => setStatus(value as 'read' | 'wishlist')}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wishlist">
                      <div className="flex items-center gap-2">
                        <Icon name="Heart" size={16} />
                        Хочу прочитать
                      </div>
                    </SelectItem>
                    <SelectItem value="read">
                      <div className="flex items-center gap-2">
                        <Icon name="CheckCircle2" size={16} />
                        Прочитано
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="year" className="text-sm font-medium">
                    Год
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="pages" className="text-sm font-medium">
                    Страниц
                  </Label>
                  <Input
                    id="pages"
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="300"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="rating" className="text-sm font-medium">
                    Оценка
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="5"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Обложка книги</Label>
              <div className="mt-1.5 border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                {coverPreview ? (
                  <div className="relative group">
                    <img
                      src={coverPreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setCoverPreview('')}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="cover-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="bg-primary/10 p-4 rounded-full mb-3">
                        <Icon name="ImagePlus" size={32} className="text-primary" />
                      </div>
                      <p className="text-sm font-medium mb-1">Загрузить обложку</p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG до 5MB
                      </p>
                    </div>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить книгу
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}