import type { Component } from "solid-js";
import { AddBook } from "./AddBook";
import { BookList } from "./BookList";

export const Bookshelf: Component<{ name: string }> = (props) => (
  <div class="text-black">
    <h1>{props.name}'s Bookshelf</h1>
    <BookList />
    <AddBook />
  </div>
);
