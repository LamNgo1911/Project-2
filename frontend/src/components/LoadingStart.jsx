import React from 'react'

function LoadingStart() {
  return (
    <div className='absolute top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-bgColorLight' />
      </div>
  )
}

export default LoadingStart