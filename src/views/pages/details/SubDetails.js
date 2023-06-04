import React, { useState,useEffect } from "react";
import { getDatabase,ref,onValue,} from "firebase/database";
import {
  CButton,CCard,
  CCardBody,CCol,
  CContainer,CRow,
  CCardText,CCardTitle,
  CCardImage,CHeader,
  CHeaderNav,
} from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom';
import ErrorImg from 'src/assets/images/error.png'

const SubDetails = () => {

  const params = useParams();
  const naviagte = useNavigate();
  const [eventData, seteventData] = useState([]);

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
        if(item.id == params.EventID){
          return item;
        }
      })
      seteventData(filteredData);
    });
},[]);

const Registeration =(data)=>{
  naviagte(`/${data.maineventid}/registration`);
}

  return (
    <div className="bg-light">
        <CHeader position="sticky" className="mb-4">
            <CContainer fluid>
                <CHeaderNav className="app-name d-md-flex me-auto">
                    Event.
                </CHeaderNav>
            </CContainer>
        </CHeader>
        <CContainer fluid>
          <CRow xs={{ cols: 1, gutter: 3 }} md={{ cols: 2 }}>
            {eventData && eventData.length ? eventData.map((data) => (
              <>
                <CCol xs key={data.id}>
                  <CCard>
                    {data.eventphoto ?
                    <CCardImage orientation="top" src={data.eventphoto} style={{ height: 500 }}/>
                    :
                    <CCardImage orientation="top" src={ErrorImg} style={{ height: 500 }}/>
                    }
                  </CCard>
                </CCol>

                <CCol xs>
                  <CCard>
                    <CCardBody>
                      <CCardImage />
                      <CCardTitle>{data.subeventname}</CCardTitle>
                      <CCardText><strong>From Date : </strong>{data.eventfromdate}</CCardText>
                      <CCardText><strong>To Date : </strong>{data.eventtodate}</CCardText>
                      <CCardText><strong>Starting Time : </strong>{data.eventfromtime}</CCardText>
                      <CCardText><strong>Ending Time : </strong>{data.eventtotime}</CCardText>
                      <CCardText><strong>Venue : </strong>{data.eventvenue}</CCardText>
                      <CCardText><strong>Details : </strong>{data.eventdetails}</CCardText>
                      <CButton onClick={()=>Registeration(data)}>Register</CButton>
                    </CCardBody>
                  </CCard>
                </CCol>
              </>
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

export default SubDetails
