import React from 'react'
import Filters from '../components/Filters'
import useTemplate from '../hooks/useTemplate'
import MainSpinner from "../components/MainSpinner";
import { AnimatePresence } from 'framer-motion';
import TemplateDesignPin from '../components/TemplateDesignPin';

const HomeContainer = () => {

  const {
    data: templates,
    isLoading: temp_loading,
    isError: temp_isErrors,
    refetch: temp_refetch
  } = useTemplate()

  if (temp_loading) {
    return <MainSpinner />
  }

  return (
    <div className='w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start'>
      {/* Filter Section */}
      <Filters />
      {/* Render those templates - Resume PIN */}
      {temp_isErrors ? (
        <p className='text-lg text-txtDark'>
          Something went wrong
        </p>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          <RenderATemplate templates={templates} />
        </div>
      )}
    </div>
  )
}

const RenderATemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 ? (
        <AnimatePresence>
          {templates.map((template, index) => (
            <TemplateDesignPin
              key={template._id}
              data={template}
              index={index}
            />
          ))}
        </AnimatePresence>
      ) : (
        <p>No Data Found</p>
      )}
    </React.Fragment>
  )
}

export default HomeContainer
