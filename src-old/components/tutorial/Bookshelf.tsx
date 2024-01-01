import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
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
  const [showForm, setShowForm] = createSignal(false);
  return (
    <div class="bg-slate-2 dark:bg-slate-7 box-border rounded-lg p-4 text-black dark:text-white">
      <h2 class="mb-4 text-2xl font-semibold">{props.name}'s Bookshelf</h2>
      <BookList books={books()} />
      <Show
        when={showForm()}
        fallback={
          <button
            class="border-slate rounded border px-2 py-1"
            onClick={() => setShowForm((showForm) => !showForm)}
          >
            Add a book
          </button>
        }
      >
        <AddBook setBooks={setBooks} />
        <button
          class="border-slate rounded border px-2 py-1"
          onClick={() => setShowForm((showForm) => !showForm)}
        >
          Finish
        </button>
      </Show>
    </div>
  );
};
