import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onHandle}
      className="w-10 h-10 rounded-md bg-gray-300 flex items-center justify-center hover:shadow-md relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon className="text-txtPrimary text-base" />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-3 py-2 rounded-md bg-gray-200 absolute -left-40 after:w-2 after:h-2 after:bg-amber-600 after:absolute after:-right-1 after:top-[14px] after:rotate-45"
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InnerBoxCard;
