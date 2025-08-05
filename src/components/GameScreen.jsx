import React, { useState } from 'react'
import BozoGrid from './BozoGrid'
import ScoreModal from './ScoreModal'
import './GameScreen.css'

function GameScreen({ players, currentPlayerIndex, gameData, onScoreUpdate, onNextPlayer, onReset }) {
  const [showScores, setShowScores] = useState(false)
  const currentPlayer = players[currentPlayerIndex]

  const handlePrevPlayer = () => {
    const prevIndex = currentPlayerIndex === 0 ? players.length - 1 : currentPlayerIndex - 1
    // Aqui mudamos apenas a visualização, não o fluxo do jogo
    // Para simplicidade, vamos manter o fluxo linear
  }

  const handleNextPlayer = () => {
    onNextPlayer()
  }

  const handleScoreUpdate = (position, score) => {
    onScoreUpdate(currentPlayer, position, score)
    // Automaticamente passa para o próximo jogador
    setTimeout(() => {
      onNextPlayer()
    }, 500)
  }

  const getCurrentScores = () => {
    return players.map(player => ({
      name: player,
      score: gameData[player].scores.reduce((sum, score) => sum + (score || 0), 0)
    })).sort((a, b) => b.score - a.score)
  }

  return (
    <div className="container game-screen-container">
      <div className="player-info">
        <div className="current-player">
          {currentPlayer}
        </div>
        <div>Sua vez de jogar!</div>
      </div>

      <div className="player-navigation">
        <div className="game-player-info">
          Jogador {currentPlayerIndex + 1} de {players.length}
        </div>
        <button 
          onClick={() => setShowScores(true)}
          className="game-score-button"
        >
          Ver Pontuação
        </button>
      </div>

      <BozoGrid 
        playerData={gameData[currentPlayer]}
        onScoreUpdate={handleScoreUpdate}
      />

      <div className="button-group game-actions">
        <button 
          onClick={onReset}
          className="game-reset-button"
        >
          Reiniciar Jogo
        </button>
      </div>

      {showScores && (
        <ScoreModal 
          scores={getCurrentScores()}
          onClose={() => setShowScores(false)}
        />
      )}
    </div>
  )
}

export default GameScreen
