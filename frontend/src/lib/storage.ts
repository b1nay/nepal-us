export interface SavedBook {
  id: string;
  filename: string;
  pdfData: any;
  lastSpread: number;
  timestamp: number;
}

const STORAGE_KEY = "oso_library_v1";

export const LibraryStorage = {
  getBooks: (): SavedBook[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },
  saveBook: (book: SavedBook) => {
    const books = LibraryStorage.getBooks();
    const filtered = books.filter(b => b.filename !== book.filename);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([book, ...filtered].slice(0, 12)));
  },
  updateProgress: (id: string, spreadIdx: number) => {
    const books = LibraryStorage.getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index].lastSpread = spreadIdx;
      books[index].timestamp = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }
};