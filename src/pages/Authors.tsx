import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { api, type Author } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const avatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop',
];

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setLoading(true);
        const data = await api.authors.getAll();
        setAuthors(data);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить авторов',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, []);

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topAuthor = authors.length > 0
    ? authors.reduce((prev, current) => 
        prev.pages_read > current.pages_read ? prev : current
      )
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка авторов...</p>
        </div>
      </div>
    );
  }

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
        {topAuthor && (
          <Card className="mb-8 bg-gradient-to-br from-primary to-secondary text-white border-0 animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={avatars[0]}
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
                      {topAuthor.books_count} книг
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="FileText" size={16} />
                      {topAuthor.pages_read.toLocaleString()} страниц
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 animate-fade-in">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Поиск по имени автора..."
              className="pl-10 h-12 border-2 focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author, index) => (
            <Card
              key={author.name}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in border-2 hover:border-primary"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={avatars[index % avatars.length]}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover group-hover:scale-110 transition-transform border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg mb-1">{author.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div>
                    <div className="text-2xl font-heading font-bold text-primary">{author.books_count}</div>
                    <div className="text-xs text-muted-foreground">книг</div>
                  </div>
                  <div>
                    <div className="text-2xl font-heading font-bold text-secondary">
                      {(author.pages_read / 1000).toFixed(1)}k
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

        {filteredAuthors.length === 0 && authors.length > 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Icon name="UserX" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Авторы не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить поисковый запрос</p>
          </div>
        )}

        {authors.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Icon name="Users" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Нет авторов</h3>
            <p className="text-muted-foreground">Добавьте книги, чтобы увидеть авторов</p>
          </div>
        )}
      </main>
    </div>
  );
}
