import React, { useState,useEffect } from "react";
import { getDatabase,ref,onValue,} from "firebase/database";
import {
  CButton,CCarouselCaption,
  CCard,CCarouselItem,
  CCardBody,CCardHeader,
  CCol,CCarousel,
  CContainer,
  CRow,
  CCardText,
  CCardTitle,
  CCardImage,
  CHeader,
  CHeaderNav,
} from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom';
import ErrorImg from 'src/assets/images/error.png'

const Details = () => {

  const params = useParams();
  const naviagte = useNavigate();
  const [eventData, seteventData] = useState([]);
  const [subeventData, setsubEventData] = useState([]);

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
      let filteredData = newArray.filter((item)=>{
        if(item.id == params.EventID){
          return item;
        }
      })
      seteventData(filteredData);
    });
},[]);

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
      if(item.maineventid == params.EventID){
        return item;
      }
    })
    setsubEventData(filteredData);
  });
},[]);

const Registeration =(data)=>{
  naviagte(`/${data.id}/registration`);
}

const SubEvent =(data)=>{
  naviagte(`/${data.id}/subdetails`);
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
                      <CCardTitle>{data.eventname}</CCardTitle>
                      <CCardText><strong>From : </strong>{data.eventfromdate}</CCardText>
                      <CCardText><strong>To : </strong>{data.eventtodate}</CCardText>
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

      <CContainer className='carousel-style'>
        <CCol xs={7}>
          <CCard>
            <CCardHeader>
                <strong>Sub-Events</strong>
            </CCardHeader>
            <CCardBody>
                <CCarousel controls indicators >
                {subeventData && subeventData.length ? subeventData.map((data) => (
                    <CCarouselItem key={data.id}>
                    {data.eventphoto ?
                    <img className="d-block w-100" src={data.eventphoto} style={{ height: 500 }}/>
                    :
                    <img className="d-block w-100" src={ErrorImg} style={{ height: 500 }}/>
                    }
                          <CCarouselCaption className="d-none d-md-block">
                            <h5>{data.subeventname}</h5>
                            <CButton onClick={()=>SubEvent(data)}>Details</CButton>
                          </CCarouselCaption>
                      </CCarouselItem>
                ))
                :
                  <CCardBody>
                    <CCardText>No Sub-Events found for this Event</CCardText>
                  </CCardBody>
                }
                </CCarousel>
            </CCardBody>
          </CCard>
        </CCol>
      </CContainer>
    </div>
  )
}

export default Details
