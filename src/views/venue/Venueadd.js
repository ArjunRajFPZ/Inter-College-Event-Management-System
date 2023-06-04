import React, { useState , useEffect} from "react";
import { getDatabase, ref, push,} from "firebase/database";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CRow,
    CAlert,
    CFormFeedback,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilCheckCircle} from '@coreui/icons';

const VenueAdd = () => {

    const Userid = sessionStorage.getItem("id");
    const [showSuccess,setshowSuccess] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formData, setFormdata] = useState({
        venuename: "",
        venuetype: "",
        collegeid: Userid,
        venuestatus: "Active",
    });

    useEffect(() => {
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
        let form =document.querySelector("#venueaddform1")
        setValidated(true);
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }else{
            const db = getDatabase();
            push(ref(db, 'venuereg/'), formData);
            setshowSuccess(true);
            setValidated(false);
            setFormdata({
                venuename: "",
                venuetype: "",
                collegeid: Userid,
                venuestatus: "Active",
            });
        }      
      }

    const Reset = () =>{
        setFormdata({
            venuename: "",
            venuetype: "",
            collegeid: Userid,
            venuestatus: "Active",
        });
    }

    return(
        <CRow>
            <CAlert color="success" className="d-flex align-items-center"
            dismissible visible={showSuccess} onClose={() => setshowSuccess(false)}>
            <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
            <div>Venue Successfully Added</div>
            </CAlert>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Venue Add</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm id="venueaddform1" validated={validated}>
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
                                        <option>Choose...</option>
                                        <option value="Small">Small</option>
                                        <option value="Large">Large</option>
                                    </CFormSelect>
                                    <CFormFeedback invalid>Please provide a Venue Type.</CFormFeedback>
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

export default VenueAdd;