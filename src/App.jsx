// eslint-disable-next-line no-unused-vars
import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen'
import Authentication from './pages/Authentication'

const App = () => {
  return <Suspense fallback={
    <div>loading...</div>}>
      <Routes>
        <Route path="/*" element={<HomeScreen />} />
        <Route path="/auth" element={<Authentication />} />
        </Routes>
    </Suspense>
}

export default App