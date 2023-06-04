import React, { useEffect, useState } from "react";
import { getDatabase, ref, push,get,query,orderByChild,equalTo} from "firebase/database";
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
    CRow,
    CAlert,
    CFormFeedback,
  } from '@coreui/react'
  
import CIcon from '@coreui/icons-react'
import { cilCheckCircle} from '@coreui/icons';

const Collegeadd = () => {
    
    const [validated, setValidated] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [formData, setFormdata] = useState({
        collegename: "",
        address:"",
        regid: "",
        phnumber:"",
        email: "",
        password: "",
        confirmpassword: "",
        collegestatus: "Active",
        usertype: "college"
    });

    useEffect(()=>{
        if(addSuccess){
            setTimeout(() => {
                setAddSuccess(false);
            }, 2000);
        } 
    },[addSuccess]);

    const setInput = (e) => {
        const {name, value} = e.target;
        setFormdata({
            ...formData,
            [name] : value
        })
    }

  const submitHandler = (event) => {
    let form =document.querySelector("#collegeaddform1")
    setValidated(true);
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else{
      if((formData.phnumber).length >= 10){
        if(formData.password === formData.confirmpassword){
          const db = getDatabase();
        const dbstarRef = ref(db, 'collegereg/');
        const dbRef = query(dbstarRef, orderByChild('email'),equalTo(formData.email));
        get(dbRef).then(snapshot => {
          if (snapshot.exists()) {
            alert("Email Exists");
            return;
          }else{
            push(ref(db, 'collegereg/'), formData);
            setAddSuccess(true);
            setValidated(false);
            setFormdata({
              collegename: "",
              address: "",
              regid: "",
              phnumber: "",
              email: "",
              password: "",
              confirmpassword: "",
              collegestatus: "Active",
              usertype: "college"
            });
          }
        });
        }else{
          alert("Password Missmatch");
          return;
        }      
      }else{
          alert("Phone Number must contain atleast 10 digit's.");
          return;
      }
    }      
  }

    const Reset = () =>{
        setFormdata({
            collegename: "",
            address: "",
            regid: "",
            phnumber: "",
            email: "",
            password: "",
            confirmpassword: "",
            collegestatus: "Active",
            usertype: "college"
        });
    }

    return(
        <CRow>
            <CAlert color="success" className="d-flex align-items-center"
            dismissible visible={addSuccess} onClose={() => setAddSuccess(false)}>
            <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
            <div>College Successfully Added</div>
            </CAlert>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                    <strong>Registration Form</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm id="collegeaddform1" validated={validated}>
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
                                    //invalid={validated && formData.collegename.length < 3}
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

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="dark" onClick={Reset}>Reset</CButton>
                        <CButton onClick={submitHandler}>Register Now</CButton>
                        </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow> 
    )
}

export default Collegeadd;