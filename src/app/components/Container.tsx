import React from 'react'


interface i{
    children:React.ReactNode
}
function Container({children}:i) {
  return (
    <div className='container mx-auto '>
        {children}
    </div>
  )
}

export default Container