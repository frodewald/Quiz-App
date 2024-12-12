import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Result.css';
import ResultContainer from './ResultContainer';
import Pagination from './Pagination';
import RecordContainer from './RecordContainer';
import useRecords from './hooks/useRecords';

const Result = () => {
  const navigate = useNavigate();
  const {
    records,
    latestRecord,
    userId,
    totalPages,
    currentPage,
    filterOption,
    recordsPerPage,
    getFilteredRecords,
    handlePageChange,
    handleFilterChange,
  } = useRecords();

  const handleGoHome = () => {
    localStorage.removeItem('quiz');
    navigate('/');
  };

  return (
    <div className="result-container">
      <ResultContainer score={latestRecord?.correct_answer} wrongAnswer={latestRecord?.wrong_answer} total={latestRecord?.total_question} />
      <hr></hr>
      <RecordContainer
        filterOption={filterOption}
        handleFilterChange={handleFilterChange}
        getFilteredRecords={getFilteredRecords}
        records={records}
        latestRecord={userId ? latestRecord : ''}
      />
      <Pagination
        totalRecords={
          filterOption === 'user'
            ? records.filter(record => String(record.user_id._id) === String(userId)).length
            : records.length
        }
        recordsPerPage={recordsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <button className="result-button" onClick={handleGoHome}>Go Home</button>
    </div>
  );
};

export default Result;
