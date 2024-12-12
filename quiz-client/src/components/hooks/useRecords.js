import { useState, useEffect } from 'react';
import axios from 'axios';
import { RECORD_API_ENDPOINT, USER_API_ENDPOINT } from '../../services/api';

const useRecords = () => {
  const [records, setRecords] = useState([]);
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState('all');
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(RECORD_API_ENDPOINT.getAllRecords);
        setRecords(response.data.records.slice(0, 100));
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    const fetchUserId = async () => {
      try {
        const response = await axios.get(USER_API_ENDPOINT.getUserId, {
          withCredentials: true,
        });
        setUserId(response.data.user_id);
        console.log(response)
      } catch (error) {
        setUserId('');
        console.error('Error fetching user ID:', error);
      }
    };

    fetchRecords();
    fetchUserId();
  }, []);

  const latestRecord = records.length > 0
    ? records
        .filter(record => String(record.user_id._id) === String(userId))
        .reduce((latest, record) => {
          const currentCreatedAt = new Date(record.createdAt).getTime();
          const latestCreatedAt = new Date(latest.createdAt).getTime();
          return currentCreatedAt > latestCreatedAt ? record : latest;
        }, records[0])
    : null;

  const totalPages = Math.ceil(records.length / recordsPerPage);

  const getFilteredRecords = () => {
    const filteredRecords = filterOption === 'user'
      ? records.filter(record => String(record.user_id._id) === String(userId))
      : records;
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredRecords.slice(startIndex, startIndex + recordsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setCurrentPage(1);
  };

  return {
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
  };
};

export default useRecords;
