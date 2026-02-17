'use client'

import { Player } from '@/app/page'

interface GameResultProps {
  winner: 'spy' | 'civilian'
  players: Player[]
  onReset: () => void
}

export default function GameResult({ winner, players, onReset }: GameResultProps) {
  const spies = players.filter(p => p.isSpy)
  const whiteboards = players.filter(p => p.isWhiteboard)
  const civilians = players.filter(p => !p.isSpy && !p.isWhiteboard)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-6">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">
            {winner === 'spy' ? '🎭' : '👥'}
          </div>
          <h2 className="text-5xl font-bold mb-4">
            {winner === 'spy' ? (
              <span className="text-red-600">卧底胜利！</span>
            ) : (
              <span className="text-green-600">好人胜利！</span>
            )}
          </h2>
          <p className="text-xl text-gray-600">
            {winner === 'spy' ? '卧底成功混入人群！' : '卧底已被全部找出！'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
              🎭 卧底阵营
            </h3>
            <div className="space-y-3">
              {spies.map(player => (
                <div
                  key={player.id}
                  className={`bg-white p-4 rounded-lg shadow ${
                    player.isEliminated ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">{player.name}</span>
                    <span className={player.isEliminated ? 'text-red-600' : 'text-green-600'}>
                      {player.isEliminated ? '❌ 出局' : '✓ 存活'}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    词语: <span className="font-bold text-red-600">{player.word}</span>
                  </div>
                  {player.photoUrl && (
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="mt-2 w-full h-32 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              ⬜ 白板阵营
            </h3>
            {whiteboards.length === 0 ? (
              <div className="text-gray-500 text-center py-4">本局无白板</div>
            ) : (
              <div className="space-y-3">
                {whiteboards.map(player => (
                  <div
                    key={player.id}
                    className={`bg-white p-4 rounded-lg shadow ${
                      player.isEliminated ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">{player.name}</span>
                      <span className={player.isEliminated ? 'text-red-600' : 'text-green-600'}>
                        {player.isEliminated ? '❌ 出局' : '✓ 存活'}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      词语: <span className="font-bold text-gray-600">{player.word}</span>
                    </div>
                    {player.photoUrl && (
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="mt-2 w-full h-32 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
              👥 好人阵营
            </h3>
            <div className="space-y-3">
              {civilians.map(player => (
                <div
                  key={player.id}
                  className={`bg-white p-4 rounded-lg shadow ${
                    player.isEliminated ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">{player.name}</span>
                    <span className={player.isEliminated ? 'text-red-600' : 'text-green-600'}>
                      {player.isEliminated ? '❌ 出局' : '✓ 存活'}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    词语: <span className="font-bold text-green-600">{player.word}</span>
                  </div>
                  {player.photoUrl && (
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="mt-2 w-full h-32 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
        >
          🔄 再来一局
        </button>
      </div>
    </div>
  )
}
