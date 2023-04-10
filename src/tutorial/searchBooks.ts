type ResultItem = {
  title: string;
  author_name: string[];
};

export const searchBooks = async (query: string) => {
  if (query.trim() === "") return [];

  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURI(query)}`,
  );
  const results = await response.json();
  const documents = results.docs as ResultItem[];

  return documents.slice(0, 10).map(({ title, author_name }) => ({
    title,
    author: author_name?.join(", "),
  }));
};
