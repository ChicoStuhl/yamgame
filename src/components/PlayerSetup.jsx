import React, { useState } from 'react'
import './PlayerSetup.css'

function PlayerSetup({ playerCount, setPlayerCount, onStartGame }) {
  const [playerNames, setPlayerNames] = useState([])
  const [currentNameIndex, setCurrentNameIndex] = useState(0)
  const [showNameInput, setShowNameInput] = useState(false)

  const handlePlayerCountSelect = (count) => {
    setPlayerCount(count)
    setPlayerNames(Array(count).fill(''))
    setShowNameInput(true)
    setCurrentNameIndex(0)
  }

  const handleNameChange = (index, name) => {
    const newNames = [...playerNames]
    newNames[index] = name
    setPlayerNames(newNames)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (playerNames.every(name => name.trim())) {
      onStartGame(playerNames.map(name => name.trim()))
    }
  }

  if (!showNameInput) {
    return (
      <div className="container player-setup-container">
        <h1 className="title">🎲 BOZÓ</h1>
        <h2 className="subtitle">Quantos jogadores?</h2>
        <div className="button-group">
          {[2, 3, 4, 5, 6].map(count => (
            <button 
              key={count}
              onClick={() => handlePlayerCountSelect(count)}
              className="player-count-button"
            >
              {count} Jogadores
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container player-setup-container">
      <h1 className="title">🎲 BOZÓ</h1>
      <h2 className="subtitle">Digite os nomes dos jogadores</h2>
      
      <form onSubmit={handleSubmit} className="player-name-form">
        <div className="input-group">
          {playerNames.map((name, index) => (
            <div key={index} className="player-name-container">
              <label className="player-name-label">
                Jogador {index + 1}:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Nome do jogador ${index + 1}`}
                required
                maxLength={20}
              />
            </div>
          ))}
        </div>
        
        <div className="button-group">
          <button type="submit" className="start-game-button">
            Iniciar Jogo
          </button>
          <button 
            type="button" 
            onClick={() => setShowNameInput(false)}
            className="back-button"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlayerSetup
