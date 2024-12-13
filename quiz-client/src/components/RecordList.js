import React from 'react';

const RecordList = ({ record, isLatest, ranking }) => {
  return (
    <>
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
    </>
  );
};

export default RecordList;
