import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import RecordContainer from '../components/RecordContainer';
import '../styles/Home.css';
import useRecords from '../components/hooks/useRecords';
import { useEffect, useState } from 'react';

const Home = () => {
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

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // Cek cooldown dari localStorage
    const quizCooldown = localStorage.getItem('quizCooldown');
    if (quizCooldown) {
      const cooldownLength = 60
      const timePassed = Math.floor((Date.now() - quizCooldown) / 1000);
      const remainingCooldown = Math.max(0, cooldownLength - timePassed); // 300 detik = 5 menit
      setCooldown(remainingCooldown);

      if (remainingCooldown > 0) {
        const interval = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, []);

  const handleStart = () => {
    if (cooldown === 0) {
      navigate('/quiz');
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Fun Quiz App</h1>
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
      <button
        onClick={handleStart}
        className={cooldown > 0 ? `home-button-disable` : `home-button`}
        disabled={cooldown > 0} // Disable tombol jika cooldown belum selesai
      >
        {cooldown > 0 ? `Coba lagi dalam ${cooldown} detik` : 'Mulai Quiz'}
      </button>
    </div>
  );
};

export default Home;