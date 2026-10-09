import BooksStateContext from "./BooksStateContext";
import useLocalStorage from "../hooks/useLocalStorage";

const SAMPLE_BOOKS = [
  { id: 1, title: "Things Fall Apart", author: "Chinua Achebe", genre: "Fiction", isbn: "9780385474542", quantity: 5 },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", genre: "Technology", isbn: "9780132350884", quantity: 1 },
  { id: 3, title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", isbn: "9780553380163", quantity: 3 },
];

export function BooksProvider({ children }) {
  const [books, setBooks] = useLocalStorage("books", SAMPLE_BOOKS);

  const addBook = (book) =>
    setBooks((prev) => [...prev, { ...book, id: Date.now() }]);

  const updateBook = (id, updates) =>
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));

  const deleteBook = (id) =>
    setBooks((prev) => prev.filter((b) => b.id !== id));

  return (
    <BooksStateContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BooksStateContext.Provider>
  );
}
