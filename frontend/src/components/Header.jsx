import React from 'react'
import Navbar from './Navbar'

const Header = () => {
  return (
    <header className='flex justify-around items-center p-4'>
      <div>
        <img className='logo h-[80px] w-[80px]' src="./src/assets/react.svg" alt="" />
      </div>
      <div>
        <Navbar/>
      </div>
    </header>
  )
}

export default Header