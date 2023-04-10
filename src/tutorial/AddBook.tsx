import type { Component, JSX, Setter } from "solid-js";
import { createSignal } from "solid-js";
import { Book } from "./Bookshelf";

const emptyBook: Book = {
  title: "",
  author: "",
};

export const AddBook: Component<{
  setBooks: Setter<Book[]>;
}> = (props) => {
  const [newBook, setNewBook] = createSignal(emptyBook);

  const addBook: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    event.preventDefault();
    if (newBook() !== emptyBook) {
      props.setBooks((books) => [...books, newBook()]);
      setNewBook(emptyBook);
    }
  };

  return (
    <div class="box-border border-t p-4">
      <form>
        <div>
          <label for="title">Book name</label>
          <input
            id="title"
            class="ml-2 border border-slate p-1"
            value={newBook().title}
            onInput={(event) => {
              setNewBook({
                ...newBook(),
                title: event.currentTarget.value,
              });
            }}
          />
        </div>
        <div class="my-2">
          <label for="author">Author</label>
          <input
            id="author"
            class="ml-2 border border-slate p-1"
            value={newBook().author}
            onInput={(event) => {
              setNewBook({
                ...newBook(),
                author: event.currentTarget.value,
              });
            }}
          />
        </div>
        <button
          type="submit"
          onClick={addBook}
          class="border border-slate rounded px-2 py-1"
        >
          Add book
        </button>
      </form>
    </div>
  );
};
