import React from 'react'
import '../styles/Record.css'

const RecordContainer = ({ filterOption, handleFilterChange, getFilteredRecords, records, latestRecord}) => {
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
                  <tr key={record._id}>
                    <td style={{ backgroundColor: isLatest ? 'lightblue' : 'transparent' }}>
                      <img
                        src={record.user_id.picture || 'https://avatar.iran.liara.run/public'}
                        alt={record.user_id.name}
                        className="rounded-circle"
                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                      />
                    </td>
                    <td style={{ backgroundColor: isLatest ? 'lightblue' : 'transparent' }}>{ranking}</td>
                    <td style={{ backgroundColor: isLatest ? 'lightblue' : 'transparent' }}>{record.user_id.name}</td>
                    <td style={{ backgroundColor: isLatest ? 'lightblue' : 'transparent' }}>{record.score}</td>
                    <td style={{ backgroundColor: isLatest ? 'lightblue' : 'transparent' }}>
                      <span className="text-success">{record.correct_answer}</span>/
                      <span className="text-danger">{record.wrong_answer}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default RecordContainer