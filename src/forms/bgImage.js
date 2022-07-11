import React from 'react'
import bgImg from '../Images/loginbg.png'

const bgImage = () => {
  return (
   
      <div>
      <img style={{backgroundRepeat: 'no-repeat', backgroundSize:'Cover', backgroundPosition:'center center' }} src={bgImg}></img>
    </div>
   
  )
}

export default bgImage
