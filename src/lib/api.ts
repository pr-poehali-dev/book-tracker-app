const API_URLS = {
  books: 'https://functions.poehali.dev/134ce821-a9eb-4c13-9da8-db7469389aaf',
  stats: 'https://functions.poehali.dev/fc06f0af-ed1b-438b-905c-89a3ed331db2',
  authors: 'https://functions.poehali.dev/31d1c33f-7405-4012-b90f-bd1c6d241848',
};

export interface Book {
  id: number;
  title: string;
  author: string;
  status: 'read' | 'wishlist';
  cover_url: string;
  year?: number;
  rating?: number;
  pages?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Author {
  name: string;
  books_count: number;
  pages_read: number;
  books: string[];
}

export interface Statistics {
  overall: {
    total_read: number;
    total_wishlist: number;
    total_pages: number;
    avg_rating: number;
  };
  monthly: Array<{
    year: number;
    month: number;
    books_count: number;
    pages_count: number;
  }>;
}

export const api = {
  books: {
    getAll: async (status?: 'read' | 'wishlist'): Promise<Book[]> => {
      const url = status ? `${API_URLS.books}?status=${status}` : API_URLS.books;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch books');
      return response.json();
    },

    create: async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<Book> => {
      const response = await fetch(API_URLS.books, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      if (!response.ok) throw new Error('Failed to create book');
      return response.json();
    },

    update: async (book: Book): Promise<Book> => {
      const response = await fetch(API_URLS.books, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      if (!response.ok) throw new Error('Failed to update book');
      return response.json();
    },

    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_URLS.books}?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete book');
    },
  },

  stats: {
    get: async (): Promise<Statistics> => {
      const response = await fetch(API_URLS.stats);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      return response.json();
    },
  },

  authors: {
    getAll: async (): Promise<Author[]> => {
      const response = await fetch(API_URLS.authors);
      if (!response.ok) throw new Error('Failed to fetch authors');
      return response.json();
    },
  },
};
