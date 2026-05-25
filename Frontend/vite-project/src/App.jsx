import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"

import Home from "./pages/Home/Home"
import Login from './pages/Login/Login'
import Profile from './pages/Profile/Profile'
import ImovelView from './pages/ImovelView/ImovelView'
import ImovelEdit from './pages/ImovelEdit/ImovelEdit'
import ImovelFilter from './pages/ImovelFilter/ImovelFilter'
import ImovelAdd from './pages/ImovelAdd/ImovelAdd'
import About from './pages/About/About'

function App() {
  return (
    <>
      <Navbar />

      <main>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/imovelFilter' element={<ImovelFilter />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/imovelView/:idImovel' element={<ImovelView />} />
          <Route path='/imovelEdit/:idImovel' element={<ImovelEdit />} />
          <Route path='/adicionar-imovel' element={<ImovelAdd />} />
          <Route path='/about' element={<About />} />
        </Routes>
        
      </main>

      <Footer />
    </>
  )
}

export default App