import React from 'react'
import './ScoreModal.css'

function ScoreModal({ scores, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content score-modal-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="score-modal-title">Pontuação Atual</h3>
        <div className="score-summary">
          <ul className="score-list">
            {scores.map((player, index) => (
              <li key={player.name} className="score-item">
                <span className="result-player-position">
                  {index === 0 && '🥇 '}
                  {index === 1 && '🥈 '}
                  {index === 2 && '🥉 '}
                  {player.name}
                </span>
                <span className="result-player-score">
                  {player.score} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
        <button 
          onClick={onClose}
          className="score-modal-close"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

export default ScoreModal
