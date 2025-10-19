import { useState, useEffect } from 'react';
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

interface EditBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditBook: (book: Book) => void;
  book: Book | null;
}

export default function EditBookDialog({ open, onOpenChange, onEditBook, book }: EditBookDialogProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'read' | 'wishlist'>('wishlist');
  const [year, setYear] = useState('');
  const [pages, setPages] = useState('');
  const [rating, setRating] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setStatus(book.status);
      setYear(book.year?.toString() || '');
      setPages(book.pages?.toString() || '');
      setRating(book.rating?.toString() || '');
      setCoverPreview(book.cover);
    }
  }, [book]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!book) return;

    const updatedBook: Book = {
      id: book.id,
      title,
      author,
      status,
      cover: coverPreview || book.cover,
      year: year ? parseInt(year) : undefined,
      pages: pages ? parseInt(pages) : undefined,
      rating: rating ? parseInt(rating) : undefined,
    };

    onEditBook(updatedBook);
    onOpenChange(false);
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Редактировать книгу
          </DialogTitle>
          <DialogDescription>
            Измените информацию о книге
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="text-sm font-medium">
                  Название книги *
                </Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите название"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="edit-author" className="text-sm font-medium">
                  Автор *
                </Label>
                <Input
                  id="edit-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Введите имя автора"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="edit-status" className="text-sm font-medium">
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
                  <Label htmlFor="edit-year" className="text-sm font-medium">
                    Год
                  </Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-pages" className="text-sm font-medium">
                    Страниц
                  </Label>
                  <Input
                    id="edit-pages"
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="300"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-rating" className="text-sm font-medium">
                    Оценка
                  </Label>
                  <Input
                    id="edit-rating"
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
                    <label htmlFor="edit-cover-upload" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-lg">
                      <div className="text-white text-center">
                        <Icon name="ImagePlus" size={32} className="mx-auto mb-2" />
                        <p className="text-sm">Изменить</p>
                      </div>
                    </label>
                    <input
                      id="edit-cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                ) : (
                  <label htmlFor="edit-cover-upload" className="cursor-pointer block">
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
                      id="edit-cover-upload"
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
              <Icon name="Check" size={18} className="mr-2" />
              Сохранить изменения
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
