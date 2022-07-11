import React from 'react'
import { useState,useEffect } from 'react'
import "../index.css";

import Dashboard  from './dashboard'; 
import Report  from './report'; 
import LogoPage from './logoPage';
import axios from 'axios';

import { textAlign } from '@mui/system';
import {signInWithGooglePopup,
        signInWithMicrosoftPopup,
        createUserDocumentFromAuth, 
        firebaseApp,auth} 
from '../utils/firebase/firebase.utils';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Link,
    Outlet,
    useParams,
    NavLink,
    useNavigate,
    useLocation
    } from 'react-router-dom';


function Home(){

    // React States
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
  const state = location.state;
  const [email, setEmail] = useState('');
    // User Login info
    
    
    const errors = {
      uname: "invalid username",
      pass: "invalid password"
    };
    
    useEffect(() => {
      
      let isAuth = JSON.parse(localStorage.getItem('token'))
      if(isAuth && isAuth !== null) {
      navigate("/") 
    }
    }, [])
    
    
    
    const authorizeandRedirect=(event)=>{
      event.preventDefault();


      var { uname, pass } = document.forms[0];
      let Username =uname.value ;
        
       let Password=pass.value;
       const data={Username};
    
    axios.post('/login',data)   
    .then((response)=>{
    
          //  console.log(response);
           
            if(response.statusText==='OK')
            {
           
              let token=response.data;
         
          const postData={token};
          navigate("/dashboard",{state:postData});
    
    
           // navigate("/dashboard",{state:1});
          }
    
            
    }) 
    .catch((error)=>{
     // debugger;
          console.log("my error is "+ error);
      }) 
    
    }

    const handleLogIn=async()=>{


      const {user}=await signInWithMicrosoftPopup();
       
        const userDocReference= await createUserDocumentFromAuth(user);
        //console.log(response);
        createUserDocumentFromAuth(user);
       
        if(user.isAnonymous)
        {
          setErrorMessages({ name: "pass", message: errors.pass });
          
        }
        else
        {
          debugger;
          let token=user.accessToken;
          let email=user.email;
          const postData={token,email};
          navigate("/dashboard",{state:postData});
          
        }
      

    }
    const logMicrosoftUser= async ()=>{ 
 
        //const response=await signInWithMicrosoftPopup();
        const {user}=await signInWithMicrosoftPopup();
       // console.log(user);
        const userDocReference= await createUserDocumentFromAuth(user);
        //console.log(response);
        createUserDocumentFromAuth(user);
       
        if(user.isAnonymous)
        {
          setErrorMessages({ name: "pass", message: errors.pass });
          
        }
        else
        {
            debugger;
          let token=user.accessToken;
          let email=user.email;
          const postData={token,email};
          localStorage.setItem('email', email);
          navigate("/dashboard",{state:postData});
          //navigate("/report",{state:postData});
         // authorizeandRedirect();
        }
      }
    
   
    
    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
      name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
      );
    
      const styleLogin = {
      float:'right'
     
      };
    
      return(
        
        <div>
          
        

           <div>
          <div className='row'>
          
            <div className='col-sm-11 col-md-11' >
            {/* <a className="text-end" style={styleLogin}  onClick={handleLogIn}>Microsoft LogIn</a> */}
            </div>
          </div>
         </div>
    <div className="app">
      <div className='h-100'> 
    <div className="login-form">
      <div className='text-center'>
      <LogoPage/>
      </div>
  
    {/* <div className="title text-center h4 pt-2">Sign In</div> */}
    <div className="form">
        <form onSubmit={authorizeandRedirect}>
          {/* <div className="input-container">
            <label>Username </label>
            <input type="text" name="uname" required />
            {renderErrorMessage("uname")}
          </div>
          <div className="input-container">
            <label>Password </label>
            <input type="password" name="pass" required />
            {renderErrorMessage("pass")}
          </div> */}
          <div className="button-container">
            

            <input type="button" className='btn btn-outline-primary' onClick={logMicrosoftUser} value="Sign in with Microsoft"></input>
          </div>
        </form>
      </div>
      </div>
      </div>
      </div>
      </div>
      )
    };

    export default Home