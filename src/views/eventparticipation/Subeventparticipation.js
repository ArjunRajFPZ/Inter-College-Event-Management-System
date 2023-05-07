import React, { useState,useEffect } from "react";
import { getDatabase, ref,onValue,} from "firebase/database";
import {
  CCard,CCardBody,
  CCardHeader,CCol,
  CRow,CTable,
  CTableBody,CTableDataCell,
  CTableHead,CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilChevronRight} from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Pagination from "src/components/Pagination";

const SubEventParticipation = () => {

  const params = useParams();
  const [eventData, setEventData] = useState([]);
  const [filteredData, setfilteredData] = useState();
  const naviagte = useNavigate();

  const passRecords = (data) => {
    setfilteredData(data);
  };

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
          setEventData(filteredData);
        });
    },[]);          

    const viewEventParticipation =(data)=>{
        console.log(data)
        naviagte(`/${data.id}/EventparticipationView`);
      }

    return(
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Event Participation</strong>
            </CCardHeader>
            <CCardBody>
              <CTable>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">From Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">To Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData && filteredData.length ? filteredData.map((data,index) => (
                      <CTableRow key={data.id}>
                      <CTableHeaderCell>{index +1}</CTableHeaderCell>
                      <CTableDataCell>{data.subeventname}</CTableDataCell>
                      <CTableDataCell>{data.eventfromdate}</CTableDataCell>
                      <CTableDataCell>{data.eventtodate}</CTableDataCell>
                      <CTableDataCell>
                        <CIcon icon={cilChevronRight} title="View Event Participation" className="ml-2 pointer" 
                        onClick={()=>viewEventParticipation(data)}/>
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

export default SubEventParticipation;