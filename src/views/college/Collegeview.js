import React, { useState,useEffect } from "react";
import { getDatabase, ref,query,orderByChild,equalTo,get,remove,set,} from "firebase/database";
import {
  CCard,CAlert,
  CCardBody,CFormTextarea,
  CCardHeader,
  CCol,CModal,
  CRow,CModalHeader,
  CTable,CModalTitle,
  CTableBody,CModalBody,
  CTableDataCell,CModalFooter,
  CTableHead,CButton,
  CTableHeaderCell,CFormInput,
  CTableRow,CFormLabel,
  CForm,CFormSelect,
  CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil ,cilTrash,cilCheckCircle} from '@coreui/icons';
import Pagination from "src/components/Pagination";

const CollegeView = () => {
    
    const [collegeData, setcollegeData] = useState([]);
    const [deleteData, setDeleteData] = useState({});
    const [validated, setValidated] = useState(false);
    const [delvisible, setDelVisible] = useState(false);
    const [delSuccess, setdelSuccess] = useState(false);
    const [editSuccess, seteditSuccess] = useState(false);
    const [visible, setVisible] = useState(false);
    const [filteredData, setfilteredData] = useState();
    const [formData, setFormdata] = useState({
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
        if(delSuccess){
          setTimeout(()=>{
            setdelSuccess(false);
          },2000)
        }
    },[delSuccess]);

    useEffect(()=>{
      if(editSuccess){
        setTimeout(()=>{
          seteditSuccess(false);
        },2000)
      }
  },[editSuccess]);

    const editCollege = (data) => {
      setFormdata({
       id: data.id,
       collegename: data.collegename,
       address:  data.address,
       regid:  data.regid,
       phnumber:  data.phnumber,
       email:  data.email,
       password:  data.password,
       confirmpassword:  data.confirmpassword,
       collegestatus:  data.collegestatus,
      })
      setVisible(true);
     }

    const setInput = (e) => {
      const {name, value} = e.target;
      setFormdata({
          ...formData,
          [name] : value
      })
  }

  const updateHandler = (event) => {
    let form =document.querySelector("#collegeviewform1")
    setValidated(true);
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else{
      const db = getDatabase();
      const { ['id']: uid, ...rest } = formData;
      set(ref(db, 'collegereg/'+uid), rest);
      setVisible(false);
      seteditSuccess(true);
    }      
  }

    const delCollegeData = () =>{
      const db = getDatabase();
      remove(ref(db, 'collegereg/'+deleteData.id));
      setDelVisible(false);
      setdelSuccess(true);
      setDeleteData({});
    }

    const deleteCollege = (data) => {
      setDeleteData(data);
      setDelVisible(true);
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

    const editCollegeModal = () =>{
      return (
        <>
        <CModal alignment="center" size="xl" scrollable visible={visible} onClose={() => {
          setVisible(false);
          setValidated(false);}}>
          <CModalHeader>
            <CModalTitle>College Edit</CModalTitle>
          </CModalHeader>
          <CModalBody>
                <CForm id="collegeviewform1" validated={validated}>
                      <CRow className="mb-3">
                          <CFormLabel className="col-sm-2 col-form-label">
                          College Name
                          </CFormLabel>
                          <CCol sm={10}>
                              <CFormInput 
                                  type="text" 
                                  name="collegename"
                                  value={formData.collegename}
                                  onChange={setInput}
                                  required
                              />
                              <CFormFeedback invalid>Please provide a College Name.</CFormFeedback>
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
                          Registration ID
                          </CFormLabel>
                          <CCol sm={10}>
                              <CFormInput 
                                  type="text"
                                  name="regid" 
                                  value={formData.regid}
                                  onChange={setInput}
                                  required
                              />
                              <CFormFeedback invalid>Please provide a Registration ID.</CFormFeedback>
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

                      <CRow className="mb-3">
                          <CFormLabel className="col-sm-2 col-form-label">
                          Password 
                          </CFormLabel>
                          <CCol sm={10}>
                              <CFormInput 
                                  type="password"
                                  name="password" 
                                  value={formData.password}
                                  onChange={setInput}
                                  required
                              />
                              <CFormFeedback invalid>Please provide a Password.</CFormFeedback>
                          </CCol>
                      </CRow>

                      <CRow className="mb-3">
                          <CFormLabel className="col-sm-2 col-form-label">
                          Confirm password
                          </CFormLabel>
                          <CCol sm={10}>
                              <CFormInput 
                                  type="password"
                                  name="confirmpassword" 
                                  value={formData.confirmpassword}
                                  onChange={setInput}
                                  required
                              />
                              <CFormFeedback invalid>Please provide a Confirm password.</CFormFeedback>
                          </CCol>
                      </CRow>

                      <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        College Status
                      </CFormLabel>
                      <CCol sm={10}>
                          <CFormSelect 
                              name="collegestatus"
                              value={formData.collegestatus} 
                              onChange={setInput}
                          >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                          </CFormSelect>
                      </CCol>
                      </CRow>
                </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => {
              setVisible(false);
              setValidated(false);}}>
              Close
            </CButton>
            <CButton color="primary" onClick={updateHandler}>Update</CButton>
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
          <div>College Successfully Deleted</div>
          </CAlert>
          <CAlert color="success" className="d-flex align-items-center"
          dismissible visible={editSuccess} onClose={() => seteditSuccess(false)}>
          <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>College Successfully Updated</div>
          </CAlert>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>College View</strong>
            </CCardHeader>
            <CCardBody>
              {deleteCollegeModel()}
              {editCollegeModal()}
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
                        <CIcon icon={cilPencil} title="Edit college" className="pointer" onClick={()=>editCollege(data)}/>
                        <CIcon icon={cilTrash} title="Delete college" className="ml-2 pointer"  onClick={()=>deleteCollege(data)}/>
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