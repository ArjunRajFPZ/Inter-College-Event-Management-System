import React, { useState,useEffect } from "react";
import { getDatabase, ref,onValue,set,remove,} from "firebase/database";
import {
  CCard,CCardBody,
  CCardHeader,CCol,
  CRow,CTable,
  CTableBody,CTableDataCell,
  CTableHead,CTableHeaderCell,
  CTableRow,CButton,
  CModal,CModalHeader,
  CModalTitle,CModalBody,
  CModalFooter,CFormInput,
  CFormLabel,CForm,CFormFeedback,
  CFormTextarea,CFormSelect,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil ,cilTrash,cilLibraryAdd,cilCheckCircle} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import Pagination from "src/components/Pagination";

const EventView = () => {

  const Userid = sessionStorage.getItem("id");
  const naviagte = useNavigate();
  const [validated, setValidated] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [deleteData, setDeleteData] = useState({});
  const [visible, setVisible] = useState(false);
  const [delvisible, setDelVisible] = useState(false);
  const [editSuccess, seteditSuccess] = useState(false);
  const [deleteSuccess, setdeleteSuccess] = useState(false);
  const [filteredData, setfilteredData] = useState();
  const [formData, setFormdata] = useState({
        eventname: "",
        eventfromdate: "",
        eventtodate: "",
        eventdetails: "",
        collegeid: Userid,
        eventphoto: "",
        eventstatus: ""
    });

    const passRecords = (data) => {
      setfilteredData(data);
    };

    useEffect(()=>{
      if(editSuccess){
          setTimeout(() => {
              seteditSuccess(false);
          }, 2000);
      } 
  },[editSuccess]);

  useEffect(()=>{
    if(deleteSuccess){
      setTimeout(()=>{
        setdeleteSuccess(false);
      }, 2000);
    }
  },[deleteSuccess]);

    useEffect(()=>{
        const db = getDatabase();
        const getdb = ref(db, 'eventreg/');
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
          setEventData(filtered);
        });
    },[]);     
 
    const viewSubEvents =(data)=>{
      console.log(data)
      naviagte(`/${data.id}/sub-events`);
    }
    
    const EditEvent = (data) => {
      setFormdata({
       id: data.id,
       eventname: data.eventname,
       eventfromdate:  data.eventfromdate,
       eventtodate:  data.eventtodate,
       eventdetails:  data.eventdetails,
       collegeid:  Userid,
       eventphoto:  data.eventphoto,
       eventstatus:  data.eventstatus
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
      let form =document.querySelector("#eventedit1")
      setValidated(true);
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      }else{
        console.log(formData);
        const db = getDatabase();
        const { ['id']: uid, ...rest } = formData;
        set(ref(db, 'eventreg/'+uid), rest);
        setVisible(false);
        seteditSuccess(true);
      }      
    }

     const deleteEventRow =()=>{
      const db = getDatabase();
      remove(ref(db, 'eventreg/'+deleteData.id));
      setDelVisible(false);
      setdeleteSuccess(true);
      setDeleteData({});
    } 

     const deleteEvent =(data)=>{
      setDeleteData(data);
      setDelVisible(true);
    } 

     const deleteEventModel = () => {
      return (
        <>
          <CModal alignment="center" visible={delvisible} onClose={() => setDelVisible(false)}>
            <CModalHeader>
              <CModalTitle>Confirm </CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are  you sure you want to delete <b>{deleteData.eventname}</b> ?
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setDelVisible(false)}>
                No
              </CButton>
              <CButton color="primary" onClick={deleteEventRow}>Yes</CButton>
            </CModalFooter>
          </CModal>
        </>
      )
    }

    const EditEventModal = () =>{
      return (
        <>
        <CModal alignment="center" size="xl" scrollable visible={visible} onClose={() =>{
            setVisible(false);
            setValidated(false);}}>
          <CModalHeader>
            <CModalTitle>Event Edit</CModalTitle>
          </CModalHeader>
          <CModalBody>
          <CForm id="eventedit1" validated={validated}>
              <CRow className="mb-3">
                  <CFormLabel className="col-sm-2 col-form-label">
                    Event Name
                  </CFormLabel>
                  <CCol sm={10}>
                      <CFormInput 
                          type="text" 
                          name="eventname"
                          value={formData.eventname}
                          onChange={setInput}
                          required
                      />
                      <CFormFeedback invalid>Please provide a Event Name.</CFormFeedback>
                  </CCol>
              </CRow>

              <CRow className="mb-3">
                  <CCol md={6}>
                      <CRow className="mb-3">
                          <CFormLabel className="col-sm-4 col-form-label">
                              From Date
                          </CFormLabel>
                          <CCol sm={8}>
                              <CFormInput 
                                  type="date" 
                                  name="eventfromdate"
                                  value={formData.eventfromdate}
                                  onChange={setInput}
                                  required
                              />
                              <CFormFeedback invalid>Please provide a Event Name.</CFormFeedback>
                          </CCol>
                      </CRow>
                  </CCol>
                  <CCol md={6}>
                      <CRow className="mb-3">
                          <CFormLabel className="col-sm-4 col-form-label">
                            To Date
                          </CFormLabel>
                          <CCol sm={8}>
                              <CFormInput 
                                  type="date" 
                                  name="eventtodate"
                                  value={formData.eventtodate}
                                  onChange={setInput}
                                  required
                              />
                              <CFormFeedback invalid>Please provide a Event Name.</CFormFeedback>
                          </CCol>
                      </CRow>
                  </CCol>
              </CRow>

              <CRow className="mb-3">
                  <CFormLabel className="col-sm-2 col-form-label">
                  Event Details
                  </CFormLabel>
                  <CCol sm={10}>
                      <CFormTextarea 
                          name="eventdetails"
                          value={formData.eventdetails}
                          onChange={setInput}
                          required
                      >
                      </CFormTextarea>
                      <CFormFeedback invalid>Please provide a Event Name.</CFormFeedback>
                  </CCol>
              </CRow>

              <CRow className="mb-3">
                  <CFormLabel className="col-sm-2 col-form-label">
                    Event Photo
                  </CFormLabel>
                  <CCol sm={10}>
                      <CFormInput 
                          type="file" 
                      />
                  </CCol>
              </CRow>

              <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Event Status
              </CFormLabel>
              <CCol sm={10}>
                  <CFormSelect 
                      name="eventstatus"
                      value={formData.eventstatus} 
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
            <CButton color="secondary" onClose={() =>{
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
        dismissible visible={editSuccess} onClose={() => seteditSuccess(false)}>
        <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>Event Successfully Updated</div>
        </CAlert>
        <CAlert color="success" className="d-flex align-items-center"
        dismissible visible={deleteSuccess} onClose={() => setdeleteSuccess(false)}>
        <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>Event Successfully Deleted</div>
        </CAlert>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Event View</strong>
            </CCardHeader>
            <CCardBody>
              {EditEventModal()}
              {deleteEventModel()}
              <CTable className="table">
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">From Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">To Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Details</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData && filteredData.length ? filteredData.map((data,index) => (
                      <CTableRow key={data.id}>
                      <CTableHeaderCell>{index +1}</CTableHeaderCell>
                      <CTableDataCell>{data.eventname}</CTableDataCell>
                      <CTableDataCell>{data.eventfromdate}</CTableDataCell>
                      <CTableDataCell>{data.eventtodate}</CTableDataCell>
                      <CTableDataCell>{data.eventdetails}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon icon={cilPencil} title="Edit Event" className="pointer" onClick={()=>EditEvent(data)}/>
                        <CIcon icon={cilLibraryAdd} title="View Sub Events" className="ml-2 pointer" onClick={()=>viewSubEvents(data)}/>
                        <CIcon icon={cilTrash} title="Delete Event" className="ml-2 pointer" onClick={()=>deleteEvent(data)}/>
                      </CTableDataCell>
                      </CTableRow>
                      ))
                      :
                      <CTableRow>
                      <CTableDataCell colSpan={9}>No Data to display</CTableDataCell>
                      </CTableRow>}
                  </CTableBody>
                </CTable>
                <Pagination passRecords={passRecords} Data={eventData}/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default EventView;