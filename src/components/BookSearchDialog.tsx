import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { api, type SearchedBook } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface BookSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBook: (book: SearchedBook) => void;
}

export default function BookSearchDialog({ open, onOpenChange, onSelectBook }: BookSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchedBook[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название книги',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSearching(true);
      const books = await api.bookSearch.search(searchQuery);
      setResults(books);
      
      if (books.length === 0) {
        toast({
          title: 'Не найдено',
          description: 'Попробуйте изменить запрос',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось найти книги',
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSelectBook = (book: SearchedBook) => {
    onSelectBook(book);
    setSearchQuery('');
    setResults([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border">
        <DialogHeader>
          <DialogTitle className="text-primary font-heading">Поиск книги в интернете</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Найдите книгу и автоматически заполните информацию
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Введите название или автора..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-card/50 border-border"
            />
            <Button 
              onClick={handleSearch} 
              disabled={searching}
              className="bg-primary text-primary-foreground"
            >
              {searching ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <Icon name="Search" size={20} />
              )}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {results.map((book, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:border-primary transition-all bg-card/50 border-border"
                  onClick={() => handleSelectBook(book)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {book.cover && (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded border border-border"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-foreground mb-1 truncate">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          {book.year && (
                            <span className="flex items-center gap-1">
                              <Icon name="Calendar" size={12} />
                              {book.year}
                            </span>
                          )}
                          {book.pages && (
                            <span className="flex items-center gap-1">
                              <Icon name="FileText" size={12} />
                              {book.pages} стр.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!searching && results.length === 0 && searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="SearchX" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Введите запрос и нажмите поиск</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
