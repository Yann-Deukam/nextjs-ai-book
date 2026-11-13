import BookCard from '@/components/BookCard';
import LibraryHero from '@/components/Hero';
import { sampleBooks } from '@/constants';
import React from 'react'

const page = () => {
  return (
    <main className="wrapper container">
      <LibraryHero/>

      <div className="library-books-grid">
        {sampleBooks.map((book) => (
          <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
    </main>
  );
};

export default page;