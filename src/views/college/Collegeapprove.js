import React, { useState,useEffect } from "react";
import { getDatabase, ref,query,orderByChild,equalTo,get,remove,set,} from "firebase/database";
import {
  CCard,CButton,
  CCardBody,CModal,
  CCardHeader,CModalHeader,
  CCol,CModalTitle,
  CRow,CModalBody,
  CTable,CModalFooter,
  CTableBody,CAlert,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck ,cilTrash,cilCheckCircle} from '@coreui/icons';
import Pagination from "src/components/Pagination";

const CollegeView = () => {
    
    const [collegeData, setcollegeData] = useState([]);
    const [delvisible, setDelVisible] = useState(false);
    const [approvevisible, setApproveVisible] = useState(false);
    const [delSuccess, setdelSuccess] = useState(false);
    const [approveSuccess, setapproveSuccess] = useState(false);
    const [deleteData, setDeleteData] = useState({});
    const [filteredData, setfilteredData] = useState();
    const [approveData, setApproveData] = useState({
      collegename: "",
      address:"",
      regid: "",
      phnumber:"",
      email: "",
      password: "",
      confirmpassword: "",
      collegestatus: ""
    });

    const passRecords = (data) => {
      setfilteredData(data);
    };

    useEffect(()=>{
      getApprovalData()
    },[]);

    const getApprovalData =()=>{
      const db = getDatabase();
      const starCountRef = ref(db, 'collegereg/');
      console.log(starCountRef)
      const dbRef = query(starCountRef, orderByChild('collegestatus'),equalTo('Inactive'));
      get(dbRef).then(async snapshot => {
        console.log(snapshot.val())
        if (snapshot.exists()) {
          const val = snapshot.val();
          let newArray = [];
          Object.keys(val).map((key) => {
            val[key].id  = key;
            newArray.push(val[key])
          })
          setcollegeData(newArray);
        }
      });
    }

    useEffect(()=>{
      if(delSuccess){
        setTimeout(()=>{
          setdelSuccess(false);
        },2000)
      }
  },[delSuccess]);

  useEffect(()=>{
    if(approveSuccess){
      setTimeout(()=>{
        setapproveSuccess(false);
      },2000)
    }
},[approveSuccess]);

  const deleteCollege = (data) => {
    setDeleteData(data);
    setDelVisible(true);
  }

  const approveCollege =(data)=>{
    setApproveData({
      id: data.id,
      collegename: data.collegename,
      address: data.address,
      regid: data.regid,
      phnumber: data.phnumber,
      email: data.email,
      password: data.password,
      confirmpassword: data.confirmpassword,
      collegestatus: "Active",
    })
    setApproveVisible(true);
  }

    const delCollegeData = () =>{
      const db = getDatabase();
      remove(ref(db, 'collegereg/'+deleteData.id));
      setDelVisible(false);
      setdelSuccess(true);
      setDeleteData({});
    }

    const approveCollegeData=(e)=>{
      e.preventDefault();
      const db = getDatabase();
      const { ['id']: uid, ...rest } = approveData;
      set(ref(db, 'collegereg/'+uid), rest);
      setApproveVisible(false);  
      setapproveSuccess(true);
      getApprovalData()
    }

    const deleteCollegeModel = () =>{
      return (
        <>
          <CModal alignment="center" visible={delvisible} onClose={() => setDelVisible(false)}>
            <CModalHeader>
              <CModalTitle>Confirm </CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are  you sure you want to delete <b>{deleteData.collegename}</b> ?
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setDelVisible(false)}>
                No
              </CButton>
              <CButton color="primary" onClick={delCollegeData}>Yes</CButton>
            </CModalFooter>
          </CModal>
        </>
      )
    }

    const approveModel = () =>{
      return (
        <>
          <CModal alignment="center" visible={approvevisible} onClose={() => setApproveVisible(false)}>
            <CModalHeader>
              <CModalTitle>Confirm </CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are  you sure you want to Approve <b>{approveData.collegename}</b> ?
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setApproveVisible(false)}>
                No
              </CButton>
              <CButton color="primary" onClick={approveCollegeData}>Yes</CButton>
            </CModalFooter>
          </CModal>
        </>
      )
    }

    return(
        <CRow>
          <CAlert color="success" className="d-flex align-items-center"
          dismissible visible={delSuccess} onClose={() => setdelSuccess(false)}>
          <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>College Successfully Removed</div>
          </CAlert>
          <CAlert color="success" className="d-flex align-items-center"
          dismissible visible={approveSuccess} onClose={() => setapproveSuccess(false)}>
          <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>College Successfully Approved</div>
          </CAlert>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>College View</strong>
            </CCardHeader>
            <CCardBody>
              {deleteCollegeModel()}
              {approveModel()}
              <CTable>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">College Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Registration ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Phone Number</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Password</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData && filteredData.length ? filteredData.map((data,index) => (
                      <CTableRow key={data.id}>
                      <CTableHeaderCell>{index +1}</CTableHeaderCell>
                      <CTableDataCell>{data.collegename}</CTableDataCell>
                      <CTableDataCell>{data.address}</CTableDataCell>
                      <CTableDataCell>{data.regid}</CTableDataCell>
                      <CTableDataCell>{data.phnumber}</CTableDataCell>
                      <CTableDataCell>{data.email}</CTableDataCell>
                      <CTableDataCell>{data.password}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon icon={cilCheck} title="Accept college" className="pointer" onClick={()=>approveCollege(data)}/>
                        <CIcon icon={cilTrash} title="Remove college" className="ml-2 pointer" onClick={()=>deleteCollege(data)}/>
                      </CTableDataCell>
                      </CTableRow>
                      ))
                      :
                      <CTableRow>
                      <CTableDataCell colSpan={9}>No Data to display</CTableDataCell>
                      </CTableRow>}
                  </CTableBody>
                </CTable>
                <Pagination passRecords={passRecords} Data={collegeData}/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default CollegeView;