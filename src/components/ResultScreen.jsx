import React from 'react'
import './ResultScreen.css'

function ResultScreen({ players, gameData, onPlayAgain }) {
  const finalScores = players.map(player => ({
    name: player,
    score: gameData[player].total
  })).sort((a, b) => b.score - a.score)

  const winner = finalScores[0]

  return (
    <div className="container result-screen-container">
      <h1 className="title">🎉 Fim de Jogo!</h1>
      
      <div className="winner">
        <h2>🏆 VENCEDOR 🏆</h2>
        <h3>{winner.name}</h3>
        <p className="result-winner-score">{winner.score} pontos</p>
        <p className="result-winner-message">Parabéns! Você é o campeão do Bozó!</p>
      </div>

      <div className="score-summary">
        <h3 className="result-classification-title">Classificação Final</h3>
        <ul className="score-list">
          {finalScores.map((player, index) => (
            <li key={player.name} className="score-item">
              <span className="result-player-position">
                {index === 0 && '🥇 '}
                {index === 1 && '🥈 '}
                {index === 2 && '🥉 '}
                {index > 2 && `${index + 1}º `}
                {player.name}
              </span>
              <span className="result-player-score">
                {player.score} pts
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="button-group">
        <button 
          onClick={onPlayAgain}
          className="result-play-again-button"
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  )
}

export default ResultScreen
