import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Author {
  id: number;
  name: string;
  booksCount: number;
  pagesRead: number;
  avatar: string;
  nationality: string;
  books: string[];
}

const mockAuthors: Author[] = [
  {
    id: 1,
    name: 'Фёдор Достоевский',
    booksCount: 3,
    pagesRead: 1850,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    nationality: '🇷🇺 Россия',
    books: ['Преступление и наказание', 'Идиот', 'Братья Карамазовы']
  },
  {
    id: 2,
    name: 'Михаил Булгаков',
    booksCount: 2,
    pagesRead: 920,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    nationality: '🇷🇺 Россия',
    books: ['Мастер и Маргарита', 'Собачье сердце']
  },
  {
    id: 3,
    name: 'Лев Толстой',
    booksCount: 2,
    pagesRead: 2100,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    nationality: '🇷🇺 Россия',
    books: ['Война и мир', 'Анна Каренина']
  },
  {
    id: 4,
    name: 'Джордж Оруэлл',
    booksCount: 2,
    pagesRead: 650,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
    nationality: '🇬🇧 Великобритания',
    books: ['1984', 'Скотный двор']
  },
  {
    id: 5,
    name: 'Джоан Роулинг',
    booksCount: 7,
    pagesRead: 3500,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    nationality: '🇬🇧 Великобритания',
    books: ['Гарри Поттер (серия)', 'Случайная вакансия']
  },
  {
    id: 6,
    name: 'Айн Рэнд',
    booksCount: 2,
    pagesRead: 2000,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    nationality: '🇺🇸 США',
    books: ['Атлант расправил плечи', 'Источник']
  },
  {
    id: 7,
    name: 'Рэй Брэдбери',
    booksCount: 3,
    pagesRead: 890,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    nationality: '🇺🇸 США',
    books: ['451 градус по Фаренгейту', 'Марсианские хроники', 'Вино из одуванчиков']
  },
  {
    id: 8,
    name: 'Антон Чехов',
    booksCount: 4,
    pagesRead: 780,
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop',
    nationality: '🇷🇺 Россия',
    books: ['Вишневый сад', 'Три сестры', 'Чайка', 'Дядя Ваня']
  }
];

export default function Authors() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAuthors = mockAuthors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.nationality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topAuthor = mockAuthors.reduce((prev, current) => 
    prev.pagesRead > current.pagesRead ? prev : current
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur-sm animate-fade-in">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
              <Icon name="Users" className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Авторы
              </h1>
              <p className="text-sm text-muted-foreground">Ваш личный каталог писателей</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-gradient-to-br from-primary to-secondary text-white border-0 animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={topAuthor.avatar}
                  alt={topAuthor.name}
                  className="w-24 h-24 rounded-full border-4 border-white/30 object-cover"
                />
                <div className="absolute -top-2 -right-2 bg-amber-400 p-2 rounded-full">
                  <Icon name="Crown" size={20} className="text-amber-900" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm opacity-90 mb-1">Любимый автор</div>
                <div className="text-2xl font-heading font-bold mb-2">{topAuthor.name}</div>
                <div className="flex gap-6 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Icon name="BookOpen" size={16} />
                    {topAuthor.booksCount} книг
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="FileText" size={16} />
                    {topAuthor.pagesRead.toLocaleString()} страниц
                  </span>
                  <span>{topAuthor.nationality}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 animate-fade-in">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Поиск по имени или стране..."
              className="pl-10 h-12 border-2 focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author, index) => (
            <Card
              key={author.id}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in border-2 hover:border-primary"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover group-hover:scale-110 transition-transform border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg mb-1">{author.name}</h3>
                    <p className="text-sm text-muted-foreground">{author.nationality}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div>
                    <div className="text-2xl font-heading font-bold text-primary">{author.booksCount}</div>
                    <div className="text-xs text-muted-foreground">книг</div>
                  </div>
                  <div>
                    <div className="text-2xl font-heading font-bold text-secondary">
                      {(author.pagesRead / 1000).toFixed(1)}k
                    </div>
                    <div className="text-xs text-muted-foreground">страниц</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Прочитанные книги:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {author.books.slice(0, 3).map((book, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {book.length > 20 ? book.substring(0, 20) + '...' : book}
                      </Badge>
                    ))}
                    {author.books.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{author.books.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAuthors.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Icon name="UserX" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Авторы не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </main>
    </div>
  );
}
