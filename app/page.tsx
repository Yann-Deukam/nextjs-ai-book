import React from 'react'

const page = () => {
  return (
    <main className="container">
      <section className="wrapper py-12 md:py-20">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-(--text-secondary)">
            Your library
          </p>
          <h1 className="page-title-xl">Read smarter, with your books by your side.</h1>
          <p className="subtitle max-w-2xl">
            Bookidy turns your reading list into a conversational assistant so you can ask questions,
            revisit ideas, and keep learning from every page.
          </p>
        </div>
      </section>
    </main>
  );
};

export default page;