import { useBooks } from "../hooks/useBooks";

export default function Dashboard() {
  const { books } = useBooks();
  const lowStockBooks = books.filter((book) => book.quantity < 2);
  const totalCopies = books.reduce((total, book) => total + book.quantity, 0);

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">COMMUNITY LIBRARY</p>
          <h2>Availability overview</h2>
        </div>
      </div>

      <div className="summary-grid">
        <article className="summary-item">
          <span>Catalog titles</span>
          <strong>{books.length}</strong>
        </article>
        <article className="summary-item">
          <span>Copies in stock</span>
          <strong>{totalCopies}</strong>
        </article>
        <article className="summary-item summary-alert">
          <span>Low-stock titles</span>
          <strong>{lowStockBooks.length}</strong>
        </article>
      </div>

      <section className="list-section">
        <div className="section-heading">
          <h3>Current availability</h3>
          <span className="muted-copy">Low stock means fewer than 2 copies</span>
        </div>
        {books.length === 0 ? (
          <p className="empty-state">No books have been added yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Available</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className={book.quantity < 2 ? "low-stock-row" : ""}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <span className={`stock-status ${book.quantity < 2 ? "stock-low" : "stock-ok"}`}>
                        {book.quantity < 2 ? "Low stock" : "Available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}