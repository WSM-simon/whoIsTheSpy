'use client'

import { useState, useRef, useEffect } from 'react'
import { Player } from '@/app/page'

interface CardRevealProps {
  player: Player
  onRevealed: (playerId: number, photoUrl: string) => void
}

// Configuration constants
const PHOTO_CONFIRMATION_DELAY = 1500 // milliseconds

export default function CardReveal({ player, onRevealed }: CardRevealProps) {
  const [showWord, setShowWord] = useState(false)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Reset state when player changes
  useEffect(() => {
    setShowWord(false)
    setPhotoTaken(false)
    setCameraError('')
  }, [player.id])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err: any) {
      console.error('Camera error:', err)
      setCameraError('无法访问摄像头，但您仍可继续游戏')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoUrl = canvas.toDataURL('image/jpeg')
        setPhotoTaken(true)

        // Stop camera
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }

        // Wait a moment before continuing
        setTimeout(() => {
          onRevealed(player.id, photoUrl)
        }, PHOTO_CONFIRMATION_DELAY)
      }
    } else {
      // If no camera, continue anyway
      onRevealed(player.id, '')
    }
  }

  const handleReveal = () => {
    setShowWord(true)
    startCamera()
  }

  const handleConfirm = () => {
    capturePhoto()
  }

  useEffect(() => {
    return () => {
      // Cleanup camera on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {player.name}的回合
        </h2>

        {!showWord ? (
          <div className="text-center space-y-6">
            <div className="text-lg text-gray-600 mb-4">
              请{player.name}准备好，点击下方按钮查看您的词语
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl mb-6">
              <p className="text-gray-700">
                ⚠️ 注意：点击后将会启动摄像头并拍摄照片
              </p>
            </div>
            <button
              onClick={handleReveal}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              🎴 查看我的词语
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`p-8 rounded-2xl text-center shadow-lg ${
              player.isWhiteboard 
                ? 'bg-gradient-to-r from-gray-300 to-gray-400' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-400'
            }`}>
              <p className="text-gray-700 mb-2 text-lg">您的词语是：</p>
              <p className="text-5xl font-bold text-white drop-shadow-lg">{player.word}</p>
              {player.isWhiteboard && (
                <p className="text-sm text-gray-700 mt-2">（您是白板玩家，需要根据其他人的描述猜测词语）</p>
              )}
            </div>

            <div className="relative">
              {!photoTaken && (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-xl shadow-lg"
                  />
                  {cameraError && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                      {cameraError}
                    </div>
                  )}
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-700 transition-all duration-200 shadow-lg"
                  >
                    📸 确认并拍照
                  </button>
                </div>
              )}

              {photoTaken && (
                <div className="text-center p-8">
                  <div className="text-green-600 text-6xl mb-4">✓</div>
                  <p className="text-2xl font-bold text-gray-700">照片已拍摄！</p>
                  <p className="text-gray-600 mt-2">请将设备交给下一位玩家...</p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>
    </div>
  )
}
