import React from 'react'

const ResultContainer = ({ score, wrongAnswer, total}) => {
  return (
    <>
      <div className="result-stats">
        <div className="result-card correct">
          <div className="result-card-icon">✔️</div>
          <div className="result-card-content">
            <h3>Jumlah Benar</h3>
            <p>{score}</p>
          </div>
        </div>
        <div className="result-card wrong">
          <div className="result-card-icon">❌</div>
          <div className="result-card-content">
            <h3>Jumlah Salah</h3>
            <p>{wrongAnswer}</p>
          </div>
        </div>
        <div className="result-card total">
          <div className="result-card-icon">📋</div>
          <div className="result-card-content">
            <h3>Total Soal</h3>
            <p>{total}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResultContainer