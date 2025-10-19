import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AddBookDialog from '@/components/AddBookDialog';
import EditBookDialog from '@/components/EditBookDialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api, type Book as APIBook } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type BookStatus = 'read' | 'wishlist' | 'all';

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

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await api.books.getAll();
      const mappedBooks: Book[] = data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        status: book.status,
        cover: book.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        year: book.year,
        rating: book.rating,
        pages: book.pages,
      }));
      setBooks(mappedBooks);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить книги',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleAddBook = async (newBook: Book) => {
    try {
      const bookData = {
        title: newBook.title,
        author: newBook.author,
        status: newBook.status,
        cover_url: newBook.cover,
        year: newBook.year,
        pages: newBook.pages,
        rating: newBook.rating,
      };
      
      await api.books.create(bookData);
      await loadBooks();
      
      toast({
        title: 'Готово!',
        description: 'Книга добавлена в библиотеку',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить книгу',
        variant: 'destructive',
      });
    }
  };

  const handleEditBook = async (updatedBook: Book) => {
    try {
      const bookData = {
        id: updatedBook.id,
        title: updatedBook.title,
        author: updatedBook.author,
        status: updatedBook.status,
        cover_url: updatedBook.cover,
        year: updatedBook.year,
        pages: updatedBook.pages,
        rating: updatedBook.rating,
      };
      
      await api.books.update(bookData);
      await loadBooks();
      
      toast({
        title: 'Готово!',
        description: 'Книга обновлена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить книгу',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    
    try {
      await api.books.delete(selectedBook.id);
      await loadBooks();
      
      toast({
        title: 'Готово!',
        description: 'Книга удалена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить книгу',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBook(null);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesTab = activeTab === 'all' || book.status === activeTab;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    totalRead: books.filter(b => b.status === 'read').length,
    totalWishlist: books.filter(b => b.status === 'wishlist').length,
    totalPages: books.filter(b => b.status === 'read').reduce((sum, b) => sum + (b.pages || 0), 0),
    avgRating: books.filter(b => b.rating).length > 0 
      ? (books.filter(b => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) / books.filter(b => b.rating).length).toFixed(1)
      : '0.0'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка библиотеки...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 animate-fade-in">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
                <Icon name="BookOpen" className="text-white" size={28} />
              </div>
              <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Моя Библиотека
              </h1>
            </div>
            <div className="flex gap-3">
              <Link to="/statistics">
                <Button variant="outline" className="gap-2">
                  <Icon name="BarChart3" size={20} />
                  Статистика
                </Button>
              </Link>
              <Link to="/authors">
                <Button variant="outline" className="gap-2">
                  <Icon name="Users" size={20} />
                  Авторы
                </Button>
              </Link>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                onClick={() => setDialogOpen(true)}
              >
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить книгу
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Прочитано</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">{stats.totalRead}</div>
              <p className="text-xs opacity-75 mt-1">книг завершено</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">В планах</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">{stats.totalWishlist}</div>
              <p className="text-xs opacity-75 mt-1">хочу прочитать</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Страниц</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">{stats.totalPages.toLocaleString()}</div>
              <p className="text-xs opacity-75 mt-1">всего прочитано</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Рейтинг</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-heading font-bold">{stats.avgRating}</div>
                <Icon name="Star" size={20} className="fill-yellow-200" />
              </div>
              <p className="text-xs opacity-75 mt-1">средняя оценка</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 space-y-4 animate-fade-in">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Поиск по названию или автору..."
              className="pl-10 h-12 border-2 focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
              className={activeTab === 'all' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
            >
              <Icon name="BookOpen" size={18} className="mr-2" />
              Все книги
            </Button>
            <Button
              variant={activeTab === 'read' ? 'default' : 'outline'}
              onClick={() => setActiveTab('read')}
              className={activeTab === 'read' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
            >
              <Icon name="CheckCircle2" size={18} className="mr-2" />
              Прочитанное
            </Button>
            <Button
              variant={activeTab === 'wishlist' ? 'default' : 'outline'}
              onClick={() => setActiveTab('wishlist')}
              className={activeTab === 'wishlist' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
            >
              <Icon name="Heart" size={18} className="mr-2" />
              Хочу прочитать
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <Card
              key={book.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in border-2 hover:border-primary"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={book.status === 'read' ? 'bg-green-500' : 'bg-pink-500'}>
                    {book.status === 'read' ? (
                      <>
                        <Icon name="CheckCircle2" size={14} className="mr-1" />
                        Прочитано
                      </>
                    ) : (
                      <>
                        <Icon name="Heart" size={14} className="mr-1" />
                        В планах
                      </>
                    )}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Icon name="MoreVertical" size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => { setSelectedBook(book); setEditDialogOpen(true); }}>
                        <Icon name="Pencil" size={16} className="mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => { setSelectedBook(book); setDeleteDialogOpen(true); }}
                        className="text-destructive"
                      >
                        <Icon name="Trash2" size={16} className="mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-heading font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                
                {book.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={16}
                        className={i < book.rating! ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t">
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} />
                    {book.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="FileText" size={14} />
                    {book.pages} стр.
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Icon name="BookX" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Книги не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </main>

      <AddBookDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onAddBook={handleAddBook}
      />

      <EditBookDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditBook={handleEditBook}
        book={selectedBook}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить книгу?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить "{selectedBook?.title}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBook}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;