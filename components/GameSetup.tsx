'use client'

import { useState } from 'react'
import { Player } from '@/app/page'

interface GameSetupProps {
  onStart: (players: Player[]) => void
}

export default function GameSetup({ onStart }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(6)
  const [spyCount, setSpyCount] = useState(2)
  const [whiteboardCount, setWhiteboardCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoMode, setDemoMode] = useState(true)

  const handleStart = async () => {
    if (spyCount >= playerCount) {
      setError('卧底数量必须少于玩家总数')
      return
    }

    if (playerCount < 3) {
      setError('至少需要3名玩家')
      return
    }

    if (spyCount + whiteboardCount >= playerCount) {
      setError('卧底和白板总数必须少于玩家总数')
      return
    }

    if (playerCount - spyCount - whiteboardCount < 2) {
      setError('至少需要2名好人才能开始游戏')
      return
    }

    setLoading(true)
    setError('')

    try {
      const apiUrl = demoMode ? '/api/generate-words-demo' : '/api/generate-words'
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerCount, spyCount }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate words')
      }

      const { civilianWord, spyWord } = await response.json()

      // Randomly assign spy and whiteboard roles
      const spyIndices = new Set<number>()
      while (spyIndices.size < spyCount) {
        spyIndices.add(Math.floor(Math.random() * playerCount))
      }

      const whiteboardIndices = new Set<number>()
      while (whiteboardIndices.size < whiteboardCount) {
        const index = Math.floor(Math.random() * playerCount)
        if (!spyIndices.has(index)) {
          whiteboardIndices.add(index)
        }
      }

      const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
        id: i,
        name: `玩家 ${i + 1}`,
        word: whiteboardIndices.has(i) ? '白板' : spyIndices.has(i) ? spyWord : civilianWord,
        isSpy: spyIndices.has(i),
        isWhiteboard: whiteboardIndices.has(i),
        hasRevealed: false,
        isEliminated: false,
        forgotWord: false,
      }))

      onStart(players)
    } catch (err: any) {
      setError(err.message || '生成词语失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">游戏设置</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
          <label className="text-lg font-medium text-gray-700">
            演示模式（无需API密钥）
          </label>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              demoMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                demoMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            玩家数量: {playerCount}
          </label>
          <input
            type="range"
            min="3"
            max="12"
            value={playerCount}
            onChange={e => setPlayerCount(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>3</span>
            <span>12</span>
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            卧底数量: {spyCount}
          </label>
          <input
            type="range"
            min="1"
            max={Math.floor(playerCount / 2)}
            value={Math.min(spyCount, Math.floor(playerCount / 2))}
            onChange={e => setSpyCount(Number(e.target.value))}
            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>1</span>
            <span>{Math.floor(playerCount / 2)}</span>
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            白板数量: {whiteboardCount}
          </label>
          <input
            type="range"
            min="0"
            max={Math.max(0, playerCount - spyCount - 2)}
            value={Math.min(whiteboardCount, Math.max(0, playerCount - spyCount - 2))}
            onChange={e => setWhiteboardCount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>0</span>
            <span>{Math.max(0, playerCount - spyCount - 2)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? '生成中...' : '开始游戏'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">游戏规则：</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 每位玩家点击查看自己的词语</li>
          <li>• 白板玩家看到的是"白板"二字</li>
          <li>• 查看时会自动拍照留念</li>
          <li>• 所有人查看后开始游戏</li>
          <li>• 点击卡牌投票出局或标记忘词</li>
          <li>• 卧底全灭则好人胜利</li>
          <li>• 卧底人数≥好人则卧底胜利</li>
        </ul>
      </div>
    </div>
  )
}
