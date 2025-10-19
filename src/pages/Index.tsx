import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

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

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    status: 'read',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    year: 1967,
    rating: 5,
    pages: 480
  },
  {
    id: 2,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    status: 'read',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    year: 1866,
    rating: 5,
    pages: 671
  },
  {
    id: 3,
    title: 'Война и мир',
    author: 'Лев Толстой',
    status: 'wishlist',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    year: 1869,
    pages: 1225
  },
  {
    id: 4,
    title: '1984',
    author: 'Джордж Оруэлл',
    status: 'read',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
    year: 1949,
    rating: 5,
    pages: 328
  },
  {
    id: 5,
    title: 'Гарри Поттер',
    author: 'Джоан Роулинг',
    status: 'wishlist',
    cover: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop',
    year: 1997,
    pages: 432
  },
  {
    id: 6,
    title: 'Атлант расправил плечи',
    author: 'Айн Рэнд',
    status: 'read',
    cover: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=400&h=600&fit=crop',
    year: 1957,
    rating: 4,
    pages: 1168
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<BookStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = mockBooks.filter(book => {
    const matchesTab = activeTab === 'all' || book.status === activeTab;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    totalRead: mockBooks.filter(b => b.status === 'read').length,
    totalWishlist: mockBooks.filter(b => b.status === 'wishlist').length,
    totalPages: mockBooks.filter(b => b.status === 'read').reduce((sum, b) => sum + (b.pages || 0), 0),
    avgRating: (mockBooks.filter(b => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) / mockBooks.filter(b => b.rating).length).toFixed(1)
  };

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
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить книгу
            </Button>
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
    </div>
  );
};

export default Index;
