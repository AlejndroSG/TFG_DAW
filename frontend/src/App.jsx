import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Plantilla from './layout/Plantilla'
import Banner from './Pages/Banner'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Plantilla/>}>
            <Route index element={<Banner/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
