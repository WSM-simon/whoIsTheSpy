'use client'

import { useState } from 'react'
import { Player } from '@/app/page'

interface GamePlayProps {
  players: Player[]
  onAction: (playerId: number, action: 'eliminate' | 'forgot') => void
}

export default function GamePlay({ players, onAction }: GamePlayProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)

  const alivePlayers = players.filter(p => !p.isEliminated)
  const aliveSpies = alivePlayers.filter(p => p.isSpy).length
  const aliveCivilians = alivePlayers.filter(p => !p.isSpy).length

  const handleEliminate = () => {
    if (selectedPlayer !== null) {
      onAction(selectedPlayer, 'eliminate')
      setSelectedPlayer(null)
    }
  }

  const handleForgot = () => {
    if (selectedPlayer !== null) {
      onAction(selectedPlayer, 'forgot')
      setSelectedPlayer(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">游戏进行中</h2>

        <div className="flex justify-center gap-8 mb-6">
          <div className="bg-blue-100 px-6 py-3 rounded-lg">
            <span className="text-blue-800 font-semibold">在场玩家: {alivePlayers.length}</span>
          </div>
          <div className="bg-green-100 px-6 py-3 rounded-lg">
            <span className="text-green-800 font-semibold">好人: {aliveCivilians}</span>
          </div>
          <div className="bg-red-100 px-6 py-3 rounded-lg">
            <span className="text-red-800 font-semibold">卧底: {aliveSpies}</span>
          </div>
        </div>

        <p className="text-center text-gray-600 mb-4">
          点击玩家卡牌选择操作
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {players.map(player => (
          <div
            key={player.id}
            onClick={() => !player.isEliminated && setSelectedPlayer(player.id)}
            className={`
              relative cursor-pointer transform transition-all duration-200 
              ${player.isEliminated ? 'opacity-50 grayscale' : 'hover:scale-105'}
              ${selectedPlayer === player.id ? 'ring-4 ring-yellow-400' : ''}
            `}
          >
            <div
              className={`
                bg-gradient-to-br p-6 rounded-xl shadow-lg
                ${player.isEliminated
                  ? 'from-gray-400 to-gray-600'
                  : player.forgotWord
                  ? 'from-orange-400 to-orange-600'
                  : 'from-purple-500 to-blue-500'
                }
              `}
            >
              <div className="text-white text-center">
                <div className="text-4xl mb-2">
                  {player.isEliminated ? '💀' : player.forgotWord ? '🤔' : '🎴'}
                </div>
                <div className="font-bold text-lg">{player.name}</div>
                {player.isEliminated && (
                  <div className="text-sm mt-2 bg-black/30 rounded py-1">已出局</div>
                )}
                {player.forgotWord && !player.isEliminated && (
                  <div className="text-sm mt-2 bg-black/30 rounded py-1">忘词</div>
                )}
              </div>

              {player.photoUrl && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="w-full h-24 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPlayer !== null && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            对 {players[selectedPlayer].name} 的操作
          </h3>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleForgot}
              disabled={players[selectedPlayer].forgotWord}
              className="bg-orange-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              🤔 标记忘词
            </button>

            <button
              onClick={handleEliminate}
              className="bg-red-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-red-700 transition-all duration-200 shadow-lg"
            >
              ❌ 投票出局
            </button>

            <button
              onClick={() => setSelectedPlayer(null)}
              className="bg-gray-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-600 transition-all duration-200 shadow-lg"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
