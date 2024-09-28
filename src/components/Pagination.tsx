import React from 'react'

const Pagination = () => {
  return (
    <div className='flex justify-between p-4 items-center text-gray-500'>
        <button className='py-2 px-4 rounded-md font-semibold text-xs disabled:cursor-not-allowed disabled:opacity-50'>
            Prev
        </button>
        <div className='flex items-center text-sm gap-2'>
            <button className='px-2 rounded-sm bg-mSky '>1</button>
            <button className='px-2 rounded-sm '>2</button>
            <button className='px-2 rounded-sm '>3</button>
            ...
            <button className='px-2 rounded-sm '>4</button>
        </div>
        <button className='py-2 px-4 rounded-md font-semibold text-xs disabled:cursor-not-allowed disabled:opacity-50'>
            Next
        </button>
    </div>
  )
}

export default Pagination