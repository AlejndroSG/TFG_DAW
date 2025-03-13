import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Plantilla from './layout/Plantilla'
import Banner from './Pages/Banner'
import Login from './Pages/Login'
import Cursos from './Pages/Cursos'
import Recursos from './Pages/Recursos'
import Blog from './Pages/Blog'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Plantilla/>}>
            <Route index element={<Banner/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/cursos" element={<Cursos/>}/>
            <Route path="/recursos" element={<Recursos/>}/>
            <Route path="/blog" element={<Blog/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}

export default App