import React from 'react';
import { motion } from 'framer-motion';
import { scaleInOut } from '../animation';

const TemplateDesignPin = ({ data, index }) => {
  return (
    <motion.div key={data?._id} {...scaleInOut(index)}>
      <div className="w-full h-[240px] 2xl:h-[450px] rounded-md bg-gray-200 overflow-hidden relative">
        <img src={data.imageURL} className="w-full h-full object-cover" alt="" />







        
      </div>
    </motion.div>
  );
};

export default TemplateDesignPin;
