import { Component, createSignal } from "solid-js";
import { AddBook } from "./AddBook";
import { BookList } from "./BookList";

export type Book = {
  title: string;
  author: string;
};

const initialBooks: Book[] = [
  { title: "Code Complete", author: "Steve McConnell" },
  { title: "The Hobbit", author: "J.R.R. Tolkien" },
  { title: "Living a Feminist Life", author: "Sarah Ahmed" },
];

export const Bookshelf: Component<{ name: string }> = (props) => {
  const [books, setBooks] = createSignal(initialBooks);
  return (
    <div class="box-border border rounded-lg bg-slate-2 p-4">
      <h2 class="mb-4 text-2xl font-semibold">{props.name}'s Bookshelf</h2>
      <BookList books={books()} />
      <AddBook setBooks={setBooks} />
    </div>
  );
};
