import React, { useState } from 'react'
import './BozoGrid.css'

// Configuração das células do grid do Bozó
const GRID_CONFIG = [
  { id: 0, label: 'Ás', type: 'normal', multiplier: 1, max: 5 },      // Casa 1: 1-5 pontos
  { id: 1, label: 'Quadra', type: 'normal', multiplier: 4, max: 5 },      // Casa 4: 4,8,12,16,20 pontos  
  { id: 2, label: 'Fu', type: 'special', options: [10, 15] },     // Casa especial: 10 ou 15
  { id: 3, label: 'Duque', type: 'normal', multiplier: 2, max: 5 },      // Casa 2: 2,4,6,8,10 pontos
  { id: 4, label: 'Quina', type: 'normal', multiplier: 5, max: 5 },      // Casa 5: 5,10,15,20,25 pontos
  { id: 5, label: 'Sequência', type: 'special', options: [20, 25] },     // Casa especial: 20 ou 25
  { id: 6, label: 'Terno', type: 'normal', multiplier: 3, max: 5 },      // Casa 3: 3,6,9,12,15 pontos
  { id: 7, label: 'Sena', type: 'normal', multiplier: 6, max: 5 },      // Casa 6: 6,12,18,24,30 pontos
  { id: 8, label: 'Quadrada', type: 'special', options: [30, 35] },     // Casa especial: 30 ou 35
  { id: 9, label: 'General', type: 'victory', options: [40, 'vitória'] }  // Casa especial: 40 ou vitória
]

function BozoGrid({ playerData, onScoreUpdate }) {
  const [selectedCell, setSelectedCell] = useState(null)
  const [showScoreOptions, setShowScoreOptions] = useState(false)

  const handleCellClick = (cellId) => {
    if (playerData.scores[cellId] !== null) {
      return // Célula já preenchida
    }
    
    setSelectedCell(cellId)
    setShowScoreOptions(true)
  }

  const handleScoreSelect = (score) => {
    if (selectedCell !== null) {
      onScoreUpdate(selectedCell, score === 'X' ? 0 : score)
      setSelectedCell(null)
      setShowScoreOptions(false)
    }
  }

  const getScoreOptions = (cellConfig) => {
    const options = []
    
    if (cellConfig.type === 'normal') {
      // Gerar opções baseadas no multiplicador
      for (let i = 1; i <= cellConfig.max; i++) {
        options.push(cellConfig.multiplier * i)
      }
    } else if (cellConfig.type === 'special' || cellConfig.type === 'victory') {
      options.push(...cellConfig.options)
    }
    
    // Sempre adicionar opção X (0 pontos)
    options.push('X')
    
    return options
  }

  const getCellDisplay = (cellId) => {
    const score = playerData.scores[cellId]
    if (score === null) return ''
    if (score === 0) return 'X'
    if (score === 'vitória') return '🏆'
    return score
  }

  const getCellClass = (cellId) => {
    const score = playerData.scores[cellId]
    if (score === null) return 'grid-cell'
    if (score === 0) return 'grid-cell crossed'
    return 'grid-cell filled'
  }

  return (
    <div className="bozo-grid-container">
      <div className="game-grid">
        {GRID_CONFIG.map((cell) => (
          <div
            key={cell.id}
            className={`${getCellClass(cell.id)} grid-${cell.id}`}
            onClick={() => handleCellClick(cell.id)}
          >
            <div className="bozo-grid-label">
              {cell.label}
            </div>
            <div className="bozo-grid-score">
              {getCellDisplay(cell.id)}
            </div>
          </div>
        ))}
      </div>

      {showScoreOptions && selectedCell !== null && (
        <div className="modal-overlay" onClick={() => setShowScoreOptions(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="score-modal-title">Escolha a pontuação para: {GRID_CONFIG[selectedCell].label}</h3>
            <div className="button-group score-options-container">
              {getScoreOptions(GRID_CONFIG[selectedCell]).map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleScoreSelect(option)}
                  className={`score-option-button ${option === 'X' ? 'cross' : 'normal'}`}
                >
                  {option === 'X' ? 'X (0)' : option}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowScoreOptions(false)}
              className="score-modal-cancel"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BozoGrid
