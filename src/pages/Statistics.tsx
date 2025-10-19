import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { api, type Statistics as StatsType } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

export default function Statistics() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await api.stats.get();
        setStats(data);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить статистику',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const totalBooks = stats.overall.total_read + stats.overall.total_wishlist;
  const maxBooks = stats.monthly.length > 0 
    ? Math.max(...stats.monthly.map(d => d.books_count))
    : 1;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg border border-primary/30">
                <Icon name="BarChart3" className="text-primary-foreground" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-primary">
                  Статистика чтения
                </h1>
                <p className="text-sm text-muted-foreground">Ваш прогресс</p>
              </div>
            </div>
            <Link to="/">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Icon name="Home" size={24} className="text-primary" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-all backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Прочитано</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-primary">{stats.overall.total_read}</div>
              <p className="text-xs text-muted-foreground mt-1">книг завершено</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-accent/20 hover:border-accent/40 transition-all backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Страниц</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-accent">{stats.overall.total_pages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">прочитано</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-secondary/20 hover:border-secondary/40 transition-all backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">В планах</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-secondary">{stats.overall.total_wishlist}</div>
              <p className="text-xs text-muted-foreground mt-1">хочу прочитать</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-all backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Рейтинг</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-heading font-bold text-primary">
                  {typeof stats.overall.avg_rating === 'string' 
                    ? parseFloat(stats.overall.avg_rating).toFixed(1)
                    : stats.overall.avg_rating.toFixed(1)}
                </div>
                <Icon name="Star" size={20} className="fill-primary text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">средняя оценка</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" className="text-primary" />
                Прогресс по месяцам
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.monthly.length > 0 ? (
                <div className="space-y-6">
                  {stats.monthly.map((data, index) => (
                    <div key={`${data.year}-${data.month}`} className="space-y-2" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{monthNames[data.month - 1]} {data.year}</span>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="BookOpen" size={14} />
                            {data.books_count} книг
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="FileText" size={14} />
                            {data.pages_count} стр.
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <div 
                          className="h-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500"
                          style={{ width: `${(data.books_count / maxBooks) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Нет данных по месяцам</p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary to-secondary text-white border-0 animate-scale-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon name="Target" />
                  Годовая цель
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-5xl font-heading font-bold mb-2">
                    {stats.overall.total_read}/50
                  </div>
                  <p className="text-sm opacity-90 mb-4">книг прочитано</p>
                  <Progress 
                    value={(stats.overall.total_read / 50) * 100} 
                    className="h-3 bg-white/20"
                  />
                  <p className="text-xs opacity-75 mt-3">
                    Осталось {50 - stats.overall.total_read} книг до цели
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-scale-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Award" className="text-primary" />
                  Достижения
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.overall.total_read >= 5 && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
                    <div className="bg-amber-500 p-2 rounded-full">
                      <Icon name="Star" className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Книжный червь</div>
                      <div className="text-xs text-muted-foreground">5+ книг прочитано</div>
                    </div>
                  </div>
                )}

                {stats.overall.total_pages >= 1000 && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="bg-purple-500 p-2 rounded-full">
                      <Icon name="Flame" className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Читающий марафон</div>
                      <div className="text-xs text-muted-foreground">1000+ страниц</div>
                    </div>
                  </div>
                )}

                {stats.overall.total_read >= 10 && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                    <div className="bg-orange-500 p-2 rounded-full">
                      <Icon name="Zap" className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Активный читатель</div>
                      <div className="text-xs text-muted-foreground">10+ книг</div>
                    </div>
                  </div>
                )}

                {stats.overall.total_read === 0 && stats.overall.total_wishlist === 0 && (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    Добавьте книги, чтобы получить достижения!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}