import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import { saveToCollections, saveToFavorites } from '../api/index';
import { FadeInOutWithOpacity, scaleInOut } from '../animation';
import InnerBoxCard from './InnerBoxModel';
import useTemplate from '../hooks/useTemplate';

const TemplateDesignPin = ({ data, index }) => {
  const { data: user, refetch: userRefetch } = useUser();
  const { refetch: temp_Refetch } = useTemplate();
const [isHovered, setIsHovered] = useState(false)
  const addToCollection = async (e) => {
    e.stopPropagation();
    
      await saveToCollections(user, data);
      userRefetch();
  };

  const addToFavorites = async (e) => {
    e.stopPropagation();

      await saveToFavorites(user, data);
      temp_Refetch();
  };

  return (
    <motion.div key={data?._id} {...scaleInOut(index)}>
      <div className="w-full h-[240px] 2xl:h-[450px] rounded-md bg-gray-200 overflow-hidden relative"
      onMouseEnter={()=>setIsHovered(true)} 
      onMouseLeave={()=>setIsHovered(false)}>
        <img src={data.imageURL} className="w-full h-full object-cover" alt="" />
        <AnimatePresence>
          {isHovered && (
            <motion.div
            {...FadeInOutWithOpacity}
            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer"
          >
            <div className="flex flex-col items-end justify-start w-full gap-8">
              <InnerBoxCard 
                label={user?.collections?.includes(data?._id) ? "Added to Collection" : "Add to Collection"} 
                Icon={user?.collections?.includes(data?._id) ? BiSolidFolderPlus : BiFolderPlus} 
                onHandle={addToCollection} 
              />
              <InnerBoxCard 
                label={data?.favorites.includes(user?.uid) ?"Added to Favorites":"Add To Favorites "} 
                Icon={data?.favorites.includes(user?.uid) ?BiSolidHeart:BiHeart} 
                onHandle={addToFavorites} 
              />
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TemplateDesignPin;
