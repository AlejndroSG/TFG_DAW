import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Plantilla from './layout/Plantilla'
import Banner from './Pages/Banner'
import Login from './Pages/Login'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Plantilla/>}>
            <Route index element={<Banner/>}/>
            <Route path="/login" element={<Login/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App