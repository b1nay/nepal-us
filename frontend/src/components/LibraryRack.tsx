// lib/storage.ts
export interface SavedBook {
  id: string;
  filename: string;
  data: any; // The PDFResponse
  lastPage: number;
  savedAt: number;
}

const STORAGE_KEY = "oso_library";

export const LibraryStorage = {
  saveBook: (id: string, filename: string, data: any) => {
    const library = LibraryStorage.getLibrary();
    library[id] = { id, filename, data, lastPage: 0, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  },

  updateBookmark: (id: string, pageIdx: number) => {
    const library = LibraryStorage.getLibrary();
    if (library[id]) {
      library[id].lastPage = pageIdx;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    }
  },

  getLibrary: (): Record<string, SavedBook> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  deleteBook: (id: string) => {
    const library = LibraryStorage.getLibrary();
    delete library[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }
};