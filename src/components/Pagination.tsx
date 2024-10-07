'use client'
import { ITEMS_PER_PAGE } from '@/lib/settings'
import { useRouter } from 'next/navigation'
import React from 'react'
interface paginationProps {
  page: number,
  count: number
}
const Pagination = ({ page, count }: paginationProps) => {
  const router = useRouter()
  const hasPrev = ITEMS_PER_PAGE * (page - 1) > 0
  const hasNext = ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE < count
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search)

    if (newPage === 1 || !newPage) {
      params.delete('page')
      router.push(`${window.location.pathname}?${params}`)
    } else {
      params.set('page', newPage.toString())
      router.push(`${window.location.pathname}?${params}`)
    }
  }
  return (
    <div className='flex justify-between p-4 items-center text-gray-500'>
      <button
        className='py-2 px-4 rounded-md font-semibold text-xs disabled:cursor-not-allowed disabled:opacity-50'
        onClick={() => changePage(page - 1)}
        disabled={!hasPrev}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from(
          { length: Math.ceil(count / ITEMS_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                key={pageIndex}
                className={`px-2 rounded-sm ${page === pageIndex ? "bg-lamaSky" : ""
                  }`}
                onClick={() => {
                  changePage(pageIndex);
                }}
              >
                {pageIndex}
              </button>
            );
          }
        )}
      </div>
      <button
        className='py-2 px-4 rounded-md font-semibold text-xs disabled:cursor-not-allowed disabled:opacity-50'
        disabled={!hasNext}
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination