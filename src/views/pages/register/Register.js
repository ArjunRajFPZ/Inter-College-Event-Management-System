import React, { useEffect, useState } from "react";
import { getDatabase, ref, push,get,query,orderByChild,equalTo} from "firebase/database";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,CAlert,
  CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHttps, cilUser, cilPhone, cilEnvelopeClosed, cilHouse, cilCheckCircle} from '@coreui/icons'

const Register = () => {
  
  var Test = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const [validated, setValidated] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [formData, setFormdata] = useState({
    collegename: "",
    address:"",
    regid: "",
    phnumber:"",
    email: "",
    password: "",
    confirmpassword: "",
    collegestatus: "Inactive",
    usertype: "college"
});

useEffect(()=>{
  if(showSuccess){
      setTimeout(() => {
          setshowSuccess(false);
      }, 3000);
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
  let form =document.querySelector("#registrationform1")
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
          setshowSuccess(true);
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

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CAlert color="success" className="d-flex align-items-center"
            dismissible visible={showSuccess} onClose={() => setshowSuccess(false)}>
            <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
            <div>Registration Successful Please Wait 15 Days Before Loging In.</div>
            </CAlert>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm id="registrationform1" validated={validated} >
                  <h1>Registration Form</h1>
                  <p className="text-medium-emphasis">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="College Name" 
                      type="text" 
                      name="collegename"
                      value={formData.collegename}
                      onChange={setInput} 
                      required
                    />
                    <CFormFeedback invalid>Please provide a College Name.</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilHouse} />
                    </CInputGroupText>
                      <CFormTextarea 
                          placeholder="Address"
                          name="address"
                          value={formData.address}
                          onChange={setInput}
                          required
                      >
                      </CFormTextarea>
                    <CFormFeedback invalid>Please provide a Address.</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      Ⓡ
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Registration ID" 
                      type="text"
                      name="regid" 
                      value={formData.regid}
                      onChange={setInput} 
                      required
                    />
                    <CFormFeedback invalid>Please provide a Registration ID.</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Phone Number" 
                      type="number"
                      name="phnumber" 
                      value={formData.phnumber}
                      onChange={setInput} 
                      required
                    />
                    <CFormFeedback invalid>Please provide a Phone Number.</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Email" 
                      type="email"
                      name="email" 
                      value={formData.email}
                      onChange={setInput}
                      required
                    />
                    <CFormFeedback invalid>Please provide a Email.</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilHttps} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      name="password" 
                      value={formData.password}
                      onChange={setInput}
                      required
                    />
                    <CFormFeedback invalid>Please provide a Password.</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilHttps} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm password"
                      name="confirmpassword" 
                      value={formData.confirmpassword}
                      onChange={setInput}
                      required
                    />
                    <CFormFeedback invalid>Please provide a Confirm password.</CFormFeedback>
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton color="success" onClick={submitHandler}>Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
