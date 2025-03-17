import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Plantilla from './layout/Plantilla'
import Banner from './Pages/Banner'
import Login from './Pages/Login'
import Cursos from './Pages/Cursos'
import Blog from './Pages/Blog'
import SobreNosotros from './Pages/SobreNosotros'
import Contacto from './Pages/Contacto'
import Curso from './Pages/Curso'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Plantilla/>}>
            <Route index element={<Banner/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/cursos" element={<Cursos/>}/>
            <Route path="/blog" element={<Blog/>}/>
            <Route path="/sobre-nosotros" element={<SobreNosotros/>}/>
            <Route path="/contacto" element={<Contacto/>}/>
            <Route path="/curso/:id" element={<Curso/>}/>
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