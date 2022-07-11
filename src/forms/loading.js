import React from 'react'


import logobar from '../Images/loadingbar.gif';

const Loading = () => {
    return (
        <div className="loadingDiv text-center mt-sm-5 mt-lg-5 pt-5 ps-5 pe-5 pb-5 ms-5 me-5">
             <div className="loading-spinner text-center "></div>
             <div>
      <img  src={logobar}></img>
    </div>
        </div>
    )
}

export default Loading