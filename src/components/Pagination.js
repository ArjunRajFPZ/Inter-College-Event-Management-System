import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types'

const Pagination = ({Data,passRecords}) => {
    const [currentPage ,setcurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = Data?.slice(firstIndex ,lastIndex);
    const npage = Math.ceil(Data?.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    useEffect(()=>{ 
        passRecords(records);
    }, [Data,currentPage]);

    return(
        <div>
            <nav>
                <ul className="pagination">
                    <li className="page-item">
                        <a href="javascript:void(0)" className="page-link"  onClick={prePage} >prev</a>
                    </li>
                    {
                    numbers.map((n , i) => (
                        <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                            <a href="javascript:void(0)" className="page-link" onClick={() => changePage(n)} >{n}</a>
                        </li>
                    ))
                    }
                    <li className="page-item">
                        <a href="javascript:void(0)" className="page-link" onClick={nextPage} >next</a>
                    </li>
                </ul>
            </nav>
        </div>
    )

    function prePage(){
        if(currentPage !== 1){
            setcurrentPage(currentPage - 1)
        }
    }
    
    function changePage(id){
        setcurrentPage(id)
    }
    
    function nextPage(){
        if(currentPage !== npage){
            setcurrentPage(currentPage + 1)
        }
    }
}

export default Pagination;

Pagination.propTypes = {
    Data: PropTypes.arrayOf(PropTypes.any),
    passRecords: PropTypes.func,
  }
  