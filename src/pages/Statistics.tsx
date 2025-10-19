import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface MonthData {
  month: string;
  books: number;
  pages: number;
}

const mockMonthlyData: MonthData[] = [
  { month: 'Янв', books: 3, pages: 850 },
  { month: 'Фев', books: 2, pages: 620 },
  { month: 'Мар', books: 4, pages: 1200 },
  { month: 'Апр', books: 3, pages: 780 },
  { month: 'Май', books: 5, pages: 1450 },
  { month: 'Июн', books: 2, pages: 540 },
  { month: 'Июл', books: 4, pages: 980 },
  { month: 'Авг', books: 3, pages: 720 },
];

const genreData = [
  { name: 'Классика', count: 8, color: 'bg-purple-500' },
  { name: 'Фантастика', count: 5, color: 'bg-pink-500' },
  { name: 'Детектив', count: 3, color: 'bg-orange-500' },
  { name: 'Биография', count: 2, color: 'bg-amber-500' },
];

export default function Statistics() {
  const maxBooks = Math.max(...mockMonthlyData.map(d => d.books));
  const totalBooks = mockMonthlyData.reduce((sum, d) => sum + d.books, 0);
  const totalPages = mockMonthlyData.reduce((sum, d) => sum + d.pages, 0);
  const avgBooksPerMonth = (totalBooks / mockMonthlyData.length).toFixed(1);
  const avgPagesPerMonth = Math.round(totalPages / mockMonthlyData.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur-sm animate-fade-in">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
              <Icon name="BarChart3" className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Статистика чтения
              </h1>
              <p className="text-sm text-muted-foreground">Ваш прогресс за 2024 год</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Всего книг</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">{totalBooks}</div>
              <p className="text-xs opacity-75 mt-1">за 8 месяцев</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Страниц</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">{totalPages.toLocaleString()}</div>
              <p className="text-xs opacity-75 mt-1">прочитано</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">В среднем</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">{avgBooksPerMonth}</div>
              <p className="text-xs opacity-75 mt-1">книг в месяц</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Страниц/месяц</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">{avgPagesPerMonth}</div>
              <p className="text-xs opacity-75 mt-1">в среднем</p>
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
              <div className="space-y-6">
                {mockMonthlyData.map((data, index) => (
                  <div key={data.month} className="space-y-2" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="BookOpen" size={14} />
                          {data.books} книг
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="FileText" size={14} />
                          {data.pages} стр.
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={(data.books / maxBooks) * 100} 
                        className="h-3"
                      />
                      <div 
                        className="absolute top-0 left-0 h-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${(data.books / maxBooks) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="PieChart" className="text-primary" />
                  По жанрам
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {genreData.map((genre, index) => (
                  <div key={genre.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{genre.name}</span>
                      <span className="text-muted-foreground">{genre.count} книг</span>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${genre.color} transition-all duration-500`}
                        style={{ 
                          width: `${(genre.count / totalBooks) * 100}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-secondary text-white border-0 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon name="Target" />
                  Годовая цель
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-5xl font-heading font-bold mb-2">
                    {totalBooks}/50
                  </div>
                  <p className="text-sm opacity-90 mb-4">книг прочитано</p>
                  <Progress 
                    value={(totalBooks / 50) * 100} 
                    className="h-3 bg-white/20"
                  />
                  <p className="text-xs opacity-75 mt-3">
                    Осталось {50 - totalBooks} книг до цели
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-scale-in" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Award" className="text-primary" />
                  Достижения
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
                  <div className="bg-amber-500 p-2 rounded-full">
                    <Icon name="Star" className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Книжный червь</div>
                    <div className="text-xs text-muted-foreground">5 книг за месяц</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="bg-purple-500 p-2 rounded-full">
                    <Icon name="Flame" className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Читающий марафон</div>
                    <div className="text-xs text-muted-foreground">1000+ страниц</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <div className="bg-orange-500 p-2 rounded-full">
                    <Icon name="Zap" className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Скорочтение</div>
                    <div className="text-xs text-muted-foreground">4 книги в месяц</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
