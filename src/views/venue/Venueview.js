import React, { useState,useEffect } from "react";
import { getDatabase,set, ref,onValue,remove} from "firebase/database";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,CAlert,
  CTableRow,CButton,CModal,
  CModalHeader,CModalTitle,
  CModalBody,CModalFooter,
  CFormSelect,CFormLabel,
  CFormInput,CForm,
  CFormFeedback
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil ,cilTrash,cilCheckCircle} from '@coreui/icons'
import Pagination from "src/components/Pagination";

const VenueView = () => {

    const Userid = sessionStorage.getItem("id");
    const [venuData, setvenuData] = useState([]);
    const [deleteData, setDeleteData] = useState({});
    const [validated, setValidated] = useState(false);
    const [editvisible, setEditVisible] = useState(false);
    const [delvisible, setDelVisible] = useState(false);
    const [deleteSuccess, setdeleteSuccess] = useState(false);
    const [editSuccess, seteditSuccess] = useState(false);
    const [filteredData, setfilteredData] = useState();
    const [formData, setFormdata] = useState({
      venuename: "",
      venuetype: "",
      collegeid: Userid,
      venuestatus: "",
  });
  
  const passRecords = (data) => {
    setfilteredData(data);
  };

    useEffect(()=>{
        const db = getDatabase();
        const getdb = ref(db, 'venuereg/');
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
          setvenuData(filtered);
        });
    },[]);

    useEffect(()=>{
      if(deleteSuccess){
        setTimeout(()=>{
          setdeleteSuccess(false);
        },2000);
      }
    },[deleteSuccess]);

    useEffect(()=>{
      if(editSuccess){
        setTimeout(()=>{
          seteditSuccess(false);
        },2000);
      }
    },[editSuccess]);

    const venueDelete =(data)=>{
      setDeleteData(data);
      setDelVisible(true);
    }

    const deleteEventRow = () => {
      const db = getDatabase();
      remove(ref(db, 'venuereg/'+deleteData.id));      
      setDelVisible(false);
      setDeleteData({});
      setdeleteSuccess(true);
    }

    const editVenue = (data) => {
      console.log(data)
      setFormdata({
       id: data.id,
       venuename: data.venuename,
       venuetype:  data.venuetype,
       collegeid:  Userid,
       venuestatus:  data.venuestatus
      })
      setEditVisible(true);
     }

     const setInput = (e) => {
         const {name, value} = e.target;
         setFormdata({
             ...formData,
             [name] : value
         })
     }

     const updateHandler = (event) => {
      let form =document.querySelector("#venueviewform1")
      setValidated(true);
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      }else{
        const db = getDatabase();
        const { ['id']: uid, ...rest } = formData;
        set(ref(db, 'venuereg/'+uid), rest);
        setEditVisible(false);
        seteditSuccess(true);
      }      
    }

    const venueDeleteModel = () => {
      return (
        <>
          <CModal alignment="center" visible={delvisible} onClose={() => setDelVisible(false)}>
            <CModalHeader>
              <CModalTitle>Confirm </CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are  you sure you want to delete <b>{deleteData.venuename}</b> ?
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

    const editVenueModel = () => {
      return (
        <>
          <CModal alignment="center" size="xl" scrollable visible={editvisible} onClose={() => {
            setEditVisible(false);
            setValidated(false);}}>
            <CModalHeader>
              <CModalTitle>Edit Venue</CModalTitle>
            </CModalHeader>
            <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardBody>
                        <CForm id="venueviewform1" validated={validated}>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">
                                Venue Name
                                </CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput 
                                        type="text"
                                        name="venuename"
                                        value={formData.venuename}
                                        onChange={setInput}
                                        required
                                    />
                                    <CFormFeedback invalid>Please provide a Venue Name.</CFormFeedback>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">
                                Venue Type
                                </CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect 
                                        name="venuetype"
                                        value={formData.venuetype}
                                        onChange={setInput}
                                        required
                                    >
                                        <option value="Small">Small</option>
                                        <option value="Large">Large</option>
                                    </CFormSelect>
                                    <CFormFeedback invalid>Please provide a Venue Type.</CFormFeedback>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">
                                Venue Status
                                </CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect 
                                        name="venuestatus"
                                        value={formData.venuestatus}
                                        onChange={setInput}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
            <CModalFooter>
              <CButton color="secondary" onClick={() => {
                setEditVisible(false);
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
        dismissible visible={deleteSuccess} onClose={() => setdeleteSuccess(false)}>
        <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>Venue Successfully Deleted</div>
        </CAlert>
        <CAlert color="success" className="d-flex align-items-center"
        dismissible visible={editSuccess} onClose={() => seteditSuccess(false)}>
        <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>Venue Successfully Updated</div>
        </CAlert>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Venue View</strong>
          </CCardHeader>
          <CCardBody>
            {venueDeleteModel()}
            {editVenueModel()}
            <CTable>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Venue Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Venue Type </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredData && filteredData.length ? filteredData.map((data,index) => (
                    <CTableRow key={data.id}>
                    <CTableHeaderCell>{index+1}</CTableHeaderCell>
                    <CTableDataCell>{data.venuename}</CTableDataCell>
                    <CTableDataCell>{data.venuetype}</CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilPencil} title="Edit Venue" className="pointer" onClick={()=>editVenue(data)}/>
                      <CIcon icon={cilTrash} title="Delete Venue" className="ml-2 pointer" onClick={()=>venueDelete(data)}/>
                    </CTableDataCell>
                    </CTableRow>
                    ))
                    :
                    <CTableRow>
                    <CTableDataCell colSpan={9}>No Data to display</CTableDataCell>
                    </CTableRow>}
                </CTableBody>
              </CTable>
              <Pagination passRecords={passRecords} Data={venuData}/>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    )
}

export default VenueView;