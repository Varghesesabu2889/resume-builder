import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FadeInOutWithOpacity, scaleInOut } from '../animation';
import {  BiFolderPlus, BiHeart } from 'react-icons/bi'
const TemplateDesignPin = ({ data, index }) => {

const addToCollection = async() =>{

}
const addToFavorites = async()=>{

}


  return (
    <motion.div key={data?._id} {...scaleInOut(index)}>
      <div className="w-full h-[240px] 2xl:h-[450px] rounded-md bg-gray-200 overflow-hidden relative">
        <img src={data.imageURL} className="w-full h-full object-cover" alt="" />

<AnimatePresence>
  <motion.div
    {...FadeInOutWithOpacity}
    className='absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer'
    >
<div className='flex flex-col items-end justify-start w-full gap-8'>
  <InnerBoxCard Label={"Add to Collection"} Icon={BiFolderPlus} OnHandle={addToCollection}/>
  <InnerBoxCard Label={"Add to Favorites"} Icon={BiHeart} OnHandle={addToFavorites}/>

  </div>    

  </motion.div>
</AnimatePresence>





        
      </div>
    </motion.div>
  );
};


const InnerBoxCard = ({Label,Icon,OnHandle}) =>{
  const [isHovered, setIsHovered] = useState(false)
return(
<div onClick={OnHandle} className='w-10 h-10 rounded-md bg-gray-300 flex items-center justify-center 
      hover:shadow-md relative'
      onMouseEnter={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}>
  <Icon className='text-txtPrimary text-base'/>
  <AnimatePresence>
    {isHovered && (
      <motion.div  
      initial={{opacity:0, scale:0.6, x:50}}
      animate={{opacity:1, scale:1, x:0}}
      exit={{opacity:0, scale:0.6, x:50}}
      className='px-3 py-2 rounded-md bg-gray-200 absolute -left-40 after:w-2 
                after:h-2 after:bg-amber-600 after:absolute after:-right-1 after:top-[14px] after:rotate-45'>
        <p className='text-sm text-txtPrimary whitespace-nowrap'>{Label}</p>
      </motion.div>
    )}
  </AnimatePresence>





</div>
)
}

export default TemplateDesignPin;