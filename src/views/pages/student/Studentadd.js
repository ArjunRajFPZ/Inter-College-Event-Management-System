import React, { useEffect, useState } from "react";
import { getDatabase, ref,query,orderByChild,equalTo,get,push,} from "firebase/database";
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CFormSelect,
    CFormTextarea,
    CRow,CAlert,
    CFormLabel,CFormFeedback,
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilCheckCircle} from '@coreui/icons'
import { useParams } from 'react-router-dom';


const StudentAdd = () => {
    
    const params = useParams();
    const [validated, setValidated] = useState(false);
    const [showSuccess, setshowSuccess] = useState(false);
    const [collegeData, setcollegeData] = useState([]);
    const [eventData, seteventData] = useState([]);
    const [formData, setFormdata] = useState({
        collegeid: "",
        eventid: "",
        studentname: "",
        dob: "",
        rollno: "",
        address: "",
        branch: "",
        phnumber: "",
        email: "",
    });

    useEffect(()=>{
        const db = getDatabase();
        const starCountRef = ref(db, 'collegereg/');
        const dbRef = query(starCountRef, orderByChild('collegestatus'),equalTo('Active'));
        get(dbRef).then(async snapshot => {
          console.log(snapshot.val())
          if (snapshot.exists()) {
            const val = snapshot.val();
            let newArray = [];
            Object.keys(val).map((key) => {
              val[key].id  = key;
              newArray.push(val[key])
            })
            const filtered = newArray.filter(newArray => {
              return newArray.usertype == 'college';
            });
            setcollegeData(filtered);
          }
        });
      },[]);

    useEffect(()=>{
        const db = getDatabase();
        const starCountRef = ref(db, 'subeventreg/');
        const dbRef = query(starCountRef, orderByChild('eventstatus'),equalTo('Active'));
        get(dbRef).then(async snapshot => {
          console.log(snapshot.val())
          if (snapshot.exists()) {
            const val = snapshot.val();
            let newArray = [];
            Object.keys(val).map((key) => {
              val[key].id  = key;
              newArray.push(val[key])
            })
            let filteredData = newArray.filter((item)=>{
              if(item.maineventid == params.EventID){
                return item;
              }
            })
            seteventData(filteredData);
          }
        });
      },[]);

    useEffect(()=>{
      if(showSuccess){
          setTimeout(() => {
              setshowSuccess(false);
          }, 3000);
      }
    },[showSuccess]);

    const setInput = (e) => {
        const {name, value} = e.target;
        setFormdata({
            ...formData,
            [name] : value
        })
    }

    const Reset = () =>{
        setFormdata({
            collegeid: "",
            eventid: "",
            studentname: "",
            dob: "",
            rollno: "",
            address: "",
            branch: "",
            phnumber: "",
            email: "",
        });
    }

    const submitHandler = (event) => {
        let form =document.querySelector("#studentregform1")
        setValidated(true);
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }else{
            if((formData.phnumber).length >= 10){
                const db = getDatabase();
                push(ref(db, 'studentreg/'), formData);
                setshowSuccess(true);
                setValidated(false);
                setFormdata({
                    collegeid: "",
                    eventid: "",
                    studentname: "",
                    dob: "",
                    rollno: "",
                    address: "",
                    branch: "",
                    phnumber: "",
                    email: "",
                });
            }else{
                alert("Phone Number must contain atleast 10 digit's.");
                return;
            }
        }      
      }

    return(
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center cards-style">
          <CCol md={9} lg={9} xl={9}>
            <CAlert color="success" className="d-flex align-items-center"
            dismissible visible={showSuccess} onClose={() => setshowSuccess(false)}>
            <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
            <div>Event Registration Successful.</div>
            </CAlert>
            <CCard className="mx-4">
            <div className="card-name">
              <h1>Registration Form</h1>
              <p className="text-medium-emphasis">
                Students from registered college can only register through this portal.
              </p>
            </div>
            <CCardBody>
                <CForm id="studentregform1" validated={validated}>
                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    College Name
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormSelect 
                            name="collegeid"
                            value={formData.collegeid}
                            onChange={setInput}
                            required
                        >
                            <option>Choose...</option>
                            {collegeData && collegeData.length ? collegeData.map((data) => (
                            <option key={data.id} value={data.id}>{data.collegename}</option>
                            ))
                            :
                            <option>No Data to display</option>
                            }
                        </CFormSelect>
                        <CFormFeedback invalid>Please provide a College Name.</CFormFeedback>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Sub-Event Name
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormSelect 
                            name="eventid"
                            value={formData.eventid}
                            onChange={setInput}
                            required
                        >
                            <option>Choose...</option>
                            {eventData && eventData.length ? eventData.map((data) => (
                            <option key={data.id} value={data.id}>{data.subeventname}</option>
                            ))
                            :
                            <option>No Sub-Event to display</option>
                            }
                        </CFormSelect>
                        <CFormFeedback invalid>Please provide a Sub-Event Name.</CFormFeedback>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Student Name
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="text"
                            name="studentname" 
                            value={formData.studentname}
                            onChange={setInput}
                            required
                        />
                        <CFormFeedback invalid>Please provide a Student Name.</CFormFeedback>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    DOB
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="date"
                            name="dob" 
                            value={formData.dob}
                            onChange={setInput}
                            required
                        />
                        <CFormFeedback invalid>Please provide a DOB.</CFormFeedback>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Roll No
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="text"
                            name="rollno" 
                            value={formData.rollno}
                            onChange={setInput}
                            required
                        />
                        <CFormFeedback invalid>Please provide a Roll No.</CFormFeedback>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Address
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormTextarea 
                            name="address"
                            value={formData.address}
                            onChange={setInput}
                            required
                        >
                        </CFormTextarea>
                        <CFormFeedback invalid>Please provide a Address.</CFormFeedback>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Branch
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="text"
                            name="branch" 
                            value={formData.branch}
                            onChange={setInput}
                            required
                        />
                        <CFormFeedback invalid>Please provide a Branch.</CFormFeedback>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Phone Number
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="number"
                            name="phnumber" 
                            value={formData.phnumber}
                            onChange={setInput}
                            required
                        />
                        <CFormFeedback invalid>Please provide a Phone Number.</CFormFeedback>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Email
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="email"
                            name="email" 
                            value={formData.email}
                            onChange={setInput}
                            required
                        />
                        <CFormFeedback invalid>Please provide a Email.</CFormFeedback>
                    </CCol>
                </CRow>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="dark" onClick={Reset}>Reset</CButton>
                <CButton onClick={submitHandler}>Register Now</CButton>
                </div>
                </CForm>
            </CCardBody>
            </CCard>
            </CCol>
        </CRow>
      </CContainer>
    </div>
    )
}

export default StudentAdd;