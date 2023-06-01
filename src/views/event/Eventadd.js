import React, { useEffect, useState } from "react";
import { getDatabase, ref, push,} from "firebase/database";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormTextarea,
    CFormInput,
    CFormLabel,
    CRow,CAlert,
    CFormFeedback,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilCheckCircle} from '@coreui/icons';
import storage from "src/firebaseConfig";
import { uploadBytesResumable, getDownloadURL, ref as sref } from "firebase/storage";

const EventAdd = () => {

    const Userid = sessionStorage.getItem("id");
    const [showSuccess, setshowSuccess] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formData, setFormdata] = useState({
        eventname: "",
        eventfromdate: "",
        eventtodate: "",
        eventdetails: "",
        collegeid: Userid,
        eventphoto: "",
        eventstatus: "Active"
    });

    // State to store uploaded file
    const [file, setFile] = useState("");
    // progress
    const [percent, setPercent] = useState(0);

    // Handle file upload event and update state
    function handleChange(event) {
        setFile(event.target.files[0]);
    }
    
    useEffect(()=>{
        if(showSuccess){
            setTimeout(() => {
                setshowSuccess(false);
            }, 2000);
        }
    },[showSuccess]);

    const setInput = (e) => {
        const {name, value} = e.target;
        setFormdata({
            ...formData,
            [name] : value
        })
    }

    const submitHandler = (event) => {
        let form =document.querySelector("#addevent1")
        setValidated(true);
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }else{
            if (!file) {
                alert("Please upload an image first!");
                }
            
                const storageRef = sref(storage, `/files/${file.name}`);
            
                // progress can be paused and resumed. It also exposes progress updates.
                // Receives the storage reference and the file to upload.
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
                            push(ref(db, 'eventreg/'), formData);
                            setshowSuccess(true);
                            setValidated(false);
                            setFormdata({
                                eventname: "",
                                eventfromdate: "",
                                eventtodate: "",
                                eventdetails: "",
                                collegeid: "",
                                eventphoto: "",
                                eventstatus: ""
                            });
                            setFile("");
                            setPercent(0);
                            document.getElementById("file-upload").value = null;
                        });
                    }
                );
        }      
      }

    const Reset = () =>{
        setFormdata({
            eventname: "",
            eventfromdate: "",
            eventtodate: "",
            eventdetails: "",
            eventphoto: "",
            eventstatus: ""
        });
    }

    return(
    <CRow>
        <CAlert color="success" className="d-flex align-items-center"
        dismissible visible={showSuccess} onClose={() => setshowSuccess(false)}>
        <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>Event Successfully Added</div>
        </CAlert>
        <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Event Add</strong>
              </CCardHeader>
                <CCardBody>
                    <CForm id="addevent1" validated={validated}>
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
                             Event Photo
                            </CFormLabel>
                            <CCol sm={10}>
                                <CFormInput 
                                    type="file" 
                                    id="file-upload"
                                    onChange={handleChange}
                                    accept="/image/*"
                                    required
                                />
                                <CFormFeedback invalid>Please provide Event Photo.</CFormFeedback>
                                <p>{percent} {"% done"}</p>
                            </CCol>
                        </CRow>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="dark" onClick={Reset}>Reset</CButton>
                        <CButton onClick={submitHandler}>Submit</CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
    )
}

export default EventAdd;