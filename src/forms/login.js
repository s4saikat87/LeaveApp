import React from 'react'
import { useState,useEffect } from 'react'
import "../index.css";




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
  import {signInWithGooglePopup,signInWithMicrosoftPopup,createUserDocumentFromAuth, firebaseApp,auth} from '../utils/firebase/firebase.utils';

import Home  from './home';     
import Dashboard  from './dashboard'; 
import Report  from './report'; 

import { textAlign } from '@mui/system';


function Login() {
      return (
        <Router>      
           <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route path='/report' element={<Report />} />
              
            </Routes>    
        </Router>     
      );
  
   
  }

export default Login
