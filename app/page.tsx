'use client'

import { useState } from 'react'
import GameSetup from '@/components/GameSetup'
import CardReveal from '@/components/CardReveal'
import GamePlay from '@/components/GamePlay'
import GameResult from '@/components/GameResult'

export type GamePhase = 'setup' | 'reveal' | 'play' | 'result'

export interface Player {
  id: number
  name: string
  word: string
  isSpy: boolean
  hasRevealed: boolean
  isEliminated: boolean
  forgotWord: boolean
  photoUrl?: string
}

export interface GameState {
  phase: GamePhase
  players: Player[]
  currentRevealingPlayer: number
  winner: 'spy' | 'civilian' | null
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    players: [],
    currentRevealingPlayer: 0,
    winner: null,
  })

  const startGame = (players: Player[]) => {
    setGameState({
      phase: 'reveal',
      players,
      currentRevealingPlayer: 0,
      winner: null,
    })
  }

  const handleCardRevealed = (playerId: number, photoUrl: string) => {
    const updatedPlayers = gameState.players.map(p =>
      p.id === playerId ? { ...p, hasRevealed: true, photoUrl } : p
    )

    const allRevealed = updatedPlayers.every(p => p.hasRevealed)

    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: allRevealed ? 'play' : 'reveal',
      currentRevealingPlayer: allRevealed ? 0 : gameState.currentRevealingPlayer + 1,
    })
  }

  const handlePlayerAction = (playerId: number, action: 'eliminate' | 'forgot') => {
    const updatedPlayers = gameState.players.map(p =>
      p.id === playerId
        ? {
            ...p,
            isEliminated: action === 'eliminate' ? true : p.isEliminated,
            forgotWord: action === 'forgot' ? true : p.forgotWord,
          }
        : p
    )

    // Check victory conditions
    const alivePlayers = updatedPlayers.filter(p => !p.isEliminated)
    const aliveSpies = alivePlayers.filter(p => p.isSpy).length
    const aliveCivilians = alivePlayers.filter(p => !p.isSpy).length

    let winner: 'spy' | 'civilian' | null = null

    if (aliveSpies === 0) {
      winner = 'civilian'
    } else if (aliveSpies >= aliveCivilians) {
      winner = 'spy'
    }

    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: winner ? 'result' : 'play',
      winner,
    })
  }

  const resetGame = () => {
    setGameState({
      phase: 'setup',
      players: [],
      currentRevealingPlayer: 0,
      winner: null,
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-white mb-8 mt-8 drop-shadow-lg">
          🎭 谁是卧底 🎭
        </h1>

        {gameState.phase === 'setup' && <GameSetup onStart={startGame} />}

        {gameState.phase === 'reveal' && (
          <CardReveal
            player={gameState.players[gameState.currentRevealingPlayer]}
            onRevealed={handleCardRevealed}
          />
        )}

        {gameState.phase === 'play' && (
          <GamePlay players={gameState.players} onAction={handlePlayerAction} />
        )}

        {gameState.phase === 'result' && gameState.winner && (
          <GameResult
            winner={gameState.winner}
            players={gameState.players}
            onReset={resetGame}
          />
        )}
      </div>
    </main>
  )
}
