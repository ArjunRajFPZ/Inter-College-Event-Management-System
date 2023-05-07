import React, { useState,useEffect } from "react";
import { getDatabase,ref,query,orderByChild,equalTo,get,onValue,} from "firebase/database";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CCardText,
  CCardTitle,
  CCardImage,
  CHeader,
  CHeaderNav,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import ErrorImg from 'src/assets/images/error.png'

const Home = () => {

  const naviagte = useNavigate();
  const [eventData, seteventData] = useState([]);
  const [collegeData, setcollegeData] = useState([]);

  useEffect(()=>{
    const db = getDatabase();
    const starCountRef = ref(db, 'eventreg/');
    const dbRef = query(starCountRef, orderByChild('eventstatus'),equalTo('Active'));
    get(dbRef).then(async snapshot => {
      console.log(snapshot.val())
      if (snapshot.exists()) {
        const val = snapshot.val();
        let newArray = [];
        Object.keys(val).map((key) => {
          val[key].id  = key;
          newArray.push(val[key])
        })
        seteventData(newArray);
      }
    });
  },[]);

  useEffect(()=>{
    const db = getDatabase();
    const getdb = ref(db, 'collegereg/');
    onValue(getdb, (snapshot) => {
        const data = snapshot.val();
        let newArray = [];
        if(data){
            Object.keys(data).map((key) => {
              data[key].id  = key;
              newArray.push(data[key])
            })
        }
        console.log(newArray)
        setcollegeData(newArray);
    });
  },[]);

  const viewEvent =(data)=>{
    naviagte(`/${data.id}/details`);
  }

  const getCollegeName = (id)=>{
    let clgname = collegeData.find((item)=> item.id=== id);
    return clgname?.collegename;
  }

  return (
    <div className="bg-light">
        <CHeader position="sticky" className="mb-4">
            <CContainer fluid>
                <CHeaderNav className="app-name d-md-flex me-auto">
                    Event.
                </CHeaderNav>
                <CHeaderNav className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/login">
                    <CButton shape="rounded-pill" type="submit">Login</CButton>
                  </Link>
                  <Link to="/register">
                    <CButton shape="rounded-pill" type="submit">Sign Up</CButton>
                  </Link>
                </CHeaderNav>
            </CContainer>
        </CHeader>
        <CContainer fluid>
          <CRow xs={{ cols: 1, gutter: 3 }} md={{ cols: 3 }}>
              {eventData && eventData.length ? eventData.map((data) => (
                  <CCol xs key={data.id}>
                    <CCard>
                    {data.eventphoto ?
                    <CCardImage orientation="top" src={data.eventphoto} style={{ height: 250 }}/>
                    :
                    <CCardImage orientation="top" src={ErrorImg} style={{ height: 250 }}/>
                    }
                      <CCardBody>
                        <CCardTitle>{data.eventname}</CCardTitle>
                        <CCardText><strong>Conducted By : </strong>{getCollegeName(data.collegeid)}</CCardText>
                        <CCardText><strong>From : </strong>{data.eventfromdate}</CCardText>
                        <CCardText><strong>To : </strong>{data.eventtodate}</CCardText>
                        <CCardText><strong>Details : </strong>{data.eventdetails}</CCardText>
                        <CButton onClick={()=>viewEvent(data)}>More Details</CButton>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))
                :
                <CCol xs>
                  <CCard>
                    <CCardBody>
                    <CCardText>No Events to display</CCardText>
                    </CCardBody>
                  </CCard>
                </CCol>}
          </CRow>
        </CContainer>
    </div>
  )
}

export default Home
