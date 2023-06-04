import React, { useState,useEffect } from "react";
import { getDatabase, ref, onValue, set} from "firebase/database";
import {
  CCard,CModal,
  CCardBody,CButton,
  CCardHeader,CModalFooter,
  CCol,CModalHeader,
  CRow,CModalTitle,
  CTable,CModalBody,
  CTableBody,CFormCheck,
  CTableDataCell,CFormLabel,
  CTableHead,CAlert,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil ,cilCheckCircle,} from '@coreui/icons';
import { useParams } from 'react-router-dom';
import Pagination from "src/components/Pagination";

const EventparticipationView = () => {

  const params = useParams();
  const [visible, setVisible] = useState(false);
  const [Success, setSuccess] = useState(false);
  const [studentData, setstudentData] = useState([]);
  const [collegeData, setcollegeData] = useState([]);
  const [filteredData, setfilteredData] = useState();
  const [statusData, setstatusData] = useState({
        collegeid: "",
        eventid: "",
        studentname: "",
        dob: "",
        rollno: "",
        address: "",
        branch: "",
        phnumber: "",
        email: "",
        studentphoto: "",
        idphoto: "",
        attendance:"",
        prizewon:"",
});

const passRecords = (data) => {
  setfilteredData(data);
};

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
        console.log(newArray)
        setcollegeData(newArray);
    });
  },[]);

    useEffect(() => {
      if(Success){
        setTimeout(()=>{
          setSuccess(false);
        },2000);
      }
    },[Success]);

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
          let filteredData = newArray.filter((item)=>{
            if(item.eventid == params.EventID){
              return item;
            }
          })
          setstudentData(filteredData);
        });
    },[]);

    const setInput = (e) => {
      const {name, value} = e.target;
      setstatusData({
          ...statusData,
          [name] : value
      })
  }

    const StudentStatus = (data) =>{
      setstatusData({
        id: data.id,
        collegeid: data.collegeid,
        eventid: data.eventid,
        studentname: data.studentname,
        dob: data.dob,
        rollno: data.rollno,
        address: data.address,
        branch: data.branch,
        phnumber: data.phnumber,
        email: data.email,
        studentphoto: data.studentphoto,
        idphoto: data.idphoto,
        attendance: data.attendance,
        prizewon: data.prizewon,
      })
      setVisible(true);
    }

    const updateHandler = (e) => {
      e.preventDefault();
      const db = getDatabase();
      const { ['id']: uid, ...rest } = statusData;
      set(ref(db, 'studentreg/'+uid), rest);
      setVisible(false);  
      setSuccess(true);
  } 

  const getCollegeName = (id)=>{

    let clgname = collegeData.find((item)=> item.id=== id);
    return clgname?.collegename;
  }

    const StudentStatusModel = () => {
      return (
        <>
          <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
              <CModalTitle>Student Status</CModalTitle>
            </CModalHeader>
            <CModalBody>

                <CRow>
                  <CFormLabel className="col-sm-4 col-form-label">
                    Attendance
                  </CFormLabel>
                  <CCol className="col-sm-7 col-form-label">
                    <CFormCheck
                        inline
                        type="radio"
                        name="attendance"
                        value="Present"
                        label="Present"
                        checked={statusData.attendance === "Present"}
                        onChange={setInput}
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="attendance"
                        value="Absent"
                        label="Absent"
                        checked={statusData.attendance === "Absent"}
                        onChange={setInput}
                      />
                  </CCol>
                </CRow>

                <CRow>
                  <CFormLabel className="col-sm-4 col-form-label">
                  Prize Wons
                  </CFormLabel>
                  <CRow className="col-sm-8 col-form-label">
                    <CCol>
                    <CFormCheck
                        inline
                        type="radio"
                        name="prizewon"
                        value="1"
                        label="1"
                        checked={statusData.prizewon === "1"}
                        onChange={setInput}
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="prizewon"
                        value="2"
                        label="2"
                        checked={statusData.prizewon === "2"}
                        onChange={setInput}
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="prizewon"
                        value="3"
                        label="3"
                        checked={statusData.prizewon === "3"}
                        onChange={setInput}
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="prizewon"
                        value="Nothing"
                        label="Nothing"
                        checked={statusData.prizewon === "Nothing"}
                        onChange={setInput}
                      />
                    </CCol>
                  </CRow>
                </CRow>

            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
              <CButton color="primary" onClick={updateHandler}>Save changes</CButton>
            </CModalFooter>
          </CModal>
        </>
      )
    }

    return(
      <CRow>
        <CAlert color="success" className="d-flex align-items-center"
        dismissible visible={Success} onClose={() => setSuccess(false)}>
        <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>Student Status Successfully Added</div>
        </CAlert>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                <strong>Event Participation View</strong>
                </CCol>
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              {StudentStatusModel()}
              <CTable>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">DOB</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Roll No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Branch</CTableHeaderCell>
                      <CTableHeaderCell scope="col">College Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData && filteredData.length ? filteredData.map((data,index) => (
                      <CTableRow key={data.id}>
                      <CTableHeaderCell>{index+1}</CTableHeaderCell>
                      <CTableDataCell>{data.studentname}</CTableDataCell>
                      <CTableDataCell>{data.dob}</CTableDataCell>
                      <CTableDataCell>{data.rollno}</CTableDataCell>
                      <CTableDataCell>{data.branch}</CTableDataCell>
                      <CTableDataCell>{getCollegeName(data.collegeid)}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon icon={cilPencil} title="Student Status update" className="pointer" onClick={()=>StudentStatus(data)}/>
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

export default EventparticipationView;