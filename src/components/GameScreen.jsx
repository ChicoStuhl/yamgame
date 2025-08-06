import React, { useState } from 'react'
import BozoGrid from './BozoGrid'
import ScoreModal from './ScoreModal'
import './GameScreen.css'

function GameScreen({ players, currentPlayerIndex, gameData, onScoreUpdate, onNextPlayer, onReset, onUndoMove, onNavigateToPlayer, onExitViewingMode, canUndo, isViewingMode }) {
  const [showScores, setShowScores] = useState(false)
  const currentPlayer = players[currentPlayerIndex]

  const handlePrevPlayer = () => {
    const prevIndex = currentPlayerIndex === 0 ? players.length - 1 : currentPlayerIndex - 1
    onNavigateToPlayer(prevIndex)
  }

  const handleNextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length
    onNavigateToPlayer(nextIndex)
  }

  const handleScoreUpdate = (position, score) => {
    if (isViewingMode) return // Não permitir marcar no modo de visualização
    
    onScoreUpdate(currentPlayer, position, score)
    // Restaurar avanço automático
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
      {isViewingMode && (
        <div className="viewing-mode-banner">
          <div className="viewing-mode-text">
            🔍 Modo Visualização - Você está vendo o grid de {currentPlayer}
          </div>
          <button 
            onClick={onExitViewingMode}
            className="exit-viewing-button"
          >
            Voltar ao Jogo
          </button>
        </div>
      )}
      
      <div className="player-info">
        <div className="current-player">
          {currentPlayer}
        </div>
        <div>
          {isViewingMode ? 'Visualizando grid' : 'Sua vez de jogar!'}
        </div>
      </div>

      <div className="player-navigation">
        <button 
          onClick={handlePrevPlayer}
          className="nav-button"
          disabled={players.length <= 1}
        >
          ← Anterior
        </button>
        
        <div className="game-player-info">
          Jogador {currentPlayerIndex + 1} de {players.length}: {currentPlayer}
        </div>
        
        <button 
          onClick={handleNextPlayer}
          className="nav-button"
          disabled={players.length <= 1}
        >
          Próximo →
        </button>
      </div>

      <div className="action-buttons">
        <button 
          onClick={onUndoMove}
          className="undo-button"
          disabled={!canUndo || isViewingMode}
          title="Desfazer última jogada"
        >
          ↶ Desfazer
        </button>
        
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
        isViewingMode={isViewingMode}
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
