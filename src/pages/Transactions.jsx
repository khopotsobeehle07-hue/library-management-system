import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useBooks } from "../hooks/useBooks";
import useLocalStorage from "../hooks/useLocalStorage";

const INITIAL_FORM = { bookId: "", type: "borrow", quantity: "1" };

export default function Transactions() {
  const { books, updateBook } = useBooks();
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const book = books.find((item) => String(item.id) === form.bookId);
    const quantity = Number(form.quantity);

    if (!book) {
      setError("Choose a book to update.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Enter a whole-number quantity of at least 1.");
      return;
    }
    if (form.type === "borrow" && quantity > book.quantity) {
      setError(`Only ${book.quantity} ${book.quantity === 1 ? "copy is" : "copies are"} currently in stock.`);
      return;
    }

    const isStockIn = form.type === "stock-in";
    const updatedQuantity = book.quantity + (isStockIn ? quantity : -quantity);
    updateBook(book.id, { quantity: updatedQuantity });
    setTransactions((previous) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        bookId: book.id,
        bookTitle: book.title,
        type: form.type,
        quantity,
        resultingStock: updatedQuantity,
        userName: currentUser.name,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);
    setForm(INITIAL_FORM);
    setError("");
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">INVENTORY</p>
          <h2>Stock transactions</h2>
        </div>
      </div>

      <form className="card transaction-form" onSubmit={handleSubmit} noValidate>
        <h3>Record a transaction</h3>
        {books.length === 0 ? (
          <p className="empty-state">Add a book to the catalog before recording stock movements.</p>
        ) : (
          <>
            <div className="form-grid">
              <div>
                <label htmlFor="transaction-book">Book</label>
                <select
                  id="transaction-book"
                  value={form.bookId}
                  onChange={(event) => setForm({ ...form, bookId: event.target.value })}
                  required
                >
                  <option value="">Select a book</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.quantity} in stock)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="transaction-type">Transaction</label>
                <select
                  id="transaction-type"
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                >
                  <option value="borrow">Borrow copies</option>
                  <option value="stock-in">Add incoming stock</option>
                </select>
              </div>
              <div>
                <label htmlFor="transaction-quantity">Quantity</label>
                <input
                  id="transaction-quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                  required
                />
              </div>
            </div>
            {error && <p className="error" role="alert">{error}</p>}
            <button type="submit" className="btn">Save transaction</button>
          </>
        )}
      </form>

      <section className="list-section">
        <div className="section-heading">
          <h3>Transaction history</h3>
          <span className="count-label">{transactions.length} records</span>
        </div>
        {transactions.length === 0 ? (
          <p className="empty-state">No transactions have been recorded yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Stock after</th>
                  <th>Recorded by</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                    <td>{transaction.bookTitle}</td>
                    <td>{transaction.type === "stock-in" ? "Stock added" : "Borrowed"}</td>
                    <td>{transaction.quantity}</td>
                    <td>{transaction.resultingStock}</td>
                    <td>{transaction.userName}</td>
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