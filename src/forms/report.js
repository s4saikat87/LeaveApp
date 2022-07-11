import React from 'react'
import Header  from './header';

import {useLocation, useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

// if (process.env.NODE_ENV != 'development') {

//   axios.defaults.baseURL = process.env.REACT_APP_PROD_URL;
// }
// else{
// axios.defaults.baseURL = process.env.REACT_APP_DEV_URL;
// }
const Report = () => {
    const location = useLocation();
    const state = location.state;
    //const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reportData, setreportData] = useState([]);
    const [rows, setRow] = useState([]);

    const columns = [
        
        { field: 'Employee', headerName: 'Employee Name', width: 350 },
        
        {
          field: 'CL',
          headerName: 'CL',
          disablePadding: true,
          type: 'number',
          width: 150,
        },
        {
          field: 'CO',
          headerName: 'CO',
          type: 'number',
          width: 150,
        },
        {
          field: 'ML',
          headerName: 'ML',
          type: 'number',
          width: 150,
        },
        {
            field: 'PL',
            headerName: 'PL',
            type: 'number',
            width: 150,
          },
          {
            field: 'SL',
            headerName: 'SL',
            type: 'number',
            width: 150,
          }
    
      ];
      
    useEffect(() => {

        const fetchData = async () => {
          setLoading(true);
        
          try {    
            debugger;
                  let token = location.state.jwtToken;
                  
                  let yearId = '2018';
                  const postData = { yearId };
                  localStorage.setItem('token', JSON.stringify(location.state));
                  axios.post('/ReportGet',
                    postData,
                    {
                      headers: {
                        'authorization': JSON.parse(localStorage.getItem('token')),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }
                    })
                    .then(response => {
    
                      console.log(response);
                      debugger;
                      
                      const data = JSON.parse(response.data);
                      debugger;
                      
                      setRow(data);
                       setreportData(data);
                      
                    })
                    .catch((error) => {
                      debugger;
                      return error;
                    });
          } catch (error) {
            console.error(error.message);
          }
          setLoading(false);
        }
    
        fetchData();
    
    
    
      }, [])
  return (
    <div>
      <Header/>

      <div className='py-3'>   </div>
      <div className="card mx-2 my-2">
        <div className="card-header tableheader">Report Details</div>
      </div>
      <div className="container-fluid">
        <div className="row text-center">
          {

            <div style={{ height: 625, width: '100%' }}>
              <DataGrid
                getRowId={row => Math.random()}
                //  id={Math.random()}
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}

              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Report
