import React from 'react'
import { FadeLoader } from 'react-spinners'

const MainSpinner = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <FadeLoader color='#498FCD' size={180}/>
    </div>
  )
}

export default MainSpinner