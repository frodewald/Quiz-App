import React, { Suspense, lazy, useMemo } from 'react'
import '../styles/Record.css'
import { Skeleton } from '@mui/material';

const RecordContainer = ({ filterOption, handleFilterChange, getFilteredRecords, records, latestRecord}) => {
  const RecordList = useMemo(() => lazy(() => import('../components/RecordList')), []);
  return (
      <div className="mb-4 record-container">
        <div className="container text-center" style={{ width: '100%'}}>
          <div className="mb-4">
            <select
              className="form-select m-auto"
              value={filterOption}
              onChange={handleFilterChange}
              style={{ width: "40%"}}
            >
              <option value="all">Top 100 Peserta</option>
              <option value="user">Rekaman Anda</option>
            </select>
          </div>
          <table className="table text-center" style={{ width: '100%', margin: '0 auto', borderBottom: '2px solid #ddd', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Peringkat</th>
                <th>Nama</th>
                <th>Score</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
            {getFilteredRecords().map((record, index) => {
              const isLatest = String(record._id) === String(latestRecord._id);
              const ranking = records.indexOf(record) + 1;

              return (
                <Suspense
                  key={record._id}
                  fallback={
                    <tr>
                      {Array(5)
                        .fill(null)
                        .map((_, idx) => (
                          <td key={idx} style={{ backgroundColor: 'transparent' }}>
                            <Skeleton
                              variant="rectangular"
                              animation="wave"
                              width="100%"
                              height="35px"
                            />
                          </td>
                        ))}
                    </tr>
                  }
                >
                  <tr>
                    <RecordList record={record} isLatest={isLatest} ranking={ranking} />
                  </tr>
                </Suspense>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default RecordContainer