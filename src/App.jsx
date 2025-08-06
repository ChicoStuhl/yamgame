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
  const [gameHistory, setGameHistory] = useState([]) // Histórico de jogadas para desfazer
  const [isViewingMode, setIsViewingMode] = useState(false) // Modo de visualização

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
    setGameHistory([]) // Limpar histórico
    setIsViewingMode(false) // Resetar modo de visualização
    setGameState('playing')
  }

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length
    setCurrentPlayerIndex(nextIndex)
    setIsViewingMode(false) // Sair do modo de visualização ao avançar jogador
    
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
    // Salvar estado atual no histórico antes da mudança
    const historyEntry = {
      gameData: JSON.parse(JSON.stringify(gameData)), // Deep copy para evitar referências
      currentPlayerIndex,
      playerName,
      position,
      timestamp: Date.now()
    }
    
    setGameHistory(prev => [...prev, historyEntry])
    
    const newGameData = { ...gameData }
    newGameData[playerName].scores[position] = score
    setGameData(newGameData)
  }

  const undoLastMove = () => {
    if (gameHistory.length === 0) return
    
    const lastState = gameHistory[gameHistory.length - 1]
    
    // Restaurar o estado anterior (antes da jogada)
    setGameData(lastState.gameData)
    setCurrentPlayerIndex(lastState.currentPlayerIndex)
    setIsViewingMode(false) // Sair do modo de visualização ao desfazer
    
    // Remover a entrada do histórico
    setGameHistory(prev => prev.slice(0, -1))
  }

  const navigateToPlayer = (playerIndex) => {
    setCurrentPlayerIndex(playerIndex)
    setIsViewingMode(true) // Entrar no modo de visualização ao navegar com setas
  }

  const exitViewingMode = () => {
    setIsViewingMode(false)
    // Encontrar qual jogador deveria estar jogando na verdade
    const actualCurrentPlayer = findActualCurrentPlayer()
    setCurrentPlayerIndex(actualCurrentPlayer)
  }

  const findActualCurrentPlayer = () => {
    // Lógica para encontrar o jogador que deveria estar jogando
    // baseado no número de jogadas feitas por cada jogador
    const playersWithMoves = players.map(player => ({
      name: player,
      movesCount: gameData[player].scores.filter(score => score !== null).length
    }))
    
    // Encontrar o jogador com menos jogadas
    const minMoves = Math.min(...playersWithMoves.map(p => p.movesCount))
    const playersWithMinMoves = playersWithMoves.filter(p => p.movesCount === minMoves)
    
    // Se há empate, pegar o primeiro na ordem dos jogadores
    const nextPlayerName = playersWithMinMoves[0].name
    return players.indexOf(nextPlayerName)
  }

  const resetGame = () => {
    setGameState('setup')
    setCurrentPlayerIndex(0)
    setPlayers([])
    setGameData({})
    setGameHistory([])
    setIsViewingMode(false)
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
          onUndoMove={undoLastMove}
          onNavigateToPlayer={navigateToPlayer}
          onExitViewingMode={exitViewingMode}
          canUndo={gameHistory.length > 0}
          isViewingMode={isViewingMode}
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
