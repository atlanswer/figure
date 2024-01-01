import { Component, For, Setter, Show, createResource } from "solid-js";
import { createSignal } from "solid-js";
import { Book } from "./Bookshelf";
import { searchBooks } from "./searchBooks";

export const AddBook: Component<{
  setBooks: Setter<Book[]>;
}> = (props) => {
  const [input, setInput] = createSignal("");
  const [query, setQuery] = createSignal("");

  const [data] = createResource<Book[], string>(query, searchBooks);

  return (
    <div class="box-border border-t p-4">
      <form>
        <div>
          <label for="title">Search books</label>
          <input
            id="title"
            class="border-slate ml-2 border p-1"
            value={input()}
            onInput={(event) => {
              setInput(event.currentTarget.value);
            }}
          />
        </div>
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            setQuery(input());
          }}
          class="border-slate rounded border px-2 py-1"
        >
          Search
        </button>
      </form>
      <Show when={!data.loading} fallback={<span>Searching...</span>}>
        <ul>
          <For each={data()}>
            {(book) => (
              <li>
                {book.title} by {book.author}
                <button
                  aria-label={`Add ${book.title} by ${book.author} to the bookshelf.`}
                  class="border-slate ml-2 rounded border px-2 py-1"
                  onClick={(event) => {
                    event.preventDefault();
                    props.setBooks((books) => [...books, book]);
                  }}
                >
                  Add
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};
