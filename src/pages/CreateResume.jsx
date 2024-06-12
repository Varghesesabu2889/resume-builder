import { Route, Routes } from 'react-router-dom'
import { TemplatesData } from '../utils/helpers'

const CreateResume = () => {
  return (
    <div className='w-full flex flex-col items-center justify-start py-4'>
      <Routes>
        {TemplatesData.map(template => {
          return (
            <Route 
              key={template?.id}
              path={`/${template.name}`}  
              element={<template.component />}
            />
          )
        })}
      </Routes>
    </div>
  )
}

export default CreateResume
