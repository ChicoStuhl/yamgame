import React, { useState } from 'react'
import PlayerSetup from './components/PlayerSetup'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('setup') // 'setup', 'naming', 'playing', 'finished'
  const [playerCount, setPlayerCount] = useState(2)
  const [players, setPlayers] = useState([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [gameData, setGameData] = useState({})

  const startGame = (playerNames) => {
    const initialGameData = {}
    playerNames.forEach(name => {
      initialGameData[name] = {
        scores: Array(10).fill(null), // 6 casas normais + 4 casas especiais
        total: 0
      }
    })
    
    setPlayers(playerNames)
    setGameData(initialGameData)
    setGameState('playing')
  }

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length
    setCurrentPlayerIndex(nextIndex)
    
    // Verificar se o jogo terminou (todos os grids preenchidos)
    const allPlayersFinished = players.every(player => 
      gameData[player].scores.every(score => score !== null)
    )
    
    if (allPlayersFinished) {
      // Calcular totais finais
      const finalGameData = { ...gameData }
      players.forEach(player => {
        const scores = finalGameData[player].scores
        const total = scores.reduce((sum, score) => sum + (score || 0), 0)
        finalGameData[player].total = total
      })
      setGameData(finalGameData)
      setGameState('finished')
    }
  }

  const updatePlayerScore = (playerName, position, score) => {
    const newGameData = { ...gameData }
    newGameData[playerName].scores[position] = score
    setGameData(newGameData)
  }

  const resetGame = () => {
    setGameState('setup')
    setCurrentPlayerIndex(0)
    setPlayers([])
    setGameData({})
    setPlayerCount(2)
  }

  return (
    <div className="App">
      {gameState === 'setup' && (
        <PlayerSetup 
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          onStartGame={startGame}
        />
      )}
      
      {gameState === 'playing' && (
        <GameScreen
          players={players}
          currentPlayerIndex={currentPlayerIndex}
          gameData={gameData}
          onScoreUpdate={updatePlayerScore}
          onNextPlayer={nextPlayer}
          onReset={resetGame}
        />
      )}
      
      {gameState === 'finished' && (
        <ResultScreen
          players={players}
          gameData={gameData}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  )
}

export default App
