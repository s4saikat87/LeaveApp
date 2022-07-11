import React from 'react'
import Header from './header';
import {
  useLocation, useNavigate
} from 'react-router-dom';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridAutoSizer } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { auth } from '../utils/firebase/firebase.utils';
import Loading from './loading';
import isDev from './devDetect';
import process from 'process'
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

if (process.env.NODE_ENV != 'development') {

  axios.defaults.baseURL = process.env.REACT_APP_PROD_URL;
}
else{
axios.defaults.baseURL = process.env.REACT_APP_DEV_URL;
}


const Dashboard = () => {
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [employeeDtls, setEmployeeDtls] = useState([]);
  const [myLeave, setMyLeave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rows, setRow] = useState([]);
  const [rowsReq, setRowReq] = useState([]);
  const [rowsReqCompOffGet, setRowReqCompOffGet] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openCompOff, setOpenCompOff] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [errorCustom, setErrorCustom] = useState('');
  // const [columns, setColumns] = useState([]);
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  const [leaveTypId, setLeaveTypId] = React.useState(21);
  const [txtDesc, setDesc] = React.useState("");
  const [days, setDays] = React.useState("");
  const [errorMessage, setErrorMessage] = useState([]);
  const [touched, setTouched] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  const errors = {
    fromdate: "Form date required",
    Todate: "To date required",
    txtDesc: "Description required",
    txtDescCompOff: "Description required",
    outTime: "OutTime required",
    inTime: "In Time required",
    fromdateCompOff: "From Date required",
    todateCompOff: "To Date required",
  };
  const [stateCompoff, setstateCompoff] = React.useState({
    fromdateCompOff: "",
    todateCompOff: "",
    txtDescCompOff: "",
    outTime: "",
    inTime: ""
  });

  const handleChange = (event) => {

    setstateCompoff({
      ...stateCompoff,
      [event.target.name]: event.target.value
    });
    setTouched(true);

  };



  const DateFormatter = (params) => {

    let date = new Date(params.value);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;


  };

  const columnsReqCompOff = [
    //{ field: 'EmployeeCode', headerName: 'Employee ID', width: 140 },
    //{ field: 'EmployeeNm', headerName: 'Employee Name', width: 200 },
    { field: 'EmployeeCode', headerName: 'Code', width: 120 },
    { field: 'EmployeeNm', headerName: 'Name', width: 160 },
    { field: 'EmailAddr', headerName: 'Email', width: 200 },
    { field: 'ApproverName', headerName: 'Approver', width: 170 },


    {
      field: 'FromDt', headerName: 'From Date', width: 130,
      valueFormatter: DateFormatter

      //Cell: ({ value }) => { return format(new Date(value), 'MM/dd/yyyy') }
    },
    {
      field: 'ToDt', type: 'date', headerName: 'To Date', width: 130,
      valueFormatter: DateFormatter

    },

    {
      field: 'TotDays',
      headerName: 'Total Days',
      disablePadding: true,
      type: 'number',
      width: 135, align: 'right',
      valueFormatter: ({ value }) => `${value.toFixed(2)}`

    },

    {
      field: 'Description',
      headerName: 'Particulars',
      width: 180,
    }

  ];


  const columnsReq = [
    //{ field: 'EmployeeCode', headerName: 'Employee ID', width: 140 },
    //{ field: 'EmployeeNm', headerName: 'Employee Name', width: 200 },
    { field: 'EmployeeCode', headerName: 'Code', width: 120 },
    { field: 'EmployeeNm', headerName: 'Name', width: 180 },
    { field: 'EmailAddr', headerName: 'Email', width: 180 },
    { field: 'LeaveName', headerName: 'Leave Type', width: 150 },
    {
      field: 'FromDt', headerName: 'From Date', width: 140,
      valueFormatter: DateFormatter

      //Cell: ({ value }) => { return format(new Date(value), 'MM/dd/yyyy') }
    },
    {
      field: 'ToDt', type: 'date', headerName: 'To Date', width: 140,
      valueFormatter: DateFormatter


    },

    {
      field: 'TotDays',
      headerName: 'Total Days',
      disablePadding: true,
      type: 'number',
      width: 135, align: 'right',
      valueFormatter: ({ value }) => `${value.toFixed(2)}`

    },

    {
      field: 'LeaveDesc',
      headerName: 'Particulars',
      width: 200,
    }

  ];

  const columns = [
    //{ field: 'EmployeeCode', headerName: 'Employee ID', width: 140 },
    //{ field: 'EmployeeNm', headerName: 'Employee Name', width: 200 },
    { field: 'LeaveName', headerName: 'Leave Name', width: 200 },
    { field: 'LeaveCode', headerName: 'Leave Code', width: 200 },
    { field: 'YearId', headerName: 'Year', width: 200 },
    {
      field: 'OpeningBal',
      headerName: 'Opening Balance',
      disablePadding: true,
      type: 'number',
      width: 200,
      valueFormatter: ({ value }) => `${value.toFixed(2)}`
    },
    {
      field: 'LeaveTaken',
      headerName: 'Leave Taken',
      type: 'number',
      width: 200,
      valueFormatter: ({ value }) => `${value.toFixed(2)}`
    },
    {
      field: 'ClosingBal',
      headerName: 'Closing Balance',
      type: 'number',
      width: 200,
      valueFormatter: ({ value }) => `${value.toFixed(2)}`
    }

  ];

  //setOpenCompOff

  const CompOffGetData = async () => {
    setLoading(true);

    let ApproverId = JSON.parse(localStorage.getItem('ApproverId'));
    let AdministratorId = JSON.parse(localStorage.getItem('AdministratorId'));
    let EmployeeId = JSON.parse(localStorage.getItem('empId'));

    const postData = { AdministratorId, ApproverId, EmployeeId };

    await axios.post('/CompOffBalanceGet',
      postData,
      {
        headers: {
          'authorization': JSON.parse(localStorage.getItem('token')),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(response => {

        //  console.log(response);

        const reqCompData = JSON.parse(response.data);

        setRowReqCompOffGet(reqCompData);

        setLoading(false);

      })
      .catch((error) => {

        return error;
      });

  }


  const handleCompOffClickOpen = () => {
    setOpenCompOff(true);
  }
  const handleCompOffClose = (event, reason) => {
    debugger;
    if (reason && reason == "backdropClick")
      return;

    setOpenCompOff(false);
    setstateCompoff({
      ...stateCompoff,
      fromdateCompOff: "",
      todateCompOff: "",
      txtDescCompOff: "",
      outTime: "",
      inTime: ""
    });
    setErrorMessages({ name: "fromdateCompOff", message: '' });
    setErrorMessages({ name: "todateCompOff", message: '' });
    setErrorMessages({ name: "inTime", message: '' });
    setErrorMessages({ name: "outTime", message: '' });
    //  setErrorMessages({ name: "txtDescCompOff", message: '' });
    setErrorMessage([]);

  };

  const handleSubmitCompOff = () => {

    //console.log(stateCompoff);
    if (stateCompoff.fromdateCompOff === '') {
      setErrorMessages({ name: "fromdateCompOff", message: errors.fromdateCompOff });
    }

    else if (stateCompoff.todateCompOff === '') {
      setErrorMessages({ name: "todateCompOff", message: errors.todateCompOff });
    }


    else if (stateCompoff.inTime === '') {
      setErrorMessages({ name: "inTime", message: errors.inTime });
    }

    else if (stateCompoff.outTime === '') {
      setErrorMessages({ name: "outTime", message: errors.outTime });
    }
    else if (stateCompoff.txtDescCompOff === '') {
      setErrorMessages({ name: "txtDescCompOff", message: '' });
      setErrorMessage(["Description can't be blank."])
    }



    else {

      let EmployeeId = employeeDtls.EmployeeId;
      let AdministratorId = employeeDtls.AdministratorId;

      let ApproverId = employeeDtls.ApproverId;
      let ToDt = stateCompoff.todateCompOff;
      let FromDt = stateCompoff.fromdateCompOff
      let inTime = stateCompoff.inTime;
      let OutTime = stateCompoff.outTime;
      let Description = stateCompoff.txtDescCompOff;
      let IsAdmin = 0;
      let IsNotAdmin = 0;
      let AdminComm = '';
      let IsAppr = 0;
      let IsNotAppr = 0;
      let ApprComm = '';

      //let txtDays=days;
      var postData = { EmployeeId, AdministratorId, ApproverId, ToDt, FromDt, inTime, OutTime, Description, IsAdmin, IsNotAdmin, AdminComm, IsAppr, IsNotAppr, ApprComm };
      setLoading(true);

      axios.post('/CompOffBalanceSet',
        postData,
        {
          headers: {
            'authorization': JSON.parse(localStorage.getItem('token')),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => {

          // console.log(response);
          setLoading(false);
          const data = JSON.parse(response.data);


          setstateCompoff({
            ...stateCompoff,
            fromdateCompOff: "",
            todateCompOff: "",
            txtDescCompOff: "",
            outTime: "",
            inTime: ""
          });
          setErrorMessage([]);
          // debugger;
          if (data[0].ErrorNumber != undefined && data[0].ErrorNumber != 1) {
            //  alert(data[0].Error);

            setLoading(false);
            setErrorCustom(data[0].Error);
            setOpenError(true);

          }
          else {

            CompOffGetData();
            setOpenCompOff(false);
          }

        })
        .catch((error) => {

          return error;
        });
    }



  }



  //console.log(state);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleLeaveTypChange = (event) => {

    setLeaveTypId(event.target.value);

  }
  const handleSubmitReq = () => {

    if (fromDate === '') {

      setErrorMessages({ name: "fromdate", message: errors.fromdate });
    }
    else if (toDate === '') {
      setErrorMessages({ name: "Todate", message: errors.Todate });
    }
    else if (txtDesc === '') {
      setErrorMessages({ name: "txtDesc", message: errors.txtDesc });
    }
    else {
      let TransactId = 0;
      let EmployeeId = employeeDtls.EmployeeId;
      let FrmDt = fromDate;
      let ToDt = toDate;
      let LeaveTypeId = leaveTypId;


      let LeaveDesc = txtDesc;
      //let txtDays=days;
      var postData = { TransactId, EmployeeId, FrmDt, ToDt, LeaveTypeId, LeaveDesc };
      setLoading(true);

      axios.post('/RequestSet',
        postData,
        {
          headers: {
            'authorization': JSON.parse(localStorage.getItem('token')),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => {

          // console.log(response);
          setLoading(false);
          const data = JSON.parse(response.data);
          if (data[0].Error != undefined && data[0].Error != '') {
            //  alert(data[0].Error);
            setLoading(false);
            setErrorCustom(data[0].Error);
            setFromDate('');
            setToDate('');
            setDesc('');
            setOpenError(true);
          }
          else {
            fetchReqData();
            setOpen(false);
          }





        })
        .catch((error) => {

          return error;
        });
    }





  }




  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick")
      return;
    setOpen(false);
    setFromDate('');
    setToDate('');
    setDesc('');
    setErrorMessages({ name: "fromdate", message: '' });
    setErrorMessages({ name: "todate", message: '' });
    setErrorMessages({ name: "txtDesc", message: '' });


  };

  const handleCloseError = () => {

    setOpenError(false);
  }



  const fetchReqData = async () => {
    setLoading(true);



    let TransactId = 0;
    let EmployeeId = JSON.parse(localStorage.getItem('empId'));
    let yearId = JSON.parse(localStorage.getItem('year'));
    const postData = { TransactId, EmployeeId, yearId };

    axios.post('/RequestGet',
      postData,
      {
        headers: {
          'authorization': JSON.parse(localStorage.getItem('token')),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(response => {

        //  console.log(response);

        const reqData = JSON.parse(response.data);

        setRowReq(reqData);

        setLoading(false);
      })
      .catch((error) => {

        return error;
      });





  }

const headers = {
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '3600',
}

  const baseURL = '';


  //   useEffect(() => {

  //     localStorage.setItem('AdministratorId', JSON.stringify(employeeDtls.AdministratorId));
  //     localStorage.setItem('ApproverId', JSON.stringify(employeeDtls.ApproverId));
  //    // setEmployeeDtls(employeeDtls);
  // }, [employeeDtls]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // let Username = location.state.email; 
        let Username = localStorage.getItem('email');//location.state.email;


        // let Password=pass.value;
        const data = { Username };
        debugger;
        //  const isDev = () =>   !process.env.NODE_ENV || process.env.NODE_ENV === 'development'


        //axios.defaults.withCredentials = true;
       // headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
       // headers.append('Access-Control-Allow-Credentials', 'true');
      //   if (process.env.NODE_ENV != 'development') {

      //     axios.defaults.baseURL = process.env.REACT_APP_PROD_URL;
      //   }
      //   else{
      //   axios.defaults.baseURL = process.env.REACT_APP_DEV_URL;
      // }
       
        await axios.post('/login', data,
        {
           headers:headers
        }
        )
          .then((response) => {

            //console.log(response);

            if (response.statusText === 'OK') {

              getHomepageData(response.data.jwtToken, response.data.EmployeeId);

            }


          })
          .catch((error) => {

            console.log("my error is " + error);
          })
      } catch (error) {
        console.error(error.message);
      }

    }
    fetchData();
  }, [])

  const getHomepageData = async (token, empId) => {

    let EmpId = empId;
    const postData = { EmpId };
    localStorage.setItem('token', JSON.stringify(location.state));
    await axios.post('/homepageget',
      postData,
      {
        headers: {
          'authorization': JSON.parse(localStorage.getItem('token')),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(response => {

        // console.log(response);

        // const data = JSON.parse(response.data);
        const data = response.data;

        // const { EmployeeId, EmployeeCode, EmployeeNm, AdminName, ApproverName,AdminCode, ApproverCode} =data;

        setEmployeeDtls(data);

        setMyLeave(data.ocMyLeave);
        setRow(data.ocMyLeave);
        localStorage.setItem('AdministratorId', JSON.stringify(data.AdministratorId));
        localStorage.setItem('ApproverId', JSON.stringify(data.ApproverId));
        localStorage.setItem('empId', JSON.stringify(data.EmployeeId));
        localStorage.setItem('year', JSON.stringify(data.ocMyLeave[0].YearId));

        fetchReqData();
        CompOffGetData();
        setLoading(false);
        // setUsers(data);
        //  localStorage.setItem('userList',JSON.stringify(data));
        //  window.location.reload();
      })
      .catch((error) => {

        return error;
      });

  }

  const signOut = () => {
    auth.signOut();
    navigate("/");


  }
  const Title = ({ children }) => <div className="title">{children}</div>;
  let closeImg = { cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px' };
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );
  const styleLogin = {
    float: 'right'

  };
  if (loading) {
    return <Loading />
  }
  return (
    <div >
      {/* <div>
        <div className='row'>

          <div className='col-sm-11 col-md-11' >
            <div ><a className='text-end' style={styleLogin} onClick={signOut}>Logout</a></div>
          </div>
        </div>
      </div> */}
      <Header />

      {/*  compoff dialog start */}


      <Dialog

        fullWidth={true}
        maxWidth={'sm'}
        open={openCompOff}
        onClose={handleCompOffClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"

      >
        <DialogTitle id="alert-dialog-title" className='lead ms-2 mt-1'>
          <Title>{"Comp Off Request"} <img src={require('../Images/Close.png')} onClick={handleCompOffClose} style={closeImg} /></Title>

        </DialogTitle>
        <DialogContent>
        <div style={{  height: "100%", width: "100%" }}>
        <Box mt={1} mx={1} sx={{
           height: "100%",
           width: "100%",
          '&:hover': {
            opacity: [0.9, 0.8, 0.7],
          },
        }}
        >


          <div className='row'>

            <div className='col-sm-10 col-md-6 my-1'>
              <label >From Date:</label>
              <input type='date' className='form-control' value={stateCompoff.fromdateCompOff}
                onChange={handleChange} name='fromdateCompOff' required></input>

              <div className='row'>

                <div className='col-sm 10 col-md-12 my-1'>
                  {renderErrorMessage("fromdateCompOff")}
                </div>
              </div>
            </div>

            <div className='col-sm-10 col-md-6 my-1'>
              <label >To Date:</label>
              <input type='date' className='form-control' name='todateCompOff'
                value={stateCompoff.todateCompOff} onChange={handleChange}
                required></input>

              <div className='row'>

                <div className='col-sm 10 col-md-12 my-1'>
                  {renderErrorMessage("todateCompOff")}
                </div>
              </div>
            </div>
          </div>

          <div className='row'>

            <br />
          </div>


          <div className='row'>
            <div className='col-sm-10 col-md-4 my-1'>
              <label >In Time:</label>
            </div>
            <div className='col-sm-10 col-md-8 pt-1'>
              <input type='time'
                value={stateCompoff.inTime} onChange={handleChange}
                className='form-control' name='inTime'></input>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6 col-md-4 '>
            </div>
            <div className='col-sm 10 col-md-8'>
              {renderErrorMessage("inTime")}
            </div>
          </div>


          <div className='row'>
            <div className='col-sm-10 col-md-4 my-1'>
              <label >Out Time:</label>
            </div>
            <div className='col-sm-10 col-md-8 pt-1'>
              <input type='time' className='form-control'
                value={stateCompoff.outTime} onChange={handleChange}
                name='outTime'></input>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6 col-md-4 '>
            </div>
            <div className='col-sm 10 col-md-8'>
              {renderErrorMessage("outTime")}
            </div>
          </div>

          <div className='row'>

            <div className='col-12 pt-2'>

              <TextField
                className='form-control' name='txtDescCompOff'
                value={stateCompoff.txtDescCompOff} onChange={handleChange} multiline variant="outlined" label='Description'

                error={touched && Boolean(errorMessage.length)}
                helperText={touched && errorMessage[0]}
              ></TextField>



            </div>
          </div>

          
          <DialogActions>
            <Button onClick={handleCompOffClose}>Close</Button>
            <Button onClick={handleSubmitCompOff} autoFocus>
              Save
            </Button>
          </DialogActions>
        </Box>
        </div>
        </DialogContent>
      </Dialog>


      {/*   compoff dialog end   */}


      <Dialog
        open={open}
        onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          <Title>{"Leave Request"} <img src={require('../Images/Close.png')} onClick={handleClose} style={closeImg} /></Title>

        </DialogTitle>
        <DialogContent>
        <div style={{  height: "100%", width: "100%" }}>
        <Box mt={1} px={1} sx={{
          width: "100%",
          height: "100%",


          // backgroundColor: 'primary.dark',
          '&:hover': {
            // backgroundColor: 'primary.main',
            opacity: [0.9, 0.8, 0.7],
          },
        }}
        >

          <div>
            <div className="input-container">
              <div className='row'>
                <div className='col-sm 10 col-md-3 '>
                  <label >From Date</label>
                </div>
                <div className='col-sm 10 col-md-5'>
                  <input type='date' className='form-control' onChange={e => setFromDate(e.target.value)}
                    name='fromdate' required></input>
                </div>
                <div className='col-sm 10 col-md-4 '>
                  {renderErrorMessage("fromdate")}
                </div>
              </div>




            </div>
            <div className="input-container">

              <div className='row'>
                <div className='col-sm 10 col-md-3 '>
                  <label >To Date</label>
                </div>
                <div className='col-sm 10 col-md-5'>
                  <input type='date' onChange={e => setToDate(e.target.value)} className='form-control' name='Todate'></input>
                </div>
                <div className='col-sm 10 col-md-4 '>
                  {renderErrorMessage("Todate")}
                </div>
              </div>

            </div>
            <RadioGroup value={leaveTypId}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="21" name='rdTypeCL' onClick={handleLeaveTypChange} control={<Radio />} label="CL" />
              <FormControlLabel value="19" name='rdTypePL' onClick={handleLeaveTypChange} control={<Radio />} label="PL" />
              <FormControlLabel value="20" name='rdTypeSL' onClick={handleLeaveTypChange} control={<Radio />} label="SL" />
              <FormControlLabel value="23" name='rdTypeML' onClick={handleLeaveTypChange} control={<Radio />} label="ML" />
              <FormControlLabel value="22" name='rdTypeCO' onClick={handleLeaveTypChange} control={<Radio />} label="CO" />
            </RadioGroup>

            <div className="input-container">
              <TextField
                className='form-control' id='txtDesc' onChange={e => setDesc(e.target.value)}
                label="Description" multiline variant="outlined"

              // helperText="Incorrect entry."
              ></TextField>
              {renderErrorMessage("txtDesc")}
            </div>




          </div>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleSubmitReq} autoFocus>
              Save
            </Button>
          </DialogActions>

        </Box>
        </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openError}
        onClose={handleCloseError}>
        <DialogTitle id="alert-dialog-title">

          <Title>{"Validation"} <img src={require('../Images/Close.png')} onClick={handleCloseError} style={closeImg} /></Title>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <label >{errorCustom}</label>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseError}>Close</Button>

        </DialogActions>


      </Dialog>

      <div>
        <div className='text-center mx-2 my-2 pt-2 bg-fitek text-white sticky-top'>

          <div className='row'>
            <div className='col-sm-11 col-md-4 col-lg-4'>
              <Typography sx={{ mb: 1.5 }}>
                Employee : {employeeDtls.EmployeeNm}({employeeDtls.EmployeeCode})
              </Typography>
            </div>
            <div className='col-sm-11 col-md-4 col-lg-4'>
              <Typography sx={{ mb: 1.5 }}>
                Approver : {employeeDtls.ApproverName}
              </Typography>
            </div>
            <div className='col-sm-11 col-md-4 col-lg-4'>
              <Typography sx={{ mb: 1.5 }}>
                Admin : {employeeDtls.AdminName}
              </Typography>
            </div>
          </div>




        </div>

        <div className="my-2">
          <div className="card-header pb-2 mb-2 w-100 mx-1">
            <div className='row'>
              <div className='col-6'>
                <div className='tableheader'>Leave Requests</div>



              </div>
              {/* <div className='col-md-3'></div> */}
              <div className='col-3 d-flex justify-content-end'>
                <a className="btn btn-outline-primary btn-sm" onClick={handleClickOpen}>Add Request</a>
              </div>

              <div className='col-3 d-flex justify-content-end'>
                <a className="btn btn-outline-primary btn-sm" onClick={handleCompOffClickOpen}>Add Comp Off</a>
              </div>


            </div>

          </div>
          <div>

            {<div className="container-fluid">
              <div className="row text-center">


                {

                  <div style={{ height: 220, width: '100%' }}>
                    <DataGrid

                      getRowId={row => Math.random()}
                      //  id={Math.random()}
                      rows={rowsReq}
                      columns={columnsReq}
                      pageSize={2}
                      rowsPerPageOptions={[4]}

                    />
                  </div>


                }

              </div>
            </div>}

          </div>
        </div>
        <div className="my-2">
          <div className="card-header pb-2 mb-2 w-100 mx-1">
            <div className='row'>
              <div className='col-sm-10 col-md-3 col-lg-3'>
                <div className='tableheader'>Comp off Requests</div>



              </div>
            </div>
          </div>
          <div>
            <div className="container-fluid border-0">
              <div className="row text-center">

                {

                  <div style={{ height: 220, width: '100%' }}>
                    <DataGrid
                      getRowId={row => Math.random()}
                      //  id={Math.random()}
                      rows={rowsReqCompOffGet}
                      columns={columnsReqCompOff}
                      pageSize={2}
                      rowsPerPageOptions={[4]}

                    />
                  </div>

                }
              </div>
            </div>
          </div>
        </div>








        <div className="my-2">
          <div className="card-header pb-2 mb-2 w-100 mx-1">
            <div className='row'>
              <div className='col'>
                <div className='tableheader'>Leave Balance</div>

              </div>
            </div>
          </div>
          <div className="container-fluid border-0">
            <div className="row text-center">


              {

                <div style={{ height: 325, width: '100%' }}>
                  <DataGrid
                    getRowId={row => Math.random()}
                    //  id={Math.random()}
                    rows={rows}
                    columns={columns}
                    pageSize={4}
                    rowsPerPageOptions={[4]}

                  />
                </div>


              }

            </div>
          </div>

        </div>

      </div>


    </div>
  )
}

export default Dashboard
