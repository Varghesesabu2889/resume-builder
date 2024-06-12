import React from 'react';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { getTemplateDetails, saveToCollections, saveToFavorites } from '../api';
import MainSpinner from '../components/MainSpinner';
import { FaHouse } from 'react-icons/fa6';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import useTemplate from '../hooks/useTemplate';
import TemplateDesignPin from '../components/TemplateDesignPin';
import { AnimatePresence } from 'framer-motion';

const TemplateDesignPinDetails = () => {
  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ['template', templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: userRefetch } = useUser();
  const { data: templates, refetch: temp_Refetch, isLoading: temp_isLoading } = useTemplate();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavorites = async (e) => {
    e.stopPropagation();
    await saveToFavorites(user, data);
    temp_Refetch();
    refetch();
  };

  if (isLoading) return <MainSpinner />;

  if (isError) {
    return (
      <div className='w-full h-[60vh] flex flex-col items-center justify-center'>
        <p className='text-lg text-txtPrimary font-semibold'>Error while fetching the data...Please try again later....</p>
      </div>
    );
  }

  return (
    <div className='w-full flex items-center justify-start flex-col px-4 py-12'>
      {/* Breadcrumb */}
      <div className='w-full flex items-center pb-8 gap-2'>
        <Link to='/' className='flex items-center justify-center gap-2 text-txtPrimary'>
          <FaHouse />Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>
      {/* Main section layout */}
      <div className='w-full grid grid-cols-1 lg:grid-cols-12'>
        {/* Left section */}
        <div className='col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4'>
          {/* Load the template image */}
          <img className='w-full h-auto object-contain rounded-md' src={data?.imageURL} alt='tempImg' />
          {/* Title & other sections */}
          <div className='w-full flex flex-col items-start justify-start gap-2'>
            {/* Title section */}
            <div className='w-full flex items-center justify-between'>
              {/* Title */}
              <p className='text-base text-txtPrimary font-semibold'>{data?.title}</p>
              {/* Likes */}
              {data?.favorites?.length > 0 && (
                <div className='flex items-center justify-center gap-1'>
                  <BiSolidHeart className='text-base text-red-500' />
                  <p className='text-base text-txtPrimary font-semibold'>{data?.favorites?.length} likes</p>
                </div>
              )}
            </div>
            {/* Collections & Favorites options */}
            {user && (
              <div className='flex items-center justify-center gap-3'>
                {user?.collections?.includes(data?._id) ? (
                  <div
                    className='flex items-center justify-center px-4 py-2 rounded-md border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'
                    onClick={addToCollection}
                  >
                    <BiSolidFolderPlus className='text-base text-txtPrimary' />
                    <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove From Collections</p>
                  </div>
                ) : (
                  <div
                    className='flex items-center justify-center px-4 py-2 rounded-md border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'
                    onClick={addToCollection}
                  >
                    <BiFolderPlus className='text-base text-txtPrimary' />
                    <p className='text-sm text-txtPrimary whitespace-nowrap'>Add To Collections</p>
                  </div>
                )}

                {data?.favorites.includes(user?.uid) ? (
                  <div
                    className='flex items-center justify-center px-4 py-2 rounded-md border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'
                    onClick={addToFavorites}
                  >
                    <BiSolidHeart className='text-base text-txtPrimary' />
                    <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove From Favorites</p>
                  </div>
                ) : (
                  <div
                    className='flex items-center justify-center px-4 py-2 rounded-md border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'
                    onClick={addToFavorites}
                  >
                    <BiHeart className='text-base text-txtPrimary' />
                    <p className='text-sm text-txtPrimary whitespace-nowrap'>Add To Favorites</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className='col-span-1 lg:col-span-4 w-full flex 
        flex-col items-center justify-start px-3 gap-6 '>
<div className="w-full h-72 bg-blue-200 rounded-md overflow-hidden relative" style={{background:"url(https://img.freepik.com/free-photo/realistic-water-drop-with-ecosystem_23-2151196378.jpg)",
  backgroundPosition:"center",backgroundSize:"cover"
}}>
  {/* Discover more */}
  <div className='absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]'>
    <Link to={'/'} className='px-4 py-2 rounded-md border-2 border-gray-50 text-white'>
    Discover More
    </Link>
  </div>

</div>
  {/* edit the template */}
  {user && (
    <Link className='w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer' to={`/resume/${data?.name}?templateID=${templateID}`}>
      <p className='text-white font-semibold text-lg'>Edit this Template</p>
    </Link>
  )}
{/* tags */}
<div className='w-full flex items-center justify-start flex-wrap gap-2'>
  {data?.tags?.map((tag,index)=>(
    <p className='text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap' key={index}>
    {tag}
    </p>
  ))}
</div>
        </div>
      </div>
      {/* similar templates */}
      {templates?.filter((temp)=>temp._id !==data?._id).length > 0 && (
       <div className='w-full py-8 flex flex-col items-start justify-start gap-4'>
       <p className='text-lg font-semibold text-txtDark'>You might also like...</p>
       <div className="w-full grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 2xl:grid-cols-4 gap-2">
       <React.Fragment>
        <AnimatePresence>
          {templates?.filter((temp)=>temp._id !==data?._id).map((template, index) => (
            <TemplateDesignPin
              key={template._id}
              data={template}
              index={index}
            />
          ))}
        </AnimatePresence>
        </React.Fragment>
       </div>
     </div>
     )}
    </div>
  );
};

export default TemplateDesignPinDetails;
