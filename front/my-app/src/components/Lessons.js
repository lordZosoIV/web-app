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

function validateTime(timeString) {
  var regEx = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  if(!timeString.match(regEx)) return false;  // Invalid format
  return true;
}

function getValideTime(time){
  var date = new Date(time);
  var hours = ("0" + date.getHours()).slice(-2);
  var minutes = ("0" + date.getMinutes()).slice(-2);
  return hours+":"+minutes;
}

const LessonTable = ({idx}) =>{

  const dynamicLookupObject = [
    { id: 0, day: "Monday" },
    { id: 1, day: "Tuesday" },
    { id: 2, day: "Wednesday"},
    { id: 3, day: "Thursday"},
    { id: 4, day: "Friday"},
    { id: 5, day: "Saturday"},
    { id: 6, day: "Sunday"}
    ];


  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];  


  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: "subject", field: "subject", validate: rowData => rowData.subject === '' ? 'Day cannot be empty' : ''},
    {title: "day", field: "day",  validate: rowData => rowData.day === '' ? 'Day cannot be empty' : '',
    lookup: {0: "Monday",
               1: "Tuesday",
               2: "Wednesday",
               3: "Thursday",
               4: "Friday",
               5: "Saturday",
               6: "Sunday"}},
    {title: "startTime",  field: "startTime",type:"time",  validate: rowData => rowData.startTime === '' ? 'StartTime cannot be empty' : ''},
    {title: "endTime", field: "endTime",type:"time",  validate: rowData => rowData.endTime === '' ? 'EndTime cannot be empty' : ''},
  ]

  const [data, setData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  function fetch(){
    let data = []
    api.get("/getAllStudents")
    .then(res => {
       res.data.filter(student => student.id === idx)
       .map(student => student.allLessons
        .map(lesson => {console.log(lesson)
          data.push(lesson)}))
       setData(data)
     })
     .catch(error=>{
         console.log("Error")
     })
  }
  
  useEffect(() => { 
    fetch();
  }, [])

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = []

    console.log(oldData)
    newData.startTime = getValideTime(newData.startTime);
    newData.endTime = getValideTime(newData.endTime)
    if(newData.startTime === "aN:aN") newData.startTime = oldData.startTime
    if(newData.endTime === "aN:aN") newData.endTime = oldData.endTime

    console.log(newData)
    if(newData.day === ""){
      errorList.push("Please enter day")
    }
    if(newData.startTime === "" ){
      errorList.push("Please enter startTime")
    }
   if(newData.endTime === "" || newData.startTime > newData.endTime){
      errorList.push("Please enter endTime")
    }

  
    if(errorList.length < 1){


    let day = newData.day;
    let startTime = newData.startTime;
    let endTime = newData.endTime;
    console.log(newData)
    console.log(idx)
      
    api.put("/updateLessonById/"+newData.id,null, { params : {
        day, startTime, endTime
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
    //validation
    let errorList = []
    console.log(idx)
    newData.startTime = getValideTime(newData.startTime);
    newData.endTime = getValideTime(newData.endTime)
    console.log(newData)


    if(newData.day === ""){
        errorList.push("Please enter day")
      }
    if(newData.startTime === "" || newData.startTime === "aN:aN"){
        errorList.push("Please enter startTime")
      }
    if(newData.endTime === "" || newData.endTime === "aN:aN" || newData.startTime > newData.endTime){
        errorList.push("Please enter endTime")
      }

    if(errorList.length < 1){ //no error
      api.put("/addLesson/"+idx, newData)
      .then(res => {
        let dataToAdd = [...data];
        dataToAdd.push(newData);
        setData(dataToAdd);
        console.log(data)
        resolve()
        setErrorMessages([])
        setIserror(false)
        fetch()
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
    
    api.delete("/deleteLessonById/"+oldData.id)
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


  const handleShowLesson = (rowData, resolve) => {
     console.log(rowData.id.Lessons)
    // lessons = rowData.id.Lessons;
}


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
              title="GAKVETILEBE"
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
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
    </div>
  );
}

export default LessonTable;