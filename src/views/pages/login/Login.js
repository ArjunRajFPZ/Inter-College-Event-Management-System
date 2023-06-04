import React, { useState } from "react";
import { getDatabase, ref, get,equalTo,orderByChild,query,} from "firebase/database";
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHttps, cilUser } from '@coreui/icons'

const Login = () => {

  const [Username, setUsername] = useState('');
  const [Userpassword, setpassword] = useState('');

  const LoginCheck =()=>{
    if(Username !== '' && Userpassword !==''){
    const db = getDatabase();
    const starCountRef = ref(db, 'collegereg/');
    console.log(starCountRef)
    const dbRef = query(starCountRef, orderByChild('email'),equalTo(Username));
    get(dbRef).then(async snapshot => {
      console.log(snapshot.val())
      if (snapshot.exists()) {
        const val = snapshot.val();
        let newArray = [];
        Object.keys(val).map((key) => {
          val[key].id  = key;
          newArray.push(val[key])
        })
        if(newArray[0].collegestatus == 'Active'){
          if(newArray[0].password === Userpassword){
            sessionStorage.setItem("id",newArray[0].id);
            sessionStorage.setItem("usertype",newArray[0].usertype);
            window.location.replace('/');
          }else{
            alert("You have entered a wrong password");
          }
        }else{
          alert("Sorry User your account is Inactive.")
        }
        
        //
      }else{
        alert("User not registered");
      }
    });
    }else{
      alert("Please enter your username and password");
    }

  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        type="email"
                        placeholder="Enter your Email/Username"
                        name="username"
                        value={Username}
                        onChange={event => setUsername(event.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilHttps} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={Userpassword}
                        onChange={event => setpassword(event.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={LoginCheck}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Dont have an account yet ?
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
