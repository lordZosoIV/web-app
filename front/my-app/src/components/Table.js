import React, { useState, useEffect } from 'react';
import '../App.css';
import { forwardRef } from 'react';
import Grid from '@material-ui/core/Grid'

import MaterialTable from "material-table";
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import LessonTable from './Lessons';






const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const api = axios.create({
  baseURL: `http://localhost:8080`
})


function validateEmail(email){
  const regEx = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return regEx.test(String(email).toLowerCase());
}

function validateDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

function Table() {

  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: "name", field: "name", validate: rowData => rowData.name === '' ? 'Name cannot be empty' : ''},
    {title: "surname", field: "surname", validate: rowData => rowData.name === '' ? 'Surname cannot be empty' : ''},
    {title: "email", field: "email", type: "email", validate: rowData => rowData.email === '' ? 'Email cannot be empty' : ''},
    {title: "personalCodeNumber", field: "personalCodeNumber",type:"numeric", validate: rowData => rowData.personalCodeNumber === '' ? 'personal code cannot be empty' : ''},
    {title: "telNumber", field: "telNumber", type:"numeric",  validate: rowData => rowData.telNumber === '' ? 'telephone number cannot be empty' : ''},
    {title: "birthDate", field: "birthDate", type:"date",  validate: rowData => rowData.birthDate === '' ? 'Birthdate cannot be empty' : ''}
  ]

  const [data, setData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  //for modal
  const [enable, setEnable] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => { 
    api.get("/getAllStudents")
        .then(res => {               
            setData(res.data)
         })
         .catch(error=>{
             console.log("Error")
         })
  }, [])

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    newData.birthDate = convert(newData.birthDate);
    let errorList = []
    if(newData.name === ""){
      errorList.push("Please enter first name")
    }
    if(newData.surname === ""){
      errorList.push("Please enter last name")
    }
    if(newData.mail === "" || validateEmail(newData.email) === false){
      errorList.push("Please enter a valid email")
    }
    if(newData.personalCodeNumber === "" || !isNumeric(newData.personalCodeNumber)){
      errorList.push("Please enter personal code")
    }
    if(newData.telNumber === "" || !isNumeric(newData.telNumber)){
      errorList.push("Please enter telephone number")
    }
    if(newData.birthDate === "" || !validateDate(newData.birthDate)){
      errorList.push("Please enter birth date")
    }

    if(errorList.length < 1){
      console.log(newData)
    let name = newData.name;
    let surname = newData.surname;
    let email = newData.email;
    let personalCodeNumber = newData.personalCodeNumber;
    let telNumber = newData.telNumber;
    let birthDate = newData.birthDate;
      
    api.put("/updateStudentInfo/"+newData.id,null, { params : {
        name, surname, email, personalCodeNumber, telNumber, birthDate
      }})
      .then(res => {
        const dataUpdate = [...data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setData([...dataUpdate]);
        resolve()
        setIserror(false)
        setErrorMessages([])
      })
      .catch(error => {
        setErrorMessages(["Update failed! Server error"])
        setIserror(true)
        resolve()
        
      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
    
  }

  const handleRowAdd = (newData, resolve) => {
    newData.birthDate = convert(newData.birthDate);
    console.log(newData.birthDate)
    //validation
    let errorList = []
    if(newData.name === ""){
      errorList.push("Please enter first name")
    }
    if(newData.surname === ""){
      errorList.push("Please enter last name")
    }
    if(newData.mail === "" || validateEmail(newData.email) === false){
      errorList.push("Please enter a valid email")
    }
    if(newData.personalCodeNumber === "" || !isNumeric(newData.personalCodeNumber)){
      errorList.push("Please enter personal code")
    }
    if(newData.telNumber === "" || !isNumeric(newData.telNumber)){
      errorList.push("Please enter telephone number")
    }
    if(newData.birthDate === "" || !validateDate(newData.birthDate)){
      errorList.push("Please enter birth date")
    }

    if(errorList.length < 1){ //no error
      api.post("/createStudent", newData)
      .then(res => {
        let dataToAdd = [...data];
        dataToAdd.push(newData);
        setData(dataToAdd);
        resolve()
        setErrorMessages([])
        setIserror(false)
        //need id for recently added student
        api.get("/getAllStudents")
        .then(res => {               
            setData(res.data)
         })
         .catch(error=>{
             console.log("Error")
         })
      })
      .catch(error => {
        setErrorMessages(["Cannot add data. Server error!"])
        setIserror(true)
        resolve()
      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }

    
  }

  const handleRowDelete = (oldData, resolve) => {
    
    api.delete("/deleteStudentById/"+oldData.id)
      .then(res => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 450,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

  const handleClose = () => {
    setEnable(false);
};

const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);

  return (
    <div className="App">
      <Grid container spacing={1}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
          <div>
            {iserror && 
              <Alert severity="error">
                  {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>
                  })}
              </Alert>
            }       
          </div>
            <MaterialTable
              title="MAGARI TABLE"
              actions={[
                {
                  icon: AddCircleOutlinedIcon,
                  tooltip: 'Lessons',
                  onClick: (event, rowData) => {
                    setEnable(true)
                    setIdx(rowData.id)
                  }
                }
              ]}
              columns={columns}
              data={data}
              icons={tableIcons}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                      handleRowUpdate(newData, oldData, resolve);
                  }),
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    handleRowAdd(newData, resolve)
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    handleRowDelete(oldData, resolve)
                  }),
              }}
            />
              <Modal
                open={enable}
                onClose={handleClose}
            >
              <div style={modalStyle} className={classes.paper}>
                {idx}
                <LessonTable idx={idx}/>
                </div>
            </Modal>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
    </div>
  );
}

export default Table;