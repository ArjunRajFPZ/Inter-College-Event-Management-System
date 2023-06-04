import React, { useState,useEffect } from "react";
import { getDatabase, ref, onValue,} from "firebase/database";
import {
  CCard,CButton,
  CCardBody,CModalFooter,
  CCardHeader,CModalBody,
  CCol,CModalTitle,
  CRow,CModalHeader,
  CTable,CModal,
  CTableBody,CFormInput,
  CTableDataCell,CFormLabel,
  CTableHead,CFormTextarea,
  CTableHeaderCell,
  CTableRow,CForm,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilChevronRight} from '@coreui/icons';
import Pagination from "src/components/Pagination";

const StudentParticipation = () => {
    
    const Userid = sessionStorage.getItem("id");
    const [eventData, setEventData] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [collegeData, setcollegeData] = useState([]);
    const [filteredData, setfilteredData] = useState();
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
        attendance: "",
        prizewon: "",
    });

    const passRecords = (data) => {
      setfilteredData(data);
    };

    useEffect(()=>{
        const db = getDatabase();
        const getdb = ref(db, 'subeventreg/');
        onValue(getdb, (snapshot) => {
            const data = snapshot.val();
            let newArray = [];
            if(data){
                Object.keys(data).map((key) => {
                  data[key].id  = key;
                  newArray.push(data[key])
                })
            }
          setEventData(newArray);
        });
    },[]);

    useEffect(()=>{
        const db = getDatabase();
        const getdb = ref(db, 'studentreg/');
        onValue(getdb, (snapshot) => {
            const data = snapshot.val();
            let newArray = [];
            if(data){
                Object.keys(data).map((key) => {
                  data[key].id  = key;
                  newArray.push(data[key])
                })
            }
            const filtered = newArray.filter(newArray => {
            return newArray.collegeid == Userid;
          });
          setStudentData(filtered);
        });
    },[]);

    useEffect(()=>{
        const db = getDatabase();
        const getdb = ref(db, 'collegereg/');
        onValue(getdb, (snapshot) => {
            const data = snapshot.val();
            let newArray = [];
            if(data){
                Object.keys(data).map((key) => {
                  data[key].id  = key;
                  newArray.push(data[key])
                })
            }
            setcollegeData(newArray);
        });
    },[]);

    const viewDetails = (data) =>{
        setFormdata({
            id: data.id,
            collegeid: data.collegeid,
            eventid:  data.eventid,
            studentname:  data.studentname,
            dob:  data.dob,
            rollno:  data.rollno,
            address:  data.address,
            branch:  data.branch,
            phnumber:  data.phnumber,
            email:  data.email,
            attendance:  data.attendance,
            prizewon:  data.prizewon,
           })
           setVisible(true);
    }

    const getCollegeName = (id)=>{
        let clgname = collegeData.find((item)=> item.id=== id);
        return clgname?.collegename;
      }

    const getEventName = (id)=>{
    let eventname = eventData.find((item)=> item.id=== id);
    return eventname?.subeventname;
    }
    
    const viewStudentDetails = () =>{
        return (
          <>
          <CModal alignment="center" size="xl" scrollable visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
              <CModalTitle>Student Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
            <CForm>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    College Name
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="text"
                            name="collegeid" 
                            value={getCollegeName(formData.collegeid)}
                        />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Sub-Event Name
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="text"
                            name="eventid" 
                            value={getEventName(formData.eventid)}
                        />
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
                        />
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
                        />
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
                        />
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
                        >
                        </CFormTextarea>
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
                        />
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
                        />
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
                        />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Attendance
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="text"
                            name="attendance" 
                            value={formData.attendance}
                        />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel className="col-sm-2 col-form-label">
                    Prize Won
                    </CFormLabel>
                    <CCol sm={10}>
                        <CFormInput 
                            type="text"
                            name="prizewon" 
                            value={formData.prizewon}
                        />
                    </CCol>
                </CRow>

            </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          </>
        )
      }

    return(
        <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Student Details</strong>
            </CCardHeader>
            <CCardBody>
              {viewStudentDetails()}
              <CTable>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Roll NO</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Branch</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData && filteredData.length ? filteredData.map((data,index) => (
                      <CTableRow key={data.id}>
                      <CTableHeaderCell>{index +1}</CTableHeaderCell>
                      <CTableDataCell>{data.studentname}</CTableDataCell>
                      <CTableDataCell>{data.rollno}</CTableDataCell>
                      <CTableDataCell>{data.branch}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon icon={cilChevronRight} title="View Student Details" className="ml-2 pointer" 
                        onClick={()=>viewDetails(data)} />
                      </CTableDataCell>
                      </CTableRow>
                      ))
                      :
                      <CTableRow>
                      <CTableDataCell colSpan={9}>No Data to display</CTableDataCell>
                      </CTableRow>}
                  </CTableBody>
                </CTable>
                <Pagination passRecords={passRecords} Data={studentData}/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default StudentParticipation;