import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Menu from '../components/Menu'
import Display from '../components/Display'

const Home = () => {
  const [menuDisplay, setMenuDisplay] = useState("All")
  // console.log(menuDisplay)
  return (
    <div>
        {/* <Navbar /> */}
        <Menu menuDisplay={menuDisplay} setMenuDisplay={setMenuDisplay} />
        <Display menuDisplay={menuDisplay}/>
    </div>
  )
}

export default Home