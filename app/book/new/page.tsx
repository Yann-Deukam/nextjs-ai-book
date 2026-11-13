import UploadForm from '@/components/UploadForm'
import React from 'react'

const page = () => {
  return (
    <main className='wrapper container'>
      <div className="mx-auto max-w-180 space-y-10">
        <section className="flex flex-col gap-5">
          <h1 className="page-title-xl">Add a New Book</h1>
          <p className="subtitle">
            Add a PDF to start book-chatting
          </p>
        </section>

        <UploadForm/>
      </div>
    </main>
  )
}

export default page