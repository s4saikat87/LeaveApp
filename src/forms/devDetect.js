import React from 'react'
import process from 'process'



const devDetect = () => {

    debugger;
    const isDev = () =>   !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  return (
    <>{isDev}</>
  )
}

export default devDetect




