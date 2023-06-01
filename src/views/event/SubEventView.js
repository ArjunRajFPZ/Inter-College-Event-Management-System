import React, { useState,useEffect } from "react";
import { getDatabase, ref, push, set, onValue, remove,get,equalTo,orderByChild,query} from "firebase/database";
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
  CFormLabel,CForm,
  CFormTextarea,CFormSelect,
  CAlert,CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil ,cilTrash,cilCheckCircle} from '@coreui/icons';
import { useParams } from 'react-router-dom';
import Pagination from "src/components/Pagination";
import storage from "src/firebaseConfig";
import { uploadBytesResumable, getDownloadURL, ref as sref } from "firebase/storage";

const SubEventView = () => {

  const params = useParams();
  const Userid = sessionStorage.getItem("id");
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [eventData, setEventData] = useState([]);
  const [deleteData, setDeleteData] = useState({});
  const [validated, setValidated] = useState(false);
  const [delvisible, setDelVisible] = useState(false);
  const [addSuccess, setaddSuccess] = useState(false);
  const [editSuccess, seteditSuccess] = useState(false);
  const [deleteSuccess, setdeleteSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCheck, seteditCheck] = useState(false);
  const [visible, setVisible] = useState(false)
  const [filteredData, setfilteredData] = useState();
  const [selected, setSelected] = useState("");
  const [venueData, setvenueData] = useState([]);
  const [formData, setFormdata] = useState({
    subeventname: "",
    eventfromdate: "",
    eventtodate: "",
    eventdetails: "",
    eventtype: "",
    eventvenue: "",
    eventfromtime: "",
    eventtotime: "",
    eventphoto: "",
    eventstatus:"Active",
    maineventid: params.subEventID
});

const passRecords = (data) => {
  setfilteredData(data);
};

useEffect(()=>{
  const db = getDatabase();
  const starCountRef = ref(db, 'venuereg/');
  const dbRef = query(starCountRef, orderByChild('venuetype'),equalTo(selected));
  get(dbRef).then(async snapshot => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      let newArray = [];
      Object.keys(val).map((key) => {
        val[key].id  = key;
        newArray.push(val[key])
      })
        const filtered = newArray.filter(newArray => {
        return newArray.collegeid == Userid;
      });
      setvenueData(filtered);
    }
  });
},[selected]);

  useEffect(()=>{
    if(addSuccess){
      setTimeout(() => {
        setaddSuccess(false);
      },2000);
    }
  },[addSuccess]);

  useEffect(()=>{
    if(editSuccess){
      setTimeout(() => {
        seteditSuccess(false);
      },2000);
    }
  },[editSuccess]);

  useEffect(()=>{
    if(deleteSuccess){
      setTimeout(() => {
        setdeleteSuccess(false);
      },2000);
    }
  },[deleteSuccess]);

useEffect(()=>{
  if(!visible){
    setFormdata({
      subeventname: "",
      eventfromdate: "",
      eventtodate: "",
      eventdetails: "",
      eventtype: "",
      eventvenue: "",
      eventfromtime: "",
      eventtotime: "",
      eventphoto: "",
      eventstatus:"Active",
      maineventid: params.subEventID
  })
  setIsEdit(false);
  }
},[visible])

useEffect(()=>{ 
  if(formData.eventfromdate && formData.eventtodate && formData.eventvenue && editCheck == true){
    let getVenueFromDB=  eventData.filter((item)=> item.eventstatus==='Active' && item.eventvenue === formData.eventvenue);
    console.log(getVenueFromDB);

    
    getVenueFromDB.forEach((data)=>{
      let checkFromDateExist = checkDateExist(data.eventfromdate,data.eventtodate,formData.eventfromdate);
      let checkToDateExist = checkDateExist(data.eventfromdate,data.eventtodate,formData.eventtodate);

      if(checkFromDateExist || checkToDateExist){
        alert("Event Exist for This Date.")
        return;
      }else{
        getVenueFromDB.forEach((data)=>{
          let checkFromTimeExist = checkTimeExist(data.eventfromtime,data.eventtotime,formData.eventfromtime);
          let checkToTimeExist = checkTimeExist(data.eventfromtime,data.eventtotime,formData.eventtotime);
          if(checkFromTimeExist || checkToTimeExist){
            alert("Event Exist for This Time.")
            return;
          }
          console.log(checkFromTimeExist)
          console.log(checkToTimeExist)
        })
      }
    })

  }
},[formData.eventfromdate,formData.eventtodate,formData.eventvenue,editCheck])

const checkDateExist = (from,to,check) =>{
  var fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);

    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
}

const checkTimeExist = (from,to,check) =>{
  var fTime,lTime,cTime;
    fTime = from;
    lTime = to;
    cTime = check;

    if((cTime <= lTime && cTime >= fTime)) {
        return true;
    }
    return false;
}

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
          let filteredData = newArray.filter((item)=>{
            if(item.maineventid == params.subEventID){
              return item;
            }
          })
          setEventData(filteredData);
        });
    },[]);

    function handleChange(event) {
        setFile(event.target.files[0]);
    }
    
    const editEvent =(data)=>{
      console.log(data)
      setIsEdit(true);
      setFormdata({
        id: data.id,
        subeventname: data.subeventname,
        eventfromdate: data.eventfromdate,
        eventtodate: data.eventtodate,
        eventdetails: data.eventdetails,
        eventtype: data.eventtype,
        eventvenue: data.eventvenue,
        eventfromtime: data.eventfromtime,
        eventtotime: data.eventtotime,
        eventphoto: data.eventphoto,
        eventstatus: data.eventstatus,
        maineventid: params.subEventID
      })
      let eventval = {
        target:{
          value:data.eventtype
        }
      }
      changeSelectOptionHandler(eventval);
      formData.eventvenue = data.eventvenue;
      setVisible(true);
     }

    const deleteEventRow =()=>{
      console.log(deleteData)
      const db = getDatabase();
      remove(ref(db, 'subeventreg/'+deleteData.id));
      setDelVisible(false);
      setdeleteSuccess(true);
      setDeleteData({});
    } 

     const deleteEvent =(data)=>{
      setDeleteData(data);
      setDelVisible(true);
    } 

   
  const setInput = (e) => {
    seteditCheck(true);
      const {name, value} = e.target;
      setFormdata({
          ...formData,
          [name] : value
      })
  }

  const changeSelectOptionHandler = (event) => {
      if(event?.target?.value){
        setSelected(event.target.value);
        formData.eventvenue = '';
      }else{
        setvenueData([]);
      }
  };

  const change = (value,name) => {
    setInput(value,name);
  };

  function testFunction(value,name) {
    changeSelectOptionHandler(value);
    change(value,name);
}

  const submitHandler = (event) => {
    let form =document.querySelector("#subeventform1")
    setValidated(true);
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else{
      if(formData.eventtype=='' || formData.eventvenue == ''){
        return;
      }
      if (!file) {
        alert("Please upload an image first!");
        return;
        }
    
        const storageRef = sref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
            
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const percent = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
            
                        // update progress
                        setPercent(percent);
                    },
                    (err) => console.log(err),
                    () => {
                        // download url
                        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        formData.eventphoto = url;
                        const db = getDatabase();
                        push(ref(db, 'subeventreg/'), formData);
                        setVisible(false);      
                        setaddSuccess(true);
                        setSelected("");
                        changeSelectOptionHandler("");
                        setFile("");
                        setPercent(0);
                        document.getElementById("fileupload").value = null;
                    });
                    }
                );
    }      
  }

  const updateHandler = (event) => {
    let form =document.querySelector("#subeventform1")
    setValidated(true);
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else{
      if(formData.eventtype=='' || formData.eventvenue == ''){
        return;
      }
      if (file) {
        const storageRef = sref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const percent = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        // update progress
                        setPercent(percent);
                    },
                    (err) => console.log(err),
                    () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    formData.eventphoto = url;
                    const db = getDatabase();
                    const { ['id']: uid, ...rest } = formData;
                    set(ref(db, 'subeventreg/'+uid), rest);
                    setVisible(false);      
                    seteditSuccess(true);
                    setValidated(false);
                    setSelected("");
                    changeSelectOptionHandler("");
                    setFile("");
                    setPercent(0);
                    document.getElementById("fileupload").value = null;
                });
            }
        );
        }else{
          const db = getDatabase();
          const { ['id']: uid, ...rest } = formData;
          set(ref(db, 'subeventreg/'+uid), rest);
          setVisible(false);      
          seteditSuccess(true);
          setValidated(false);
        }
        
    }      
  }

    const AddEvent = () => {

      return (
        <>    
          <CModal alignment="center" size="xl" scrollable visible={visible} onClose={() =>{
            setVisible(false);
            changeSelectOptionHandler("");
            seteditCheck(false);
            setValidated(false);}}>
            <CModalHeader>
              <CModalTitle>{isEdit ? 'Edit Sub Event' : 'Add Sub-Event'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm  id="subeventform1" validated={validated}>
                  <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Event Name
                      </CFormLabel>
                      <CCol sm={10}>
                          <CFormInput 
                              type="text" 
                              name="subeventname"
                              value={formData.subeventname}
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
                                  <CFormFeedback invalid>Please provide a From Date.</CFormFeedback>
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
                                  <CFormFeedback invalid>Please provide a To Date.</CFormFeedback>
                              </CCol>
                          </CRow>
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                      <CCol md={6}>
                          <CRow className="mb-3">
                              <CFormLabel className="col-sm-4 col-form-label">
                                  From Time
                              </CFormLabel>
                              <CCol sm={8}>
                                  <CFormInput 
                                      type="time" 
                                      name="eventfromtime"
                                      value={formData.eventfromtime}
                                      onChange={setInput}
                                      required
                                  />
                                  <CFormFeedback invalid>Please provide a Event From Time.</CFormFeedback>
                              </CCol>
                          </CRow>
                      </CCol>

                      <CCol md={6}>
                          <CRow className="mb-3">
                              <CFormLabel className="col-sm-4 col-form-label">
                                To Time
                              </CFormLabel>
                              <CCol sm={8}>
                                  <CFormInput 
                                      type="time" 
                                      name="eventtotime"
                                      value={formData.eventtotime}
                                      onChange={setInput}
                                      required
                                  />
                                  <CFormFeedback invalid>Please provide a Event To Time.</CFormFeedback>
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
                          <CFormFeedback invalid>Please provide Event Details.</CFormFeedback>
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Event Type
                      </CFormLabel>
                      <CCol sm={10}>
                          <CFormSelect 
                              name="eventtype"
                              value={formData.eventtype} 
                              onChange={testFunction}
                              required
                          >
                              <option value="">Choose...</option>
                              <option value="Large">Large</option>
                              <option value="Small">Small</option>
                          </CFormSelect>
                          <CFormFeedback invalid>Please provide Event Type.</CFormFeedback>
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Event Venue
                      </CFormLabel>
                      <CCol sm={10}>
                          <CFormSelect 
                              name="eventvenue"
                              value={formData.eventvenue} 
                              onChange={setInput}
                              required
                          >
                            <option value="">Please select a venue type.</option>
                              {venueData && venueData.length && venueData.map((data) => (
                              <option key={data.id} value={data.venuename}>{data.venuename}</option>
                              ))
                              }
                          </CFormSelect>
                          <CFormFeedback invalid>Please provide a Event Venue.</CFormFeedback>
                      </CCol>
                  </CRow>
                  
                  <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Event Photo
                      </CFormLabel>
                      <CCol sm={10}>
                          <CFormInput 
                              type="file" 
                              id="fileupload"
                              onChange={handleChange}
                              accept="/image/*"
                          />
                          <p>{percent} {"% done"}</p>
                          
                          {formData?.eventphoto &&
                            <div>
                            <img src={formData.eventphoto} style={{ width: 70 }}/>
                            </div>
                          }
                          <CFormFeedback invalid>Please provide Sub-Event Photo.</CFormFeedback>
                          
                      </CCol>
                  </CRow>

                  {isEdit ? 
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
                  :
                  <></>            
                  }
                  
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() =>{
                setVisible(false);
                changeSelectOptionHandler("");
                seteditCheck(false);
                setValidated(false);}}>
                Close
              </CButton>
              {isEdit ? 
              <CButton type="button" onClick={updateHandler}>Update</CButton>
            :
            <CButton type="button" onClick={submitHandler}>Add Sub-Event</CButton>
            }
              
            </CModalFooter>
          </CModal>
        </>
      )
    }
    
    const deleteEventModel = () => {
      return (
        <>
          <CModal alignment="center" visible={delvisible} onClose={() => setDelVisible(false)}>
            <CModalHeader>
              <CModalTitle>Confirm </CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are  you sure you want to delete <b>{deleteData.subeventname}</b> ?
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

    return(
      <CRow>
        <CAlert color="success" className="d-flex align-items-center"
        dismissible visible={addSuccess} onClose={() => setaddSuccess(false)}>
        <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>Sub-Event Successfully Added</div>
        </CAlert>
        <CAlert color="success" className="d-flex align-items-center"
        dismissible visible={editSuccess} onClose={() => seteditSuccess(false)}>
        <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>Sub-Event Successfully Updated</div>
        </CAlert>
        <CAlert color="success" className="d-flex align-items-center"
        dismissible visible={deleteSuccess} onClose={() => setdeleteSuccess(false)}>
        <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>Sub-Event Successfully Deleted</div>
        </CAlert>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                <strong>Sub-Event View</strong>
                </CCol>
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton onClick={() => setVisible(true)}>Add</CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
            {AddEvent()}
            {deleteEventModel()}
              <CTable>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">From Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">To Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Details</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event Type</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event Venue</CTableHeaderCell>
                      <CTableHeaderCell scope="col">From Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">To Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData && filteredData.length ? filteredData.map((data,index) => (
                      <CTableRow key={data.id}>
                      <CTableHeaderCell>{index+1}</CTableHeaderCell>
                      <CTableDataCell>{data.subeventname}</CTableDataCell>
                      <CTableDataCell>{data.eventfromdate}</CTableDataCell>
                      <CTableDataCell>{data.eventtodate}</CTableDataCell>
                      <CTableDataCell>{data.eventdetails}</CTableDataCell>
                      <CTableDataCell>{data.eventtype}</CTableDataCell>
                      <CTableDataCell>{data.eventvenue}</CTableDataCell>
                      <CTableDataCell>{data.eventfromtime}</CTableDataCell>
                      <CTableDataCell>{data.eventtotime}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon icon={cilPencil} title="Edit sub Event" className="pointer" onClick={()=>editEvent(data)}/>
                        <CIcon icon={cilTrash} title="Delete sub Event" className="ml-2 pointer" onClick={()=>deleteEvent(data)}/>
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

export default SubEventView;