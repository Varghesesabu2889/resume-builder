// eslint-disable-next-line no-unused-vars
import React from 'react'
import icon from '../assets/images/icon.png'
import { Link } from 'react-router-dom'
const Footer = () => {
  return <div className='w-full flex items-center justify-between border-t border-gray-300'>
<div className='flex items-center justify-center gap-3 py-3'>
<img src={icon} alt="icon image" className='w-8 h-auto object-contain' />
<p className='text-sm'>ResumeBoost</p>

</div>
<div className='flex items-center justify-center gap-6 py-3'>
    <Link to={'/'} className='text-blue-700 text-sm'>Home</Link>
    <Link to={'/'} className='text-blue-700 text-sm'>Contact</Link>
    <Link to={'/'} className='text-blue-700 text-sm whitespace-nowrap'>Privacy Policy</Link>


    
</div>



  </div>
}

export default Footer