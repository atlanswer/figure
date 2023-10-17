import { For } from "solid-js";
import type { Component } from "solid-js";
import type { Book } from "./Bookshelf";

export const BookList: Component<{ books: Book[] }> = (props) => {
  const totalBooks = () => props.books.length;

  return (
    <>
      <h3 class="flex items-center gap-2 font-semibold">
        Number of books:
        <div class="grid h-6 min-w-6 w-6 place-items-center border border-gray-5 rounded-full font-bold text-blue-5">
          <span>{totalBooks()}</span>
        </div>
      </h3>
      <ul class="my-2 list-disc list-inside">
        <For each={props.books}>
          {(book) => (
            <li>
              {book.title} <span class="font-italic">({book.author})</span>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};
